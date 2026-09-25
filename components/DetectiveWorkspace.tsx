"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import { BookOpen, Brain, Check, FileText, GitBranch, Lightbulb, Search, Target, Trash2, Upload } from "lucide-react";
import { deleteLibraryFile, listLibraryFiles, saveLibraryFile, type StoredLibraryFile } from "@/lib/libraryStorage";
import ScientificSearch from "./ScientificSearch";
import { buildConceptMap, extractDocumentText, type ConceptMap, type ConceptNode } from "@/lib/documentAnalysis";

type Mode = "inicio" | "mapa" | "feynman" | "cazador" | "caso" | "perfil" | "ciencia";
type Concept = { term: string; frequency: number; context: string };

type DetectiveState = { xp: number; feynman: number; hunter: number; case: number; foundErrors: number };
const STATE_KEY = "datam-detective-v1";
const STOPWORDS = new Set("de la el en y a los las un una que por con para es del se al como su sus más pero o este esta entre sin sobre también hasta desde nos les ni lo le ya muy todo todos toda ser son fue fueron está están hay había eran sea sido tiene tienen hacer hace puede pueden debe deben solo según tras durante mediante así donde cuando porque aunque cual cuales quien quienes esto aquello algo alguien nadie nada siempre nunca tampoco además entonces luego después antes mientras".split(" "));

