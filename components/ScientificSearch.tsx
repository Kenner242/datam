"use client";

import { FormEvent, useState } from "react";
import { BookOpen, ExternalLink, Search, SlidersHorizontal } from "lucide-react";

type ResearchResult = { id: string; title: string; authors: string; year: number | null; source: string; doi: string; url: string; abstract: string; openAccess: boolean };

export default function ScientificSearch() {
  const [query, setQuery] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim().length < 2) { setError("Escribe un tema con al menos dos caracteres."); return; }
    setLoading(true); setError(""); setSearched(true);
    try {
      const params = new URLSearchParams({ q: query.trim() });
      if (fromYear) params.set("from", fromYear);
      if (toYear) params.set("to", toYear);
      const response = await fetch(`/api/research/search?${params.toString()}`);
      const data = await response.json() as { results?: ResearchResult[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Falló la búsqueda científica.");
      setResults(data.results ?? []);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "No se pudieron cargar los resultados.");
      setResults([]);
    } finally { setLoading(false); }
  }

  const visibleResults = openAccessOnly ? results.filter((result) => result.openAccess) : results;

  return <section className="research-search" aria-label="Buscador de libros y artículos científicos">
    <header className="research-search-head"><div><p className="data-cell-header">Fuentes académicas abiertas</p><h2 className="mt-1 font-display text-xl font-bold text-white">Buscar libros y artículos científicos</h2><p className="mt-2 text-sm text-blue-100">Busca en Crossref y OpenAlex. Los resultados incluyen DOI y enlace a la fuente; el acceso al texto completo depende de cada publicación.</p></div><span className="research-sources">Crossref · OpenAlex</span></header>
    <form onSubmit={(event) => void search(event)} className="research-search-form">
      <label className="research-query"><Search className="h-4 w-4 shrink-0 text-muted" /><span className="sr-only">Tema de búsqueda</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. alfabetización de datos en educación" /></label>
      <div className="research-filters"><label>Desde <input type="number" min="1900" max="2100" value={fromYear} onChange={(event) => setFromYear(event.target.value)} placeholder="2018" /></label><label>Hasta <input type="number" min="1900" max="2100" value={toYear} onChange={(event) => setToYear(event.target.value)} placeholder="2026" /></label><label className="research-access"><input type="checkbox" checked={openAccessOnly} onChange={(event) => setOpenAccessOnly(event.target.checked)} /> Solo acceso abierto</label><button type="submit" disabled={loading} className="rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{loading ? "Buscando..." : "Buscar"}</button></div>
    </form>
    {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
    {searched && !loading && visibleResults.length === 0 && <div className="research-empty"><SlidersHorizontal className="mx-auto h-6 w-6 text-blue-300" /><p className="mt-2 text-sm text-blue-100">No hay resultados con estos filtros. Prueba otros términos o amplía los años.</p></div>}
    <div className="research-results">{visibleResults.map((result) => <article key={result.id} className="research-result"><div className="flex items-start gap-3"><span className="research-result-icon"><BookOpen className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs text-blue-200">{result.source}{result.year ? ` · ${result.year}` : ""}</span>{result.openAccess && <span className="research-open">Acceso abierto</span>}</div><h3 className="mt-1 font-display text-base font-bold leading-6 text-white">{result.title}</h3><p className="mt-1 text-xs leading-5 text-blue-100">{result.authors}</p>{result.abstract && <p className="mt-3 text-sm leading-6 text-blue-100">{result.abstract}{result.abstract.length >= 700 ? "…" : ""}</p>}{result.doi && <p className="mt-2 break-all font-mono text-[11px] text-blue-200">DOI: {result.doi}</p>}{result.url && <a href={result.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-white">Abrir fuente <ExternalLink className="h-3.5 w-3.5" /></a>}</div></div></article>)}</div>
    <p className="mt-4 text-xs leading-5 text-blue-200">DataM muestra registros bibliográficos de bases académicas. Verifica autoría, fecha, metodología y pertinencia antes de citar. Algunos textos pueden requerir acceso institucional.</p>
  </section>;
}
