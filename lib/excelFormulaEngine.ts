import type { ExcelCellMap, ExcelValueMap } from "@/lib/excelCurriculum";

type Scalar = string | number | boolean;
type Value = Scalar | Scalar[];
type Token = { type: "number" | "string" | "reference" | "identifier" | "operator"; value: string };

function columnNumber(column: string) {
  return [...column.toUpperCase()].reduce((value, character) => value * 26 + character.charCodeAt(0) - 64, 0);
}

function columnName(number: number) {
  let value = number;
  let name = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

function tokenize(formula: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < formula.length) {
    const character = formula[index];
    if (/\s/.test(character)) { index += 1; continue; }
    if (character === '"') {
      let end = index + 1;
      let text = "";
      while (end < formula.length) {
        if (formula[end] === '"' && formula[end + 1] === '"') { text += '"'; end += 2; continue; }
        if (formula[end] === '"') break;
        text += formula[end++];
      }
      if (end >= formula.length) throw new Error("Texto sin comillas de cierre.");
      tokens.push({ type: "string", value: text });
      index = end + 1;
      continue;
    }
    const number = formula.slice(index).match(/^\d+(?:\.\d+)?/);
    if (number) { tokens.push({ type: "number", value: number[0] }); index += number[0].length; continue; }
    const reference = formula.slice(index).match(/^\$?[A-Z]{1,3}\$?\d+/i);
    if (reference) { tokens.push({ type: "reference", value: reference[0].replace(/\$/g, "").toUpperCase() }); index += reference[0].length; continue; }
    const identifier = formula.slice(index).match(/^[A-Z_][A-Z0-9_.]*/i);
    if (identifier) { tokens.push({ type: "identifier", value: identifier[0].toUpperCase() }); index += identifier[0].length; continue; }
    const comparison = formula.slice(index).match(/^(?:<>|<=|>=)/);
    if (comparison) { tokens.push({ type: "operator", value: comparison[0] }); index += comparison[0].length; continue; }
    if ("+-*/^&=<>():;,".includes(character)) { tokens.push({ type: "operator", value: character }); index += 1; continue; }
    throw new Error(`Carácter no soportado: ${character}`);
  }
  return tokens;
}

