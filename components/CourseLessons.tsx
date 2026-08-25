"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Course } from "@/lib/courses";
import { getTopicConcept } from "@/lib/topicConcepts";

export default function CourseLessons({ course }: { course: Course }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [watched, setWatched] = useState<string[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [message, setMessage] = useState("");
  const ids = useMemo(() => course.modules.flatMap((m) => m.lessons.map((l) => `${m.title}:${l.title}`)), [course.modules]);
  const key = userId ? `datam-progress:${userId}:${course.slug}` : "";
  const done = watched.filter((id) => ids.includes(id)).length;
  const complete = ids.length > 0 && done === ids.length;

  useEffect(() => { void supabase.auth.getUser().then(async ({ data }) => { if (!data.user) { router.replace(`/login?next=/cursos/${course.slug}`); return; } setUserId(data.user.id); const { data: enrollment } = await supabase.from("enrollments").select("id").eq("user_id", data.user.id).eq("course_slug", course.slug).maybeSingle(); setIsEnrolled(Boolean(enrollment)); }); }, [course.slug, router]);
  useEffect(() => { if (!key) return; const saved = window.localStorage.getItem(key); if (saved) { try { setWatched(JSON.parse(saved) as string[]); } catch { window.localStorage.removeItem(key); } } }, [key]);

  async function enroll() { if (!userId) return; const { error } = await supabase.from("enrollments").upsert({ user_id: userId, course_slug: course.slug }, { onConflict: "user_id,course_slug" }); if (error) setMessage(error.message); else { setIsEnrolled(true); setMessage("Te has inscrito correctamente en este curso."); } }
  async function mark(id: string) { if (!key || watched.includes(id) || !userId || !isEnrolled) return; const next = [...watched, id]; setWatched(next); window.localStorage.setItem(key, JSON.stringify(next)); await supabase.from("progress").upsert({ user_id: userId, course_slug: course.slug, lesson_id: id }, { onConflict: "user_id,course_slug,lesson_id" }); }
  function downloadMaterial(lessonTitle: string, topics: string[]) {
    const content = [
      `DataM - Material de práctica`,
      `Curso: ${course.title}`,
      `Clase: ${lessonTitle}`,
      "",
      "Objetivo: practicar los conceptos de esta clase en un caso profesional.",
      "",
      "Temas y conceptos:",
      ...topics.map((topic) => `- ${topic}: ${getTopicConcept(topic)}`),
      "",
      "Actividad sugerida:",
      "1. Crea un ejemplo con datos de un negocio o proyecto real.",
      "2. Aplica el concepto y documenta los pasos.",
      "3. Revisa el resultado y escribe una conclusión.",
    ].join("\n");
    const blobUrl = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${course.slug}-${lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-material.txt`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }
  if (!userId) return <p className="mt-8 text-sm text-muted">Verificando tu acceso...</p>;

  return <div className="mt-8 flex flex-col gap-4">
    <div className="border border-blue-200 bg-blue-50 p-5"><div className="flex justify-between"><b className="font-display text-ink">Tu progreso</b><span className="font-mono text-blue-700">{Math.round(done / ids.length * 100)}%</span></div><div className="mt-3 h-2 bg-blue-100"><div className="h-full bg-blue-600" style={{ width: `${done / ids.length * 100}%` }} /></div><p className="mt-2 text-xs text-muted">{done} de {ids.length} clases completadas</p>{!isEnrolled && <button onClick={enroll} className="mt-4 rounded-cell bg-blue-600 px-4 py-2 text-sm font-bold text-white">Inscribirme en este curso</button>}{isEnrolled && <p className="mt-3 text-sm font-medium text-green-700">Curso inscrito</p>}{complete && <button onClick={() => router.push(`/certificado/${course.slug}`)} className="mt-4 rounded-cell bg-blue-600 px-4 py-2 text-sm font-bold text-white">Descargar certificado PDF</button>}{message && <p role="status" className="mt-3 text-sm text-blue-800">{message}</p>}</div>
    {course.modules.map((module, moduleIndex) => <section key={module.title} className="data-cell overflow-hidden"><div className="border-b border-line bg-blue-50 px-5 py-4"><p className="font-mono text-xs uppercase tracking-[0.14em] text-blue-700">Módulo {String(moduleIndex + 1).padStart(2, "0")}</p><h3 className="mt-1 font-display text-xl font-bold text-ink">{module.title}</h3></div><div className="divide-y divide-line">{module.lessons.map((lesson, lessonIndex) => { const id = `${module.title}:${lesson.title}`; const isDone = watched.includes(id); const milestone = moduleIndex === course.modules.length - 1 && lessonIndex === module.lessons.length - 1 ? "Proyecto final listo para tu portafolio" : `Avance ${moduleIndex + 1}.${lessonIndex + 1} de tu proyecto`; return <article key={lesson.title} className="px-5 py-5"><div className="flex flex-wrap items-baseline justify-between gap-2"><h4 className="font-display text-lg font-bold text-ink">Clase {lessonIndex + 1}: {lesson.title}</h4><span className="font-mono text-xs text-blue-700">10-20 min</span></div><section className="mt-4 border-l-4 border-accent bg-blue-50 p-4"><p className="data-cell-header">Misión de aprendizaje</p><p className="mt-1 text-sm font-medium text-ink">Aprende y aplica: {lesson.topics.join(", ")}.</p><p className="mt-2 text-sm text-muted">Esta clase construye una parte de tu proyecto de {course.title}.</p></section>{lesson.videoUrl ? <video controls preload="metadata" src={lesson.videoUrl} onEnded={() => mark(id)} className="mt-5 aspect-video w-full rounded-cell bg-ink" /> : <div className="mt-5 flex aspect-video items-center justify-center rounded-cell bg-blue-950 px-4 text-center text-sm text-blue-100">El video de esta clase estará disponible próximamente.</div>}<section className="mt-5"><p className="data-cell-header">Conceptos clave</p><ul className="mt-3 grid gap-3 text-sm text-muted md:grid-cols-2">{lesson.topics.map((topic) => <li key={topic}><strong className="text-ink">{topic}:</strong> {getTopicConcept(topic)}</li>)}</ul></section><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => downloadMaterial(lesson.title, lesson.topics)} className="rounded-cell border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50">Descargar material de práctica</button></div><section className="mt-5 border border-line bg-panel p-4"><p className="data-cell-header">Reto de 10 minutos</p><h5 className="mt-1 font-display font-bold text-ink">Resuelve un caso usando {lesson.topics[0]}</h5><p className="mt-2 text-sm text-muted">Abre el material descargado, aplica los conceptos de la clase y comprueba que tu resultado responda a una necesidad real de un negocio o proyecto.</p><details className="mt-4 border-t border-line pt-3"><summary className="cursor-pointer text-sm font-medium text-blue-700">Necesito una pista</summary><p className="mt-2 text-sm text-muted">Empieza por identificar los datos de entrada, el resultado que necesitas y el concepto que te permite conectarlos.</p></details><details className="mt-3 border-t border-line pt-3"><summary className="cursor-pointer text-sm font-medium text-blue-700">Ver solución guiada</summary><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted"><li>Abre el archivo de práctica y revisa sus columnas o secciones.</li><li>Aplica {lesson.topics.slice(0, 2).join(" y ")} siguiendo el video.</li><li>Revisa el resultado y compáralo con el objetivo de la misión.</li></ol></details></section><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-l-4 border-blue-500 bg-blue-50 p-4"><div><p className="font-display text-sm font-bold text-ink">Hito del proyecto</p><p className="mt-1 text-sm text-muted">{milestone}</p></div><button disabled={!isEnrolled || isDone} onClick={() => mark(id)} className="rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted">{isDone ? "Clase completada" : "Completar y continuar"}</button></div>{!isEnrolled && <p className="mt-2 text-xs text-muted">Inscríbete en el curso para registrar el avance de tu proyecto.</p>}</article>; })}</div></section>)}
  </div>;
}
