"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  ChevronDown,
  Database,
  Download,
  FileBarChart,
  FileCode,
  FileSpreadsheet,
  FileText,
  FolderArchive,
  Target,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Course, CourseResource, ResourceCategory, ResourceFormat } from "@/lib/courses";
import { getTopicConcept } from "@/lib/topicConcepts";

function getDefaultResources(courseSlug: string, lessonTitle: string): CourseResource[] {
  const isExcel = courseSlug.startsWith("excel") || courseSlug === "finanzas-para-emprendedores";
  const isPowerBi = courseSlug.startsWith("power-bi");
  const isSql = courseSlug.startsWith("sql");
  const isPython = courseSlug.startsWith("python");
  const isWeb = courseSlug === "programacion-desarrollo-web";

  if (isExcel) {
    return [
      {
        title: `Plantilla de trabajo (${lessonTitle})`,
        category: "starter",
        format: "excel",
        size: "540 KB",
        description: "Dataset inicial con datos y tablas preparadas sin resolver.",
      },
      {
        title: "Guía de laboratorio & Cheat Sheet",
        category: "guide",
        format: "pdf",
        size: "320 KB",
        description: "Paso a paso con explicaciones de fórmulas y funciones.",
      },
      {
        title: `Modelo resuelto (${lessonTitle})`,
        category: "solution",
        format: "excel",
        size: "580 KB",
        description: "Archivo final con cálculos y resultados completados.",
      },
    ];
  }

  if (isPowerBi) {
    return [
      {
        title: "Origen de datos (Excel / CSV)",
        category: "starter",
        format: "excel",
        size: "820 KB",
        description: "Archivos origen listos para importar y relacionar en Power BI.",
      },
      {
        title: "Guía de modelo & Medidas DAX",
        category: "guide",
        format: "pdf",
        size: "410 KB",
        description: "Documentación del esquema de datos y fórmulas DAX.",
      },
      {
        title: "Informe Power BI resuelto (.pbix)",
        category: "solution",
        format: "pbix",
        size: "1.2 MB",
        description: "Dashboard interactivo terminado con visualizaciones.",
      },
    ];
  }

  if (isSql) {
    return [
      {
        title: "Script SQL inicial (DDL/DML)",
        category: "starter",
        format: "sql",
        size: "120 KB",
        description: "Sentencias de creación de tablas e inserción de datos.",
      },
      {
        title: "Guía de consultas & Diagrama ER",
        category: "guide",
        format: "pdf",
        size: "290 KB",
        description: "Requerimientos de negocio y modelo entidad-relación.",
      },
      {
        title: "Queries SQL resueltas",
        category: "solution",
        format: "sql",
        size: "145 KB",
        description: "Consultas finales con JOINs, agrupaciones y filtros.",
      },
    ];
  }

  if (isPython) {
    return [
      {
        title: "Script inicial de trabajo (.py)",
        category: "starter",
        format: "python",
        size: "210 KB",
        description: "Código base con estructuras e importaciones iniciales.",
      },
      {
        title: "Guía sintáctica & Ejercicios",
        category: "guide",
        format: "pdf",
        size: "350 KB",
        description: "Manual con sintaxis, funciones y ejercicios prácticos.",
      },
      {
        title: "Script Python resuelto",
        category: "solution",
        format: "python",
        size: "230 KB",
        description: "Código completo funcional listo para ejecutar.",
      },
    ];
  }

  if (isWeb) {
    return [
      {
        title: "Estructura base del proyecto (.zip)",
        category: "starter",
        format: "zip",
        size: "450 KB",
        description: "Archivos HTML, CSS y assets iniciales del sitio.",
      },
      {
        title: "Cheat Sheet HTML / CSS / JS",
        category: "guide",
        format: "pdf",
        size: "380 KB",
        description: "Resumen de etiquetas, selectores y sintaxis web.",
      },
      {
        title: "Código fuente resuelto (.zip)",
        category: "solution",
        format: "zip",
        size: "510 KB",
        description: "Proyecto completado y responsive para verificar.",
      },
    ];
  }

  return [
    {
      title: "Ficha de actividades prácticas",
      category: "starter",
      format: "pdf",
      size: "280 KB",
      description: "Documento de trabajo para aplicar los conceptos.",
    },
    {
      title: "Guía metodológica & Conceptos",
      category: "guide",
      format: "pdf",
      size: "310 KB",
      description: "Resumen teórico y marco de trabajo de la lección.",
    },
    {
      title: "Ejemplo modelo resuelto",
      category: "solution",
      format: "pdf",
      size: "330 KB",
      description: "Caso práctico de referencia con respuestas esperadas.",
    },
  ];
}

function getFormatStyle(format: ResourceFormat) {
  switch (format) {
    case "excel":
      return { label: "XLSX", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: FileSpreadsheet };
    case "pbix":
      return { label: "PBIX", color: "bg-amber-50 text-amber-700 border-amber-200", icon: FileBarChart };
    case "sql":
      return { label: "SQL", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Database };
    case "python":
      return { label: "PY", color: "bg-sky-50 text-sky-700 border-sky-200", icon: FileCode };
    case "zip":
      return { label: "ZIP", color: "bg-purple-50 text-purple-700 border-purple-200", icon: FolderArchive };
    case "pdf":
    default:
      return { label: "PDF", color: "bg-rose-50 text-rose-700 border-rose-200", icon: FileText };
  }
}