function words(text: string) { return text.toLowerCase().match(/[a-záéíóúñü]{4,}/g) ?? []; }
function conceptsFrom(text: string): Concept[] { const frequency: Record<string, number> = {}; words(text).forEach((word) => { if (!STOPWORDS.has(word)) frequency[word] = (frequency[word] ?? 0) + 1; }); return Object.entries(frequency).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([term, frequency]) => ({ term, frequency, context: text.split(/(?<=[.!?])\s+/).find((sentence) => sentence.toLowerCase().includes(term))?.slice(0, 220) ?? "Concepto detectado en el material." })); }
function tutorReplySections(reply: string) {
  const lines = reply.split(/\n+/).map((line) => line.replace(/^\s*(?:[-*#]+\s*)?/, "").trim()).filter(Boolean);
  const labels = [/^(?:acierto|lo que hiciste bien)\s*:?\s*/i, /^(?:para mejorar|siguiente paso)\s*:?\s*/i, /^(?:pregunta para ti|pregunta para profundizar)\s*:?\s*/i];
  const sections: Array<{ title: string; text: string }> = [];
  for (const line of lines) {
    const labelIndex = labels.findIndex((pattern) => pattern.test(line));
    if (labelIndex >= 0) {
      const title = ["Acierto", "Para mejorar", "Pregunta para ti"][labelIndex];
      const text = line.replace(labels[labelIndex], "").trim();
      sections.push({ title, text });
    } else if (sections.length) sections[sections.length - 1].text += ` ${line}`;
    else sections.push({ title: "Comentario de Dax", text: line });
  }
  return sections;
}
function readState(): DetectiveState { try { const saved = JSON.parse(window.localStorage.getItem(STATE_KEY) ?? "{}"); return { xp: 0, feynman: 0, hunter: 0, case: 0, foundErrors: 0, ...saved }; } catch { return { xp: 0, feynman: 0, hunter: 0, case: 0, foundErrors: 0 }; } }

export default function DetectiveWorkspace() {
  const [files, setFiles] = useState<StoredLibraryFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("inicio");
  const [state, setState] = useState<DetectiveState>(readState);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [mapView, setMapView] = useState<"tree" | "outline">("tree");
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState(false);
  const [feynmanText, setFeynmanText] = useState("");
  const [daxFeedback, setDaxFeedback] = useState("");
  const [daxLoading, setDaxLoading] = useState(false);
  const [feynmanRubric, setFeynmanRubric] = useState<string[]>([]);
  const [hunterIndex, setHunterIndex] = useState(0);
  const [hunterDone, setHunterDone] = useState(false);
  const [caseAnswers, setCaseAnswers] = useState<string[]>(["", "", ""]);

  useEffect(() => { void listLibraryFiles().then(setFiles); }, []);
  useEffect(() => { window.localStorage.setItem(STATE_KEY, JSON.stringify(state)); }, [state]);

  const selected = files.find((file) => file.id === selectedId) ?? files[0];
  const concepts = useMemo(() => selected ? conceptsFrom(selected.text) : [], [selected]);
  const conceptMap = useMemo(() => selected ? buildConceptMap(selected.name, selected.text) : null, [selected]);
  const conceptNodes = conceptMap?.concepts.flatMap((section) => section.children) ?? [];
  const selectedConcept = conceptNodes.find((node) => node.id === selectedConceptId) ?? conceptNodes[0] ?? null;
  const sentences = useMemo(() => selected?.text.split(/(?<=[.!?])\s+/).map((line) => line.trim()).filter((line) => line.length > 45).slice(0, 30) ?? [], [selected]);
  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()));
  const hunterSentence = sentences[hunterIndex % Math.max(1, sentences.length)] ?? "Sube un material con texto para iniciar la investigación.";

  function award(amount: number, key: keyof Pick<DetectiveState, "feynman" | "hunter" | "case">) { setState((current) => ({ ...current, xp: current.xp + amount, [key]: current[key] + amount })); }
  async function processFiles(input: FileList | File[]) {
    const next: StoredLibraryFile[] = [];
    setProcessing(true); setMessage("");
    for (const file of Array.from(input)) {
      if (file.size > 50 * 1024 * 1024) { setMessage(`${file.name}: supera 50 MB.`); continue; }
      try {
        const type = file.name.split(".").pop()?.toLowerCase() ?? "archivo";
        const extracted = await extractDocumentText(file);
        const text = extracted.text;
        const conceptMap = buildConceptMap(file.name, text);
        const extractedConcepts = conceptMap.concepts.flatMap((section) => section.children).slice(0, 16);
        const item: StoredLibraryFile = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: file.name, type, mimeType: file.type || "application/octet-stream", size: file.size, text, summary: text ? `${conceptMap.wordCount.toLocaleString("es-PE")} palabras · ${conceptMap.sections.length} secciones identificadas · ${extractedConcepts.length} conceptos con citas.` : "Archivo guardado sin texto extraíble.", concepts: extractedConcepts.map((concept) => concept.label), missions: [], flashcards: extractedConcepts.slice(0, 8).map((concept) => ({ term: concept.label, definition: concept.evidence[0] || "Revisa la evidencia citada en el mapa conceptual." })), analysisWarnings: [...extracted.warnings, ...conceptMap.warnings], createdAt: new Date().toISOString(), blob: file };
        await saveLibraryFile(item); next.push(item);
      } catch (error) { setMessage(error instanceof Error ? `${file.name}: ${error.message}` : `No se pudo extraer el texto de ${file.name}.`); }
    }
    if (next.length) { setFiles((current) => [...next, ...current]); setSelectedId(next[0].id); setMode("mapa"); const warning = next[0].analysisWarnings?.[0]; setMessage(`${next.length} material${next.length === 1 ? "" : "es"} procesado${next.length === 1 ? "" : "s"}. Revisa el mapa conceptual y sus citas.${warning ? ` Aviso: ${warning}` : ""}`); }
    setProcessing(false);
  }
  function handleInput(event: ChangeEvent<HTMLInputElement>) { if (event.target.files) void processFiles(event.target.files); event.target.value = ""; }
  function handleDrop(event: DragEvent<HTMLLabelElement>) { event.preventDefault(); setDragging(false); void processFiles(event.dataTransfer.files); }
  async function removeFile(id: string) { await deleteLibraryFile(id); setFiles((current) => current.filter((file) => file.id !== id)); if (selectedId === id) setSelectedId(null); }
  async function evaluateFeynman() {
    const explanation = feynmanText.trim();
    const count = explanation.split(/\s+/).filter(Boolean).length;
    if (count < 20 || !selected) return;
    const lower = explanation.toLowerCase();
    const rubric = [
      ["Explicas el concepto central", concepts.some((concept) => lower.includes(concept.term.toLowerCase()))],
      ["Incluyes un ejemplo", /por ejemplo|imagina|como cuando|sup[oó]n/i.test(explanation)],
      ["Explicas por qué importa", /porque|permite|sirve para|ayuda a|importante/i.test(explanation)],
      ["Usas suficiente desarrollo", count >= 50],
    ] as const;
    setFeynmanRubric(rubric.filter(([, passed]) => passed).map(([label]) => label));
    setDaxFeedback("");
    setDaxLoading(true);
    try {
      const response = await fetch("/api/dax", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: `Estoy practicando explicar el concepto ${concepts[0]?.term ?? "del material"} con mis propias palabras. Responde en español usando exactamente tres líneas, cada una con estos encabezados: "Acierto:", "Para mejorar:", "Pregunta para ti:". Escribe una o dos frases concretas por sección. Basa los comentarios en el material y mi explicación. No reescribas mi respuesta, no inventes criterios y no me des una nota/certificación. Mi explicación: ${explanation}` }], generatedContext: selected.text.slice(0, 4000) }) });
      const result = await response.json() as { reply?: string; error?: string };
      setDaxFeedback(result.reply ?? result.error ?? "Dax no devolvió comentarios. Usa la lista de autoevaluación y vuelve a intentarlo.");
    } catch {
      setDaxFeedback("No se pudo conectar con Dax ahora. Revisa los criterios de autoevaluación, mejora tu explicación y vuelve a enviarla.");
    } finally {
      setDaxLoading(false);
      award(Math.min(80, 20 + count), "feynman");
    }
  }
  function answerHunter(isFalse: boolean) { setHunterDone(true); if (isFalse) { award(40, "hunter"); setState((current) => ({ ...current, foundErrors: current.foundErrors + 1 })); } else award(5, "hunter"); }
  function completeCase() { if (caseAnswers.every((answer) => answer.trim().length >= 20)) award(80, "case"); }

  const modes: Array<{ id: Mode; label: string; icon: typeof Search; description: string }> = [{ id: "inicio", label: "Inicio", icon: Search, description: "Material y siguiente investigación" }, { id: "mapa", label: "Mapa conceptual", icon: GitBranch, description: "Ideas principales y evidencia" }, { id: "feynman", label: "Enseña a Dax", icon: Brain, description: "Explica con tus propias palabras" }, { id: "cazador", label: "Cazador de errores", icon: Target, description: "Entrena pensamiento crítico" }, { id: "caso", label: "Caso real", icon: Lightbulb, description: "Transfiere a una situación laboral" }, { id: "ciencia", label: "Buscar Ciencia", icon: BookOpen, description: "Libros y artículos académicos" }, { id: "perfil", label: "Habilidades", icon: Check, description: "Tu dominio cognitivo" }];

  return <div className="detective-space">
    <section className="detective-hero"><p className="data-cell-header detective-kicker">Método Detective Cognitivo</p><h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">No solo leas tu material. <em>Investígalo.</em></h1><p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">Convierte tus materiales en mapas conceptuales con evidencia, explicaciones, detección de errores y casos reales. Cada acción entrena una habilidad profesional.</p><div className="mt-5 flex flex-wrap gap-5 text-sm text-blue-100"><span><b className="text-white">{state.xp}</b> XP</span><span><b className="text-white">{state.feynman}</b> explicación</span><span><b className="text-white">{state.foundErrors}</b> errores detectados</span><span><b className="text-white">{state.case}</b> transferencia</span></div></section>
    <label htmlFor="detective-input" onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} className={`detective-dropzone ${dragging ? "active" : ""}`}><Upload className="mx-auto h-8 w-8 text-accent2" /><b className="mt-3 block text-lg text-white">Sube el material que quieres investigar</b><span className="mt-2 block text-sm text-blue-100">PDF, documentos, datos, código o texto. Los formatos con texto se analizan localmente.</span><span className="mt-4 inline-flex rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white">Seleccionar material</span><input id="detective-input" type="file" onChange={handleInput} className="sr-only" /></label>
    {message && <p role="status" className="mt-3 text-sm text-blue-800">{message}</p>}
    <div className="mt-6 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]"><aside className="detective-nav"><p className="data-cell-header">Investigación</p><div className="mt-3 space-y-1">{modes.map(({ id, label, icon: Icon, description }) => <button key={id} type="button" onClick={() => setMode(id)} className={`detective-nav-item ${mode === id ? "active" : ""}`}><Icon className="h-4 w-4 shrink-0" /><span><b>{label}</b><small>{description}</small></span></button>)}</div><p className="mt-6 data-cell-header">Materiales</p><div className="mt-3 space-y-1">{filteredFiles.length === 0 ? <p className="px-3 text-xs text-muted">Aún no hay materiales.</p> : filteredFiles.map((file) => <button key={file.id} type="button" onClick={() => { setSelectedId(file.id); setMode("inicio"); }} className={`detective-file ${selected?.id === file.id ? "active" : ""}`}><FileText className="h-4 w-4" /><span className="truncate">{file.name}</span><Trash2 onClick={(event) => { event.stopPropagation(); void removeFile(file.id); }} className="ml-auto h-3.5 w-3.5 shrink-0" /></button>)}</div><div className="mt-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar material" className="w-full rounded-cell border border-line bg-white px-3 py-2 text-xs" /></div></aside>
      <main className="detective-panel">
        <div hidden={mode !== "ciencia"}><ScientificSearch /></div>
        <div hidden={mode === "ciencia"}>
          {!selected ? <div className="detective-empty"><BookOpen className="mx-auto h-10 w-10 text-blue-300" /><h2 className="mt-3 font-display text-xl font-bold text-white">Tu caso aún no existe</h2><p className="mt-2 text-sm text-blue-100">Sube un material para iniciar tu investigación cognitiva.</p></div> : <>
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="data-cell-header">Caso activo</p><h2 className="mt-1 break-all font-display text-xl font-bold text-white">{selected.name}</h2><p className="mt-1 text-sm text-blue-100">{selected.text ? `${words(selected.text).length.toLocaleString("es-PE")} palabras · ${concepts.length} conceptos detectados` : "Sin texto extraíble"}</p></div><span className="rounded-cell bg-green-100 px-2 py-1 text-xs font-bold text-green-800">Investigación activa</span></div>
            <DetectiveMode mode={mode} selected={selected} concepts={concepts} conceptMap={conceptMap} selectedConcept={selectedConcept} mapView={mapView} onMapView={setMapView} onSelectConcept={setSelectedConceptId} sentences={sentences} hunterSentence={hunterSentence} hunterDone={hunterDone} feynmanText={feynmanText} setFeynmanText={setFeynmanText} daxFeedback={daxFeedback} daxLoading={daxLoading} feynmanRubric={feynmanRubric} caseAnswers={caseAnswers} setCaseAnswers={setCaseAnswers} onFeynman={evaluateFeynman} onHunter={answerHunter} onNextHunter={() => { setHunterIndex((index) => index + 1); setHunterDone(false); }} onCase={completeCase} state={state} />
          </>}
        </div>
      </main>
    </div>
  </div>;
}

