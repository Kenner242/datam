"use client";

import { useEffect, useState } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { courses } from "@/lib/courses";
import { draftFlashcardsFromLesson, validateFlashcardDrafts, type Flashcard, type FlashcardDraft } from "@/lib/flashcards";
import FlashcardDeck from "@/components/FlashcardDeck";

export default function FlashcardSetForm() {
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug ?? "");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [setId, setSetId] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [drafts, setDrafts] = useState<FlashcardDraft[]>([]);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const course = courses.find((item) => item.slug === courseSlug) ?? courses[0];
  const module = course?.modules[moduleIndex];
  const lesson = module?.lessons[lessonIndex];

  async function loadSet() {
    setMessage("");
    setShowPreview(false);
    const { data: setRow } = await supabase.from("flashcard_sets").select("id, published").eq("course_slug", courseSlug).eq("module_index", moduleIndex).eq("lesson_index", lessonIndex).maybeSingle();
    if (!setRow) {
      setSetId(null);
      setPublished(false);
      setDrafts(lesson?.content ? draftFlashcardsFromLesson(lesson.content) : []);
      return;
    }
    setSetId(setRow.id);
    setPublished(setRow.published);
    const { data: cardRows } = await supabase.from("flashcards").select("id, term, definition, sort_order").eq("set_id", setRow.id).order("sort_order");
    setDrafts(((cardRows as Flashcard[] | null) ?? []).map((card) => ({ term: card.term, definition: card.definition })));
  }

  useEffect(() => { void loadSet(); }, [courseSlug, moduleIndex, lessonIndex]);

  function updateDraft(index: number, patch: Partial<FlashcardDraft>) {
    setDrafts((current) => current.map((draft, i) => (i === index ? { ...draft, ...patch } : draft)));
  }

  function removeDraft(index: number) {
    setDrafts((current) => current.filter((_, i) => i !== index));
  }

  function addDraft() {
    setDrafts((current) => [...current, { term: "", definition: "" }]);
  }

  function reorder(from: number, to: number) {
    setDrafts((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  async function saveSet(nextPublished: boolean) {
    const error = validateFlashcardDrafts(drafts);
    if (error) {
      setMessage(error);
      return;
    }
    let currentSetId = setId;
    if (!currentSetId) {
      const { data, error: insertError } = await supabase.from("flashcard_sets").insert({ course_slug: courseSlug, module_index: moduleIndex, lesson_index: lessonIndex, published: nextPublished }).select("id").single();
      if (insertError || !data) {
        setMessage(insertError?.message ?? "No se pudo crear el set.");
        return;
      }
      currentSetId = data.id;
      setSetId(currentSetId);
    } else {
      await supabase.from("flashcard_sets").update({ published: nextPublished }).eq("id", currentSetId);
    }
    await supabase.from("flashcards").delete().eq("set_id", currentSetId);
    const { error: cardsError } = await supabase.from("flashcards").insert(drafts.map((draft, index) => ({ set_id: currentSetId, term: draft.term.trim(), definition: draft.definition.trim(), sort_order: index })));
    setPublished(nextPublished);
    setMessage(cardsError ? cardsError.message : nextPublished ? "Set publicado. Los estudiantes ya pueden verlo." : "Borrador guardado. Aún no es visible para estudiantes.");
    // TODO(retos-reales): enlazar vocabulario del set a un reto real de una empresa cuando exista ese módulo.
  }

  const previewCards: Flashcard[] = drafts.map((draft, index) => ({ id: `preview-${index}`, sortOrder: index, ...draft }));

  return (
    <section className="data-cell mt-6 p-6">
      <div><span className="data-cell-header">Content Studio</span><h2 className="mt-1 font-display text-2xl font-bold text-ink">Flashcards por tema</h2></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <select value={courseSlug} onChange={(event) => { setCourseSlug(event.target.value); setModuleIndex(0); setLessonIndex(0); }} className="rounded-cell border border-line p-2 text-sm">{courses.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select>
        <select value={moduleIndex} onChange={(event) => { setModuleIndex(Number(event.target.value)); setLessonIndex(0); }} className="rounded-cell border border-line p-2 text-sm">{course?.modules.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}</select>
        <select value={lessonIndex} onChange={(event) => setLessonIndex(Number(event.target.value))} className="rounded-cell border border-line p-2 text-sm">{module?.lessons.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}</select>
      </div>
      <p className="mt-3 text-xs font-medium text-muted">{published ? "Publicado — visible para estudiantes" : "Borrador — no visible para estudiantes"}</p>

      <div className="mt-4 space-y-2">
        {drafts.map((draft, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => setDragFrom(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => { if (dragFrom !== null && dragFrom !== index) reorder(dragFrom, index); setDragFrom(null); }}
            className="flex items-center gap-2 rounded-cell border border-line bg-white p-2"
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted" />
            <input value={draft.term} onChange={(event) => updateDraft(index, { term: event.target.value })} placeholder="Término (ej. BUSCARX)" className="w-40 shrink-0 rounded-cell border border-line p-2 text-sm" />
            <input value={draft.definition} onChange={(event) => updateDraft(index, { definition: event.target.value })} placeholder="Definición aplicable en el trabajo" className="min-w-0 flex-1 rounded-cell border border-line p-2 text-sm" />
            <button type="button" onClick={() => removeDraft(index)} aria-label="Eliminar tarjeta" className="shrink-0 p-1 text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addDraft} className="mt-3 rounded-cell border border-line px-4 py-2 text-sm font-bold text-ink">Añadir tarjeta</button>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => void saveSet(false)} className="rounded-cell border border-line px-4 py-2 text-sm font-bold text-ink">Guardar borrador</button>
        <button type="button" onClick={() => setShowPreview((value) => !value)} className="rounded-cell border border-accent px-4 py-2 text-sm font-bold text-accent">{showPreview ? "Ocultar" : "Vista previa"}</button>
        <button type="button" onClick={() => void saveSet(true)} className="rounded-cell bg-accent px-4 py-2 text-sm font-bold text-white">Publicar set</button>
      </div>
      {message && <p role="status" className="mt-3 text-sm text-blue-800">{message}</p>}
      {showPreview && <div className="mt-5 border-t border-line pt-4"><FlashcardDeck setId={setId ?? "preview"} cards={previewCards} /></div>}
    </section>
  );
}
