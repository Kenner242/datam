export type SqlValue = string | number | boolean | null;
export type SqlRow = Record<string, SqlValue>;
export type SqlTable = SqlRow[];
export type SqlDatabase = Record<string, SqlTable>;
export type SqlResult = { columns: string[]; rows: SqlRow[]; rowCount: number };
export type SqlRunResult = SqlResult | { error: string };

type Token = { kind: "word" | "number" | "string" | "symbol"; value: string };
type Expr =
  | { kind: "literal"; value: SqlValue }
  | { kind: "column"; table?: string; name: string }
  | { kind: "star" }
  | { kind: "unary"; op: string; value: Expr }
  | { kind: "binary"; op: string; left: Expr; right: Expr }
  | { kind: "between"; value: Expr; low: Expr; high: Expr }
  | { kind: "list"; values: Expr[] }
  | { kind: "subquery"; query: Query }
  | { kind: "call"; name: string; args: Expr[]; distinct?: boolean }
  | { kind: "case"; branches: Array<{ when: Expr; then: Expr }>; otherwise?: Expr };
type SelectItem = { expr: Expr; alias?: string };
type TableRef = { name: string; alias: string };
type Join = { kind: "INNER" | "LEFT" | "RIGHT"; table: TableRef; on: Expr };
type Query = { items: SelectItem[]; from: TableRef; joins: Join[]; where?: Expr; groupBy: Expr[]; having?: Expr; orderBy: Array<{ expr: Expr; direction: "ASC" | "DESC" }>; limit?: number; distinct: boolean };
type Context = { database: SqlDatabase; row: SqlRow; group?: SqlRow[] };

export const SQL_SAMPLE_DATABASE: SqlDatabase = {
  clientes: [
    { id: 1, nombre: "Ana García", ciudad: "Lima", edad: 28, email: "ana@mail.com", activo: 1 },
    { id: 2, nombre: "Luis Pérez", ciudad: "Santiago", edad: 34, email: "luis@mail.com", activo: 1 },
    { id: 3, nombre: "Sofía Ramírez", ciudad: "Bogotá", edad: 22, email: "sofia@mail.com", activo: 1 },
    { id: 4, nombre: "Marco Díaz", ciudad: "Lima", edad: 45, email: "marco@mail.com", activo: 0 },
    { id: 5, nombre: "Elena Torres", ciudad: "Buenos Aires", edad: 31, email: "elena@mail.com", activo: 1 },
    { id: 6, nombre: "Diego Rojas", ciudad: "Santiago", edad: 19, email: "diego@mail.com", activo: 1 },
  ],
  categorias: [{ id: 1, nombre: "Computadoras" }, { id: 2, nombre: "Accesorios" }, { id: 3, nombre: "Monitores" }],
  productos: [
    { id: 1, nombre: "Laptop Pro", categoria_id: 1, precio: 1200 },
    { id: 2, nombre: "Mouse Inalámbrico", categoria_id: 2, precio: 25 },
    { id: 3, nombre: "Teclado Mecánico", categoria_id: 2, precio: 80 },
    { id: 4, nombre: "Monitor 27\"", categoria_id: 3, precio: 300 },
    { id: 5, nombre: "Laptop Air", categoria_id: 1, precio: 950 },
    { id: 6, nombre: "Webcam HD", categoria_id: 2, precio: 60 },
  ],
  ventas: [
    { id: 1, cliente_id: 1, producto_id: 1, cantidad: 2, fecha: "2024-01-15" },
    { id: 2, cliente_id: 1, producto_id: 2, cantidad: 5, fecha: "2024-01-20" },
    { id: 3, cliente_id: 2, producto_id: 1, cantidad: 1, fecha: "2024-02-03" },
    { id: 4, cliente_id: 2, producto_id: 3, cantidad: 4, fecha: "2024-02-10" },
    { id: 5, cliente_id: 3, producto_id: 4, cantidad: 2, fecha: "2024-02-15" },
    { id: 6, cliente_id: 3, producto_id: 1, cantidad: 3, fecha: "2024-03-01" },
    { id: 7, cliente_id: 4, producto_id: 2, cantidad: 10, fecha: "2024-03-05" },
    { id: 8, cliente_id: 5, producto_id: 5, cantidad: 2, fecha: "2024-03-12" },
    { id: 9, cliente_id: 5, producto_id: 6, cantidad: 1, fecha: "2024-03-20" },
    { id: 10, cliente_id: 6, producto_id: 2, cantidad: 3, fecha: "2024-04-01" },
  ],
};

