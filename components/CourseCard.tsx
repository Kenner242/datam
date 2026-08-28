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
    <div className="data-cell group flex flex-col gap-3 overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex aspect-[16/10] items-center justify-center bg-base p-5 sm:p-6">
        <img src={image} alt={`Imagen del curso ${title}`} className="h-full w-full object-contain" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="data-cell-header">{code}</span>
          <span className="rounded-cell bg-base px-2 py-1 text-xs font-medium text-muted">{level}</span>
        </div>
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        <p className="text-sm text-muted">{description}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <span className="font-mono text-xs text-muted">{duration}</span>
          <Link href={`/cursos/${slug}`} className="text-sm font-medium text-accent group-hover:underline">
            Ver curso →
          </Link>
        </div>
      </div>
    </div>
  );
}
