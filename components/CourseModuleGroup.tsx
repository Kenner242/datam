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
      className="data-cell group flex h-full min-h-[31rem] cursor-pointer flex-col gap-3 overflow-hidden transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      aria-label={`Ingresar al módulo de ${title}`}
    >
      <div className="flex aspect-[16/10] items-center justify-center p-5 sm:p-6">
        <img src={image} alt={`Herramienta ${title}`} className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-28" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="data-cell-header">Módulo</span>
          <span className="rounded-cell bg-base px-2 py-1 text-xs font-medium text-muted">{totalDuration} niveles</span>
        </div>
        <h3 className="font-display text-xl font-bold leading-tight text-ink sm:text-lg">{title}</h3>
        <p className="text-base leading-6 text-muted sm:text-sm sm:leading-normal">{description}</p>
        <div className="border-l-2 border-accent pl-3">
          <p className="data-cell-header">Lograrás</p>
          <p className="mt-1 text-base leading-6 text-ink sm:text-sm sm:leading-5">{professionalUse}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <span className="text-base font-medium text-accent group-hover:underline sm:text-sm">Ver módulo →</span>
        </div>
      </div>
    </Link>
  );
}