function DetectiveMode({ mode, selected, concepts, conceptMap, selectedConcept, mapView, onMapView, onSelectConcept, sentences, hunterSentence, hunterDone, feynmanText, setFeynmanText, daxFeedback, daxLoading, feynmanRubric, caseAnswers, setCaseAnswers, onFeynman, onHunter, onNextHunter, onCase, state }: { mode: Mode; selected: StoredLibraryFile; concepts: Concept[]; conceptMap: ConceptMap | null; selectedConcept: ConceptNode | null; mapView: "tree" | "outline"; onMapView: (view: "tree" | "outline") => void; onSelectConcept: (id: string) => void; sentences: string[]; hunterSentence: string; hunterDone: boolean; feynmanText: string; setFeynmanText: (value: string) => void; daxFeedback: string; daxLoading: boolean; feynmanRubric: string[]; caseAnswers: string[]; setCaseAnswers: (value: string[]) => void; onFeynman: () => void; onHunter: (isFalse: boolean) => void; onNextHunter: () => void; onCase: () => void; state: DetectiveState }) {
  if (mode === "mapa") return <ConceptMapPanel conceptMap={conceptMap} selectedConcept={selectedConcept} mapView={mapView} onMapView={onMapView} onSelectConcept={onSelectConcept} selectedFile={selected} />;
  if (mode === "feynman") return <section className="detective-content"><p className="data-cell-header">Autoexplicación Feynman · Tutor Dax</p><h3>Enséñale <em>{concepts[0]?.term ?? "el concepto"}</em> a Dax</h3><p>Explícalo como a una persona que empieza: define la idea, da un ejemplo propio y explica para qué sirve en la práctica.</p><div className="feynman-coach"><b>Guía de explicación</b><ol><li>¿Qué es, sin copiar una definición?</li><li>¿Qué ejemplo sencillo lo demuestra?</li><li>¿Por qué importa en este material o en el trabajo?</li></ol></div><textarea value={feynmanText} onChange={(event) => setFeynmanText(event.target.value)} className="detective-textarea" placeholder="Mira Dax, imagina que..." /><div className="mt-2 flex justify-between text-xs text-muted"><span>{feynmanText.trim().split(/\s+/).filter(Boolean).length} palabras</span><span>Mínimo recomendado: 30</span></div><button type="button" disabled={daxLoading || feynmanText.trim().split(/\s+/).filter(Boolean).length < 20} onClick={onFeynman} className="mt-3 rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{daxLoading ? "Dax está revisando..." : "Enviar explicación a Dax"}</button>{feynmanRubric.length > 0 && <div className="feynman-feedback"><b>Autoevaluación formativa</b><ul>{["Explicas el concepto central", "Incluyes un ejemplo", "Explicas por qué importa", "Usas suficiente desarrollo"].map((criterion) => <li key={criterion}>{feynmanRubric.includes(criterion) ? "✓" : "○"} {criterion}</li>)}</ul></div>}{daxFeedback && <div className="dax-feedback"><div className="dax-feedback-avatar">D</div><div className="min-w-0 flex-1"><b>Retroalimentación formativa de Dax</b><div className="mt-2 grid gap-2">{tutorReplySections(daxFeedback).map((section, index) => <div key={`${section.title}-${index}`} className="dax-reply-section"><b>{section.title}</b><p>{section.text}</p></div>)}</div></div></div>}</section>;
  if (mode === "cazador") return <section className="detective-content"><p className="data-cell-header">Detección de errores</p><h3>¿Esta afirmación es fiel al material?</h3><div className="detective-quote">{hunterSentence}</div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => onHunter(false)} className="rounded-cell border border-line px-4 py-2 text-sm text-ink">Es correcta</button><button type="button" onClick={() => onHunter(true)} className="rounded-cell border border-red-300 px-4 py-2 text-sm text-red-700">Es falsa</button></div>{hunterDone && <div className="mt-4 rounded-cell bg-green-50 p-4 text-sm text-green-800">Respuesta registrada. Contrasta siempre la afirmación con el contexto original antes de concluir.</div>}<button type="button" onClick={onNextHunter} className="mt-3 rounded-cell bg-ink px-4 py-2 text-sm font-bold text-white">Nueva afirmación</button></section>;
  if (mode === "caso") return <section className="detective-content"><p className="data-cell-header">Transferencia profesional</p><h3>Aplica lo aprendido a una situación nueva</h3><p>Un equipo necesita usar el material para resolver un problema real. Responde con acciones concretas y medibles.</p>{["Diagnóstico: ¿qué problema resolverías y con qué concepto?", "Aplicación: ¿qué harías primero, segundo y tercero?", "Medición: ¿cómo demostrarías que la solución funcionó?"] .map((question, index) => <label key={question} className="mt-4 block text-sm font-bold text-white">{question}<textarea value={caseAnswers[index]} onChange={(event) => { const next = [...caseAnswers]; next[index] = event.target.value; setCaseAnswers(next); }} className="detective-textarea mt-2" /></label>)}<button type="button" onClick={onCase} className="mt-4 rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white">Evaluar caso</button></section>;
  if (mode === "perfil") return <section className="detective-content"><p className="data-cell-header">Habilidades cognitivas</p><h3>Tu dominio se construye con evidencia</h3><div className="skill-grid">{[["Explicación Feynman", state.feynman], ["Detección de errores", state.hunter], ["Transferencia profesional", state.case]].map(([label, value]) => <div key={label as string} className="skill-card"><b>{value as number} XP</b><span>{label as string}</span></div>)}</div></section>;
  return <section className="detective-content"><p className="data-cell-header">Inicio de investigación</p><h3>Elige una técnica para dominar este material</h3><div className="detective-method-grid"><div><GitBranch className="text-accent" /><b>Mapa conceptual</b><span>Ordena ideas principales con evidencia de origen.</span></div><div><Brain className="text-accent" /><b>Enseña a Dax</b><span>Explica con tus propias palabras y recibe orientación.</span></div><div><Target className="text-accent" /><b>Cazador de errores</b><span>Contrasta afirmaciones con el material original.</span></div><div><BookOpen className="text-accent" /><b>Buscar Ciencia</b><span>Consulta Crossref y OpenAlex sin necesitar un archivo activo.</span></div></div><div className="mt-5 rounded-cell border-l-4 border-cyan-400 bg-cyan-950/30 p-4 text-sm text-blue-100">La biblioteca complementa los cursos oficiales. El aprendizaje y el certificado siguen dependiendo de las actividades y evaluaciones del curso.</div></section>;
}

