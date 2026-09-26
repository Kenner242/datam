"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, ChevronRight, Code2, FlaskConical, LockKeyhole, RotateCcw, Trophy, X, Zap } from "lucide-react";
import type { Course, Lesson } from "@/lib/courses";

type PythonStage = { id: string; title: string; icon: string; bloom: string; goal: string; color: string; keywords: string[] };
type PracticeState = { code: string; output: string; checked: boolean; passed: boolean };

const STAGES: PythonStage[] = [
  { id: "fundamentos", title: "Introducción a Python", icon: "🐍", bloom: "Recordar", goal: "Entender qué es Python y guardar información en variables.", color: "#60a5fa", keywords: ["print", "=", "nombre"] },
  { id: "decisiones", title: "Operadores y decisiones", icon: "🎯", bloom: "Comprender", goal: "Hacer que tus programas tomen decisiones según los datos.", color: "#3b82f6", keywords: ["if", "elif", "else"] },
  { id: "automatizacion", title: "Bucles y automatización", icon: "🔄", bloom: "Aplicar", goal: "Repetir tareas sin escribir el mismo código muchas veces.", color: "#4ade80", keywords: ["for", "while", "range"] },
  { id: "funciones", title: "Funciones", icon: "🧩", bloom: "Analizar", goal: "Reutilizar lógica y construir soluciones mantenibles.", color: "#16a34a", keywords: ["def", "return"] },
  { id: "datos", title: "Estructuras de datos", icon: "📚", bloom: "Evaluar", goal: "Guardar, recorrer y analizar colecciones de información.", color: "#a78bfa", keywords: ["list", "dict", "len"] },
  { id: "proyecto", title: "Proyecto aplicado", icon: "🚀", bloom: "Crear", goal: "Integrar todo lo aprendido en un analizador de ventas.", color: "#7c3aed", keywords: ["sum", "max", "min", "f"] },
];

const STARTERS = [
  'nombre = "DataM"\nedad = 20\nprint(nombre)\nprint(edad)',
  'nota = 5.5\nif nota >= 4:\n    print("Aprobado")\nelse:\n    print("Repasa")',
  'total = 0\nfor numero in range(1, 6):\n    total += numero\nprint(total)',
  'def duplicar(valor):\n    return valor * 2\n\nprint(duplicar(5))',
  'notas = [6, 5, 7]\npromedio = sum(notas) / len(notas)\nprint(promedio)',
  'ventas = [120, 340, 90, 500, 210]\nprint("Total:", sum(ventas))\nprint("Mejor día:", max(ventas))',
];

function stageLessons(course: Course, stageIndex: number): Lesson[] {
  const lessons = course.modules.flatMap((module) => module.lessons);
  const start = Math.floor((lessons.length / STAGES.length) * stageIndex);
  const end = Math.max(start + 1, Math.floor((lessons.length / STAGES.length) * (stageIndex + 1)));
  return lessons.slice(start, end);
}