export function calculateExcelSheet(cells: ExcelCellMap): ExcelValueMap {
  const cache = new Map<string, Value>();
  const active = new Set<string>();

  function getCell(reference: string): Value {
    const cell = reference.replace(/\$/g, "").toUpperCase();
    if (cache.has(cell)) return cache.get(cell)!;
    if (active.has(cell)) throw new Error(`Referencia circular en ${cell}.`);
    const raw = cells[cell];
    if (raw === undefined || raw.trim() === "") return 0;
    if (!raw.startsWith("=")) {
      const numeric = Number(raw);
      const result = raw.trim() !== "" && Number.isFinite(numeric) ? numeric : raw;
      cache.set(cell, result);
      return result;
    }
    active.add(cell);
    try {
      const result = evaluate(raw.slice(1));
      cache.set(cell, result);
      return result;
    } finally {
      active.delete(cell);
    }
  }

  function rangeValues(start: string, end: string): Scalar[] {
    const from = start.match(/^([A-Z]+)(\d+)$/);
    const to = end.match(/^([A-Z]+)(\d+)$/);
    if (!from || !to) throw new Error("Rango inválido.");
    const c1 = columnNumber(from[1]);
    const c2 = columnNumber(to[1]);
    const r1 = Number(from[2]);
    const r2 = Number(to[2]);
    if (Math.abs(c2 - c1) > 50 || Math.abs(r2 - r1) > 500) throw new Error("El rango es demasiado grande para el simulador.");
    const output: Scalar[] = [];
    for (let row = Math.min(r1, r2); row <= Math.max(r1, r2); row += 1) {
      for (let col = Math.min(c1, c2); col <= Math.max(c1, c2); col += 1) {
        const reference = `${columnName(col)}${row}`;
        if (cells[reference] === undefined || cells[reference].trim() === "") { output.push(""); continue; }
        const value = getCell(reference);
        output.push(Array.isArray(value) ? "" : value);
      }
    }
    return output;
  }

  function flatten(values: Value[]) { return values.flatMap((value) => Array.isArray(value) ? value : [value]); }
  function numeric(value: Value | undefined) {
    if (typeof value === "boolean") return value ? 1 : 0;
    const converted = Number(value ?? 0);
    return Number.isFinite(converted) ? converted : 0;
  }

  function matches(value: Scalar, criterion: Value | undefined) {
    const text = String(criterion ?? "");
    const operator = text.match(/^(<=|>=|<>|=|<|>)(.*)$/);
    if (operator) {
      const expectedText = operator[2].replace(/^"|"$/g, "");
      const expectedNumber = Number(expectedText);
      const left: number | string = typeof value === "number" && Number.isFinite(expectedNumber) ? value : String(value).toLocaleLowerCase();
      const right: number | string = typeof left === "number" ? expectedNumber : expectedText.toLocaleLowerCase();
      switch (operator[1]) {
        case "=": return left === right;
        case "<>": return left !== right;
        case "<": return left < right;
        case ">": return left > right;
        case "<=": return left <= right;
        default: return left >= right;
      }
    }
    if (text.includes("*") || text.includes("?")) {
      const escaped = text.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".");
      return new RegExp(`^${escaped}$`, "i").test(String(value));
    }
    return String(value).toLocaleLowerCase() === text.toLocaleLowerCase();
  }

  function call(name: string, args: Value[]): Value {
    const flat = flatten(args);
    switch (name) {
      case "SUMA": case "SUM": return flat.reduce<number>((sum, value) => sum + (typeof value === "number" ? value : 0), 0);
      case "PROMEDIO": case "AVERAGE": {
        const values = flat.filter((value): value is number => typeof value === "number");
        return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
      }
      case "CONTAR": case "COUNT": return flat.filter((value) => typeof value === "number").length;
      case "CONTARA": case "COUNTA": return flat.filter((value) => value !== "").length;
      case "MAX": { const numbers = flat.filter((value): value is number => typeof value === "number"); return numbers.length ? Math.max(...numbers) : 0; }
      case "MIN": { const numbers = flat.filter((value): value is number => typeof value === "number"); return numbers.length ? Math.min(...numbers) : 0; }
      case "REDONDEAR": case "ROUND": { const factor = 10 ** numeric(args[1]); return Math.round(numeric(args[0]) * factor) / factor; }
      case "ABS": return Math.abs(numeric(args[0]));
      case "SI": case "IF": return args[0] ? args[1] ?? false : args[2] ?? false;
      case "Y": case "AND": return args.every(Boolean);
      case "O": case "OR": return args.some(Boolean);
      case "CONCATENAR": case "CONCAT": return args.map((value) => Array.isArray(value) ? value.join("") : String(value ?? "")).join("");
      case "CONTAR.SI": case "COUNTIF": { const values = Array.isArray(args[0]) ? args[0] : [args[0] as Scalar]; return values.filter((value) => matches(value, args[1])).length; }
      case "SUMAR.SI": case "SUMIF": {
        const criteriaRange = Array.isArray(args[0]) ? args[0] : [args[0] as Scalar];
        const sumRange = Array.isArray(args[2]) ? args[2] : args[2] === undefined ? criteriaRange : [args[2] as Scalar];
        return criteriaRange.reduce<number>((sum, value, index) => sum + (matches(value, args[1]) ? numeric(sumRange[index]) : 0), 0);
      }
      default: throw new Error(`Función no soportada: ${name}`);
    }
  }

  function evaluate(formula: string): Value {
    const tokens = tokenize(formula);
    let position = 0;
    const peek = () => tokens[position];
    const take = () => tokens[position++];
    function parseComparison(): Value {
      let left = parseConcat();
      while (peek()?.type === "operator" && ["=", "<>", "<", ">", "<=", ">="].includes(peek().value)) {
        const operator = take().value;
        const right = parseConcat();
        const a: Scalar = typeof left === "number" && typeof right === "number" ? left : String(left);
        const b: Scalar = typeof left === "number" && typeof right === "number" ? right : String(right);
        if (operator === "=") left = a === b;
        else if (operator === "<>") left = a !== b;
        else if (operator === "<") left = a < b;
        else if (operator === ">") left = a > b;
        else if (operator === "<=") left = a <= b;
        else left = a >= b;
      }
      return left;
    }
    function parseConcat(): Value { let left = parseAdd(); while (peek()?.value === "&") { take(); left = String(left) + String(parseAdd()); } return left; }
    function parseAdd(): Value { let left = parseMultiply(); while (peek()?.value === "+" || peek()?.value === "-") { const operator = take().value; const right = parseMultiply(); left = operator === "+" ? numeric(left) + numeric(right) : numeric(left) - numeric(right); } return left; }
    function parseMultiply(): Value { let left = parsePower(); while (peek()?.value === "*" || peek()?.value === "/") { const operator = take().value; const right = parsePower(); left = operator === "*" ? numeric(left) * numeric(right) : numeric(left) / numeric(right); } return left; }
    function parsePower(): Value { let left = parseUnary(); while (peek()?.value === "^") { take(); left = numeric(left) ** numeric(parseUnary()); } return left; }
    function parseUnary(): Value { if (peek()?.value === "-") { take(); return -numeric(parseUnary()); } if (peek()?.value === "+") { take(); return numeric(parseUnary()); } return parsePrimary(); }
    function parsePrimary(): Value {
      const token = take();
      if (!token) throw new Error("Fórmula incompleta.");
      if (token.type === "number") return Number(token.value);
      if (token.type === "string") return token.value;
      if (token.type === "reference") {
        if (peek()?.value === ":") { take(); const end = take(); if (end?.type !== "reference") throw new Error("Rango inválido."); return rangeValues(token.value, end.value); }
        return getCell(token.value);
      }
      if (token.type === "identifier") {
        if (peek()?.value !== "(") throw new Error(`Nombre no soportado: ${token.value}`);
        take();
        const args: Value[] = [];
        if (peek()?.value !== ")") { args.push(parseComparison()); while (peek()?.value === ";" || peek()?.value === ",") { take(); args.push(parseComparison()); } }
        if (take()?.value !== ")") throw new Error("Falta un paréntesis de cierre.");
        return call(token.value, args);
      }
      if (token.value === "(") { const value = parseComparison(); if (take()?.value !== ")") throw new Error("Falta un paréntesis de cierre."); return value; }
      throw new Error(`Token no esperado: ${token.value}`);
    }
    const result = parseComparison();
    if (position !== tokens.length) throw new Error(`No se pudo interpretar ${tokens[position].value}.`);
    return result;
  }

  const results: ExcelValueMap = {};
  for (const reference of Object.keys(cells)) {
    try {
      const value = getCell(reference);
      results[reference.toUpperCase()] = Array.isArray(value) ? "#ERROR" : value;
    }
    catch { results[reference.toUpperCase()] = "#ERROR"; }
  }
  return results;
}

export function evaluateExcelFormulaForTests(cells: ExcelCellMap, formula: string): Value {
  const result = calculateExcelSheet({ ...cells, __FORMULA__: formula });
  return result.__FORMULA__ ?? "#ERROR";
}