const keywords = new Set(["SELECT", "DISTINCT", "FROM", "WHERE", "GROUP", "BY", "HAVING", "ORDER", "ASC", "DESC", "LIMIT", "AS", "INNER", "LEFT", "RIGHT", "OUTER", "JOIN", "ON", "AND", "OR", "NOT", "IN", "BETWEEN", "LIKE", "IS", "NULL", "CASE", "WHEN", "THEN", "ELSE", "END", "TRUE", "FALSE"]);
const aggregateNames = new Set(["COUNT", "SUM", "AVG", "MIN", "MAX"]);

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < sql.length) {
    const char = sql[index];
    if (/\s/.test(char)) { index += 1; continue; }
    if (char === "-" && sql[index + 1] === "-") { while (index < sql.length && sql[index] !== "\n") index += 1; continue; }
    if (char === "/" && sql[index + 1] === "*") throw new Error("Usa comentarios de línea --; los comentarios de bloque no están disponibles.");
    if (char === "'" || char === '"') {
      const quote = char;
      index += 1;
      let value = "";
      while (index < sql.length && sql[index] !== quote) {
        if (sql[index] === "\\" && index + 1 < sql.length) { value += sql[index + 1]; index += 2; }
        else { value += sql[index]; index += 1; }
      }
      if (sql[index] !== quote) throw new Error("Texto sin comilla de cierre.");
      index += 1;
      tokens.push({ kind: "string", value });
      continue;
    }
    const number = sql.slice(index).match(/^\d+(?:\.\d+)?/);
    if (number) { tokens.push({ kind: "number", value: number[0] }); index += number[0].length; continue; }
    const word = sql.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (word) { tokens.push({ kind: "word", value: word[0] }); index += word[0].length; continue; }
    const pair = sql.slice(index, index + 2);
    if (["<=", ">=", "<>", "!="].includes(pair)) { tokens.push({ kind: "symbol", value: pair === "!=" ? "<>" : pair }); index += 2; continue; }
    if ("+-*/%=<>(),.;*".includes(char)) { tokens.push({ kind: "symbol", value: char }); index += 1; continue; }
    throw new Error(`Símbolo no soportado: ${char}`);
  }
  return tokens;
}

class Parser {
  private position = 0;
  constructor(private readonly tokens: Token[]) {}
  private peek() { return this.tokens[this.position]; }
  private take() { return this.tokens[this.position++]; }
  private wordIs(value: string) { return this.peek()?.kind === "word" && this.peek()?.value.toUpperCase() === value; }
  private matchWord(value: string) { if (!this.wordIs(value)) return false; this.position += 1; return true; }
  private expectWord(value: string) { if (!this.matchWord(value)) throw new Error(`Se esperaba ${value}; se encontró ${this.peek()?.value ?? "fin de consulta"}.`); }
  private matchSymbol(value: string) { if (this.peek()?.kind !== "symbol" || this.peek()?.value !== value) return false; this.position += 1; return true; }
  private expectSymbol(value: string) { if (!this.matchSymbol(value)) throw new Error(`Se esperaba ${value}.`); }

  parse(): Query {
    this.expectWord("SELECT");
    const distinct = this.matchWord("DISTINCT");
    const items = [this.parseItem()];
    while (this.matchSymbol(",")) items.push(this.parseItem());
    this.expectWord("FROM");
    const from = this.parseTable();
    const joins: Join[] = [];
    while (["INNER", "LEFT", "RIGHT"].some((kind) => this.wordIs(kind))) {
      let kind: Join["kind"] = "INNER";
      if (this.matchWord("LEFT")) { kind = "LEFT"; this.matchWord("OUTER"); }
      else if (this.matchWord("RIGHT")) { kind = "RIGHT"; this.matchWord("OUTER"); }
      else this.matchWord("INNER");
      this.expectWord("JOIN");
      const table = this.parseTable();
      this.expectWord("ON");
      joins.push({ kind, table, on: this.parseExpression() });
    }
    const query: Query = { items, from, joins, groupBy: [], orderBy: [], distinct };
    if (this.matchWord("WHERE")) query.where = this.parseExpression();
    if (this.matchWord("GROUP")) { this.expectWord("BY"); query.groupBy = this.parseExpressionList(); }
    if (this.matchWord("HAVING")) query.having = this.parseExpression();
    if (this.matchWord("ORDER")) { this.expectWord("BY"); query.orderBy = this.parseOrderList(); }
    if (this.matchWord("LIMIT")) {
      const token = this.take();
      if (token?.kind !== "number") throw new Error("LIMIT requiere un número.");
      query.limit = Number(token.value);
    }
    this.matchSymbol(";");
    if (this.position < this.tokens.length) throw new Error(`Sentencias múltiples o contenido no soportado: ${this.peek()?.value}.`);
    return query;
  }

