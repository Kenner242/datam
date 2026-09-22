"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { courses } from "@/lib/courses";
import ProgressBar from "@/components/ProgressBar";
import LearningMissionCard from "@/components/LearningMissionCard";
import { getRecommendedMission } from "@/lib/learningMissions";

type Enrollment = { course_slug: string };
type ProgressRow = { course_slug: string; lesson_id: string };
type BadgeRow = { course_slug: string; fecha: string; puntaje: number; habilidades: string[] };
type ActivityRow = { activity_date: string; lessons_completed: number };

export default function StudentDashboard() {
  const router = useRouter();
  const [name, setName] = useState("estudiante");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [badges, setBadges] = useState<BadgeRow[]>([]);
  const [lastActivity, setLastActivity] = useState<ActivityRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace("/login?next=/dashboard");
        return;
      }
      setName(auth.user.user_metadata.full_name || auth.user.email || "estudiante");
      const [enrollmentResult, progressResult, badgeResult, activityResult] = await Promise.all([
        supabase.from("enrollments").select("course_slug").eq("user_id", auth.user.id),
        supabase.from("progress").select("course_slug, lesson_id").eq("user_id", auth.user.id),
        supabase.from("badges").select("course_slug, fecha, puntaje, habilidades").eq("user_id", auth.user.id).order("fecha", { ascending: false }),
        supabase.from("learning_activity").select("activity_date, lessons_completed").eq("user_id", auth.user.id).order("activity_date", { ascending: false }).limit(1),
      ]);
      if (enrollmentResult.error) setError(enrollmentResult.error.message);
      if (progressResult.error) setError(progressResult.error.message);
      setEnrollments((enrollmentResult.data as Enrollment[] | null) ?? []);
      setProgressRows((progressResult.data as ProgressRow[] | null) ?? []);
      setBadges((badgeResult.data as BadgeRow[] | null) ?? []);
      setLastActivity((activityResult.data?.[0] as ActivityRow | undefined) ?? null);
      setIsLoading(false);
    }
    void loadDashboard();
  }, [router]);

  if (isLoading) return <p className="mt-8 text-sm text-muted">Cargando tu progreso...</p>;

  const enrolledCourses = enrollments.map(({ course_slug }) => courses.find((course) => course.slug === course_slug)).filter((course) => course !== undefined);
  const completedCourses = enrolledCourses.filter((course) => {
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = progressRows.filter((row) => row.course_slug === course.slug).length;
    return totalLessons > 0 && completedLessons >= totalLessons;
  }).length;
  const daysSinceActivity = lastActivity ? Math.floor((Date.now() - new Date(`${lastActivity.activity_date}T00:00:00`).getTime()) / 86400000) : null;
  const nextMission = getRecommendedMission(courses, progressRows.length);

  return <>
    {error && <p role="alert" className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <h1 className="mt-2 font-display text-2xl font-bold text-ink">Hola, {name}</h1>
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      <div className="data-cell p-5"><p className="data-cell-header">Cursos inscritos</p><p className="mt-2 font-display text-2xl font-bold text-ink">{enrolledCourses.length}</p></div>
      <div className="data-cell p-5"><p className="data-cell-header">Cursos terminados</p><p className="mt-2 font-display text-2xl font-bold text-ink">{completedCourses}</p></div>
      <div className="data-cell p-5"><p className="data-cell-header">Clases completadas</p><p className="mt-2 font-display text-2xl font-bold text-ink">{progressRows.length}</p></div>
    </div>
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <div className="data-cell p-5"><p className="data-cell-header">Insignias verificadas</p><p className="mt-2 font-display text-2xl font-bold text-ink">{badges.length}</p>{badges.length > 0 && <p className="mt-2 text-sm text-muted">Última: {courses.find((course) => course.slug === badges[0].course_slug)?.title ?? badges[0].course_slug} · {badges[0].puntaje}/100</p>}</div>
      <div className="data-cell p-5"><p className="data-cell-header">Actividad</p><p className="mt-2 text-sm text-muted">{daysSinceActivity === null ? "Aún no registras actividad." : daysSinceActivity >= 7 ? "Llevas varios días sin estudiar. Retoma una clase para continuar." : "Tu actividad está al día."}</p></div>
    </div>
    <section className="mt-6" aria-labelledby="next-mission-title">
      <p id="next-mission-title" className="data-cell-header mb-3">Tu próxima misión</p>
      <LearningMissionCard mission={nextMission} />
    </section>
    <div className="data-cell mt-6 p-6"><p className="data-cell-header mb-4">Mi progreso real</p>{enrolledCourses.length ? <div className="flex flex-col gap-5">{enrolledCourses.map((course) => { const total = course.modules.reduce((sum, module) => sum + module.lessons.length, 0); const done = progressRows.filter((row) => row.course_slug === course.slug).length; return <div key={course.slug}><div className="mb-2 flex items-center justify-between gap-3"><a href={`/cursos/${course.slug}`} className="font-display font-bold text-ink hover:text-accent">{course.title}</a><span className="font-mono text-xs text-muted">{done}/{total}</span></div><ProgressBar label="Avance del curso" percent={Math.min(100, Math.round((done / total) * 100))} /></div>; })}</div> : <div><p className="text-sm text-muted">Todavía no estás inscrito en ningún curso.</p><button onClick={() => router.push("/cursos")} className="mt-4 rounded-cell bg-blue-600 px-4 py-2 text-sm font-bold text-white">Explorar cursos</button></div>}</div>
  </>;
}
