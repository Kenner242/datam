"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Check, ChevronDown, Download, FileSpreadsheet, FileText, Target } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Course } from "@/lib/courses";
import type { LessonMaterials, MaterialType } from "@/lib/materialTypes";
import { lessonMaterialsKey } from "@/lib/materialTypes";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

const MATERIAL_STYLES: Record<MaterialType, { badge: string; icon: string; Icon: typeof FileText; title: (lessonTitle: string) => string; description: string }> = {
  plantilla: {
    badge: "bg-blue-100 text-blue-700",
    icon: "bg-green-50 text-green-600",
    Icon: FileSpreadsheet,
    title: (lessonTitle) => `Plantilla de trabajo (${lessonTitle})`,
    description: "Archivo inicial con datos y ejercicios preparados sin resolver.",
  },
  guia: {
    badge: "bg-purple-100 text-purple-700",
    icon: "bg-red-50 text-red-500",
    Icon: FileText,
    title: () => "Guía de laboratorio y Cheat Sheet",
    description: "Paso a paso con explicaciones de fórmulas y funciones.",
  },
  solucion: {
    badge: "bg-green-100 text-green-700",
    icon: "bg-green-50 text-green-600",
    Icon: FileSpreadsheet,
    title: (lessonTitle) => `Modelo resuelto (${lessonTitle})`,
    description: "Archivo final con cálculos y resultados completados.",
  },
};

