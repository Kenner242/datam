"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, Sparkles, X } from "lucide-react";
import type { Course } from "@/lib/courses";
import { buildStudySets, createInitialProgress, getDueCards, reviewCard, studySetStorageKey, type CardProgress, type StudyCard } from "@/lib/studySets";

export default function StudySetPanel({ course }: { course: Course }) {
  const sets = useMemo(() => buildStudySets(course), [course]);
  const [selectedSetId, setSelectedSetId] = useState(sets[0]?.id ?? "");
  const selectedSet = sets.find((set) => set.id === selectedSetId) ?? sets[0];
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [cardIndex, setCardIndex] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);

  const dueCards = selectedSet ? getDueCards(selectedSet.cards, progress) : [];
  const currentCard: StudyCard | undefined = dueCards[cardIndex % Math.max(dueCards.length, 1)];

  useEffect(() => {
    if (!selectedSet) return;
    try {
      const stored = window.localStorage.getItem(studySetStorageKey(selectedSet.id));
      setProgress(stored ? JSON.parse(stored) as Record<string, CardProgress> : {});
      setCardIndex(0);
      setIsFlipped(false);
    } catch {
      setProgress({});
    }
  }, [selectedSet]);

  function saveProgress(nextProgress: Record<string, CardProgress>) {
    setProgress(nextProgress);
    if (selectedSet) window.localStorage.setItem(studySetStorageKey(selectedSet.id), JSON.stringify(nextProgress));
  }

  function markCard(result: "know" | "review") {
    if (!currentCard) return;
    const nextProgress = { ...progress, [currentCard.id]: reviewCard(progress[currentCard.id] ?? createInitialProgress(), result) };
    saveProgress(nextProgress);
    setSessionXP((value) => value + (result === "know" ? 10 : 3));
    setCardIndex((value) => value + 1);
    setIsFlipped(false);
  }

  function resetSession() {
    setCardIndex(0);
    setSessionXP(0);
    setIsFlipped(false);
  }

  if (!selectedSet) return null;

  return (
    <section className="data-cell mt-8 p-5 sm:p-6" aria-labelledby="study-set-title">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="data-cell-header">Sets de estudio</p>
          <h2 id="study-set-title" className="mt-1 font-display text-2xl font-bold text-ink">Aprende haciendo</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Repasa cada tema con tarjetas generadas desde las lecciones del curso. Marca "Lo sé" o "Necesito repasar" para que el sistema priorice lo que aún estás aprendiendo.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-accent"><Sparkles className="h-4 w-4" /> +{sessionXP} XP</div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Sets del curso">
        {sets.map((set) => <button key={set.id} type="button" onClick={() => { setSelectedSetId(set.id); resetSession(); }} className={`shrink-0 rounded-cell border px-3 py-2 text-left text-sm ${set.id === selectedSet.id ? "border-accent bg-blue-50 text-accent" : "border-line bg-white text-muted"}`}>{set.lessonTitle}</button>)}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <button type="button" onClick={() => setIsFlipped((value) => !value)} className="flex min-h-64 w-full items-center justify-center rounded-cell border-2 border-accent bg-ink p-6 text-center text-white transition-transform hover:-translate-y-1" aria-label={isFlipped ? "Mostrar término" : "Mostrar definición"}>
            <span><span className="block text-xs uppercase tracking-[0.16em] text-blue-200">{isFlipped ? "Definición" : "Término"}</span><span className="mt-3 block font-display text-2xl font-bold">{currentCard ? (isFlipped ? currentCard.definition : currentCard.term) : "Set dominado"}</span></span>
          </button>
          <div className="mt-4 flex flex-wrap justify-between gap-2"><span className="text-xs text-muted">{dueCards.length ? `${Math.min(cardIndex + 1, dueCards.length)} de ${dueCards.length} pendientes` : "Todas las tarjetas están al día"}</span><button type="button" onClick={resetSession} className="inline-flex items-center gap-1 text-xs font-bold text-muted hover:text-accent"><RotateCcw className="h-3 w-3" /> Reiniciar sesión</button></div>
          {currentCard && <div className="mt-4 grid grid-cols-2 gap-3"><button type="button" onClick={() => markCard("review")} className="inline-flex items-center justify-center gap-2 rounded-cell border border-red-200 bg-red-50 px-3 py-3 text-sm font-bold text-red-700"><X className="h-4 w-4" /> Necesito repasar</button><button type="button" onClick={() => markCard("know")} className="inline-flex items-center justify-center gap-2 rounded-cell bg-emerald-600 px-3 py-3 text-sm font-bold text-white"><Check className="h-4 w-4" /> Lo sé</button></div>}
        </div>
        <aside className="border-l-4 border-accent2 bg-amber-50 p-4"><p className="data-cell-header">Cómo funciona</p><p className="mt-2 text-sm leading-6 text-amber-950">Las tarjetas difíciles vuelven pronto. Las que dominas pasan a intervalos más largos. Así estudias menos tiempo y recuerdas mejor.</p><p className="mt-4 text-xs text-amber-900">Set: {selectedSet.cards.length} tarjetas · sesión local disponible sin conexión</p></aside>
      </div>
    </section>
  );
}
