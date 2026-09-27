"use client";

import Image from "next/image";
import { useState, type MouseEvent, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type CourseMenuDisclosureProps = {
  className: string;
  title: string;
  progress: string;
  children: ReactNode;
};

export default function CourseMenuDisclosure({ className, title, progress, children }: CourseMenuDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeAfterNavigation(event: MouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest("button, a")) {
      setIsOpen(false);
    }
  }

  return (
    <aside className={`${className} course-menu-disclosure`}>
      <details open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
        <summary className="course-menu-trigger" aria-label={`${isOpen ? "Cerrar" : "Abrir"} menú de ${title}`}>
          <span className="course-menu-trigger-icon"><Image src="/images/datam-mark.svg" alt="" width={32} height={32} /></span>
          <span className="course-menu-trigger-copy"><b>{title}</b><small>{progress}</small></span>
          <ChevronDown className="course-menu-trigger-chevron" aria-hidden="true" />
        </summary>
        <div className="course-sidebar-content" onClick={closeAfterNavigation}>{children}</div>
      </details>
    </aside>
  );
}
