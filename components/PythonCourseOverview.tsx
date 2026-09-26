"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Code2, LockKeyhole, Play, Target, Trophy } from "lucide-react";
import type { Course } from "@/lib/courses";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUserSafely } from "@/lib/supabase/session";

const STAGES = ["Fundamentos", "Decisiones", "Bucles", "Funciones", "Estructuras", "Proyecto"];

export default function PythonCourseOverview({ course }: { course: Course }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const lessonIds = useMemo(() => course.modules.flatMap((module) => module.lessons.map((lesson) => `${module.title}:${lesson.title}`)), [course.modules]);
  const progress = lessonIds.length ? Math.round((completed.length / lessonIds.length) * 100) : 0;
  const currentModule = course.modules.findIndex((module) => module.lessons.some((lesson) => !completed.includes(`${module.title}:${lesson.title}`)));

  useEffect(() => {
    void getCurrentUserSafely().then(async ({ user }) => {
      const id = user?.id ?? null;
      setUserId(id);
      if (!id) return;
      const { data: rows } = await supabase.from("progress").select("lesson_id").eq("user_id", id).eq("course_slug", course.slug);
      setCompleted((rows ?? []).map((row) => row.lesson_id));
    });
  }, [course.slug]);

  function openTopic(moduleIndex: number, lessonIndex = 0) {
    window.dispatchEvent(new CustomEvent("datam:open-topic", { detail: { moduleIndex, lessonIndex } }));
    document.getElementById("curso-aprendizaje")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return <section className="python-overview" aria-label="Ruta Python Básico">
    <div className="python-overview-hero"><div><p className="data-cell-header python-kicker">DataM AI · Python Básico</p><h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">Construye tu ruta profesional en Python</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">Aprende desde variables hasta un analizador de ventas. Cada etapa combina lectura, práctica, laboratorio, feedback y una evidencia que puedes explicar.</p></div><div className="python-progress-card"><span className="font-display text-3xl font-bold text-white">{progress}%</span><span>ruta completada</span><div className="python-progress-track"><i style={{ width: `${progress}%` }} /></div></div></div>
    <div className="python-stats"><div><Code2 /><b>{course.modules.length}</b><span>módulos</span></div><div><Target /><b>{lessonIds.length}</b><span>actividades</span></div><div><Trophy /><b>{course.modules.reduce((sum, module) => sum + module.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.durationMinutes ?? 6), 0), 0)}</b><span>minutos</span></div><div><BookOpen /><b>{userId ? "Activo" : "Invitado"}</b><span>progreso</span></div></div>
    <div className="python-route" role="list" aria-label="Etapas de la ruta Python">
      {course.modules.map((module, moduleIndex) => { const done = module.lessons.every((lesson) => completed.includes(`${module.title}:${lesson.title}`)); const unlocked = moduleIndex === 0 || course.modules[moduleIndex - 1].lessons.every((lesson) => completed.includes(`${course.modules[moduleIndex - 1].title}:${lesson.title}`)); const current = moduleIndex === currentModule; return <div key={module.title} className={`python-stage ${done ? "done" : ""} ${!unlocked ? "locked" : ""} ${current ? "current" : ""}`} role="listitem"><button type="button" disabled={!unlocked} onClick={() => openTopic(moduleIndex)}><span className="python-stage-number">{done ? <CheckCircle2 className="h-5 w-5" /> : !unlocked ? <LockKeyhole className="h-4 w-4" /> : String(moduleIndex + 1).padStart(2, "0")}</span><span className="python-stage-copy"><b>{STAGES[moduleIndex] ?? module.title}</b><small>{module.title} · {module.lessons.length} actividades</small></span><Play className="python-stage-play h-4 w-4" /></button></div>; })}
    </div>
    <div className="python-learning-flow"><span>Leer</span><i>→</i><span>Practicar</span><i>→</i><span>Explicar a Dax</span><i>→</i><span>Resolver laboratorio</span><i>→</i><span>Demostrar</span></div>
  </section>;
}
