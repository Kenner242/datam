"use client";

import { PointerEvent, ReactNode, useEffect, useId, useRef, useState } from "react";
import { GripHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export type TopicTabId = "lectura" | "conceptos" | "ejemplo" | "flashcards" | "actividad" | "quiz" | "reflexion";

const TAB_LABELS: Record<TopicTabId, string> = {
  lectura: "Lectura",
  conceptos: "Conceptos",
  ejemplo: "Ejemplo real",
  flashcards: "Flashcards",
  actividad: "Actividad práctica",
  quiz: "Quiz",
  reflexion: "Reflexión profesional",
};

type TopicWindowProps = {
  topicSlug: string;
  title: string;
  onClose: () => void;
  tabs?: TopicTabId[];
  renderTab: (tab: TopicTabId) => ReactNode;
};

// Reutiliza el patrón de ventana flotante arrastrable de DaxAssistant, pero como modal centrado y con foco atrapado.
export default function TopicWindow({ topicSlug, title, onClose, tabs = ["lectura", "conceptos", "ejemplo", "flashcards", "actividad", "quiz", "reflexion"], renderTab }: TopicWindowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const headingId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<TopicTabId>(tabs[0]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tema", topicSlug);
    router.replace(`?${params.toString()}`, { scroll: false });
    return () => {
      const cleanup = new URLSearchParams(window.location.search);
      cleanup.delete("tema");
      const query = cleanup.toString();
      router.replace(query ? `?${query}` : window.location.pathname, { scroll: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicSlug]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.querySelector<HTMLElement>("button, [href]")?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function beginDrag(event: PointerEvent<HTMLButtonElement>) {
    dragStart.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function drag(event: PointerEvent<HTMLButtonElement>) {
    if (!dragStart.current) return;
    setOffset({ x: dragStart.current.offsetX + (event.clientX - dragStart.current.x), y: dragStart.current.offsetY + (event.clientY - dragStart.current.y) });
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-4" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        className="flex h-[min(680px,90vh)] w-[min(720px,calc(100vw-24px))] flex-col overflow-hidden rounded-cell border border-line bg-white shadow-2xl"
      >
        <header className="flex items-center gap-3 bg-ink px-4 py-3 text-white">
          <button type="button" aria-label="Mover ventana" onPointerDown={beginDrag} onPointerMove={drag} onPointerUp={() => { dragStart.current = null; }} className="cursor-grab touch-none text-blue-100 active:cursor-grabbing">
            <GripHorizontal className="h-5 w-5" />
          </button>
          <h2 id={headingId} className="min-w-0 flex-1 truncate font-display font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar tema" className="p-1 text-white hover:text-blue-200"><X className="h-5 w-5" /></button>
        </header>
        <div role="tablist" aria-label="Secciones del tema" className="flex gap-1 border-b border-line bg-base px-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-cell px-3 py-2 text-sm font-medium ${activeTab === tab ? "bg-accent text-white" : "text-ink hover:bg-blue-50"}`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">{renderTab(activeTab)}</div>
      </div>
    </div>
  );
}
