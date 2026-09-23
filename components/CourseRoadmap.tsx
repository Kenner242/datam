"use client";

import { Check } from "lucide-react";
import type { BloomLevel, Course } from "@/lib/courses";

// Colores en línea (no clases Tailwind dinámicas) para evitar que el purgador elimine estilos no detectados.
const BLOOM_HEX: Record<BloomLevel, string> = {
  recordar: "#93C5FD",
  comprender: "#60A5FA",
  aplicar: "#34D399",
  analizar: "#10B981",
  evaluar: "#A78BFA",
  crear: "#7C3AED",
};

export default function CourseRoadmap({ course, watchedLessonIds, onSelectTopic }: { course: Course; watchedLessonIds: string[]; onSelectTopic: (moduleIndex: number, lessonIndex: number) => void }) {
  const nodes = course.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => ({
      moduleIndex,
      lessonIndex,
      title: lesson.title,
      bloomLevel: module.bloomLevel ?? "recordar",
      isDone: watchedLessonIds.includes(`${module.title}:${lesson.title}`),
    })),
  );

  return (
    <section className="data-cell mt-6 p-5" aria-label="Ruta del curso">
      <p className="data-cell-header">Ruta del curso</p>
      <div className="relative mt-4 flex gap-1 overflow-x-auto pb-3">
        <div className="pointer-events-none absolute left-0 right-0 top-5 h-0.5 bg-line" aria-hidden="true" />
        {nodes.map((node) => (
          <button
            key={`${node.moduleIndex}-${node.lessonIndex}`}
            type="button"
            onClick={() => onSelectTopic(node.moduleIndex, node.lessonIndex)}
            title={node.title}
            aria-label={`Abrir tema: ${node.title}`}
            className="relative z-10 flex shrink-0 flex-col items-center gap-1.5 px-2"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: node.isDone ? "#16A34A" : BLOOM_HEX[node.bloomLevel] }}
            >
              {node.isDone ? <Check className="h-4 w-4" /> : node.lessonIndex + 1}
            </span>
            <span className="max-w-16 truncate text-[11px] font-medium text-muted">{node.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
