"use client";

import { useEffect, useState } from "react";
import type { GeneratedLessonMaterials } from "@/lib/contentStudio";

type GeneratedRow = { type: "slides" | "mindmap" | "flashcards" | "summary"; content: unknown };

export default function GeneratedLessonMaterials({ courseSlug, moduleIndex, lessonIndex }: { courseSlug: string; moduleIndex: number; lessonIndex: number }) {
  const [rows, setRows] = useState<GeneratedRow[]>([]);
  const [active, setActive] = useState<GeneratedRow["type"]>("slides");

  useEffect(() => {
    let cancelled = false;
    void import("@/lib/supabase/client").then(({ supabase }) => supabase.from("lesson_generated_content").select("type, content").eq("course_slug", courseSlug).eq("module_index", moduleIndex).eq("lesson_index", lessonIndex).eq("reviewed", true)).then(({ data }) => { if (!cancelled) setRows((data as GeneratedRow[] | null) ?? []); });
    return () => { cancelled = true; };
  }, [courseSlug, moduleIndex, lessonIndex]);

  if (!rows.length) return null;
  const selected = rows.find((row) => row.type === active) ?? rows[0];
  const value = selected.content as GeneratedLessonMaterials["mindMap"] | GeneratedLessonMaterials["slidesOutline"] | GeneratedLessonMaterials["flashcards"] | string;

  return <section className="mt-5 border border-line bg-white p-4" aria-label="Materiales complementarios">
    <p className="data-cell-header">Content Studio · material revisado</p>
    <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Materiales de la lección">
      {rows.map((row) => <button key={row.type} type="button" role="tab" aria-selected={selected.type === row.type} onClick={() => setActive(row.type)} className={`rounded-cell border px-3 py-2 text-sm font-medium ${selected.type === row.type ? "border-accent bg-accent text-white" : "border-line text-ink"}`}>{row.type === "mindmap" ? "Mapa mental" : row.type === "flashcards" ? "Flashcards" : row.type === "summary" ? "Resumen" : "Diapositivas"}</button>)}
    </div>
    <div className="mt-4 text-sm leading-6 text-ink">
      {selected.type === "summary" && <p>{value as string}</p>}
      {selected.type === "slides" && <ol className="space-y-3">{(value as GeneratedLessonMaterials["slidesOutline"]).map((slide) => <li key={slide.title} className="border-l-4 border-accent pl-3"><p className="font-bold">{slide.title}</p><ul className="mt-1 list-disc pl-5">{slide.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></li>)}</ol>}
      {selected.type === "mindmap" && <div><p className="font-bold">{(value as GeneratedLessonMaterials["mindMap"]).root}</p><ul className="mt-2 list-disc pl-5">{(value as GeneratedLessonMaterials["mindMap"]).branches.map((branch) => <li key={branch.label}><span className="font-medium">{branch.label}</span>{branch.children.length > 0 && <ul className="list-[circle] pl-5">{branch.children.map((child) => <li key={child}>{child}</li>)}</ul>}</li>)}</ul><details className="mt-3"><summary className="cursor-pointer font-medium text-blue-700">Versión de texto</summary><p className="mt-2 whitespace-pre-wrap">{(value as GeneratedLessonMaterials["mindMap"]).plainText}</p></details></div>}
      {selected.type === "flashcards" && <div className="space-y-3">{(value as GeneratedLessonMaterials["flashcards"]).map((card) => <details key={card.question} className="border border-line p-3"><summary className="cursor-pointer font-medium">{card.question}</summary><p className="mt-2">{card.answer}</p></details>)}</div>}
    </div>
  </section>;
}