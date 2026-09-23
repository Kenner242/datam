"use client";

import { useEffect, useMemo, useState } from "react";
import { Shuffle, Star, Timer } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { pickNextLearnCard, shuffle, type Flashcard, type FlashcardConfidence, type FlashcardProgress } from "@/lib/flashcards";

type DeckMode = "flashcards" | "learn" | "match";

export default function FlashcardDeck({ setId, cards }: { setId: string; cards: Flashcard[] }) {
  const [mode, setMode] = useState<DeckMode>("flashcards");
  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, FlashcardProgress>>({});
  const [order, setOrder] = useState<Flashcard[]>(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [marked, setMarked] = useState<Set<string>>(new Set());

  useEffect(() => setOrder(cards), [cards]);

  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data }) => {
      const id = data.user?.id ?? null;
      setUserId(id);
      if (!id) return;
      const { data: rows } = await supabase.from("flashcard_progress").select("flashcard_id, confidence, last_reviewed_at").in("flashcard_id", cards.map((card) => card.id));
      const map: Record<string, FlashcardProgress> = {};
      (rows ?? []).forEach((row) => { map[row.flashcard_id] = { flashcardId: row.flashcard_id, confidence: row.confidence as FlashcardConfidence, lastReviewedAt: row.last_reviewed_at }; });
      setProgress(map);
    });
  }, [cards]);

  async function setConfidence(cardId: string, confidence: FlashcardConfidence) {
    setProgress((current) => ({ ...current, [cardId]: { flashcardId: cardId, confidence, lastReviewedAt: new Date().toISOString() } }));
    if (!userId) return;
    await supabase.from("flashcard_progress").upsert({ user_id: userId, flashcard_id: cardId, confidence, last_reviewed_at: new Date().toISOString() }, { onConflict: "user_id,flashcard_id" });
  }

  function toggleMark(cardId: string) {
    setMarked((current) => { const next = new Set(current); if (next.has(cardId)) next.delete(cardId); else next.add(cardId); return next; });
  }

  const current = order[index];
  const learnCard = useMemo(() => (mode === "learn" ? pickNextLearnCard(cards, progress) : null), [mode, cards, progress, index]);

  if (cards.length === 0) return <p className="text-sm text-muted">Este tema aún no tiene flashcards publicadas.</p>;

  return (
    <div>
      <div className="flex gap-2" role="tablist" aria-label="Modo de estudio">
        {([
          { id: "flashcards", label: "Flashcards" },
          { id: "learn", label: "Learn" },
          { id: "match", label: "Match" },
        ] as const).map((option) => (
          <button key={option.id} type="button" role="tab" aria-selected={mode === option.id} onClick={() => { setMode(option.id); setIndex(0); setFlipped(false); }} className={`rounded-cell px-3 py-2 text-sm font-medium ${mode === option.id ? "bg-accent text-white" : "border border-line text-ink"}`}>{option.label}</button>
        ))}
      </div>

      {mode === "flashcards" && current && (
        <div className="mt-4">
          <div className="[perspective:1200px]">
            <button
              type="button"
              onClick={() => setFlipped((value) => !value)}
              aria-label={flipped ? "Ver término" : "Ver definición"}
              className="relative h-56 w-full [transform-style:preserve-3d] transition-transform duration-500"
              style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              <span className="absolute inset-0 flex items-center justify-center rounded-cell border border-line bg-white p-6 text-center font-display text-xl font-bold text-ink [backface-visibility:hidden]">{current.term}</span>
              <span className="absolute inset-0 flex items-center justify-center rounded-cell border border-accent bg-blue-50 p-6 text-center text-base leading-6 text-ink [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>{current.definition}</span>
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={() => { setOrder(shuffle(order)); setIndex(0); setFlipped(false); }} className="flex items-center gap-1 rounded-cell border border-line px-3 py-2 text-sm text-ink"><Shuffle className="h-4 w-4" /> Barajar</button>
            <button type="button" onClick={() => toggleMark(current.id)} className={`flex items-center gap-1 rounded-cell border px-3 py-2 text-sm ${marked.has(current.id) ? "border-amber-500 bg-amber-50 text-amber-800" : "border-line text-ink"}`}><Star className="h-4 w-4" /> Marcar para repasar</button>
            <div className="flex gap-2">
              <button type="button" disabled={index === 0} onClick={() => { setIndex((value) => value - 1); setFlipped(false); }} className="rounded-cell border border-line px-3 py-2 text-sm text-ink disabled:opacity-40">Anterior</button>
              <button type="button" disabled={index === order.length - 1} onClick={() => { setIndex((value) => value + 1); setFlipped(false); }} className="rounded-cell bg-ink px-3 py-2 text-sm font-bold text-white disabled:opacity-40">Siguiente</button>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">{index + 1} de {order.length}{marked.size > 0 ? ` · ${marked.size} marcadas para repasar` : ""}</p>
        </div>
      )}

      {mode === "learn" && (
        <LearnMode card={learnCard} progress={progress} onAnswer={(cardId, confidence) => { void setConfidence(cardId, confidence); setIndex((value) => value + 1); }} />
      )}

      {mode === "match" && <MatchMode setId={setId} cards={cards} userId={userId} />}
    </div>
  );
}

