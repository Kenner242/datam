import Link from "next/link";
import type { Course } from "@/lib/courses";

type CourseModuleGroupProps = {
  track: string;
  title: string;
  image: string;
  description: string;
  professionalUse: string;
  levels: Course[];
};

export default function CourseModuleGroup({ track, title, image, description, professionalUse, levels }: CourseModuleGroupProps) {
  const totalDuration = levels.length;
  return (
    <Link
      href={`/cursos/modulo/${track}`}
      className="data-cell group flex flex-col gap-3 overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="flex h-44 items-center justify-center p-5">
        <img src={image} alt={`Herramienta ${title}`} className="h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="data-cell-header">Módulo</span>
          <span className="rounded-cell bg-base px-2 py-1 text-xs font-medium text-muted">{totalDuration} niveles</span>
        </div>
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        <p className="text-sm text-muted">{description}</p>
        <div className="border-l-2 border-accent pl-3">
          <p className="data-cell-header">Lograrás</p>
          <p className="mt-1 text-sm leading-5 text-ink">{professionalUse}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-accent group-hover:underline">Ver módulo →</span>
        </div>
      </div>
    </Link>
  );
}
