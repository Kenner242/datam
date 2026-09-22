import Link from "next/link";
import type { LearningMission } from "@/lib/learningMissions";

const modeLabels = {
  diagnostico: "Diagnóstico",
  practica: "Práctica",
  simulacion: "Simulación laboral",
  refuerzo: "Refuerzo",
} as const;

export default function LearningMissionCard({ mission }: { mission: LearningMission }) {
  return (
    <article className="border-l-4 border-accent bg-ink p-5 text-white shadow-lg sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-blue-200">{modeLabels[mission.mode]} · +{mission.xp} XP</span>
        <span className="rounded-cell bg-white/10 px-2 py-1 text-xs text-blue-100">{mission.skill}</span>
      </div>
      <h2 className="mt-4 font-display text-2xl font-bold leading-tight">{mission.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">{mission.brief}</p>
      <div className="mt-5 border-l-2 border-accent2 pl-3 text-sm text-blue-100">
        <span className="font-bold text-white">Primera pista:</span> {mission.firstStep}
      </div>
      <Link href={`/cursos/${mission.courseSlug}`} className="mt-5 inline-flex rounded-cell bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-accent2">
        Comenzar misión
      </Link>
    </article>
  );
}