export default function PythonCourseExperience({ course }: { course: Course }) {
  const [activeStage, setActiveStage] = useState(0);
  const [openLesson, setOpenLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [practice, setPractice] = useState<PracticeState>({ code: STARTERS[0], output: "", checked: false, passed: false });
  const [message, setMessage] = useState("");
  const storageKey = `datam-python-experience:${course.slug}`;

  useEffect(() => {
    try { setCompleted(JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as string[]); } catch { window.localStorage.removeItem(storageKey); }
  }, [storageKey]);

  const lessons = useMemo(() => stageLessons(course, activeStage), [course, activeStage]);
  const completedStages = STAGES.filter((stage) => completed.includes(stage.id)).length;
  const progress = Math.round((completedStages / STAGES.length) * 100);

  function selectStage(index: number) {
    const unlocked = index === 0 || completed.includes(STAGES[index - 1].id);
    if (!unlocked) { setMessage("Completa la etapa anterior para desbloquear esta ruta."); return; }
    setActiveStage(index); setMessage(""); setPractice({ code: STARTERS[index], output: "", checked: false, passed: false });
  }

  function completeStage() {
    const next = Array.from(new Set([...completed, STAGES[activeStage].id]));
    setCompleted(next); window.localStorage.setItem(storageKey, JSON.stringify(next)); setMessage(`Etapa completada: ${STAGES[activeStage].title}.`);
  }

  function runPractice() {
    const code = practice.code;
    const hasKeywords = STAGES[activeStage].keywords.filter((keyword) => code.includes(keyword)).length;
    const passed = hasKeywords >= Math.max(2, Math.ceil(STAGES[activeStage].keywords.length * 0.6));
    const output = passed ? "✓ Código revisado: estructura principal encontrada.\nAhora explica por qué funciona." : "⚠ Aún falta una parte importante. Revisa la consigna y prueba otra vez.";
    setPractice((current) => ({ ...current, output, checked: true, passed }));
    if (passed) setMessage("Práctica superada. Puedes marcar la etapa como completada.");
  }

  return <section className="python-experience" aria-label="Experiencia interactiva de Python Básico">
    <header className="python-experience-head"><div><p className="python-kicker">DataM AI · Python Básico</p><h2>Mi ruta profesional</h2><p>Aprende, practica y crea un producto real con Python. Cada etapa combina lectura, laboratorio, retroalimentación y evidencia.</p></div><div className="python-experience-stats"><b>{progress}%</b><span>ruta completada</span><small>{completedStages}/{STAGES.length} etapas</small></div></header>
    <div className="python-stage-route" role="list" aria-label="Ruta de Python"><div className="python-stage-route-line" aria-hidden="true" />{STAGES.map((stage, index) => { const isDone = completed.includes(stage.id); const isUnlocked = index === 0 || completed.includes(STAGES[index - 1].id); return <button key={stage.id} type="button" role="listitem" className={`python-route-stage ${activeStage === index ? "active" : ""} ${isDone ? "done" : ""} ${!isUnlocked ? "locked" : ""}`} onClick={() => selectStage(index)}><span style={{ backgroundColor: isDone ? "#16a34a" : isUnlocked ? stage.color : "#64748b" }}>{isDone ? <Check className="h-5 w-5" /> : !isUnlocked ? <LockKeyhole className="h-4 w-4" /> : index + 1}</span><b>{stage.icon} {stage.title}</b><small>{stage.bloom}</small></button>; })}</div>
    {message && <p role="status" className="python-experience-message">{message}</p>}
    <div className="python-stage-card"><div className="python-stage-card-icon" style={{ backgroundColor: STAGES[activeStage].color }}>{STAGES[activeStage].icon}</div><div className="min-w-0 flex-1"><p className="python-stage-label">Etapa {activeStage + 1} · {STAGES[activeStage].bloom}</p><h3>{STAGES[activeStage].title}</h3><p>{STAGES[activeStage].goal}</p><div className="python-topic-tags">{STAGES[activeStage].keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div></div><button type="button" onClick={completeStage} className="python-complete-button"><CheckCircle2 className="h-4 w-4" /> {completed.includes(STAGES[activeStage].id) ? "Etapa completada" : "Completar etapa"}</button></div>
    <div className="python-experience-grid"><section className="python-lessons-panel"><div className="python-panel-heading"><div><p className="python-section-label">Contenido conectado</p><h3>Clases de esta etapa</h3></div><span>{lessons.length} clase{lessons.length === 1 ? "" : "s"}</span></div>{lessons.map((lesson) => <button key={lesson.title} type="button" onClick={() => setOpenLesson(lesson)} className="python-lesson-card"><span>{lesson.content ? "📖" : "🧪"}</span><span className="min-w-0 flex-1 text-left"><b>{lesson.title}</b><small>{lesson.topics.join(" · ")}</small></span><ChevronRight className="h-4 w-4" /></button>)}</section><section className="python-lab-panel"><div className="python-panel-heading"><div><p className="python-section-label">Práctica inmediata</p><h3><FlaskConical className="inline h-5 w-5" /> Laboratorio</h3></div><span>sin instalar nada</span></div><p className="python-lab-prompt">Escribe o modifica el código de la etapa. El revisor comprueba la estructura y te indica qué mejorar.</p><textarea value={practice.code} onChange={(event) => setPractice((current) => ({ ...current, code: event.target.value, checked: false }))} className="python-code-editor" spellCheck={false} aria-label="Editor de práctica Python" /><div className="python-lab-actions"><button type="button" onClick={runPractice} className="python-run-button"><Code2 className="h-4 w-4" /> Revisar código</button><button type="button" onClick={() => setPractice({ code: STARTERS[activeStage], output: "", checked: false, passed: false })} className="python-reset-button"><RotateCcw className="h-4 w-4" /> Reiniciar</button></div>{practice.checked && <div className={`python-output ${practice.passed ? "passed" : "needs-work"}`}>{practice.output}</div>}</section></div>
    <div className="python-experience-footer"><Zap className="h-4 w-4 text-amber-400" /><span>El XP motiva la práctica; la evaluación final mantiene el criterio oficial de aprobación.</span><Trophy className="ml-auto h-4 w-4 text-amber-400" /></div>
    {openLesson && <LessonPreview lesson={openLesson} onClose={() => setOpenLesson(null)} />}
  </section>;
}

function LessonPreview({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  return <div className="python-lesson-overlay" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="python-lesson-modal" role="dialog" aria-modal="true" aria-label={lesson.title}><button type="button" onClick={onClose} className="python-modal-close" aria-label="Cerrar lección"><X className="h-5 w-5" /></button><p className="python-section-label">Lección guiada</p><h2>{lesson.title}</h2><p className="python-modal-topics">{lesson.topics.join(" · ")}</p>{lesson.content ? <><p className="python-modal-intro">{lesson.content.introduction}</p><div className="python-modal-block"><b>Ideas clave</b><ul>{lesson.content.keyConcepts.slice(0, 5).map((concept) => <li key={concept}>{concept}</li>)}</ul></div><div className="python-modal-block"><b>Actividad guiada</b><p>{lesson.content.guidedActivity.instructions}</p></div></> : <div className="python-modal-block"><b>Objetivo de práctica</b><p>Completa la actividad en el laboratorio y revisa cada criterio antes de avanzar.</p></div>}<button type="button" onClick={onClose} className="python-modal-primary">Volver a la ruta</button></section></div>;
}
