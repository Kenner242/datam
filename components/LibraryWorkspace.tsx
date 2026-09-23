"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import { BookOpen, Check, FileText, Lightbulb, Trash2, Upload } from "lucide-react";

type LibraryItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  text: string;
  summary: string;
  concepts: string[];
  missions: string[];
  flashcards: { term: string; definition: string }[];
  createdAt: string;
};

const STORAGE_KEY = "datam-library-v1";
const SUPPORTED = ["txt", "md", "csv", "json", "sql", "py", "ipynb"];

function extension(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function words(text: string) {
  return text.replace(/[^\p{L}\p{N}_-]+/gu, " ").trim().split(/\s+/).filter(Boolean);
}

function createItem(file: File, text: string): LibraryItem {
  const paragraphs = text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 20);
  const candidates = Array.from(new Set(lines.concat(paragraphs).flatMap((line) => line.match(/\b[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑ0-9_-]{4,}\b/g) ?? []))).slice(0, 8);
  const concepts = candidates.length ? candidates : paragraphs.slice(0, 8).map((part) => part.split(/[.!?]/)[0]).filter(Boolean);
  const excerpt = (paragraphs[0] ?? text).slice(0, 260);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    type: extension(file.name),
    size: file.size,
    text,
    summary: `Material de ${words(text).length.toLocaleString("es-PE")} palabras. Idea inicial: ${excerpt}${excerpt.length === 260 ? "..." : ""}`,
    concepts,
    missions: [
      "Explica con tus propias palabras la idea principal del material.",
      "Elige dos conceptos técnicos y relaciónalos con una tarea real.",
      "Escribe una aplicación concreta para tu estudio o trabajo.",
    ],
    flashcards: concepts.slice(0, 8).map((term) => ({ term, definition: `Define ${term} usando un ejemplo del material y una situación laboral.` })),
    createdAt: new Date().toISOString(),
  };
}

