"use client";

import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock3, ExternalLink, FileText, GitBranch, Loader2, Plus, Search, Sparkles, Tag, Trash2, Upload, X } from "lucide-react";
import { buildConceptMap, extractDocumentText, type ConceptMap } from "@/lib/documentAnalysis";
import { deleteLibraryFile, listLibraryFiles, saveLibraryFile, type StoredLibraryFile } from "@/lib/libraryStorage";
import type { ScientificRecord } from "@/lib/scientificSearch";
import { ConceptMapPanel, STATE_KEY, readState, type DetectiveState } from "@/components/DetectiveWorkspace";

const RECENT_KEY = "datam-library-recent-v1";
const TOPICS = ["Educación y tecnología", "Inteligencia artificial", "Metodología de investigación", "Ciencia de datos", "Salud pública"];

type SearchResponse = { results?: ScientificRecord[]; error?: string; warning?: string };
function recentIds() { try { const value = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]"); return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; } catch { return []; } }
function words(text: string) { return text.match(/[\p{L}\p{N}_-]+/gu) ?? []; }

export default function LibraryWorkspace() {
  const [files, setFiles] = useState<StoredLibraryFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [results, setResults] = useState<ScientificRecord[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<DetectiveState>(readState);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = files.find((file) => file.id === selectedId) ?? null;
  const selectedMap = useMemo<ConceptMap | null>(() => selected ? buildConceptMap(selected.name, selected.text) : null, [selected]);
  const recent = recentIds().map((id) => files.find((file) => file.id === id)).filter((file): file is StoredLibraryFile => Boolean(file));
  const tags = useMemo(() => Array.from(new Set(files.flatMap((file) => file.concepts))).slice(0, 12), [files]);

  useEffect(() => { void listLibraryFiles().then(setFiles); }, []);
  useEffect(() => { window.localStorage.setItem(STATE_KEY, JSON.stringify(state)); }, [state]);

  function openFile(file: StoredLibraryFile) {
    setSelectedId(file.id);
    try { window.localStorage.setItem(RECENT_KEY, JSON.stringify([file.id, ...recentIds().filter((id) => id !== file.id)].slice(0, 8))); } catch {}
  }

  async function processFiles(input: FileList | File[]) {
    setMessage("");
    const created: StoredLibraryFile[] = [];
    for (const file of Array.from(input)) {
      if (file.size > 50 * 1024 * 1024) { setMessage(`${file.name}: supera 50 MB.`); continue; }
      try {
        const extracted = await extractDocumentText(file);
        const text = extracted.text;
        const map = buildConceptMap(file.name, text);
        const concepts = map.concepts.flatMap((section) => section.children).slice(0, 16);
        const item: StoredLibraryFile = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: file.name, type: file.name.split(".").pop()?.toLowerCase() ?? "archivo", mimeType: file.type || "application/octet-stream", size: file.size, text, summary: text ? `${map.wordCount.toLocaleString("es-PE")} palabras · ${concepts.length} conceptos detectados.` : "Archivo guardado sin texto extraíble.", concepts: concepts.map((concept) => concept.label), missions: [], flashcards: concepts.slice(0, 8).map((concept) => ({ term: concept.label, definition: concept.evidence[0] ?? "Revisa la evidencia del mapa conceptual." })), analysisWarnings: [...extracted.warnings, ...map.warnings], createdAt: new Date().toISOString(), blob: file };
        await saveLibraryFile(item); created.push(item);
      } catch (processingError) { setMessage(processingError instanceof Error ? processingError.message : "No se pudo procesar el archivo."); }
    }
    if (created.length) { setFiles((current) => [...created, ...current]); openFile(created[0]); setMessage(`${created.length} material${created.length === 1 ? "" : "es"} agregado${created.length === 1 ? "" : "s"}.`); }
  }
  function handleInput(event: ChangeEvent<HTMLInputElement>) { if (event.target.files) void processFiles(event.target.files); event.target.value = ""; }
  function handleDrop(event: DragEvent<HTMLLabelElement>) { event.preventDefault(); setDragging(false); void processFiles(event.dataTransfer.files); }
  async function removeFile(id: string) { await deleteLibraryFile(id); setFiles((current) => current.filter((file) => file.id !== id)); if (selectedId === id) setSelectedId(null); }

  async function search(event?: FormEvent, topic?: string) {
    event?.preventDefault();
    const term = (topic ?? query).trim();
    if (term.length < 2) { setError("Escribe al menos dos caracteres para buscar."); return; }
    setLoading(true); setError(""); setWarning(""); setSearched(true); setActiveQuery(term); setResults([]); setSelectedId(null);
    try {
      const response = await fetch(`/api/research/search?q=${encodeURIComponent(term)}&page=1`, { headers: { Accept: "application/json" } });
      const data = await response.json() as SearchResponse;
      if (!response.ok) throw new Error(data.error ?? "Falló la búsqueda científica.");
      setResults(data.results ?? []); setWarning(data.warning ?? "");
    } catch (searchError) { setError(searchError instanceof Error ? searchError.message : "No se pudo conectar con las bases académicas."); }
    finally { setLoading(false); }
  }

  return <div className={`library-shell ${results.length ? "has-results" : ""}`}>
    <input ref={inputRef} type="file" multiple className="sr-only" onChange={handleInput} />
    <aside className="library-sidebar">
      <div className="library-brand"><span className="library-brand-mark">D</span><span>DataM <b>Biblioteca</b></span></div>
      <button type="button" className="library-new-button" onClick={() => { setSearched(false); setResults([]); setQuery(""); }}><Plus className="h-4 w-4" /> Nueva investigación</button>
      <button type="button" className="library-upload-button" onClick={() => inputRef.current?.click()}><Upload className="h-4 w-4" /> Subir documento</button>
      <p className="library-nav-heading">Biblioteca</p>
      <button type="button" className={`library-nav-item ${!selected && !searched ? "active" : ""}`} onClick={() => { setSelectedId(null); setSearched(false); }}><Search className="h-4 w-4" /> Buscar Ciencia</button>
      {recent.length > 0 && <div className="library-recent-list">{recent.map((file) => <button key={file.id} type="button" className="library-recent-item" onClick={() => openFile(file)}><Clock3 className="h-3.5 w-3.5" /><span className="truncate">{file.name}</span></button>)}</div>}
      <p className="library-nav-heading">Mis documentos</p>
      {files.length === 0 ? <p className="library-empty-hint">Aún no hay materiales.</p> : <div className="library-doc-list">{files.map((file) => <button key={file.id} type="button" className={`library-doc-item ${selectedId === file.id ? "active" : ""}`} onClick={() => openFile(file)}><FileText className="h-4 w-4" /><span className="truncate">{file.name}</span><Trash2 className="ml-auto h-3.5 w-3.5" onClick={(event) => { event.stopPropagation(); void removeFile(file.id); }} /></button>)}</div>}
      {tags.length > 0 && <><p className="library-nav-heading">Etiquetas</p><div className="library-tag-list">{tags.map((tag) => <span key={tag} className="library-tag"><Tag className="h-3 w-3" />{tag}</span>)}</div></>}
      <div className="library-profile-footer"><span className="library-profile-avatar">D</span><div><p>Biblioteca personal</p><Link href="/dashboard">Ver perfil</Link></div></div>
    </aside>
    <main className="library-main">
      {message && <p className="library-message">{message}</p>}
      {selected ? <section className="library-document-panel"><div className="library-document-head"><div><p className="data-cell-header">Material seleccionado</p><h2>{selected.name}</h2><p>{words(selected.text).length.toLocaleString("es-PE")} palabras · {selected.concepts.length} conceptos</p></div><span className="library-active-tag">Investigación activa</span></div><div className="library-doc-tabs"><span className="active"><GitBranch className="h-4 w-4" /> Mapa conceptual</span></div><ConceptMapPanel conceptMap={selectedMap} selectedConcept={null} mapView="tree" onMapView={() => undefined} onSelectConcept={() => undefined} selectedFile={selected} /></section> : <section className="library-research-area"><section className="library-home"><p className="library-home-eyebrow">Investigación académica</p><h1>{searched ? activeQuery : "¿Qué quieres saber?"}</h1><form className="library-home-search" onSubmit={(event) => void search(event)}><Search className="h-5 w-5" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca educación, salud, IA, física..." /><button type="submit" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}</button></form><div className="library-suggestions">{TOPICS.map((topic) => <button key={topic} type="button" onClick={() => { setQuery(topic); void search(undefined, topic); }}>{topic}</button>)}</div>{error && <p className="library-search-error">{error}</p>}{warning && <p className="library-search-warning">{warning}</p>}{searched && !loading && <p className="library-home-footnote">{results.length} fuentes encontradas desde Crossref y OpenAlex.</p>}</section>{searched && <div className="library-consensus-card"><p className="library-consensus-label"><Sparkles className="h-4 w-4" /> Resultados académicos</p><div className="library-source-list">{results.map((result, index) => <article key={result.id} className="library-source-card"><span className="library-source-number">{index + 1}</span><h3>{result.title}</h3><p>{result.authors} · {result.year ?? "Año no disponible"} · {result.journal}</p><a href={result.url} target="_blank" rel="noreferrer">Ver fuente <ExternalLink className="inline h-3.5 w-3.5" /></a></article>)}</div></div>}</section>}
    </main>
  </div>;
}