  private parseTable(): TableRef {
    const token = this.take();
    if (token?.kind !== "word") throw new Error("Se esperaba el nombre de una tabla.");
    let alias = token.value;
    if (this.matchWord("AS")) {
      const aliasToken = this.take();
      if (aliasToken?.kind !== "word") throw new Error("AS requiere un alias.");
      alias = aliasToken.value;
    } else if (this.peek()?.kind === "word" && !keywords.has(this.peek()!.value.toUpperCase())) alias = this.take().value;
    return { name: token.value.toLowerCase(), alias };
  }

  private parseItem(): SelectItem {
    let expr: Expr;
    if (this.matchSymbol("*")) expr = { kind: "star" };
    else if (this.peek()?.kind === "word" && this.tokens[this.position + 1]?.value === "." && this.tokens[this.position + 2]?.value === "*") {
      this.take(); this.take(); this.take(); expr = { kind: "star" };
    } else expr = this.parseExpression();
    let alias: string | undefined;
    if (this.matchWord("AS")) {
      const token = this.take();
      if (token?.kind !== "word") throw new Error("Alias inválido.");
      alias = token.value;
    } else if (this.peek()?.kind === "word" && !keywords.has(this.peek()!.value.toUpperCase())) alias = this.take().value;
    return { expr, alias };
  }

