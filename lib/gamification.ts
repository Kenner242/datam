import type { BloomLevel } from "@/lib/courses";
import { supabase } from "@/lib/supabase/client";

export type StudentLevelId = "principiante" | "intermedio" | "avanzado" | "experto";
export type StudentLevel = { id: StudentLevelId; label: string; minXp: number };

// XP premia el pensamiento de orden superior, no solo completar clases.
const BLOOM_XP: Record<BloomLevel, number> = {
  recordar: 10,
  comprender: 10,
  aplicar: 20,
  analizar: 20,
  evaluar: 30,
  crear: 30,
};

export function xpForBloomLevel(bloomLevel?: BloomLevel): number {
  return bloomLevel ? BLOOM_XP[bloomLevel] : 10;
}

// Umbrales inspirados en el modelo de niveles de Microsoft Learn (XP acumulado en toda la plataforma).
export const STUDENT_LEVELS: StudentLevel[] = [
  { id: "principiante", label: "Principiante", minXp: 0 },
  { id: "intermedio", label: "Intermedio", minXp: 100 },
  { id: "avanzado", label: "Avanzado", minXp: 300 },
  { id: "experto", label: "Experto", minXp: 700 },
];

export function calculateStudentLevel(totalXp: number): StudentLevel {
  return [...STUDENT_LEVELS].reverse().find((level) => totalXp >= level.minXp) ?? STUDENT_LEVELS[0];
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((new Date(`${toIso}T00:00:00`).getTime() - new Date(`${fromIso}T00:00:00`).getTime()) / 86_400_000);
}

// Función pura y testeable: calcula la racha a partir del último día activo.
export function computeStreak(lastActiveDate: string | null, currentStreak: number, longestStreak: number, today = todayIso()): { currentStreak: number; longestStreak: number; lastActiveDate: string } {
  if (lastActiveDate === today) return { currentStreak, longestStreak, lastActiveDate: today };
  const gap = lastActiveDate ? daysBetween(lastActiveDate, today) : null;
  const nextCurrent = gap === 1 ? currentStreak + 1 : 1;
  return { currentStreak: nextCurrent, longestStreak: Math.max(longestStreak, nextCurrent), lastActiveDate: today };
}

type StreakRow = { current_streak: number; longest_streak: number; last_active_date: string | null };

// Se dispara junto con el registro de progreso; nunca decide aprobación ni certificado.
export async function awardXp(userId: string, courseSlug: string, lessonId: string, bloomLevel?: BloomLevel, exactAmount?: number) {
  const xpAwarded = exactAmount ?? xpForBloomLevel(bloomLevel);
  await supabase.from("xp_events").insert({ user_id: userId, course_slug: courseSlug, lesson_id: lessonId, xp_awarded: xpAwarded, bloom_level: bloomLevel ?? null });

  const { data: streakRow } = await supabase.from("streaks").select("current_streak, longest_streak, last_active_date").eq("user_id", userId).maybeSingle();
  const row = streakRow as StreakRow | null;
  const next = computeStreak(row?.last_active_date ?? null, row?.current_streak ?? 0, row?.longest_streak ?? 0);
  await supabase.from("streaks").upsert({ user_id: userId, current_streak: next.currentStreak, longest_streak: next.longestStreak, last_active_date: next.lastActiveDate }, { onConflict: "user_id" });

  return xpAwarded;
}

// Logro por módulo completo; separado de "badges" (certificado de curso) y de "trophies" (examen final).
export async function registerModuleAchievement(userId: string, courseSlug: string, moduleIndex: number) {
  await supabase.from("achievements").upsert({ user_id: userId, course_slug: courseSlug, module_index: moduleIndex }, { onConflict: "user_id,course_slug,module_index" });
}

// TODO(radar-empleabilidad): exponer nivel y trofeos del estudiante a un futuro módulo de empleabilidad, solo con consentimiento.
export async function registerCourseTrophy(userId: string, courseSlug: string) {
  await supabase.from("trophies").upsert({ user_id: userId, course_slug: courseSlug }, { onConflict: "user_id,course_slug" });
}
