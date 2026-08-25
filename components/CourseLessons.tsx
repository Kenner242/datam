"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Check, ChevronDown, Download, Lightbulb, Play, Target } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Course } from "@/lib/courses";
import { getTopicConcept } from "@/lib/topicConcepts";

export default function CourseLessons({ course }: { course: Course }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [watched, setWatched] = useState<string[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [message, setMessage] = useState("");
  const [openLessonId, setOpenLessonId] = useState("");
  const lessonIds = useMemo(
    () => course.modules.flatMap((module) => module.lessons.map((lesson) => `${module.title}:${lesson.title}`)),
    [course.modules],
  );
  const storageKey = userId ? `datam-progress:${userId}:${course.slug}` : "";
  const completedLessons = watched.filter((id) => lessonIds.includes(id)).length;
  const courseProgress = lessonIds.length ? Math.round((completedLessons / lessonIds.length) * 100) : 0;
  const isComplete = lessonIds.length > 0 && completedLessons === lessonIds.length;

  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace(`/login?next=/cursos/${course.slug}`);
        return;
      }

      setUserId(data.user.id);
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", data.user.id)
        .eq("course_slug", course.slug)
        .maybeSingle();
      setIsEnrolled(Boolean(enrollment));
    });
  }, [course.slug, router]);

  useEffect(() => {
    if (!storageKey) return;
    const savedProgress = window.localStorage.getItem(storageKey);
    if (!savedProgress) return;

    try {
      setWatched(JSON.parse(savedProgress) as string[]);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  async function enroll() {
    if (!userId) return;
    const { error } = await supabase
      .from("enrollments")
      .upsert({ user_id: userId, course_slug: course.slug }, { onConflict: "user_id,course_slug" });

    if (error) {
      setMessage(error.message);
      return;
    }

    setIsEnrolled(true);
    setMessage("Te has inscrito correctamente en este curso.");
  }

  async function markCompleted(lessonId: string) {
    if (!storageKey || watched.includes(lessonId) || !userId || !isEnrolled) return;
    const nextProgress = [...watched, lessonId];
    setWatched(nextProgress);
    window.localStorage.setItem(storageKey, JSON.stringify(nextProgress));
    await supabase
      .from("progress")
      .upsert({ user_id: userId, course_slug: course.slug, lesson_id: lessonId }, { onConflict: "user_id,course_slug,lesson_id" });
  }

  function downloadMaterial(lessonTitle: string, topics: string[]) {
    const content = [
      "DataM - Laboratorio de practica",
      `Curso: ${course.title}`,
      `Clase: ${lessonTitle}`,
      "",
      "Mision:",
      `Aplica ${topics.join(", ")} en un caso practico.`,
      "",
      "Guia de trabajo:",
      ...topics.map((topic, index) => `${index + 1}. ${topic}: ${getTopicConcept(topic)}`),
      "",
      "Reto:",
      "Usa estos conceptos para resolver una necesidad real de un negocio, estudio o proyecto personal.",
    ].join("\n");
    const blobUrl = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${course.slug}-${lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-laboratorio.txt`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }

  if (!userId) return <p className="mt-8 text-sm text-muted">Verificando tu acceso...</p>;

  return (
    <div className="mt-8 space-y-5">
      <section className="data-cell overflow-hidden">
        <div className="grid gap-5 bg-ink p-5 text-white md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue-200">Tu ruta de aprendizaje</p>
            <h3 className="mt-1 font-display text-xl font-bold">Construye tu proyecto, una mision a la vez</h3>
            <p className="mt-2 text-sm text-blue-100">Completa videos, laboratorios y retos cortos para avanzar de lo basico a una aplicacion real.</p>
          </div>
          <div className="min-w-32 border border-white/20 bg-white/10 p-4 text-center">
            <p className="font-mono text-2xl text-white">{courseProgress}%</p>
            <p className="mt-1 text-xs text-blue-100">{completedLessons} de {lessonIds.length} misiones</p>
          </div>
        </div>
        <div className="h-2 bg-blue-100"><div className="h-full bg-accent transition-all" style={{ width: `${courseProgress}%` }} /></div>
        <div className="p-5">
          {!isEnrolled && <button onClick={enroll} className="rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-ink">Inscribirme y empezar</button>}
          {isEnrolled && <p className="text-sm font-medium text-green-700">Estas inscrito. Elige tu siguiente mision.</p>}
          {isComplete && <button onClick={() => router.push(`/certificado/${course.slug}`)} className="mt-3 rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-ink">Descargar certificado PDF</button>}
          {message && <p role="status" className="mt-3 text-sm text-blue-800">{message}</p>}
        </div>
      </section>

      <div className="relative space-y-5 before:absolute before:bottom-8 before:left-7 before:top-8 before:w-px before:bg-blue-200">
        {course.modules.map((module, moduleIndex) => {
          const moduleLessonIds = module.lessons.map((lesson) => `${module.title}:${lesson.title}`);
          const completedInModule = moduleLessonIds.filter((id) => watched.includes(id)).length;
          const moduleProgress = module.lessons.length ? Math.round((completedInModule / module.lessons.length) * 100) : 0;
          const moduleStatus = moduleProgress === 100 ? "Completado" : completedInModule ? "En progreso" : "Por comenzar";

          return (
            <section key={module.title} className="relative pl-16">
              <div className="absolute left-0 top-5 z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-base bg-accent font-mono text-sm font-bold text-white shadow-sm">
                {String(moduleIndex + 1).padStart(2, "0")}
              </div>
              <div className="data-cell overflow-hidden">
                <header className="border-b border-line bg-blue-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="data-cell-header">Estacion {String(moduleIndex + 1).padStart(2, "0")} - {moduleStatus}</p>
                      <h3 className="mt-1 font-display text-xl font-bold text-ink">{module.title}</h3>
                      <p className="mt-2 text-sm text-muted">{module.lessons.length} misiones para avanzar en tu proyecto.</p>
                    </div>
                    <div className="w-28">
                      <p className="text-right font-mono text-xs text-blue-700">{moduleProgress}%</p>
                      <div className="mt-2 h-1.5 bg-blue-100"><div className="h-full bg-blue-600 transition-all" style={{ width: `${moduleProgress}%` }} /></div>
                    </div>
                  </div>
                </header>

                <div className="divide-y divide-line">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const lessonId = `${module.title}:${lesson.title}`;
                    const isDone = watched.includes(lessonId);
                    const isOpen = openLessonId === lessonId;
                    const isFinalLesson = moduleIndex === course.modules.length - 1 && lessonIndex === module.lessons.length - 1;

                    return (
                      <article key={lesson.title}>
                        <button
                          type="button"
                          onClick={() => setOpenLessonId(isOpen ? "" : lessonId)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-blue-50"
                        >
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${isDone ? "border-green-600 bg-green-600 text-white" : "border-blue-200 bg-white text-blue-700"}`}>
                            {isDone ? <Check className="h-4 w-4" /> : lessonIndex + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display font-bold text-ink">{lesson.title}</span>
                            <span className="mt-1 block truncate text-xs text-muted">{lesson.topics.join(" - ")}</span>
                          </span>
                          <span className="hidden items-center gap-1 text-xs text-muted sm:flex"><Play className="h-3.5 w-3.5" /> 10-20 min</span>
                          <ChevronDown className={`h-5 w-5 shrink-0 text-blue-700 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isOpen && (
                          <div className="border-t border-line bg-base px-5 py-5">
                            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                              <div>
                                <div className="border-l-4 border-accent bg-blue-50 p-4">
                                  <div className="flex items-center gap-2"><Target className="h-4 w-4 text-accent" /><p className="data-cell-header">Mision</p></div>
                                  <p className="mt-2 text-sm font-medium text-ink">Aplica {lesson.topics.join(", ")} en una parte concreta de tu proyecto.</p>
                                </div>
                                {lesson.videoUrl ? (
                                  <video controls preload="metadata" src={lesson.videoUrl} onEnded={() => markCompleted(lessonId)} className="mt-4 aspect-video w-full rounded-cell bg-ink" />
                                ) : (
                                  <div className="mt-4 flex aspect-video items-center justify-center rounded-cell bg-blue-950 px-4 text-center text-sm text-blue-100">El video de esta mision estara disponible proximamente.</div>
                                )}
                              </div>
                              <aside className="data-cell h-fit p-4">
                                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-700" /><p className="data-cell-header">Laboratorio</p></div>
                                <p className="mt-2 text-sm text-muted">Descarga la guia, completa el reto y utiliza una pista solo cuando la necesites.</p>
                                <button onClick={() => downloadMaterial(lesson.title, lesson.topics)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-cell border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"><Download className="h-4 w-4" /> Descargar material</button>
                                <details className="mt-4 border-t border-line pt-3"><summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-700"><Lightbulb className="h-4 w-4" /> Ver una pista</summary><p className="mt-2 text-sm text-muted">Identifica primero los datos de entrada, despues el resultado esperado y el concepto que conecta ambos.</p></details>
                                <details className="mt-3 border-t border-line pt-3"><summary className="cursor-pointer text-sm font-medium text-blue-700">Solucion guiada</summary><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted"><li>Abre el material de practica.</li><li>Aplica {lesson.topics.slice(0, 2).join(" y ")} segun el video.</li><li>Comprueba que el resultado responda a la mision.</li></ol></details>
                              </aside>
                            </div>
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-l-4 border-blue-500 bg-blue-50 p-4">
                              <div><p className="font-display text-sm font-bold text-ink">Hito de proyecto</p><p className="mt-1 text-sm text-muted">{isFinalLesson ? "Proyecto final listo para tu portafolio" : `Has completado el avance ${moduleIndex + 1}.${lessonIndex + 1}.`}</p></div>
                              <button disabled={!isEnrolled || isDone} onClick={() => markCompleted(lessonId)} className="rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted">{isDone ? "Mision completada" : "Completar mision"}</button>
                            </div>
                            {!isEnrolled && <p className="mt-2 text-xs text-muted">Inscribete en el curso para registrar tus misiones completadas.</p>}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