  private parseExpressionList() { const values = [this.parseExpression()]; while (this.matchSymbol(",")) values.push(this.parseExpression()); return values; }
  private parseOrderList() {
    const values: Query["orderBy"] = [];
    do { const expr = this.parseExpression(); values.push({ expr, direction: this.matchWord("DESC") ? "DESC" : (this.matchWord("ASC"), "ASC") }); } while (this.matchSymbol(","));
    return values;
  }
  private parseExpression(): Expr { return this.parseOr(); }
  private parseOr(): Expr { let left = this.parseAnd(); while (this.matchWord("OR")) left = { kind: "binary", op: "OR", left, right: this.parseAnd() }; return left; }
  private parseAnd(): Expr { let left = this.parseNot(); while (this.matchWord("AND")) left = { kind: "binary", op: "AND", left, right: this.parseNot() }; return left; }
  private parseNot(): Expr { if (this.matchWord("NOT")) return { kind: "unary", op: "NOT", value: this.parseNot() }; return this.parseComparison(); }
  private parseComparison(): Expr {
    const left = this.parseAdd();
    const token = this.peek();
    if (token?.kind === "symbol" && ["=", "<>", "<", ">", "<=", ">="].includes(token.value)) return { kind: "binary", op: this.take().value, left, right: this.parseAdd() };
    if (this.matchWord("IS")) { const negated = this.matchWord("NOT"); this.expectWord("NULL"); return { kind: "unary", op: negated ? "IS NOT NULL" : "IS NULL", value: left }; }
    if (this.matchWord("IN")) {
      this.expectSymbol("(");
      if (this.wordIs("SELECT")) {
        const start = this.position;
        let depth = 0;
        let end = start;
        while (end < this.tokens.length) {
          const value = this.tokens[end].value;
          if (value === "(") depth += 1;
          if (value === ")") { if (depth === 0) break; depth -= 1; }
          end += 1;
        }
        if (end >= this.tokens.length) throw new Error("La subconsulta IN necesita paréntesis de cierre.");
        const query = new Parser(this.tokens.slice(start, end)).parse();
        this.position = end + 1;
        return { kind: "binary", op: "IN", left, right: { kind: "subquery", query } };
      }
      const values = this.parseExpressionList(); this.expectSymbol(")"); return { kind: "binary", op: "IN", left, right: { kind: "list", values } };
    }
    if (this.matchWord("BETWEEN")) { const low = this.parseAdd(); this.expectWord("AND"); return { kind: "between", value: left, low, high: this.parseAdd() }; }
    if (this.matchWord("LIKE")) return { kind: "binary", op: "LIKE", left, right: this.parseAdd() };
    return left;
  }
  private parseAdd(): Expr { let left = this.parseMultiply(); while (this.peek()?.kind === "symbol" && ["+", "-"].includes(this.peek()!.value)) left = { kind: "binary", op: this.take().value, left, right: this.parseMultiply() }; return left; }
  private parseMultiply(): Expr { let left = this.parseUnary(); while (this.peek()?.kind === "symbol" && ["*", "/", "%"].includes(this.peek()!.value)) left = { kind: "binary", op: this.take().value, left, right: this.parseUnary() }; return left; }
  private parseUnary(): Expr { if (this.matchSymbol("-")) return { kind: "unary", op: "-", value: this.parseUnary() }; if (this.matchSymbol("+")) return this.parseUnary(); return this.parsePrimary(); }
  private parsePrimary(): Expr {
    const token = this.take();
    if (!token) throw new Error("Expresión incompleta.");
    if (token.kind === "number") return { kind: "literal", value: Number(token.value) };
    if (token.kind === "string") return { kind: "literal", value: token.value };
    if (token.kind === "word") {
      const upper = token.value.toUpperCase();
      if (upper === "TRUE" || upper === "FALSE") return { kind: "literal", value: upper === "TRUE" };
      if (upper === "NULL") return { kind: "literal", value: null };
      if (upper === "CASE") return this.parseCase();
      if (this.matchSymbol("(")) {
        const distinct = upper === "COUNT" && this.matchWord("DISTINCT");
        const args = this.peek()?.value === ")" ? [] : this.parseExpressionList();
        this.expectSymbol(")");
        return { kind: "call", name: upper, args, distinct };
      }
      if (this.matchSymbol(".")) { const column = this.take(); if (column?.kind !== "word") throw new Error("Nombre de columna inválido."); return { kind: "column", table: token.value, name: column.value }; }
      return { kind: "column", name: token.value };
    }
    if (token.value === "(") { const expr = this.parseExpression(); this.expectSymbol(")"); return expr; }
    if (token.value === "*") return { kind: "star" };
    throw new Error(`Token inesperado: ${token.value}.`);
  }
  private parseCase(): Expr {
    const branches: Array<{ when: Expr; then: Expr }> = [];
    while (this.matchWord("WHEN")) { const when = this.parseExpression(); this.expectWord("THEN"); branches.push({ when, then: this.parseExpression() }); }
    const otherwise = this.matchWord("ELSE") ? this.parseExpression() : undefined;
    this.expectWord("END");
    return { kind: "case", branches, otherwise };
  }
}

