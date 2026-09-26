"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, Code2, LockKeyhole, PlayCircle, Trophy } from "lucide-react";
import type { Course } from "@/lib/courses";

type PythonStage = { id: string; title: string; icon: string; goal: string; topics: string[]; bloom: string; color: string };

const PYTHON_STAGES: PythonStage[] = [
  { id: "fundamentos", title: "Fundamentos", icon: "🐍", goal: "Comprende Python, variables y tipos de datos.", topics: ["Sintaxis clara", "Variables", "Tipos de datos"], bloom: "Recordar", color: "#60a5fa" },
  { id: "decisiones", title: "Decisiones", icon: "🎯", goal: "Construye programas que respondan a condiciones.", topics: ["Comparaciones", "and / or", "if / elif / else"], bloom: "Comprender", color: "#3b82f6" },
  { id: "automatizacion", title: "Automatización", icon: "🔄", goal: "Repite tareas y procesa secuencias sin duplicar código.", topics: ["for", "while", "range", "Acumuladores"], bloom: "Aplicar", color: "#4ade80" },
  { id: "funciones", title: "Funciones", icon: "🧩", goal: "Organiza soluciones reutilizables y mantenibles.", topics: ["def", "Parámetros", "return"], bloom: "Analizar", color: "#16a34a" },
  { id: "datos", title: "Estructuras de datos", icon: "📚", goal: "Modela información con listas y diccionarios.", topics: ["Listas", "Diccionarios", "Recorridos"], bloom: "Evaluar", color: "#a78bfa" },
  { id: "proyecto", title: "Proyecto aplicado", icon: "🚀", goal: "Integra Python para resolver una necesidad real.", topics: ["Métricas", "Reporte", "Buenas prácticas"], bloom: "Crear", color: "#7c3aed" },
];

function stageLessons(course: Course, stageIndex: number) {
  const allLessons = course.modules.flatMap((module, moduleIndex) => module.lessons.map((lesson, lessonIndex) => ({ lesson, moduleIndex, lessonIndex })));
  const start = Math.floor((allLessons.length / PYTHON_STAGES.length) * stageIndex);
  const end = Math.max(start + 1, Math.floor((allLessons.length / PYTHON_STAGES.length) * (stageIndex + 1)));
  return allLessons.slice(start, end);
}

export default function PythonCourseOverview({ course }: { course: Course }) {
  const [selectedStage, setSelectedStage] = useState(0);
  const [watched, setWatched] = useState<string[]>([]);
  const selected = PYTHON_STAGES[selectedStage];
  const selectedLessons = useMemo(() => stageLessons(course, selectedStage), [course, selectedStage]);
  useEffect(() => {
    const progress: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.includes(`datam-progress:`) || !key.endsWith(`:${course.slug}`)) continue;
      try { progress.push(...(JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[])); } catch { /* Ignore invalid local progress. */ }
    }
    setWatched(Array.from(new Set(progress)));
  }, [course.slug]);
  const completedStages = PYTHON_STAGES.filter((_, index) => stageLessons(course, index).every(({ lesson, moduleIndex }) => watched.includes(`${course.modules[moduleIndex].title}:${lesson.title}`))).map((stage) => stage.id);
  const progress = Math.round((completedStages.length / PYTHON_STAGES.length) * 100);

  return <section className="python-overview" aria-label="Ruta profesional de Python Básico">
    <div className="python-overview-head">
      <div><p className="python-kicker">Python Básico · Ruta profesional</p><h2>Construye soluciones, no solo código</h2><p>Avanza desde la sintaxis hasta un producto pequeño que puedas explicar y mostrar en una entrevista.</p></div>
      <div className="python-overview-progress"><span>{progress}%</span><small>{completedStages.length} de {PYTHON_STAGES.length} etapas</small></div>
    </div>
    <div className="python-route" role="list" aria-label="Etapas del curso">
      <div className="python-route-line" aria-hidden="true" />
      {PYTHON_STAGES.map((stage, index) => { const done = completedStages.includes(stage.id); const active = selectedStage === index; return <button key={stage.id} type="button" role="listitem" aria-current={active ? "step" : undefined} onClick={() => setSelectedStage(index)} className={`python-stage ${active ? "active" : ""} ${done ? "done" : ""}`}><span className="python-stage-dot" style={{ backgroundColor: done ? "#16a34a" : stage.color }}>{done ? <CheckCircle2 className="h-5 w-5" /> : index + 1}</span><b>{stage.title}</b><small>{stage.bloom}</small></button>; })}
    </div>
    <div className="python-stage-detail">
      <div className="python-stage-icon" style={{ backgroundColor: selected.color }}>{selected.icon}</div>
      <div className="min-w-0 flex-1"><p className="python-stage-label">Etapa {selectedStage + 1} · {selected.bloom}</p><h3>{selected.title}</h3><p className="python-stage-goal">{selected.goal}</p><div className="python-topic-list">{selected.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></div>
      <button type="button" onClick={() => { const firstLesson = selectedLessons[0]; if (firstLesson) window.dispatchEvent(new CustomEvent("datam:open-python-lesson", { detail: { moduleIndex: firstLesson.moduleIndex, lessonIndex: firstLesson.lessonIndex } })); }} className="python-stage-action">{completedStages.includes(selected.id) ? <><CheckCircle2 className="h-4 w-4" /> Repasar etapa</> : <><PlayCircle className="h-4 w-4" /> Empezar etapa</>}</button>
    </div>
    <div className="python-stage-lessons"><div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-blue-600" /><p className="python-section-label">Clases conectadas</p></div>{selectedLessons.map(({ lesson, moduleIndex, lessonIndex }) => { const done = watched.includes(`${course.modules[moduleIndex].title}:${lesson.title}`); return <button type="button" key={lesson.title} onClick={() => window.dispatchEvent(new CustomEvent("datam:open-python-lesson", { detail: { moduleIndex, lessonIndex } }))} className={`python-lesson-row ${done ? "done" : ""}`}><span className="python-lesson-check">{done ? <CheckCircle2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</span><div className="min-w-0 flex-1 text-left"><b>{lesson.title}</b><small>{lesson.topics.join(" · ")}</small></div><span className="python-lesson-link">Abrir tema</span></button>; })}{selectedLessons.length === 0 && <p className="text-sm text-muted">Esta etapa utilizará el contenido del módulo actual.</p>}</div>
    <div className="python-overview-note"><Trophy className="h-4 w-4 shrink-0 text-amber-600" /><span>La ruta motiva tu práctica; la evaluación final sigue siendo la que determina la aprobación y el certificado.</span></div>
    <div className="python-overview-next"><span><LockKeyhole className="h-4 w-4" /> Próximo paso</span><b>{selectedStage < PYTHON_STAGES.length - 1 ? PYTHON_STAGES[selectedStage + 1].title : "Evaluación final"}</b><ArrowRight className="h-4 w-4" /></div>
  </section>;
}