function LearnMode({ card, progress, onAnswer }: { card: Flashcard | null; progress: Record<string, FlashcardProgress>; onAnswer: (cardId: string, confidence: FlashcardConfidence) => void }) {
  const [flipped, setFlipped] = useState(false);
  if (!card) return <p className="mt-4 text-sm text-muted">No hay tarjetas disponibles.</p>;
  const dominadas = Object.values(progress).filter((entry) => entry.confidence === "dominado").length;
  return (
    <div className="mt-4">
      <p className="text-xs text-muted">{dominadas} términos dominados</p>
      <button type="button" onClick={() => setFlipped((value) => !value)} className="mt-3 flex min-h-40 w-full flex-col items-center justify-center rounded-cell border border-line bg-white p-6 text-center">
        <span className="font-display text-lg font-bold text-ink">{card.term}</span>
        {flipped && <span className="mt-3 text-sm leading-6 text-muted">{card.definition}</span>}
      </button>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => { onAnswer(card.id, "aprendiendo"); setFlipped(false); }} className="flex-1 rounded-cell border border-amber-500 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">Aún aprendiendo</button>
        <button type="button" onClick={() => { onAnswer(card.id, "dominado"); setFlipped(false); }} className="flex-1 rounded-cell border border-green-600 bg-green-50 px-3 py-2 text-sm font-bold text-green-800">Lo domino</button>
      </div>
    </div>
  );
}

type MatchTile = { key: string; cardId: string; text: string; kind: "term" | "definition"; matched: boolean };

function MatchMode({ setId, cards, userId }: { setId: string; cards: Flashcard[]; userId: string | null }) {
  const pairCount = Math.min(8, Math.max(6, cards.length));
  const [tiles, setTiles] = useState<MatchTile[]>([]);
  const [selected, setSelected] = useState<MatchTile | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [bestTimeMs, setBestTimeMs] = useState<number | null>(null);
  const [finishedMs, setFinishedMs] = useState<number | null>(null);

  useEffect(() => {
    const subset = shuffle(cards).slice(0, pairCount);
    const nextTiles = shuffle(subset.flatMap((card) => [
      { key: `${card.id}-term`, cardId: card.id, text: card.term, kind: "term" as const, matched: false },
      { key: `${card.id}-def`, cardId: card.id, text: card.definition, kind: "definition" as const, matched: false },
    ]));
    setTiles(nextTiles);
    setSelected(null);
    setStartedAt(Date.now());
    setFinishedMs(null);
  }, [cards, pairCount]);

  useEffect(() => {
    if (!userId) return;
    void supabase.from("flashcard_match_scores").select("best_time_ms").eq("user_id", userId).eq("set_id", setId).maybeSingle().then(({ data }) => setBestTimeMs(data?.best_time_ms ?? null));
  }, [setId, userId]);

  async function handleTileClick(tile: MatchTile) {
    if (tile.matched || tile.key === selected?.key || finishedMs !== null) return;
    if (!selected) {
      setSelected(tile);
      return;
    }
    if (selected.cardId === tile.cardId && selected.kind !== tile.kind) {
      const nextTiles = tiles.map((item) => (item.cardId === tile.cardId ? { ...item, matched: true } : item));
      setTiles(nextTiles);
      setSelected(null);
      if (nextTiles.every((item) => item.matched) && startedAt) {
        const elapsed = Date.now() - startedAt;
        setFinishedMs(elapsed);
        if (userId && (bestTimeMs === null || elapsed < bestTimeMs)) {
          setBestTimeMs(elapsed);
          await supabase.from("flashcard_match_scores").upsert({ user_id: userId, set_id: setId, best_time_ms: elapsed }, { onConflict: "user_id,set_id" });
        }
      }
    } else {
      setSelected(null);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="flex items-center gap-1"><Timer className="h-3.5 w-3.5" /> {finishedMs !== null ? `Terminado en ${(finishedMs / 1000).toFixed(1)}s` : "En curso"}</span>
        {bestTimeMs !== null && <span>Mejor tiempo: {(bestTimeMs / 1000).toFixed(1)}s</span>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tiles.map((tile) => (
          <button
            key={tile.key}
            type="button"
            disabled={tile.matched}
            onClick={() => void handleTileClick(tile)}
            className={`min-h-16 rounded-cell border p-2 text-xs leading-5 transition-colors ${tile.matched ? "border-green-600 bg-green-50 text-green-800 opacity-60" : selected?.key === tile.key ? "border-accent bg-blue-50 text-ink" : "border-line bg-white text-ink"}`}
          >
            {tile.text}
          </button>
        ))}
      </div>
    </div>
  );
}