function label(expr: Expr): string { return expr.kind === "column" ? expr.name : expr.kind === "call" ? expr.name.toLowerCase() : expr.kind === "star" ? "*" : "expr"; }
function truthy(value: unknown) { return value !== null && value !== undefined && value !== false && value !== 0 && value !== ""; }
function compare(left: unknown, op: string, right: unknown): boolean {
  if (left === null || left === undefined || right === null || right === undefined) return false;
  if (op === "=" || op === "==") return left === right;
  if (op === "<>") return left !== right;
  const a = typeof left === "number" && typeof right === "number" ? left : String(left);
  const b = typeof left === "number" && typeof right === "number" ? right : String(right);
  if (op === "<") return a < b;
  if (op === ">") return a > b;
  if (op === "<=") return a <= b;
  if (op === ">=") return a >= b;
  return false;
}
function hasAggregate(expr: Expr): boolean {
  if (expr.kind === "call") return aggregateNames.has(expr.name) || expr.args.some(hasAggregate);
  if (expr.kind === "binary") return hasAggregate(expr.left) || hasAggregate(expr.right);
  if (expr.kind === "unary") return hasAggregate(expr.value);
  if (expr.kind === "between") return hasAggregate(expr.value) || hasAggregate(expr.low) || hasAggregate(expr.high);
  if (expr.kind === "case") return expr.branches.some((item) => hasAggregate(item.when) || hasAggregate(item.then)) || Boolean(expr.otherwise && hasAggregate(expr.otherwise));
  return false;
}
function resolveColumn(name: string, table: string | undefined, row: SqlRow): SqlValue {
  if (table) {
    const key = `${table}.${name}`;
    if (key in row) return row[key];
    throw new Error(`Columna no encontrada: ${key}.`);
  }
  if (name in row) return row[name];
  const matches = Object.entries(row).filter(([key]) => key.endsWith(`.${name}`));
  if (matches.length === 1) return matches[0][1];
  throw new Error(`Columna no encontrada o ambigua: ${name}.`);
}
function value(expr: Expr, context: Context): unknown {
  if (expr.kind === "literal") return expr.value;
  if (expr.kind === "column") return resolveColumn(expr.name, expr.table, context.row);
  if (expr.kind === "star") return null;
  if (expr.kind === "unary") { const inner = value(expr.value, context); return expr.op === "NOT" ? !truthy(inner) : -(Number(inner) || 0); }
  if (expr.kind === "between") return compare(value(expr.value, context), ">=", value(expr.low, context)) && compare(value(expr.value, context), "<=", value(expr.high, context));
  if (expr.kind === "binary") {
    if (expr.op === "AND") return truthy(value(expr.left, context)) && truthy(value(expr.right, context));
    if (expr.op === "OR") return truthy(value(expr.left, context)) || truthy(value(expr.right, context));
    const left = value(expr.left, context);
    if (expr.op === "IN") {
      if (expr.right.kind === "list") return expr.right.values.some((item) => value(item, context) === left);
      if (expr.right.kind === "subquery") { const result = execute(expr.right.query, context.database); return result.rows.some((item) => item[result.columns[0]] === left); }
    }
    const right = value(expr.right, context);
    if (["=", "<>", "<", ">", "<=", ">="].includes(expr.op)) return compare(left, expr.op, right);
    if (expr.op === "LIKE") { const escaped = String(right ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, "."); return new RegExp(`^${escaped}$`, "i").test(String(left ?? "")); }
    const a = Number(left) || 0; const b = Number(right) || 0;
    if (expr.op === "+") return a + b;
    if (expr.op === "-") return a - b;
    if (expr.op === "*") return a * b;
    if (expr.op === "/") return b === 0 ? null : a / b;
    if (expr.op === "%") return b === 0 ? null : a % b;
  }
  if (expr.kind === "case") { for (const branch of expr.branches) if (truthy(value(branch.when, context))) return value(branch.then, context); return expr.otherwise ? value(expr.otherwise, context) : null; }
  if (expr.kind === "call") {
    if (aggregateNames.has(expr.name)) {
      const rows = context.group ?? [context.row];
      let values = expr.args[0]?.kind === "star" ? rows.map(() => 1) : rows.map((row) => value(expr.args[0], { ...context, row, group: undefined })).filter((item) => item !== null && item !== undefined);
      if (expr.distinct) values = Array.from(new Set(values));
      if (expr.name === "COUNT") return values.length;
      const numbers = values.map(Number).filter(Number.isFinite);
      if (expr.name === "SUM") return numbers.reduce((sum, item) => sum + item, 0);
      if (expr.name === "AVG") return numbers.length ? numbers.reduce((sum, item) => sum + item, 0) / numbers.length : 0;
      if (expr.name === "MIN") return numbers.length ? Math.min(...numbers) : null;
      return numbers.length ? Math.max(...numbers) : null;
    }
    const args = expr.args.map((item) => value(item, context));
    if (expr.name === "UPPER") return String(args[0] ?? "").toUpperCase();
    if (expr.name === "LOWER") return String(args[0] ?? "").toLowerCase();
    if (expr.name === "LENGTH" || expr.name === "LEN") return String(args[0] ?? "").length;
    if (expr.name === "ROUND") { const factor = 10 ** (Number(args[1]) || 0); return Math.round((Number(args[0]) || 0) * factor) / factor; }
    if (expr.name === "ABS") return Math.abs(Number(args[0]) || 0);
    if (expr.name === "COALESCE") return args.find((item) => item !== null && item !== undefined) ?? null;
    if (expr.name === "CONCAT") return args.map((item) => String(item ?? "")).join("");
    if (expr.name === "SUBSTR" || expr.name === "SUBSTRING") return String(args[0] ?? "").substr(Math.max(0, Number(args[1]) - 1), args[2] === undefined ? undefined : Number(args[2]));
    if (expr.name === "CURRENT_DATE" && args.length === 0) return new Date().toISOString().slice(0, 10);
    throw new Error(`Función no soportada: ${expr.name}.`);
  }
  if (expr.kind === "subquery") throw new Error("Las subconsultas solo se admiten dentro de IN en WHERE.");
  throw new Error("No se pudo evaluar la expresión.");
}
function prefix(row: SqlRow, table: TableRef): SqlRow {
  const output: SqlRow = {};
  for (const [key, item] of Object.entries(row)) { output[`${table.alias}.${key}`] = item; output[`${table.name}.${key}`] = item; if (!(key in output)) output[key] = item; }
  return output;
}
function execute(query: Query, database: SqlDatabase): SqlResult {
  const base = database[query.from.name];
  if (!base) throw new Error(`Tabla no encontrada: ${query.from.name}.`);
  let rows = base.map((row) => prefix(row, query.from));
  for (const join of query.joins) {
    const source = database[join.table.name];
    if (!source) throw new Error(`Tabla no encontrada: ${join.table.name}.`);
    const rights = source.map((row) => prefix(row, join.table));
    const joined: SqlRow[] = [];
    const matched = new Set<number>();
    rows.forEach((left) => {
      let found = false;
      rights.forEach((right, index) => {
        const combination = { ...left, ...right };
        if (truthy(value(join.on, { database, row: combination }))) { joined.push(combination); matched.add(index); found = true; }
      });
      if (!found && join.kind === "LEFT") {
        const missing: SqlRow = {};
        Object.keys(source[0] ?? {}).forEach((key) => { missing[`${join.table.alias}.${key}`] = null; missing[`${join.table.name}.${key}`] = null; });
        joined.push({ ...left, ...missing });
      }
    });
    if (join.kind === "RIGHT") {
      const leftColumns = Object.keys(base[0] ?? {});
      rights.forEach((right, index) => {
        if (!matched.has(index)) {
          const missing: SqlRow = {};
          leftColumns.forEach((key) => { missing[`${query.from.alias}.${key}`] = null; missing[`${query.from.name}.${key}`] = null; });
          joined.push({ ...missing, ...right });
        }
      });
    }
    rows = joined;
  }
  if (query.where) rows = rows.filter((row) => truthy(value(query.where!, { database, row })));
  const aggregate = query.items.some((item) => hasAggregate(item.expr)) || Boolean(query.having && hasAggregate(query.having));
  let output: SqlRow[];
  if (query.groupBy.length || aggregate) {
    const groups = new Map<string, SqlRow[]>();
    if (query.groupBy.length) rows.forEach((row) => { const key = query.groupBy.map((item) => JSON.stringify(value(item, { database, row }))).join("|"); groups.set(key, [...(groups.get(key) ?? []), row]); });
    else groups.set("__all__", rows);
    if (!groups.size && !query.groupBy.length) groups.set("__all__", []);
    output = [];
    groups.forEach((group) => {
      const row = group[0] ?? {};
      const context: Context = { database, row, group };
      const result = Object.fromEntries(query.items.map((item) => [item.alias ?? label(item.expr), value(item.expr, context) as SqlValue])) as SqlRow;
      if (!query.having || truthy(value(query.having, { database, row: { ...row, ...result }, group }))) output.push(result);
    });
  } else {
    output = rows.map((row) => Object.fromEntries(query.items.flatMap((item) => item.expr.kind === "star" ? Object.entries(row).filter(([key]) => !key.includes(".")) : [[item.alias ?? label(item.expr), value(item.expr, { database, row }) as SqlValue]])) as SqlRow);
    if (query.distinct) output = Array.from(new Map(output.map((row) => [JSON.stringify(row), row])).values());
  }
  if (query.orderBy.length) output.sort((left, right) => {
    for (const order of query.orderBy) {
      const key = order.expr.kind === "column" ? order.expr.name : label(order.expr);
      const a = left[key]; const b = right[key];
      const comparison = typeof a === "number" && typeof b === "number" ? a - b : String(a ?? "").localeCompare(String(b ?? ""));
      if (comparison !== 0) return order.direction === "DESC" ? -comparison : comparison;
    }
    return 0;
  });
  if (query.limit !== undefined) output = output.slice(0, query.limit);
  const columns = query.items.some((item) => item.expr.kind === "star") ? Object.keys(output[0] ?? {}) : query.items.map((item) => item.alias ?? label(item.expr));
  return { columns, rows: output, rowCount: output.length };
}

export function runSql(source: string, database: SqlDatabase = SQL_SAMPLE_DATABASE): SqlRunResult {
  try {
    const tokens = tokenize(source);
    if (!tokens.length) throw new Error("Escribe una consulta SQL.");
    return execute(new Parser(tokens).parse(), database);
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}