function ConceptMapPanel({ conceptMap, selectedConcept, mapView, onMapView, onSelectConcept, selectedFile }: { conceptMap: ConceptMap | null; selectedConcept: ConceptNode | null; mapView: "tree" | "outline"; onMapView: (view: "tree" | "outline") => void; onSelectConcept: (id: string) => void; selectedFile: StoredLibraryFile }) {
  const warnings = [...(selectedFile.analysisWarnings ?? []), ...(conceptMap?.warnings ?? [])].filter((warning, index, all) => all.indexOf(warning) === index);

  return (
    <section className="detective-content">
      <div className="concept-map-heading">
        <div>
          <p className="data-cell-header">Mapa conceptual basado en el material</p>
          <h3>Ideas ordenadas con evidencia</h3>
        </div>
        <div className="concept-map-switch" role="tablist" aria-label="Presentación del mapa">
          <button type="button" role="tab" aria-selected={mapView === "tree"} onClick={() => onMapView("tree")}>Mapa</button>
          <button type="button" role="tab" aria-selected={mapView === "outline"} onClick={() => onMapView("outline")}>Esquema</button>
        </div>
      </div>
      <p>Organiza la fuente en secciones, conceptos subordinados y citas. Selecciona un concepto para revisar la evidencia textual que lo respalda.</p>
      {warnings.map((warning) => <p key={warning} role="status" className="concept-map-warning">{warning}</p>)}
      {conceptMap && conceptMap.concepts.length > 0 ? (
        <>
          <div className="concept-map-root">
            <BookOpen className="h-4 w-4" />
            <span>{conceptMap.documentTitle}</span>
            <small>{conceptMap.wordCount.toLocaleString("es-PE")} palabras · {conceptMap.sections.length} secciones</small>
          </div>
          <div className="concept-map-central"><span>Tema central detectado en el contenido</span><b>{conceptMap.centralTheme ?? "No se detectó un tema dominante"}</b></div>
          {mapView === "tree" ? (
            <div className="concept-map-tree">
              {conceptMap.concepts.map((section, index) => (
                <details key={section.id} className={`map-section map-section-${index % 3}`} open={index < 3}>
                  <summary className="map-section-title">
                    <span className="map-level-label">Sección {index + 1}</span>
                    <b>{section.label}</b>
                    <small>{section.children.length} conceptos{section.sourceLocation ? ` · ${section.sourceLocation}` : ""}</small>
                  </summary>
                  <div className="map-concept-list">
                    {section.children.map((node) => (
                      <button type="button" key={node.id} onClick={() => onSelectConcept(node.id)} className={`map-concept-node ${selectedConcept?.id === node.id ? "selected" : ""}`}>
                        <b>{node.label}</b>
                        <small>{node.frequency} menciones</small>
                      </button>
                    ))}
                  </div>
                  {section.evidence[0] && <p className="map-section-evidence"><span>Evidencia de sección</span>{section.evidence[0]}</p>}
                </details>
              ))}
            </div>
          ) : (
            <div className="concept-map-outline">
              {conceptMap.concepts.map((section, index) => (
                <details key={section.id} open={index === 0}>
                  <summary><span>{String(index + 1).padStart(2, "0")}</span><b>{section.label}</b><small>{section.children.length} conceptos</small></summary>
                  <ol>
                    {section.children.map((node) => (
                      <li key={node.id}>
                        <button type="button" onClick={() => onSelectConcept(node.id)}>{node.label}</button>
                        <ul>{node.evidence.map((evidence, evidenceIndex) => <li key={`${node.id}-${evidenceIndex}`}>{evidence}</li>)}</ul>
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          )}
          <aside className="concept-evidence-panel">
            <div className="concept-evidence-heading"><span>Concepto y respaldo textual{selectedConcept?.sourceLocation ? ` · ${selectedConcept.sourceLocation}` : ""}</span>{selectedConcept && <b>{selectedConcept.label}</b>}</div>
            {selectedConcept?.evidence.length ? selectedConcept.evidence.map((evidence, index) => <blockquote key={`${selectedConcept.id}-${index}`}>“{evidence}”</blockquote>) : <p>{selectedConcept ? "No se encontró una oración legible para citar este concepto." : "Selecciona un concepto del mapa para consultar sus citas."}</p>}
          </aside>
        </>
      ) : (
        <div className="concept-map-empty"><BookOpen className="mx-auto h-7 w-7" /><b>No se pudo construir el mapa</b><p>Este documento no contiene suficiente texto estructurado. En PDF escaneados se necesita OCR; el mapa no inventa conceptos sin evidencia.</p></div>
      )}
    </section>
  );
}