export default function CourseLessons({ course, materials }: { course: Course; materials: Record<string, LessonMaterials> }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [watched, setWatched] = useState<string[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState("");
  const [openLessonId, setOpenLessonId] = useState("");
  const lessonIds = useMemo(
    () => course.modules.flatMap((module) => module.lessons.map((lesson) => `${module.title}:${lesson.title}`)),
    [course.modules],
  );
  const storageKey = `datam-progress:${userId ?? "guest"}:${course.slug}`;
  const enrollmentKey = `datam-enrollment:${userId ?? "guest"}:${course.slug}`;
  const completedLessons = watched.filter((id) => lessonIds.includes(id)).length;
  const courseProgress = lessonIds.length ? Math.round((completedLessons / lessonIds.length) * 100) : 0;
  const isComplete = lessonIds.length > 0 && completedLessons === lessonIds.length;
  const levels = [
    { name: "Fundamentos", description: "Comprende los conceptos y herramientas esenciales." },
    { name: "Desarrollo", description: "Aplica los conocimientos en ejercicios guiados." },
    { name: "Dominio", description: "Integra lo aprendido en situaciones profesionales." },
  ];

  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("course_slug", course.slug)
          .maybeSingle();
        setIsEnrolled(Boolean(enrollment));
      } else {
        setIsEnrolled(window.localStorage.getItem(`datam-enrollment:guest:${course.slug}`) === "true");
      }
      setIsReady(true);
    });
  }, [course.slug]);

  useEffect(() => {
    if (!isReady) return;
    const savedProgress = window.localStorage.getItem(storageKey);
    if (!savedProgress) return;

    try {
      setWatched(JSON.parse(savedProgress) as string[]);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [isReady, storageKey]);

  useEffect(() => {
    function handleEnrollment(event: Event) {
      const requestedCourse = (event as CustomEvent<{ courseSlug: string }>).detail.courseSlug;
      if (requestedCourse === course.slug) void enroll();
    }

    window.addEventListener("datam:enroll-course", handleEnrollment);
    return () => window.removeEventListener("datam:enroll-course", handleEnrollment);
  }, [course.slug, userId]);

  async function enroll() {
    if (!userId) {
      window.localStorage.setItem(enrollmentKey, "true");
      setIsEnrolled(true);
      setMessage(`Te has inscrito correctamente en ${course.title}. Ya puedes comenzar las clases.`);
      return;
    }
    const { error } = await supabase
      .from("enrollments")
      .upsert({ user_id: userId, course_slug: course.slug }, { onConflict: "user_id,course_slug" });

    if (error) {
      setMessage(error.message);
      return;
    }

    setIsEnrolled(true);
    setMessage(`Te has inscrito correctamente en ${course.title}. Ya puedes comenzar las clases.`);
  }

  async function markCompleted(lessonId: string) {
    if (watched.includes(lessonId) || !isEnrolled) return;
    const lessonPosition = lessonIds.indexOf(lessonId);
    const previousLessonId = lessonPosition > 0 ? lessonIds[lessonPosition - 1] : null;
    if (previousLessonId && !watched.includes(previousLessonId)) return;
    const nextProgress = [...watched, lessonId];
    setWatched(nextProgress);
    window.localStorage.setItem(storageKey, JSON.stringify(nextProgress));
    if (!userId) return;
    await supabase
      .from("progress")
      .upsert({ user_id: userId, course_slug: course.slug, lesson_id: lessonId }, { onConflict: "user_id,course_slug,lesson_id" });
  }

  if (!isReady) return <p className="mt-8 text-sm text-muted">Preparando el curso...</p>;

  return (
    <div id="curso-aprendizaje" className="mt-8 space-y-5">
      <section className="data-cell overflow-hidden">
        <div className="grid gap-4 bg-ink p-4 text-white sm:gap-5 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue-200">Metodologia progresiva</p>
            <h3 className="mt-1 font-display text-lg font-bold leading-6 sm:text-xl sm:leading-tight">Aprende desde los fundamentos hasta el dominio profesional</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100 sm:leading-normal">Cada nivel combina explicacion, demostracion, practica guiada y aplicacion para consolidar tus habilidades.</p>
          </div>
          <div className="w-full border border-white/20 bg-white/10 p-4 text-center md:min-w-32 md:w-auto">
            <p className="font-mono text-2xl text-white">{courseProgress}%</p>
            <p className="mt-1 text-xs text-blue-100">{completedLessons} de {lessonIds.length} clases completadas</p>
          </div>
        </div>
        <div className="h-2 bg-blue-100"><div className="h-full bg-accent transition-all" style={{ width: `${courseProgress}%` }} /></div>
        <div className="p-4 sm:p-5">
          {!isEnrolled && <button onClick={enroll} className="w-full rounded-cell bg-accent px-4 py-3 text-base font-bold text-white transition-colors hover:bg-ink sm:w-auto sm:px-4 sm:py-2 sm:text-sm">Inscribirme y empezar</button>}
          {isEnrolled && <p className="text-sm font-medium text-green-700">Estas inscrito. Continúa con la siguiente clase de tu nivel.</p>}
          {isComplete && <button onClick={() => router.push(`/cursos/${course.slug}/evaluacion`)} className="mt-3 w-full rounded-cell bg-accent px-4 py-3 text-base font-bold text-white transition-colors hover:bg-ink sm:w-auto sm:py-2 sm:text-sm">Ir a evaluación final</button>}
          {message && <p role="status" className="mt-3 text-sm text-blue-800">{message}</p>}
        </div>
      </section>

      <div className="relative space-y-5 sm:before:absolute sm:before:bottom-8 sm:before:left-7 sm:before:top-8 sm:before:w-px sm:before:bg-blue-200">
        {course.modules.map((module, moduleIndex) => {
          const moduleLessonIds = module.lessons.map((lesson) => `${module.title}:${lesson.title}`);
          const completedInModule = moduleLessonIds.filter((id) => watched.includes(id)).length;
          const moduleProgress = module.lessons.length ? Math.round((completedInModule / module.lessons.length) * 100) : 0;
          const moduleStatus = moduleProgress === 100 ? "Completado" : completedInModule ? "En progreso" : "Por comenzar";
          const level = levels[Math.min(moduleIndex, levels.length - 1)];

          return (
            <section key={module.title} className="relative sm:pl-16">
              <div className="absolute -top-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-base bg-accent font-mono text-xs font-bold text-white shadow-sm sm:left-0 sm:top-5 sm:h-14 sm:w-14 sm:text-sm">
                {String(moduleIndex + 1).padStart(2, "0")}
              </div>
              <div className="data-cell overflow-hidden">
                <header className="border-b border-line bg-blue-50 px-4 pb-4 pt-8 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <div>
                      <p className="data-cell-header">Módulo {String(moduleIndex + 1).padStart(2, "0")} · {moduleStatus}</p>
                      <h3 className="mt-1 break-words font-display text-lg font-bold leading-6 text-ink sm:text-xl sm:leading-tight">{module.title}</h3>
                      <p className="mt-2 text-base leading-6 text-muted sm:text-sm sm:leading-normal">{module.lessons.length} clases para avanzar a tu ritmo.</p>
                      {module.learningOutcome && <details className="mt-3 text-sm text-muted"><summary className="cursor-pointer font-medium text-blue-700">Ver objetivo del módulo</summary><p className="mt-2 leading-6">{module.learningOutcome}</p></details>}
                    </div>
                    <div className="w-full sm:w-28">
                      <p className="text-left font-mono text-xs text-blue-700 sm:text-right">{moduleProgress}%</p>
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
                    const lessonPosition = lessonIds.indexOf(lessonId);
                    const previousLessonId = lessonPosition > 0 ? lessonIds[lessonPosition - 1] : null;
                    const isCompletionLocked = Boolean(previousLessonId && !watched.includes(previousLessonId));

                    return (
                      <article key={lesson.title}>
                        <button
                          type="button"
                          onClick={() => setOpenLessonId(isOpen ? "" : lessonId)}
                          aria-expanded={isOpen}
                          aria-controls={`lesson-content-${course.slug}-${moduleIndex}-${lessonIndex}`}
                            className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-blue-50 sm:items-center sm:gap-4 sm:px-5"
                        >
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${isDone ? "border-green-600 bg-green-600 text-white" : "border-blue-200 bg-white text-blue-700"}`}>
                            {isDone ? <Check className="h-4 w-4" /> : lessonIndex + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block break-words font-display text-base font-bold leading-5 text-ink sm:text-sm">{lesson.title}</span>
                            <span className="mt-1 block text-sm leading-5 text-muted sm:truncate sm:text-xs">{lesson.topics.join(" - ")}</span>
                          </span>
                          <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-blue-700 transition-transform sm:mt-0 ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isOpen && (() => {
                          const materialsKey = lessonMaterialsKey(moduleIndex, lessonIndex);
                          const lessonMaterials = materials[materialsKey] ?? {};
                          const materialTypes = (Object.keys(lessonMaterials) as (keyof typeof lessonMaterials)[]);
                          return (
                          <div id={`lesson-content-${course.slug}-${moduleIndex}-${lessonIndex}`} className="border-t border-line bg-base px-3 py-5 sm:px-5">
                            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                              <div>
                                <div className="border-l-4 border-accent bg-blue-50 p-4">
                                  <div className="flex items-center gap-2"><Target className="h-4 w-4 text-accent" /><p className="data-cell-header">Paso 1 · Aprende</p></div>
                                  <p className="mt-2 text-base font-medium leading-6 text-ink">Al terminar podrás aplicar: {lesson.topics.join(", ")}.</p>
                                </div>
                                {lesson.videoUrl ? (
                                  getYouTubeEmbedUrl(lesson.videoUrl) ? (
                                    <iframe src={getYouTubeEmbedUrl(lesson.videoUrl) ?? undefined} title={`Video de la clase ${lesson.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="mt-4 aspect-video w-full rounded-cell bg-ink" />
                                  ) : (
                                    <video controls preload="metadata" src={lesson.videoUrl} onEnded={() => markCompleted(lessonId)} aria-label={`Video de la clase ${lesson.title}`} className="mt-4 aspect-video w-full rounded-cell bg-ink" />
                                  )
                                ) : (
                                  <div role="status" className="mt-4 flex aspect-video items-center justify-center rounded-cell bg-blue-950 px-4 text-center text-sm text-blue-100">El video de esta clase estará disponible próximamente.</div>
                                )}
                              </div>
                              <aside className="data-cell h-fit p-4 sm:p-5 lg:sticky lg:top-24">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-700" /><p className="data-cell-header">Paso 2 · Materiales</p></div>
                                  {materialTypes.length > 0 && <span className="rounded-cell bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">{materialTypes.length} archivo{materialTypes.length === 1 ? "" : "s"}</span>}
                                </div>
                                {materialTypes.length > 0 ? (
                                  <div className="mt-3 flex flex-col gap-3">
                                    {materialTypes.map((type) => {
                                      const material = lessonMaterials[type];
                                      if (!material) return null;
                                      const style = MATERIAL_STYLES[type];
                                      return (
                                        <div key={type} className="data-cell p-3">
                                          <div className="flex items-center justify-between gap-2">
                                            <span className={`rounded-cell px-2 py-1 text-xs font-bold uppercase ${style.badge}`}>{material.label}</span>
                                            <span className="text-xs text-muted">{material.sizeKB} KB</span>
                                          </div>
                                          <div className="mt-3 flex items-start gap-3">
                                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-cell ${style.icon}`}><style.Icon className="h-4 w-4" /></span>
                                            <div className="min-w-0">
                                              <p className="break-words text-sm font-bold text-ink">{style.title(lesson.title)}</p>
                                              <p className="mt-1 text-xs text-muted">{style.description}</p>
                                            </div>
                                          </div>
                                          <a href={material.href} download aria-label={`Descargar ${style.title(lesson.title)}`} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-cell border border-blue-300 bg-white px-3 py-3 text-base font-medium text-blue-700 transition-colors hover:bg-blue-50 sm:py-2 sm:text-sm"><Download className="h-4 w-4" /> Descargar ({material.ext})</a>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="mt-2 text-base leading-6 text-muted sm:text-sm sm:leading-normal">Los materiales de esta clase estarán disponibles próximamente.</p>
                                )}
                              </aside>
                            </div>
                            <div className="mt-5 flex flex-col gap-4 border-t-4 border-blue-500 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:border-l-4 sm:border-t-0 sm:gap-3 sm:p-5">
                              <div><p className="font-display text-base font-bold text-ink">Paso 3 · Confirma tu avance</p><p className="mt-1 text-base leading-6 text-muted sm:text-sm sm:leading-normal">{isFinalLesson ? "Termina esta clase para pasar a la evaluación final." : "Marca la clase como completada cuando hayas revisado el video y la práctica."}</p></div>
                              <button disabled={!isEnrolled || isDone || isCompletionLocked} onClick={() => markCompleted(lessonId)} className="min-h-11 w-full shrink-0 rounded-cell bg-accent px-4 py-3 text-base font-bold text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted sm:w-auto sm:py-2 sm:text-sm">{isDone ? "Clase completada" : "Completar clase"}</button>
                            </div>
                            {isCompletionLocked && <p className="mt-2 text-xs text-muted">Puedes ver esta clase, pero debes completar la clase anterior antes de marcarla como terminada.</p>}
                            {!isEnrolled && <p className="mt-2 text-xs text-muted">Inscríbete en el curso para registrar tus clases completadas.</p>}
                          </div>
                          );
                        })()}
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
