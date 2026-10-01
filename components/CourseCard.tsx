import Link from "next/link";

type CourseCardProps = {
  slug: string;
  code: string;
  title: string;
  level: string;
  duration: string;
  description: string;
  image: string;
};

export default function CourseCard({
  slug,
  code,
  title,
  level,
  duration,
  description,
  image,
}: CourseCardProps) {
  return (
    <Link
      href={`/cursos/${slug}`}
      className="data-cell group flex h-full min-h-[31rem] cursor-pointer flex-col gap-3 overflow-hidden transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      aria-label={`Ingresar al curso ${title}`}
    >
      <div className="flex aspect-[16/10] items-center justify-center bg-base p-5 sm:p-6">
        <img src={image} alt={`Imagen del curso ${title}`} className="h-full w-full object-contain" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="data-cell-header shrink-0">{code}</span>
          <span className="max-w-full rounded-cell bg-base px-2 py-1 text-right text-xs font-medium leading-4 text-muted">{level}</span>
        </div>
        <h3 className="font-display text-xl font-bold leading-tight text-ink">{title}</h3>
        <p className="text-base leading-7 text-muted">{description}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <span className="font-mono text-sm text-muted">{duration}</span>
          <span className="text-base font-semibold text-accent group-hover:underline">Ver curso →</span>
        </div>
      </div>
    </Link>
  );
}
