"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import FlashcardDeck from "@/components/FlashcardDeck";
import type { Flashcard } from "@/lib/flashcards";

export default function TopicFlashcardsTab({ courseSlug, moduleIndex, lessonIndex }: { courseSlug: string; moduleIndex: number; lessonIndex: number }) {
  const [setId, setSetId] = useState<string | null>(null);
  const [cards, setCards] = useState<Flashcard[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void supabase
      .from("flashcard_sets")
      .select("id")
      .eq("course_slug", courseSlug)
      .eq("module_index", moduleIndex)
      .eq("lesson_index", lessonIndex)
      .eq("published", true)
      .maybeSingle()
      .then(async ({ data: setRow }) => {
        if (!setRow) {
          if (!cancelled) { setSetId(null); setCards([]); }
          return;
        }
        const { data: cardRows } = await supabase.from("flashcards").select("id, term, definition, sort_order").eq("set_id", setRow.id).order("sort_order");
        if (cancelled) return;
        setSetId(setRow.id);
        setCards(((cardRows ?? []) as { id: string; term: string; definition: string; sort_order: number }[]).map((row) => ({ id: row.id, term: row.term, definition: row.definition, sortOrder: row.sort_order })));
      });
    return () => { cancelled = true; };
  }, [courseSlug, moduleIndex, lessonIndex]);

  if (cards === null) return <p className="text-sm text-muted">Cargando flashcards...</p>;
  if (cards.length === 0) return <p className="text-sm text-muted">Este tema aún no tiene flashcards publicadas.</p>;
  return <FlashcardDeck setId={setId ?? ""} cards={cards} />;
}
