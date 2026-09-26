export type PowerBiRow = { Producto: string; Ciudad: string; Vendedor: string; Ventas: number; Cantidad: number };
export type PowerBiDataModel = { Ventas: PowerBiRow[] };
export type DaxScalar = string | number | boolean | null;
type DaxTableValue = { kind: "table-value"; rows: PowerBiRow[] };
type DaxColumnValue = { kind: "column-values"; values: DaxScalar[] };
type DaxValue = DaxScalar | DaxColumnValue | DaxTableValue;
type Token = { type: "number" | "string" | "identifier" | "operator"; value: string };
type Ast =
  | { kind: "number"; value: number }
  | { kind: "string"; value: string }
  | { kind: "boolean"; value: boolean }
  | { kind: "column"; table: string; column: string }
  | { kind: "table"; name: string }
  | { kind: "filter"; table: string; column: string; operator: string; value: DaxScalar }
  | { kind: "unary"; operator: string; value: Ast }
  | { kind: "binary"; operator: string; left: Ast; right: Ast }
  | { kind: "call"; name: string; args: Ast[] };

export const POWER_BI_SAMPLE_MODEL: PowerBiDataModel = {
  Ventas: [
    { Producto: "Laptop", Ciudad: "Lima", Vendedor: "Ana", Ventas: 1200, Cantidad: 2 },
    { Producto: "Mouse", Ciudad: "Lima", Vendedor: "Ana", Ventas: 50, Cantidad: 5 },
    { Producto: "Laptop", Ciudad: "Santiago", Vendedor: "Luis", Ventas: 1500, Cantidad: 3 },
    { Producto: "Teclado", Ciudad: "Santiago", Vendedor: "Luis", Ventas: 80, Cantidad: 4 },
    { Producto: "Monitor", Ciudad: "Bogotá", Vendedor: "Sofía", Ventas: 800, Cantidad: 2 },
    { Producto: "Laptop", Ciudad: "Bogotá", Vendedor: "Sofía", Ventas: 1300, Cantidad: 3 },
  ],
};

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (/\s/.test(char)) { index += 1; continue; }
    if (char === '"') {
      let value = "";
      index += 1;
      while (index < source.length && source[index] !== '"') value += source[index++];
      if (source[index] !== '"') throw new Error("Texto sin comillas de cierre.");
      index += 1;
      tokens.push({ type: "string", value });
      continue;
    }
    const number = source.slice(index).match(/^\d+(?:\.\d+)?/);
    if (number) { tokens.push({ type: "number", value: number[0] }); index += number[0].length; continue; }
    const identifier = source.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (identifier) { tokens.push({ type: "identifier", value: identifier[0] }); index += identifier[0].length; continue; }
    const operator = source.slice(index).match(/^(?:<=|>=|<>|==)/);
    if (operator) { tokens.push({ type: "operator", value: operator[0] }); index += operator[0].length; continue; }
    if ("+-*/^(),[].=<>".includes(char)) { tokens.push({ type: "operator", value: char }); index += 1; continue; }
    throw new Error(`Carácter no soportado: ${char}`);
  }
  return tokens;
}

