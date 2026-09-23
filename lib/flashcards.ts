import type { LessonContent } from "@/lib/courses";

export type FlashcardConfidence = "aprendiendo" | "dominado";
export type FlashcardDraft = { term: string; definition: string };
export type Flashcard = FlashcardDraft & { id: string; sortOrder: number };
export type FlashcardSet = { id: string; courseSlug: string; moduleIndex: number; lessonIndex: number; published: boolean; cards: Flashcard[] };
export type FlashcardProgress = { flashcardId: string; confidence: FlashcardConfidence; lastReviewedAt: string };

// Deriva un vocabulario inicial desde keyConcepts; un admin revisa y publica antes de mostrarlo a estudiantes.
export function draftFlashcardsFromLesson(content: LessonContent): FlashcardDraft[] {
  return content.keyConcepts.map((concept) => {
    const [term, ...rest] = concept.split(/:\s|\s-\s/);
    const definition = rest.join(": ").trim();
    return { term: term.trim(), definition: definition || concept.trim() };
  });
}

export function validateFlashcardDrafts(drafts: FlashcardDraft[]): string | null {
  if (drafts.length === 0) return "Agrega al menos un término.";
  const terms = new Set<string>();
  for (const draft of drafts) {
    if (!draft.term.trim() || !draft.definition.trim()) return "Cada tarjeta necesita término y definición.";
    const normalized = draft.term.trim().toLowerCase();
    if (terms.has(normalized)) return `El término "${draft.term}" está repetido en este set.`;
    terms.add(normalized);
  }
  return null;
}

export function pickNextLearnCard(cards: Flashcard[], progressByCard: Record<string, FlashcardProgress>): Flashcard | null {
  const learning = cards.filter((card) => (progressByCard[card.id]?.confidence ?? "aprendiendo") === "aprendiendo");
  const pool = learning.length > 0 ? learning : cards;
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
