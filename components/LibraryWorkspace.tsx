"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import { BookOpen, FileArchive, FileCode2, FileImage, FileText, Lightbulb, Search, Trash2, Upload } from "lucide-react";
import { deleteLibraryFile, listLibraryFiles, saveLibraryFile, type StoredLibraryFile } from "@/lib/libraryStorage";

type LibraryFilter = "todos" | "lectura" | "datos" | "codigo" | "multimedia" | "otros";
type PdfJsApi = { GlobalWorkerOptions: { workerSrc: string }; getDocument: (options: { data: ArrayBuffer; disableWorker: boolean }) => { promise: Promise<{ numPages: number; getPage: (page: number) => Promise<{ getTextContent: () => Promise<{ items: Array<{ str?: string }> }> }> }> } };

function extension(name: string) { return name.split(".").pop()?.toLowerCase() ?? ""; }
function words(text: string) { return text.replace(/[^\p{L}\p{N}_-]+/gu, " ").trim().split(/\s+/).filter(Boolean); }
function category(type: string): LibraryFilter { if (["txt", "md", "pdf", "doc", "docx", "epub"].includes(type)) return "lectura"; if (["csv", "xls", "xlsx", "json"].includes(type)) return "datos"; if (["sql", "py", "js", "ts", "tsx", "jsx", "ipynb", "html", "css"].includes(type)) return "codigo"; if (["png", "jpg", "jpeg", "gif", "webp", "mp3", "wav", "mp4", "webm"].includes(type)) return "multimedia"; return "otros"; }
function icon(type: string) { if (["sql", "py", "js", "ts", "tsx", "jsx", "ipynb", "html", "css"].includes(type)) return FileCode2; if (["png", "jpg", "jpeg", "gif", "webp"].includes(type)) return FileImage; if (["mp3", "wav", "mp4", "webm"].includes(type)) return FileArchive; return FileText; }
function categoryLabel(type: string) { const labels: Record<string, string> = { txt: "Lectura", md: "Lectura", pdf: "Lectura", doc: "Lectura", docx: "Lectura", epub: "Lectura", csv: "Datos", xls: "Datos", xlsx: "Datos", json: "Datos", sql: "Código", py: "Código", js: "Código", ts: "Código", tsx: "Código", jsx: "Código", ipynb: "Código", html: "Código", css: "Código", png: "Imagen", jpg: "Imagen", jpeg: "Imagen", gif: "Imagen", webp: "Imagen", mp3: "Audio", wav: "Audio", mp4: "Video", webm: "Video" }; return labels[type] ?? "Archivo"; }
async function extractPdfText(file: File): Promise<string> {
  const globalWindow = window as unknown as { pdfjsLib?: PdfJsApi };
  if (!globalWindow.pdfjsLib) {
    await new Promise<void>((resolve, reject) => { const script = document.createElement("script"); script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"; script.onload = () => resolve(); script.onerror = () => reject(new Error("No se pudo cargar el analizador PDF.")); document.head.appendChild(script); });
  }
  const pdfjs = (window as unknown as { pdfjsLib: PdfJsApi }).pdfjsLib;
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const documentPdf = await pdfjs.getDocument({ data: await file.arrayBuffer(), disableWorker: true }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= documentPdf.numPages; pageNumber += 1) { const page = await documentPdf.getPage(pageNumber); const content = await page.getTextContent(); pages.push(content.items.map((item) => item.str ?? "").join(" ")); }
  return pages.join("\n\n");
}
function createItem(file: File, text: string): StoredLibraryFile {
  const paragraphs = text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 20);
  const candidates = Array.from(new Set(lines.concat(paragraphs).flatMap((line) => line.match(/\b[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑ0-9_-]{4,}\b/g) ?? []))).slice(0, 8);
  const concepts = candidates.length ? candidates : paragraphs.slice(0, 8).map((part) => part.split(/[.!?]/)[0]).filter(Boolean);
  const excerpt = (paragraphs[0] ?? text).slice(0, 260);
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: file.name, type: extension(file.name), mimeType: file.type || "application/octet-stream", size: file.size, text, summary: text ? `Material de ${words(text).length.toLocaleString("es-PE")} palabras. Idea inicial: ${excerpt}${excerpt.length === 260 ? "..." : ""}` : "Archivo guardado. Este formato necesita un visor específico para generar análisis.", concepts, missions: ["Explica con tus propias palabras la idea principal del material.", "Elige dos conceptos técnicos y relaciónalos con una tarea real.", "Escribe una aplicación concreta para tu estudio o trabajo."], flashcards: concepts.slice(0, 8).map((term) => ({ term, definition: `Define ${term} usando un ejemplo del material y una situación laboral.` })), createdAt: new Date().toISOString(), blob: file };
}

