"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, ShieldCheck, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { courses } from "@/lib/courses";
import ProgressBar from "@/components/ProgressBar";
import LearningMissionCard from "@/components/LearningMissionCard";
import Leaderboard from "@/components/Leaderboard";
import { getRecommendedMission } from "@/lib/learningMissions";
import { calculateStudentLevel } from "@/lib/gamification";
import { getCurrentUserSafely } from "@/lib/supabase/session";

type Enrollment = { course_slug: string };
type ProgressRow = { course_slug: string; lesson_id: string };
type BadgeRow = { course_slug: string; fecha: string; puntaje: number; habilidades: string[] };
type ActivityRow = { activity_date: string; lessons_completed: number };
type StreakRow = { current_streak: number; longest_streak: number };
type ProfilePrivacy = { leaderboard_opt_in: boolean; leaderboard_display_name: string | null };

export default function StudentDashboard() {
  const router = useRouter();
  const [name, setName] = useState("estudiante");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [badges, setBadges] = useState<BadgeRow[]>([]);
  const [lastActivity, setLastActivity] = useState<ActivityRow | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [streak, setStreak] = useState<StreakRow>({ current_streak: 0, longest_streak: 0 });
  const [trophyCount, setTrophyCount] = useState(0);
  const [achievementCount, setAchievementCount] = useState(0);
  const [privacy, setPrivacy] = useState<ProfilePrivacy>({ leaderboard_opt_in: false, leaderboard_display_name: null });
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const { user, error: authError } = await getCurrentUserSafely();
      if (!user) {
        if (authError) setError(authError);
        router.replace("/login?next=/dashboard");
        return;
      }
      setName(user.user_metadata.full_name || user.email || "estudiante");
      setUserId(user.id);
      const [enrollmentResult, progressResult, badgeResult, activityResult, xpResult, streakResult, trophyResult, achievementResult, profileResult] = await Promise.all([
        supabase.from("enrollments").select("course_slug").eq("user_id", user.id),
        supabase.from("progress").select("course_slug, lesson_id").eq("user_id", user.id),
        supabase.from("badges").select("course_slug, fecha, puntaje, habilidades").eq("user_id", user.id).order("fecha", { ascending: false }),
        supabase.from("learning_activity").select("activity_date, lessons_completed").eq("user_id", user.id).order("activity_date", { ascending: false }).limit(1),
        supabase.from("xp_events").select("xp_awarded").eq("user_id", user.id),
        supabase.from("streaks").select("current_streak, longest_streak").eq("user_id", user.id).maybeSingle(),
        supabase.from("trophies").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("achievements").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("profiles").select("leaderboard_opt_in, leaderboard_display_name").eq("id", user.id).maybeSingle(),
      ]);
      if (enrollmentResult.error) setError(enrollmentResult.error.message);
      if (progressResult.error) setError(progressResult.error.message);
      setEnrollments((enrollmentResult.data as Enrollment[] | null) ?? []);
      setProgressRows((progressResult.data as ProgressRow[] | null) ?? []);
      setBadges((badgeResult.data as BadgeRow[] | null) ?? []);
      setLastActivity((activityResult.data?.[0] as ActivityRow | undefined) ?? null);
      setTotalXp(((xpResult.data as { xp_awarded: number }[] | null) ?? []).reduce((sum, row) => sum + row.xp_awarded, 0));
      setStreak((streakResult.data as StreakRow | null) ?? { current_streak: 0, longest_streak: 0 });
      setTrophyCount(trophyResult.count ?? 0);
      setAchievementCount(achievementResult.count ?? 0);
      if (profileResult.data) setPrivacy(profileResult.data as ProfilePrivacy);
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
  const studentLevel = calculateStudentLevel(totalXp);
  const nextLevel = ["principiante", "intermedio", "avanzado", "experto"].indexOf(studentLevel.id) < 3
    ? ["principiante", "intermedio", "avanzado", "experto"][(["principiante", "intermedio", "avanzado", "experto"].indexOf(studentLevel.id) + 1)]
    : "experto";
  const nextLevelXp = studentLevel.id === "principiante" ? 100 : studentLevel.id === "intermedio" ? 300 : studentLevel.id === "avanzado" ? 700 : totalXp;
  const previousLevelXp = studentLevel.minXp;
  const levelProgress = nextLevelXp > previousLevelXp ? Math.min(100, Math.round(((totalXp - previousLevelXp) / (nextLevelXp - previousLevelXp)) * 100)) : 100;
  const activeCourse = enrolledCourses.find((course) => progressRows.filter((row) => row.course_slug === course.slug).length < course.modules.reduce((sum, module) => sum + module.lessons.length, 0)) ?? enrolledCourses[0];
  const activeCourseDone = activeCourse ? progressRows.filter((row) => row.course_slug === activeCourse.slug).length : 0;
  const activeCourseTotal = activeCourse?.modules.reduce((sum, module) => sum + module.lessons.length, 0) ?? 0;

  async function togglePrivacy(optIn: boolean) {
    if (!userId) return;
    setPrivacy((current) => ({ ...current, leaderboard_opt_in: optIn }));
    await supabase.from("profiles").update({ leaderboard_opt_in: optIn }).eq("id", userId);
  }

  async function saveDisplayName(displayName: string) {
    if (!userId) return;
    setPrivacy((current) => ({ ...current, leaderboard_display_name: displayName }));
    await supabase.from("profiles").update({ leaderboard_display_name: displayName || null }).eq("id", userId);
  }

  return <div className="dashboard-space">
    {error && <p role="alert" className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <div className="dashboard-hero">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="data-cell-header dashboard-hero-kicker">Experiencia del estudiante</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">Hola, {name}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">Continúa donde lo dejaste. Tu ruta combina contenido estructurado, práctica guiada y evidencia profesional.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-cell border border-blue-300/40 bg-white/10 px-3 py-2 text-xs font-bold text-white"><ShieldCheck className="h-4 w-4" /> Nivel {studentLevel.label}</span>
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="flex items-end justify-between gap-3"><span className="font-display text-4xl font-bold text-white">{totalXp.toLocaleString("es-PE")} <small className="text-sm font-medium text-blue-200">XP</small></span><span className="text-xs text-blue-200">{studentLevel.id === "experto" ? "Nivel máximo" : `${nextLevelXp - totalXp} XP para ${nextLevel}`}</span></div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-accent2 transition-all" style={{ width: `${levelProgress}%` }} /></div>
          <div className="mt-2 flex justify-between text-xs text-blue-200"><span>Progreso de nivel</span><span>{levelProgress}%</span></div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="dashboard-stat"><b>{streak.current_streak}</b><span>Racha</span></div>
          <div className="dashboard-stat"><b>{completedCourses}</b><span>Cursos</span></div>
          <div className="dashboard-stat"><b>{progressRows.length}</b><span>Temas</span></div>
        </div>
      </div>
    </div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="data-cell p-5 sm:p-6">
        <p className="data-cell-header">Próxima acción</p>
        <div className="mt-3 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-cell bg-blue-50 text-accent"><BookOpen className="h-5 w-5" /></span><div className="min-w-0"><h2 className="font-display text-lg font-bold text-ink">{activeCourse ? activeCourse.title : "Explora tu primera ruta"}</h2><p className="mt-1 text-sm text-muted">{activeCourse ? `${activeCourseDone} de ${activeCourseTotal} temas completados` : "Elige un curso para comenzar tu desarrollo profesional."}</p></div></div>
        {activeCourse && <ProgressBar label="Avance del curso activo" percent={activeCourseTotal ? Math.round((activeCourseDone / activeCourseTotal) * 100) : 0} />}
        <button type="button" onClick={() => router.push(activeCourse ? `/cursos/${activeCourse.slug}` : "/cursos")} className="mt-4 inline-flex items-center gap-2 rounded-cell bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-ink">{activeCourse ? "Continuar curso" : "Explorar cursos"}<ArrowRight className="h-4 w-4" /></button>
      </div>
      <div className="data-cell p-5 sm:p-6"><p className="data-cell-header">Prioridad de aprendizaje</p><dl className="mt-3 space-y-3 text-sm"><div><dt className="font-bold text-ink">Qué estás aprendiendo</dt><dd className="text-muted">{activeCourse?.title ?? "Aún no hay un curso activo"}</dd></div><div><dt className="font-bold text-ink">Qué debes hacer ahora</dt><dd className="text-muted">{nextMission.title}</dd></div></dl></div>
    </div>
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="data-cell-header">Resumen de tu ruta</span>
      <span className="text-xs text-muted">La motivación acompaña tu progreso; la evaluación final decide el certificado.</span>
    </div>
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      <div className="data-cell p-5"><p className="data-cell-header">Cursos inscritos</p><p className="mt-2 font-display text-2xl font-bold text-ink">{enrolledCourses.length}</p></div>
      <div className="data-cell p-5"><p className="data-cell-header">Cursos terminados</p><p className="mt-2 font-display text-2xl font-bold text-ink">{completedCourses}</p></div>
      <div className="data-cell p-5"><p className="data-cell-header">Clases completadas</p><p className="mt-2 font-display text-2xl font-bold text-ink">{progressRows.length}</p></div>
    </div>
    <div className="mt-6 grid gap-5 md:grid-cols-3">
      <div className="data-cell p-5"><p className="data-cell-header">Insignias verificadas</p><p className="mt-2 font-display text-2xl font-bold text-ink">{badges.length}</p>{badges.length > 0 && <p className="mt-2 text-sm text-muted">Última: {courses.find((course) => course.slug === badges[0].course_slug)?.title ?? badges[0].course_slug} · {badges[0].puntaje}/100</p>}</div>
      <div className="data-cell p-5"><p className="data-cell-header">Racha de días activos</p><p className="mt-2 font-display text-2xl font-bold text-ink">Racha: {streak.current_streak} días</p><p className="mt-1 text-xs text-muted">Mejor racha: {streak.longest_streak} días</p></div>
      <div className="data-cell p-5"><p className="data-cell-header flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5" /> Trofeos y logros</p><p className="mt-2 font-display text-2xl font-bold text-ink">{trophyCount} trofeos</p><p className="mt-1 text-xs text-muted">{achievementCount} logros por módulo</p></div>
    </div>
    <div className="mt-6"><div className="data-cell p-5"><p className="data-cell-header">Actividad</p><p className="mt-2 text-sm text-muted">{daysSinceActivity === null ? "Aún no registras actividad." : daysSinceActivity >= 7 ? "Llevas varios días sin estudiar. Retoma una clase para continuar." : "Tu actividad está al día."}</p></div></div>
    <section className="mt-6" aria-labelledby="next-mission-title">
      <p id="next-mission-title" className="data-cell-header mb-3">Tu próxima misión</p>
      <LearningMissionCard mission={nextMission} />
    </section>
    <div className="data-cell mt-6 p-6"><p className="data-cell-header mb-4">Mi progreso real</p>{enrolledCourses.length ? <div className="flex flex-col gap-5">{enrolledCourses.map((course) => { const total = course.modules.reduce((sum, module) => sum + module.lessons.length, 0); const done = progressRows.filter((row) => row.course_slug === course.slug).length; return <div key={course.slug}><div className="mb-2 flex items-center justify-between gap-3"><a href={`/cursos/${course.slug}`} className="font-display font-bold text-ink hover:text-accent">{course.title}</a><span className="font-mono text-xs text-muted">{done}/{total}</span></div><ProgressBar label="Avance del curso" percent={Math.min(100, Math.round((done / total) * 100))} /></div>; })}</div> : <div><p className="text-sm text-muted">Todavía no estás inscrito en ningún curso.</p><button onClick={() => router.push("/cursos")} className="mt-4 rounded-cell bg-blue-600 px-4 py-2 text-sm font-bold text-white">Explorar cursos</button></div>}</div>
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <div className="data-cell p-5">
        <p className="data-cell-header">Privacidad de la tabla de posiciones</p>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={privacy.leaderboard_opt_in} onChange={(event) => void togglePrivacy(event.target.checked)} /> Aparecer en la tabla de posiciones</label>
        {privacy.leaderboard_opt_in && <input value={privacy.leaderboard_display_name ?? ""} onChange={(event) => setPrivacy((current) => ({ ...current, leaderboard_display_name: event.target.value }))} onBlur={(event) => void saveDisplayName(event.target.value)} placeholder="Nombre a mostrar (o deja vacío para Anónimo)" className="mt-3 w-full rounded-cell border border-line p-2 text-sm" />}
      </div>
      <Leaderboard />
    </div>
  </div>;
}