function parse(source: string): Ast {
  const tokens = tokenize(source);
  let position = 0;
  const peek = () => tokens[position];
  const take = () => tokens[position++];

  function expression(): Ast { return comparison(); }
  function comparison(): Ast {
    let left = additive();
    while (peek()?.type === "operator" && ["=", "==", "<>", "<", ">", "<=", ">="].includes(peek().value)) {
      const operator = take().value;
      left = { kind: "binary", operator, left, right: additive() };
    }
    return left;
  }
  function additive(): Ast {
    let left = multiplicative();
    while (peek()?.value === "+" || peek()?.value === "-") {
      const operator = take().value;
      left = { kind: "binary", operator, left, right: multiplicative() };
    }
    return left;
  }
  function multiplicative(): Ast {
    let left = power();
    while (peek()?.value === "*" || peek()?.value === "/") {
      const operator = take().value;
      left = { kind: "binary", operator, left, right: power() };
    }
    return left;
  }
  function power(): Ast {
    let left = unary();
    if (peek()?.value === "^") { take(); left = { kind: "binary", operator: "^", left, right: power() }; }
    return left;
  }
  function unary(): Ast {
    if (peek()?.value === "-") { take(); return { kind: "unary", operator: "-", value: unary() }; }
    if (peek()?.value === "+") { take(); return unary(); }
    return primary();
  }
  function primary(): Ast {
    const token = take();
    if (!token) throw new Error("Expresión DAX incompleta.");
    if (token.type === "number") return { kind: "number", value: Number(token.value) };
    if (token.type === "string") return { kind: "string", value: token.value };
    if (token.type === "identifier") {
      const normalized = token.value.toUpperCase();
      if (normalized === "TRUE" || normalized === "FALSE") return { kind: "boolean", value: normalized === "TRUE" };
      if (peek()?.value === "[") {
        take();
        const column = take();
        if (column?.type !== "identifier" || take()?.value !== "]") throw new Error(`Referencia de columna inválida: ${token.value}.`);
        return { kind: "column", table: token.value, column: column.value };
      }
      if (peek()?.value === "(") {
        take();
        const args: Ast[] = [];
        if (peek()?.value !== ")") { args.push(expression()); while (peek()?.value === ",") { take(); args.push(expression()); } }
        if (take()?.value !== ")") throw new Error(`Falta el paréntesis de cierre de ${token.value}.`);
        return { kind: "call", name: normalized, args };
      }
      return { kind: "table", name: token.value };
    }
    if (token.value === "(") { const result = expression(); if (take()?.value !== ")") throw new Error("Falta un paréntesis de cierre."); return result; }
    throw new Error(`Token no esperado: ${token.value}`);
  }

  const tree = expression();
  if (position !== tokens.length) throw new Error(`No se pudo interpretar ${tokens[position].value}.`);
  return tree;
}

function numberOf(value: DaxValue | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? 1 : 0;
  return Number(value) || 0;
}