export default function LibraryWorkspace() {
  const [items, setItems] = useState<StoredLibraryFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<LibraryFilter>("todos");
  const [query, setQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { void listLibraryFiles().then(setItems).catch(() => setMessage("No se pudo abrir la biblioteca local.")); }, []);
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const visibleItems = items.filter((item) => (filter === "todos" || category(item.type) === filter) && item.name.toLowerCase().includes(query.toLowerCase()));
  const totalWords = useMemo(() => items.reduce((total, item) => total + words(item.text).length, 0), [items]);

  async function processFiles(files: FileList | File[]) {
    setMessage(""); const next: StoredLibraryFile[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 50 * 1024 * 1024) { setMessage(`${file.name}: supera el límite de 50 MB.`); continue; }
      let text = "";
      const readable = file.type.startsWith("text/") || ["txt", "md", "csv", "json", "sql", "py", "js", "ts", "tsx", "jsx", "html", "css", "ipynb"].includes(extension(file.name));
      if (readable) text = await file.text();
      if (extension(file.name) === "pdf") text = await extractPdfText(file);
      const item = createItem(file, text); await saveLibraryFile(item); next.push(item);
    }
    if (next.length) { setItems((current) => [...next, ...current]); setSelectedId(next[0].id); setMessage(`${next.length} material${next.length === 1 ? "" : "es"} guardado${next.length === 1 ? "" : "s"} de forma local.`); }
  }
  function handleInput(event: ChangeEvent<HTMLInputElement>) { if (event.target.files) void processFiles(event.target.files); event.target.value = ""; }
  function handleDrop(event: DragEvent<HTMLLabelElement>) { event.preventDefault(); setIsDragging(false); void processFiles(event.dataTransfer.files); }
  async function removeItem(id: string) { await deleteLibraryFile(id); setItems((current) => current.filter((item) => item.id !== id)); if (selectedId === id) setSelectedId(null); }
  const SelectedIcon = selected ? icon(selected.type) : BookOpen;
  const previewUrl = selected && !selected.text ? URL.createObjectURL(selected.blob) : "";

  return <div className="library-space">
    <section className="library-hero"><p className="data-cell-header library-kicker">Tu biblioteca personal</p><h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Ordena todo tu aprendizaje en un solo lugar.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">Guarda lecturas, datos, código, imágenes, audio y video. DataM los clasifica y convierte los formatos legibles en conceptos, flashcards y misiones.</p><div className="mt-5 flex flex-wrap gap-5 text-sm text-blue-100"><span><b className="text-white">{items.length}</b> materiales</span><span><b className="text-white">{totalWords.toLocaleString("es-PE")}</b> palabras analizadas</span><span><b className="text-white">{items.filter((item) => item.text).length}</b> con análisis didáctico</span></div></section>
    <label htmlFor="library-file-input" onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`library-dropzone ${isDragging ? "is-dragging" : ""}`}><Upload className="mx-auto h-9 w-9 text-accent2" /><span className="mt-3 block font-display text-lg font-bold text-white">Arrastra cualquier archivo o selecciónalo</span><span className="mx-auto mt-2 block max-w-lg text-sm leading-6 text-blue-100">Hasta 50 MB por archivo. El archivo se guarda en tu navegador; los materiales de texto también se analizan localmente.</span><span className="mt-4 inline-flex rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white">Seleccionar archivos</span><input id="library-file-input" type="file" multiple onChange={handleInput} className="sr-only" /></label>
    {message && <p role="status" className="mt-3 text-sm text-blue-800">{message}</p>}
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar materiales..." className="w-full rounded-cell border border-line bg-white py-2 pl-9 pr-3 text-sm" /></label><select value={filter} onChange={(event) => setFilter(event.target.value as LibraryFilter)} className="rounded-cell border border-line bg-white px-3 py-2 text-sm"><option value="todos">Todos los formatos</option><option value="lectura">Lecturas</option><option value="datos">Datos</option><option value="codigo">Código</option><option value="multimedia">Multimedia</option><option value="otros">Otros</option></select></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.25fr)]"><section className="library-list" aria-label="Materiales guardados"><div className="flex items-center justify-between gap-3"><p className="data-cell-header">Materiales organizados</p><span className="text-xs text-muted">{visibleItems.length}/{items.length}</span></div>{visibleItems.length === 0 ? <div className="library-empty"><FileText className="mx-auto h-8 w-8 text-muted" /><p className="mt-2 text-sm text-muted">No hay materiales con ese filtro.</p></div> : <div className="mt-3 space-y-2">{visibleItems.map((item) => { const ItemIcon = icon(item.type); return <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`library-item ${selected?.id === item.id ? "selected" : ""}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-cell bg-blue-100 text-blue-700"><ItemIcon className="h-4 w-4" /></span><span className="min-w-0 flex-1 text-left"><b className="block truncate text-sm text-ink">{item.name}</b><small className="text-xs uppercase text-muted">{categoryLabel(item.type)} · {(item.size / 1024).toFixed(1)} KB</small></span><Trash2 onClick={(event) => { event.stopPropagation(); void removeItem(item.id); }} className="h-4 w-4 shrink-0 text-muted hover:text-red-600" /></button>; })}</div>}</section>
      {selected ? <section className="library-detail" aria-live="polite"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-cell bg-blue-100 text-blue-700"><SelectedIcon className="h-5 w-5" /></span><div><p className="data-cell-header">Material seleccionado</p><h2 className="mt-1 break-all font-display text-xl font-bold text-white">{selected.name}</h2></div></div><span className="rounded-cell bg-green-100 px-2 py-1 text-xs font-bold text-green-800">{selected.text ? "Listo para estudiar" : "Guardado"}</span></div><p className="mt-4 text-sm leading-6 text-blue-100">{selected.summary}</p>{selected.text ? <><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="library-panel"><h3><Lightbulb className="h-4 w-4 text-accent2" /> Conceptos detectados</h3><ul className="mt-3 space-y-2">{selected.concepts.map((concept) => <li key={concept} className="border-l-2 border-accent pl-3 text-sm text-blue-100">{concept}</li>)}</ul></div><div className="library-panel"><h3><BookOpen className="h-4 w-4 text-accent2" /> Misiones de aprendizaje</h3><ol className="mt-3 space-y-2">{selected.missions.map((mission, index) => <li key={mission} className="flex gap-2 text-sm text-blue-100"><span className="font-mono text-accent2">0{index + 1}</span>{mission}</li>)}</ol></div></div><div className="mt-4 library-panel"><h3>Flashcards técnicas</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{selected.flashcards.map((card) => <details key={card.term} className="rounded-cell border border-line-2 bg-bg2 p-3"><summary className="cursor-pointer text-sm font-bold text-white">{card.term}</summary><p className="mt-2 text-sm text-blue-100">{card.definition}</p></details>)}</div></div></> : <div className="library-panel mt-5"><h3>Vista previa del archivo</h3>{selected.mimeType.startsWith("image/") && previewUrl && <img src={previewUrl} alt={selected.name} className="mt-3 max-h-80 max-w-full object-contain" />}{selected.mimeType.startsWith("audio/") && previewUrl && <audio controls src={previewUrl} className="mt-4 w-full" />}{selected.mimeType.startsWith("video/") && previewUrl && <video controls src={previewUrl} className="mt-4 max-h-80 w-full" />}{selected.mimeType === "application/pdf" && previewUrl && <iframe title={`Vista previa de ${selected.name}`} src={previewUrl} className="mt-4 h-96 w-full" />}{!["image/", "audio/", "video/"].some((prefix) => selected.mimeType.startsWith(prefix)) && selected.mimeType !== "application/pdf" && <p className="mt-3 text-sm text-blue-100">El archivo está guardado correctamente. Para generar contenido didáctico de este formato se requiere un extractor específico.</p>}</div>}<details className="mt-4 library-source"><summary className="cursor-pointer text-sm font-bold text-blue-200">Ver extracto original</summary>{selected.text ? <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-blue-100">{selected.text.slice(0, 8000)}</pre> : <p className="mt-3 text-sm text-blue-100">No hay texto extraído para este formato.</p>}</details></section> : <section className="library-detail library-empty-detail"><BookOpen className="mx-auto h-10 w-10 text-blue-300" /><h2 className="mt-3 font-display text-xl font-bold text-white">Tu espacio de estudio</h2><p className="mt-2 text-sm text-blue-100">Selecciona un material para verlo y estudiarlo.</p></section>}</div>
  </div>;
}
