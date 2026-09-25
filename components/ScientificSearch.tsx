"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BookOpen, ExternalLink, Search, X } from "lucide-react";

type ResearchResult = { id: string; title: string; authors: string; year: number | null; journal: string; publicationType: string; source: "Crossref" | "OpenAlex"; doi: string; url: string; abstract: string; openAccess: boolean };
type SearchResponse = { results?: ResearchResult[]; error?: string; warning?: string; page?: number; hasMore?: boolean; sources?: string[] };
type YearPreset = "all" | "lastYear" | "lastFive" | "custom";
const SEARCH_STORAGE_KEY = "datam-scientific-search-v1";

function initialSearchState() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.sessionStorage.getItem(SEARCH_STORAGE_KEY) ?? "{}"); } catch { return {}; }
}

export default function ScientificSearch() {
  const [restored] = useState(initialSearchState);
  const [query, setQuery] = useState(() => restored.query ?? "");
  const [yearPreset, setYearPreset] = useState<YearPreset>(() => restored.yearPreset ?? "all");
  const [fromYear, setFromYear] = useState(() => restored.fromYear ?? "");
  const [toYear, setToYear] = useState(() => restored.toYear ?? "");
  const [openAccessOnly, setOpenAccessOnly] = useState(() => restored.openAccessOnly ?? false);
  const [results, setResults] = useState<ResearchResult[]>(() => restored.results ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [searched, setSearched] = useState(() => restored.searched ?? false);
  const [page, setPage] = useState(() => restored.page ?? 1);
  const [hasMore, setHasMore] = useState(() => restored.hasMore ?? false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(restored.expandedIds ?? []));

  useEffect(() => { window.sessionStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify({ query, yearPreset, fromYear, toYear, openAccessOnly, results, searched, page, hasMore, expandedIds: Array.from(expandedIds) })); }, [query, yearPreset, fromYear, toYear, openAccessOnly, results, searched, page, hasMore, expandedIds]);

  const effectiveYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    if (yearPreset === "lastYear") return { from: String(currentYear - 1), to: String(currentYear) };
    if (yearPreset === "lastFive") return { from: String(currentYear - 4), to: String(currentYear) };
    if (yearPreset === "custom") return { from: fromYear, to: toYear };
    return { from: "", to: "" };
  }, [fromYear, toYear, yearPreset]);

  async function fetchResults(nextPage: number, submittedQuery = query, accessOnly = openAccessOnly) {
    const normalizedQuery = submittedQuery.trim();
    if (normalizedQuery.length < 2) { setError("Escribe al menos dos caracteres para buscar."); return; }
    if (yearPreset === "custom" && fromYear && toYear && Number(fromYear) > Number(toYear)) { setError("El año inicial no puede ser posterior al final."); return; }
    setLoading(true); setError(""); setWarning(""); setSearched(true);
    try {
      const params = new URLSearchParams({ q: normalizedQuery, page: String(nextPage) });
      if (effectiveYears.from) params.set("from", effectiveYears.from);
      if (effectiveYears.to) params.set("to", effectiveYears.to);
      if (accessOnly) params.set("openAccess", "true");
      const response = await fetch(`/api/research/search?${params.toString()}`, { headers: { Accept: "application/json" } });
      const data = await response.json() as SearchResponse;
      if (!response.ok) throw new Error(data.error ?? "Falló la búsqueda académica.");
      setResults((current) => nextPage === 1 ? data.results ?? [] : [...current, ...(data.results ?? [])]);
      setHasMore(Boolean(data.hasMore));
      setPage(nextPage);
      setWarning(data.warning ?? "");
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "No se pudieron cargar los resultados.");
      if (nextPage === 1) setResults([]);
    } finally { setLoading(false); }
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setResults([]); setExpandedIds(new Set()); void fetchResults(1); }
  function clearSearch() { setQuery(""); setResults([]); setError(""); setWarning(""); setSearched(false); setPage(1); setHasMore(false); setExpandedIds(new Set()); }
  function toggleAbstract(id: string) { setExpandedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }
  const visibleResults = openAccessOnly ? results.filter((result) => result.openAccess) : results;

  return <section className="research-search" aria-label="Buscador de libros y artículos científicos">
    <header className="research-search-head"><div><p className="data-cell-header">Fuentes académicas</p><h2 className="mt-1 font-display text-xl font-bold text-white">Buscar Ciencia</h2><p className="mt-2 text-sm text-blue-100">Busca publicaciones de todas las áreas en Crossref y OpenAlex. Los filtros y resultados se mantienen aquí aunque cambies de sección.</p></div><span className="research-sources">Crossref · OpenAlex</span></header>
    <form onSubmit={handleSearch} className="research-search-form">
      <label className="research-query"><Search className="h-4 w-4 shrink-0 text-muted" /><span className="sr-only">Artículos, autores, temas, revistas o DOI</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca artículos, autores, temas, revistas o DOI…" />{query && <button type="button" onClick={clearSearch} aria-label="Limpiar búsqueda" className="rounded p-1 text-blue-200 hover:bg-white/10"><X className="h-4 w-4" /></button>}</label>
      <div className="research-filter-row"><label className="research-filter-label">Año de publicación<select value={yearPreset} onChange={(event) => setYearPreset(event.target.value as YearPreset)}><option value="all">Todos</option><option value="lastYear">Último año</option><option value="lastFive">Últimos 5 años</option><option value="custom">Rango personalizado</option></select></label>{yearPreset === "custom" && <div className="research-year-range"><label>Desde<input type="number" min="1800" max="2100" value={fromYear} onChange={(event) => setFromYear(event.target.value)} placeholder="2020" /></label><label>Hasta<input type="number" min="1800" max="2100" value={toYear} onChange={(event) => setToYear(event.target.value)} placeholder={String(new Date().getFullYear())} /></label></div>}<label className="research-access"><input type="checkbox" checked={openAccessOnly} onChange={(event) => { const checked = event.target.checked; setOpenAccessOnly(checked); if (searched && query.trim()) { setResults([]); setExpandedIds(new Set()); void fetchResults(1, query, checked); } }} /> Solo acceso abierto</label><button type="submit" disabled={loading} className="rounded-cell bg-accent px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{loading ? "Buscando..." : "Buscar"}</button></div>
    </form>
    {loading && <div role="status" className="research-status"><span className="research-spinner" /> Consultando bases académicas...</div>}
    {error && <p role="alert" className="mt-3 rounded-cell border border-red-400/30 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
    {warning && <p role="status" className="mt-3 rounded-cell border border-amber-400/30 bg-amber-950/20 p-3 text-sm text-amber-100">{warning}</p>}
    {searched && !loading && visibleResults.length === 0 && <div className="research-empty"><BookOpen className="mx-auto h-6 w-6 text-blue-300" /><p className="mt-2 text-sm text-blue-100">No encontramos resultados para esta consulta y filtros. Prueba otros términos o amplía el rango de años.</p></div>}
    {visibleResults.length > 0 && <p className="mt-5 text-xs text-blue-200">{visibleResults.length} resultados cargados · página {page}</p>}
    <div className="research-results">{visibleResults.map((result) => <article key={result.id} className="research-result"><div className="flex items-start gap-3"><span className="research-result-icon"><BookOpen className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs text-blue-200">{result.source}</span>{result.openAccess && <span className="research-open">Acceso abierto</span>}{result.year !== null && <span className="text-xs text-blue-200">{result.year}</span>}</div><h3 className="mt-1 font-display text-base font-bold leading-6 text-white">{result.title}</h3><dl className="research-metadata"><div><dt>Autores</dt><dd>{result.authors}</dd></div><div><dt>Revista / publicación</dt><dd>{result.journal || "Revista no disponible"}</dd></div><div><dt>Tipo</dt><dd>{result.publicationType || "Tipo no disponible"}</dd></div><div><dt>DOI</dt><dd>{result.doi ? <a href={`https://doi.org/${encodeURIComponent(result.doi)}`} target="_blank" rel="noreferrer">{result.doi}</a> : "DOI no disponible"}</dd></div></dl><div className="research-abstract"><b>Resumen</b>{result.abstract ? <><p>{expandedIds.has(result.id) ? result.abstract : `${result.abstract.slice(0, 360)}${result.abstract.length > 360 ? "…" : ""}`}</p>{result.abstract.length > 360 && <button type="button" onClick={() => toggleAbstract(result.id)}>{expandedIds.has(result.id) ? "Ver menos" : "Leer resumen completo"}</button>}</> : <p>Resumen no disponible.</p>}</div>{result.url && <a href={result.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-white">Ver publicación <ExternalLink className="h-3.5 w-3.5" /></a>}</div></div></article>)}</div>
    {hasMore && <button type="button" disabled={loading} onClick={() => void fetchResults(page + 1)} className="mt-5 w-full rounded-cell border border-line-2 px-4 py-3 text-sm font-bold text-white hover:border-accent disabled:opacity-50">{loading ? "Cargando..." : "Cargar más resultados"}</button>}
    <p className="mt-4 text-xs leading-5 text-blue-200">Los metadatos provienen de Crossref y OpenAlex. Un resumen o enlace de texto completo solo se muestra cuando la fuente lo proporciona. Algunos artículos pueden requerir acceso institucional.</p>
  </section>;
}