function getCategoryStyle(category: ResourceCategory) {
  switch (category) {
    case "starter":
      return { label: "Archivo de trabajo", badge: "bg-blue-100 text-blue-800 border-blue-200" };
    case "guide":
      return { label: "Guía & Resumen", badge: "bg-purple-100 text-purple-800 border-purple-200" };
    case "solution":
      return { label: "Solución final", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" };
  }
}

function handleDownloadResource(course: Course, lessonTitle: string, topics: string[], resource: CourseResource) {
  if (resource.fileUrl) {
    const link = document.createElement("a");
    link.href = resource.fileUrl;
    link.download = resource.fileUrl.split("/").pop() || `${course.slug}-${resource.category}`;
    link.target = "_blank";
    link.click();
    return;
  }

  let content = "";
  const ext = resource.format;
  const fileName = `${course.slug}-${lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${resource.category}.${ext === "excel" ? "txt" : ext === "python" ? "py" : ext === "sql" ? "sql" : "txt"}`;

  if (resource.category === "starter") {
    content = [
      `DataM - ARCHIVO DE TRABAJO INICIAL (${resource.format.toUpperCase()})`,
      `============================================================`,
      `Curso: ${course.title}`,
      `Clase: ${lessonTitle}`,
      `============================================================`,
      ``,
      `INSTRUCCIONES DE USO:`,
      `Revisa el video de la clase y utiliza esta plantilla/dataset para realizar la práctica guiada.`,
      ``,
      `CONCEPTOS A DESARROLLAR:`,
      ...topics.map((t, i) => `${i + 1}. ${t}`),
      ``,
      `GUÍA DE APRENDIZAJE:`,
      ...topics.map((t) => `- ${t}: ${getTopicConcept(t)}`),
      ``,
      `[DATOS Y RECURSOS LISTOS PARA PRACTICAR EN ESTA LECCIÓN]`,
    ].join("\n");
  } else if (resource.category === "guide") {
    content = [
      `DataM - GUÍA PRÁCTICA DE APRENDIZAJE & CHEAT SHEET`,
      `============================================================`,
      `Curso: ${course.title}`,
      `Clase: ${lessonTitle}`,
      `============================================================`,
      ``,
      `1. OBJETIVOS DE LA CLASE:`,
      ...topics.map((t) => `   * Dominar y aplicar: ${t}`),
      ``,
      `2. CONCEPTOS Y CLAVES TÉCNICAS:`,
      ...topics.map((t, i) => `   ${i + 1}. ${t}:\n      ${getTopicConcept(t)}`),
      ``,
      `3. METODOLOGÍA PASO A PASO:`,
      `   Paso 1: Visualiza la demostración en el video de la lección.`,
      `   Paso 2: Descarga el 'Archivo de trabajo' para aplicar las técnicas.`,
      `   Paso 3: Desarrolla los ejercicios apoyándote en esta guía.`,
      `   Paso 4: Compara tu resultado final con la 'Solución resuelta'.`,
    ].join("\n");
  } else {
    content = [
      `DataM - SOLUCIÓN Y MODELO DE REFERENCIA FINAL`,
      `============================================================`,
      `Curso: ${course.title}`,
      `Clase: ${lessonTitle}`,
      `Estado: EJERCICIO COMPLETADO`,
      `============================================================`,
      ``,
      `DEMOSTRACIÓN DE RESULTADOS ESPERADOS:`,
      ...topics.map((t, i) => `[PASO RESUELTO ${i + 1}] ${t}\n   Resultado esperado: Implementación exitosa basada en ${getTopicConcept(t)}`),
      ``,
      `RECOMENDACIÓN DE AUTO-EVALUACIÓN:`,
      `Utiliza este archivo para contrastar tus resultados antes de avanzar a la siguiente clase.`,
    ].join("\n");
  }

  const blobUrl = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(blobUrl);
}

export default function CourseLessons({ course }: { course: Course }) {
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
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue-200">Metodología progresiva</p>
            <h3 className="mt-1 font-display text-lg font-bold leading-6 sm:text-xl sm:leading-tight">Aprende desde los fundamentos hasta el dominio profesional</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100 sm:leading-normal">Cada nivel combina explicación, demostración, práctica guiada y aplicación para consolidar tus habilidades.</p>
          </div>
          <div className="w-full border border-white/20 bg-white/10 p-4 text-center md:min-w-32 md:w-auto">
            <p className="font-mono text-2xl text-white">{courseProgress}%</p>
            <p className="mt-1 text-xs text-blue-100">{completedLessons} de {lessonIds.length} clases completadas</p>
          </div>
        </div>
        <div className="h-2 bg-blue-100"><div className="h-full bg-accent transition-all" style={{ width: `${courseProgress}%` }} /></div>
        <div className="p-4 sm:p-5">
          {!isEnrolled && <button onClick={enroll} className="w-full rounded-cell bg-accent px-4 py-3 text-base font-bold text-white transition-colors hover:bg-ink sm:w-auto sm:px-4 sm:py-2 sm:text-sm">Inscribirme y empezar</button>}
          {isEnrolled && <p className="text-sm font-medium text-green-700">Estás inscrito. Continúa con la siguiente clase de tu nivel.</p>}
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

                    const resources = lesson.resources && lesson.resources.length > 0
                      ? lesson.resources
                      : getDefaultResources(course.slug, lesson.title);

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

                        {isOpen && (
                          <div id={`lesson-content-${course.slug}-${moduleIndex}-${lessonIndex}`} className="border-t border-line bg-base px-3 py-5 sm:px-5">
                            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                              <div>
                                <div className="border-l-4 border-accent bg-blue-50 p-4">
                                  <div className="flex items-center gap-2"><Target className="h-4 w-4 text-accent" /><p className="data-cell-header">Paso 1 · Aprende</p></div>
                                  <p className="mt-2 text-base font-medium leading-6 text-ink">Al terminar podrás aplicar: {lesson.topics.join(", ")}.</p>
                                </div>
                                {lesson.videoUrl ? (
                                  <video controls preload="metadata" src={lesson.videoUrl} onEnded={() => markCompleted(lessonId)} aria-label={`Video de la clase ${lesson.title}`} className="mt-4 aspect-video w-full rounded-cell bg-ink" />
                                ) : (
                                  <div role="status" className="mt-4 flex aspect-video items-center justify-center rounded-cell bg-blue-950 px-4 text-center text-sm text-blue-100">El video de esta clase estará disponible próximamente.</div>
                                )}
                              </div>
                              <aside className="data-cell h-fit p-4 sm:p-5 lg:sticky lg:top-24">
                                <div className="flex items-center justify-between border-b border-line pb-3">
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-blue-700" />
                                    <p className="data-cell-header">Paso 2 · Materiales de trabajo</p>
                                  </div>
                                  <span className="rounded-full bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-800">
                                    {resources.length} archivos
                                  </span>
                                </div>
                                <p className="mt-2 text-xs leading-5 text-muted">
                                  Descarga tus materiales para realizar los ejercicios de esta clase y contrastar tu avance:
                                </p>
                                <div className="mt-3 space-y-3">
                                  {resources.map((res, i) => {
                                    const formatStyle = getFormatStyle(res.format);
                                    const categoryStyle = getCategoryStyle(res.category);
                                    const FormatIcon = formatStyle.icon;

                                    return (
                                      <div key={i} className="flex flex-col gap-2 rounded-cell border border-line bg-white p-3 text-xs shadow-2xs transition-colors hover:border-blue-300">
                                        <div className="flex items-center justify-between gap-2">
                                          <span className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase ${categoryStyle.badge}`}>
                                            {categoryStyle.label}
                                          </span>
                                          <span className="font-mono text-[10px] text-muted">{res.size || "Descarga libre"}</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${formatStyle.color}`}>
                                            <FormatIcon className="h-4 w-4" />
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className="font-bold leading-tight text-ink">{res.title}</p>
                                            <p className="mt-0.5 truncate text-[11px] text-muted">{res.description || `Formato ${res.format.toUpperCase()}`}</p>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDownloadResource(course, lesson.title, lesson.topics, res)}
                                          aria-label={`Descargar ${res.title}`}
                                          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-cell border border-blue-200 bg-blue-50 py-1.5 font-medium text-blue-700 transition-colors hover:bg-blue-600 hover:text-white"
                                        >
                                          <Download className="h-3.5 w-3.5" />
                                          <span>Descargar ({formatStyle.label})</span>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </aside>
                            </div>
                            <div className="mt-5 flex flex-col gap-4 border-t-4 border-blue-500 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:border-l-4 sm:border-t-0 sm:gap-3 sm:p-5">
                              <div><p className="font-display text-base font-bold text-ink">Paso 3 · Confirma tu avance</p><p className="mt-1 text-base leading-6 text-muted sm:text-sm sm:leading-normal">{isFinalLesson ? "Termina esta clase para pasar a la evaluación final." : "Marca la clase como completada cuando hayas revisado el video y la práctica."}</p></div>
                              <button disabled={!isEnrolled || isDone || isCompletionLocked} onClick={() => markCompleted(lessonId)} className="min-h-11 w-full shrink-0 rounded-cell bg-accent px-4 py-3 text-base font-bold text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted sm:w-auto sm:py-2 sm:text-sm">{isDone ? "Clase completada" : "Completar clase"}</button>
                            </div>
                            {isCompletionLocked && <p className="mt-2 text-xs text-muted">Puedes ver esta clase, pero debes completar la clase anterior antes de marcarla como terminada.</p>}
                            {!isEnrolled && <p className="mt-2 text-xs text-muted">Inscríbete en el curso para registrar tus clases completadas.</p>}
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