export default function LibraryWorkspace() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try { setItems(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as LibraryItem[]); } catch { window.localStorage.removeItem(STORAGE_KEY); }
  }, []);

  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const totalWords = useMemo(() => items.reduce((total, item) => total + words(item.text).length, 0), [items]);

  async function processFiles(files: FileList | File[]) {
    setMessage("");
    const next: LibraryItem[] = [];
    for (const file of Array.from(files)) {
      const type = extension(file.name);
      if (!SUPPORTED.includes(type)) {
        setMessage(`${file.name}: formato no compatible todavía. Usa TXT, MD, CSV, JSON, SQL, PY o IPYNB.`);
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        setMessage(`${file.name}: supera el límite de 15 MB.`);
        continue;
      }
      const text = await file.text();
      next.push(createItem(file, text));
    }
    if (next.length) {
      setItems((current) => [...next, ...current]);
      setSelectedId(next[0].id);
      setMessage(`${next.length} material${next.length === 1 ? "" : "es"} procesado${next.length === 1 ? "" : "s"} localmente.`);
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) { if (event.target.files) void processFiles(event.target.files); event.target.value = ""; }
  function handleDrop(event: DragEvent<HTMLLabelElement>) { event.preventDefault(); setIsDragging(false); void processFiles(event.dataTransfer.files); }
  function removeItem(id: string) { setItems((current) => current.filter((item) => item.id !== id)); if (selectedId === id) setSelectedId(null); }

  return <div className="library-space">
    <section className="library-hero">
      <p className="data-cell-header library-kicker">Tu biblioteca personal</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Aprende con tus propios materiales.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">Sube apuntes y archivos de texto. DataM los organiza en conceptos, flashcards y misiones breves para estudiar con propósito.</p>
      <div className="mt-5 flex flex-wrap gap-5 text-sm text-blue-100"><span><b className="text-white">{items.length}</b> materiales</span><span><b className="text-white">{totalWords.toLocaleString("es-PE")}</b> palabras analizadas</span><span><b className="text-white">100%</b> procesamiento local</span></div>
    </section>

    <label htmlFor="library-file-input" onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`library-dropzone ${isDragging ? "is-dragging" : ""}`}>
      <Upload className="mx-auto h-9 w-9 text-accent2" />
      <span className="mt-3 block font-display text-lg font-bold text-white">Arrastra tus materiales o selecciónalos</span>
      <span className="mx-auto mt-2 block max-w-lg text-sm leading-6 text-blue-100">Procesamiento local para mantener tus archivos en tu dispositivo. Formatos: TXT, MD, CSV, JSON, SQL, PY e IPYNB.</span>
      <span className="mt-4 inline-flex rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white">Seleccionar archivos</span>
      <input id="library-file-input" type="file" multiple accept=".txt,.md,.csv,.json,.sql,.py,.ipynb" onChange={handleInput} className="sr-only" />
    </label>
    {message && <p role="status" className="mt-3 text-sm text-blue-800">{message}</p>}

    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.25fr)]">
      <section className="library-list" aria-label="Materiales guardados">
        <div className="flex items-center justify-between gap-3"><p className="data-cell-header">Materiales guardados</p><span className="text-xs text-muted">{items.length}</span></div>
        {items.length === 0 ? <div className="library-empty"><FileText className="mx-auto h-8 w-8 text-muted" /><p className="mt-2 text-sm text-muted">Tu biblioteca está vacía.</p></div> : <div className="mt-3 space-y-2">{items.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`library-item ${selected?.id === item.id ? "selected" : ""}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-cell bg-blue-100 text-blue-700"><FileText className="h-4 w-4" /></span><span className="min-w-0 flex-1 text-left"><b className="block truncate text-sm text-ink">{item.name}</b><small className="text-xs uppercase text-muted">{item.type} · {(item.size / 1024).toFixed(1)} KB</small></span><Trash2 onClick={(event) => { event.stopPropagation(); removeItem(item.id); }} className="h-4 w-4 shrink-0 text-muted hover:text-red-600" /></button>)}</div>}
      </section>

      {selected ? <section className="library-detail" aria-live="polite"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="data-cell-header">Material seleccionado</p><h2 className="mt-1 font-display text-xl font-bold text-white">{selected.name}</h2></div><span className="rounded-cell bg-green-100 px-2 py-1 text-xs font-bold text-green-800">Listo para estudiar</span></div><p className="mt-4 text-sm leading-6 text-blue-100">{selected.summary}</p><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="library-panel"><h3><Lightbulb className="h-4 w-4 text-accent2" /> Conceptos detectados</h3><ul className="mt-3 space-y-2">{selected.concepts.map((concept) => <li key={concept} className="border-l-2 border-accent pl-3 text-sm text-blue-100">{concept}</li>)}</ul></div><div className="library-panel"><h3><BookOpen className="h-4 w-4 text-accent2" /> Misiones de aprendizaje</h3><ol className="mt-3 space-y-2">{selected.missions.map((mission, index) => <li key={mission} className="flex gap-2 text-sm text-blue-100"><span className="font-mono text-accent2">0{index + 1}</span>{mission}</li>)}</ol></div></div><div className="mt-4 library-panel"><h3>Flashcards técnicas</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{selected.flashcards.map((card) => <details key={card.term} className="rounded-cell border border-line-2 bg-bg2 p-3"><summary className="cursor-pointer text-sm font-bold text-white">{card.term}</summary><p className="mt-2 text-sm text-blue-100">{card.definition}</p></details>)}</div></div><details className="mt-4 library-source"><summary className="cursor-pointer text-sm font-bold text-blue-200">Ver extracto original</summary><pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-blue-100">{selected.text.slice(0, 8000)}</pre></details></section> : <section className="library-detail library-empty-detail"><BookOpen className="mx-auto h-10 w-10 text-blue-300" /><h2 className="mt-3 font-display text-xl font-bold text-white">Tu espacio de estudio</h2><p className="mt-2 text-sm text-blue-100">Selecciona un material para ver su ruta de aprendizaje.</p></section>}
    </div>
  </div>;
}
