"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { courses } from "@/lib/courses";
import type { GeneratedLessonMaterials } from "@/lib/contentStudio";

type ModuleRow = { id: number; title: string; position: number; bloom_level: string; learning_outcome: string };

type Metrics = { enrolled: number; completed: number; averageScore: number | null };

export default function AdminContentManager() {
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug ?? "");
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [message, setMessage] = useState("");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [generated, setGenerated] = useState<GeneratedLessonMaterials | null>(null);
  const selectedCourse = courses.find((course) => course.slug === courseSlug) ?? courses[0];
  const selectedModule = selectedCourse?.modules[moduleIndex];
  const selectedLesson = selectedModule?.lessons[lessonIndex];

  async function loadCourseData(slug = courseSlug) {
    const [{ data: moduleData }, { count: enrolled }, { data: attempts }] = await Promise.all([
      supabase.from("course_modules").select("id, title, position, bloom_level, learning_outcome").eq("course_slug", slug).order("position"),
      supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("course_slug", slug),
      supabase.from("exam_attempts").select("score").eq("course_slug", slug).eq("passed", true),
    ]);
    setModules((moduleData as ModuleRow[] | null) ?? []);
    const scores = (attempts ?? []).map((attempt) => attempt.score).filter((score): score is number => typeof score === "number");
    setMetrics({ enrolled: enrolled ?? 0, completed: 0, averageScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null });
  }

  useEffect(() => { setModuleIndex(0); setLessonIndex(0); setGenerated(null); void loadCourseData(); }, [courseSlug]);

  async function createModule() {
    if (!moduleTitle.trim()) return;
    const { error } = await supabase.from("course_modules").insert({ course_slug: courseSlug, title: moduleTitle.trim(), position: modules.length + 1, bloom_level: "comprender", learning_outcome: `Aplica los conocimientos de ${moduleTitle.trim()}.` });
    setMessage(error ? error.message : "Módulo creado correctamente.");
    setModuleTitle("");
    if (!error) void loadCourseData();
  }

  async function createLesson() {
    if (!lessonTitle.trim() || modules.length === 0) return;
    const moduleId = modules[modules.length - 1].id;
    const { error } = await supabase.from("course_lessons").insert({ course_slug: courseSlug, module_id: moduleId, position: 1, title: lessonTitle.trim(), content: lessonContent.trim() || null, duration_minutes: 6, quiz: [] });
    setMessage(error ? error.message : "Lección creada correctamente en el último módulo.");
    setLessonTitle("");
    setLessonContent("");
  }

  async function generateMaterials() {
    if (!selectedLesson?.content) {
      setMessage("Esta lección no tiene LessonContent para generar materiales.");
      return;
    }
    setMessage("Generando materiales con IA...");
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch("/api/content-studio/generate", { method: "POST", headers: { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) }, body: JSON.stringify({ lessonContent: selectedLesson.content }) });
    const result = (await response.json()) as { materials?: GeneratedLessonMaterials; error?: string };
    if (!response.ok || !result.materials) {
      setMessage(result.error ?? "No se pudieron generar los materiales.");
      return;
    }
    setGenerated(result.materials);
    setMessage("Borrador generado. Revisa y aprueba cada formato.");
  }

  async function saveGenerated(type: "slides" | "mindmap" | "flashcards" | "summary") {
    if (!generated) return;
    const content = generated[type === "slides" ? "slidesOutline" : type === "mindmap" ? "mindMap" : type === "flashcards" ? "flashcards" : "textbookSummary"];
    const { error } = await supabase.from("lesson_generated_content").upsert({ course_slug: courseSlug, module_index: moduleIndex, lesson_index: lessonIndex, type, content, reviewed: true }, { onConflict: "course_slug,module_index,lesson_index,type" });
    setMessage(error ? error.message : `${type} aprobado y publicado para estudiantes.`);
  }

  return (
    <section className="data-cell mt-12 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><span className="data-cell-header">Contenido académico</span><h2 className="mt-1 font-display text-2xl font-bold text-ink">Administrar cursos y métricas</h2></div>
        <select value={courseSlug} onChange={(event) => setCourseSlug(event.target.value)} className="rounded-cell border border-line bg-white px-3 py-2 text-sm"><option value="" disabled>Selecciona un curso</option>{courses.map((course) => <option key={course.slug} value={course.slug}>{course.title}</option>)}</select>
      </div>
      {metrics && <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="bg-base p-3"><p className="data-cell-header">Inscritos</p><p className="mt-1 text-xl font-bold text-ink">{metrics.enrolled}</p></div><div className="bg-base p-3"><p className="data-cell-header">Finalización</p><p className="mt-1 text-xl font-bold text-ink">Pendiente de agregación</p></div><div className="bg-base p-3"><p className="data-cell-header">Promedio aprobado</p><p className="mt-1 text-xl font-bold text-ink">{metrics.averageScore === null ? "-" : `${metrics.averageScore}/100`}</p></div></div>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="border border-line p-4"><p className="font-bold text-ink">Nuevo módulo</p><input value={moduleTitle} onChange={(event) => setModuleTitle(event.target.value)} placeholder="Título del módulo" className="mt-3 w-full rounded-cell border border-line p-2 text-sm" /><button type="button" onClick={() => void createModule()} className="mt-3 rounded-cell bg-ink px-4 py-2 text-sm font-bold text-white">Crear módulo</button></div>
        <div className="border border-line p-4"><p className="font-bold text-ink">Nueva lección</p><input value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} placeholder="Título de la lección" className="mt-3 w-full rounded-cell border border-line p-2 text-sm" /><textarea value={lessonContent} onChange={(event) => setLessonContent(event.target.value)} placeholder="Contenido textual inicial" className="mt-2 min-h-20 w-full rounded-cell border border-line p-2 text-sm" /><button type="button" onClick={() => void createLesson()} disabled={modules.length === 0} className="mt-3 rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white disabled:bg-line">Crear lección</button></div>
      </div>
      <div className="mt-6 border border-line p-4">
        <p className="font-bold text-ink">Content Studio</p>
        <p className="mt-1 text-sm text-muted">Genera materiales desde el LessonContent existente; no reemplaza la actividad ni el quiz.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <select value={moduleIndex} onChange={(event) => { setModuleIndex(Number(event.target.value)); setLessonIndex(0); setGenerated(null); }} className="rounded-cell border border-line p-2 text-sm">{selectedCourse?.modules.map((module, index) => <option key={module.title} value={index}>{module.title}</option>)}</select>
          <select value={lessonIndex} onChange={(event) => { setLessonIndex(Number(event.target.value)); setGenerated(null); }} className="rounded-cell border border-line p-2 text-sm">{selectedModule?.lessons.map((lesson, index) => <option key={lesson.title} value={index}>{lesson.title}</option>)}</select>
        </div>
        <button type="button" onClick={() => void generateMaterials()} className="mt-3 rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white">Generar materiales con IA</button>
        {generated && <div className="mt-4 space-y-4">
          {(["slides", "mindmap", "flashcards", "summary"] as const).map((type) => {
            const value = type === "slides" ? generated.slidesOutline : type === "mindmap" ? generated.mindMap : type === "flashcards" ? generated.flashcards : generated.textbookSummary;
            return <div key={type} className="border border-line p-3"><div className="flex items-center justify-between gap-3"><p className="font-bold capitalize text-ink">{type}</p><button type="button" onClick={() => void saveGenerated(type)} className="rounded-cell bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">Aprobar formato</button></div><textarea value={JSON.stringify(value, null, 2)} onChange={(event) => { try { const parsed = JSON.parse(event.target.value); setGenerated((current) => current ? { ...current, ...(type === "slides" ? { slidesOutline: parsed } : type === "mindmap" ? { mindMap: parsed } : type === "flashcards" ? { flashcards: parsed } : { textbookSummary: parsed }) } : current); } catch { /* Keep the editable draft until valid JSON is entered. */ } }} className="mt-2 min-h-32 w-full rounded-cell border border-line p-2 font-mono text-xs" /></div>;
          })}
        </div>}
      </div>
      {modules.length > 0 && <ul className="mt-5 space-y-2">{modules.map((module) => <li key={module.id} className="border-l-4 border-accent bg-base p-3 text-sm text-ink">{module.position}. {module.title} <span className="text-muted">· {module.bloom_level}</span></li>)}</ul>}
      {message && <p role="status" className="mt-4 text-sm text-blue-800">{message}</p>}
      {/* TODO(retos-reales): connect lesson competencies to employer challenge templates. */}
      {/* TODO(radar-empleabilidad): expose course skills to a future employability read model. */}
    </section>
  );
}