function evaluateAst(ast: Ast, model: PowerBiDataModel, filters: Array<{ column: string; operator: string; value: DaxScalar }>, row?: PowerBiRow): DaxValue {
  if (ast.kind === "number" || ast.kind === "string" || ast.kind === "boolean") return ast.value;
  if (ast.kind === "table") {
    if (ast.name.toLocaleLowerCase() !== "ventas") throw new Error(`Tabla no disponible: ${ast.name}.`);
    return { kind: "table-value", rows: model.Ventas.filter((item) => filters.every((filter) => compare(item[filter.column as keyof PowerBiRow] as DaxScalar, filter.operator, filter.value))) };
  }
  if (ast.kind === "column") {
    if (ast.table.toLocaleLowerCase() !== "ventas") throw new Error(`Tabla no disponible: ${ast.table}.`);
    if (!(ast.column in model.Ventas[0])) throw new Error(`Columna no disponible: ${ast.table}[${ast.column}].`);
    if (row) return row[ast.column as keyof PowerBiRow] as DaxScalar;
    return { kind: "column-values", values: model.Ventas.filter((item) => filters.every((filter) => compare(item[filter.column as keyof PowerBiRow] as DaxScalar, filter.operator, filter.value))).map((item) => item[ast.column as keyof PowerBiRow] as DaxScalar) };
  }
  if (ast.kind === "filter") throw new Error("Un filtro aislado no es un resultado de medida.");
  if (ast.kind === "unary") return -numberOf(evaluateAst(ast.value, model, filters, row));
  if (ast.kind === "binary") {
    const left = evaluateAst(ast.left, model, filters, row);
    const right = evaluateAst(ast.right, model, filters, row);
    if (ast.operator === "+") return numberOf(left) + numberOf(right);
    if (ast.operator === "-") return numberOf(left) - numberOf(right);
    if (ast.operator === "*") return numberOf(left) * numberOf(right);
    if (ast.operator === "/") return numberOf(right) === 0 ? null : numberOf(left) / numberOf(right);
    if (ast.operator === "^") return numberOf(left) ** numberOf(right);
    return compare(left as DaxScalar, ast.operator, right as DaxScalar);
  }

  const name = ast.name;
  if (["SUMX", "AVERAGEX"].includes(name)) {
    if (ast.args.length !== 2 || ast.args[0].kind !== "table") throw new Error(`${name} requiere una tabla y una expresión.`);
    const table = evaluateAst(ast.args[0], model, filters);
    if (!table || typeof table !== "object" || Array.isArray(table) || table.kind !== "table-value") throw new Error(`${name} requiere una tabla Ventas.`);
    const values = table.rows.map((record) => numberOf(evaluateAst(ast.args[1], model, filters, record)));
    if (name === "SUMX") return values.reduce((sum, value) => sum + value, 0);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }
  if (name === "CALCULATE") {
    if (!ast.args.length || ast.args.length > 5) throw new Error("CALCULATE requiere una expresión y hasta cuatro filtros.");
    const nextFilters = [...filters];
    for (const filterAst of ast.args.slice(1)) {
      if (filterAst.kind !== "binary" || !["=", "==", "<>", "<", ">", "<=", ">="].includes(filterAst.operator) || filterAst.left.kind !== "column") throw new Error("Este laboratorio permite filtros directos del tipo Ventas[Columna] = valor.");
      const value = evaluateAst(filterAst.right, model, filters);
      if (value !== null && typeof value === "object") throw new Error("El valor del filtro debe ser escalar.");
      const filter: { column: string; operator: string; value: DaxScalar } = { column: filterAst.left.column, operator: filterAst.operator, value: value as DaxScalar };
      const existing = nextFilters.findIndex((item) => item.column.toLocaleLowerCase() === filter.column.toLocaleLowerCase());
      if (existing >= 0) nextFilters.splice(existing, 1);
      nextFilters.push(filter);
    }
    return evaluateAst(ast.args[0], model, nextFilters, row);
  }

  const args = ast.args.map((argument) => evaluateAst(argument, model, filters, row));
  const flattened: DaxScalar[] = [];
  for (const value of args) {
    if (value !== null && typeof value === "object" && !Array.isArray(value) && value.kind === "column-values") {
      flattened.push(...value.values);
    } else if (value === null || typeof value !== "object") {
      flattened.push(value as DaxScalar);
    } else {
      throw new Error(`${name} no admite una tabla como argumento escalar.`);
    }
  }
  const numericValues = flattened.filter((value): value is number => typeof value === "number");
  switch (name) {
    case "SUM": return numericValues.reduce((sum, value) => sum + value, 0);
    case "AVERAGE": return numericValues.length ? numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length : 0;
    case "MIN": return numericValues.length ? Math.min(...numericValues) : 0;
    case "MAX": return numericValues.length ? Math.max(...numericValues) : 0;
    case "COUNT": return numericValues.length;
    case "COUNTA": return flattened.filter((value) => value !== null && value !== "").length;
    case "COUNTROWS": return args[0] !== null && typeof args[0] === "object" && args[0].kind === "table-value" ? args[0].rows.length : 0;
    case "DISTINCTCOUNT": return new Set(flattened).size;
    case "DIVIDE": return numberOf(args[1]) === 0 ? args[2] ?? null : numberOf(args[0]) / numberOf(args[1]);
    case "IF": return args[0] ? args[1] ?? null : args[2] ?? null;
    case "SWITCH": {
      const expression = args[0];
      for (let index = 1; index + 1 < args.length; index += 2) if (args[index] === expression) return args[index + 1];
      return args.length % 2 === 0 ? args[args.length - 1] : null;
    }
    case "AND": return args.every(Boolean);
    case "OR": return args.some(Boolean);
    case "NOT": return !args[0];
    default: throw new Error(`Función DAX no soportada: ${name}.`);
  }
}

function compare(left: DaxScalar, operator: string, right: DaxScalar): boolean {
  if (typeof left === "number" && typeof right === "number") {
    switch (operator) {
      case "=": case "==": return left === right;
      case "<>": return left !== right;
      case "<": return left < right;
      case ">": return left > right;
      case "<=": return left <= right;
      case ">=": return left >= right;
      default: return false;
    }
  }
  const leftText = String(left).toLocaleLowerCase();
  const rightText = String(right).toLocaleLowerCase();
  switch (operator) {
    case "=": case "==": return leftText === rightText;
    case "<>": return leftText !== rightText;
    case "<": return leftText < rightText;
    case ">": return leftText > rightText;
    case "<=": return leftText <= rightText;
    case ">=": return leftText >= rightText;
    default: return false;
  }
}

export function evaluateDax(source: string, model: PowerBiDataModel = POWER_BI_SAMPLE_MODEL): DaxScalar {
  const trimmed = source.trim().replace(/^=\s*/, "");
  if (!trimmed) throw new Error("Escribe una expresión DAX.");
  const ast = parse(trimmed);
  const result = evaluateAst(ast, model, []);
  if (result !== null && typeof result === "object") throw new Error("La medida debe devolver un valor escalar.");
  if (typeof result === "number" && !Number.isFinite(result)) return null;
  return result;
}