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
    {course.modules.map((module, moduleIndex) => <section key={module.title} className="data-cell overflow-hidden"><div className="border-b border-line bg-blue-50 px-5 py-4"><p className="font-mono text-xs uppercase tracking-[0.14em] text-blue-700">Módulo {String(moduleIndex + 1).padStart(2, "0")}</p><h3 className="mt-1 font-display text-xl font-bold text-ink">{module.title}</h3></div><div className="divide-y divide-line">{module.lessons.map((lesson, lessonIndex) => { const id = `${module.title}:${lesson.title}`; const isDone = watched.includes(id); return <article key={lesson.title} className="px-5 py-4"><h4 className="font-display font-bold text-ink">Clase {lessonIndex + 1}: {lesson.title}</h4>{lesson.videoUrl ? <video controls preload="metadata" src={lesson.videoUrl} onEnded={() => mark(id)} className="mt-4 aspect-video w-full rounded-cell bg-ink" /> : <div className="mt-4 flex aspect-video items-center justify-center rounded-cell bg-blue-950 text-sm text-blue-100">Video de esta clase próximamente</div>}<ul className="mt-3 grid gap-3 text-sm text-muted md:grid-cols-2">{lesson.topics.map((topic) => <li key={topic}><strong className="text-ink">{topic}:</strong> {getTopicConcept(topic)}</li>)}</ul><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => downloadMaterial(lesson.title, lesson.topics)} className="rounded-cell border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50">Descargar material</button>{lesson.videoUrl && <button disabled={isDone} onClick={() => mark(id)} className="rounded-cell border border-blue-300 px-4 py-2 text-sm text-blue-700 disabled:text-green-700">{isDone ? "Vista" : "Marcar clase como vista"}</button>}</div></article>; })}</div></section>)}
  </div>;
}
