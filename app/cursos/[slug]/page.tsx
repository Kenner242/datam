import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseLessons from "@/components/CourseLessons";
import { courses, getCourse } from "@/lib/courses";

export function generateStaticParams() { return courses.map((course) => ({ slug: course.slug })); }

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
	const course = getCourse(params.slug);
	if (!course) notFound();
	return <><Navbar /><main>
		<section className="bg-blue-950 py-14 text-white"><div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1fr_360px] md:items-center"><div><Link href="/cursos" className="text-sm text-blue-200 hover:text-white">← Volver al catálogo</Link><p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-blue-200">{course.code} · {course.level} · {course.duration}</p><h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">{course.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-blue-100">{course.summary}</p><Link href="/registro" className="mt-8 inline-flex rounded-cell bg-blue-500 px-6 py-3 text-sm font-bold text-white">Inscribirme gratis</Link></div><img src={course.image} alt={`Imagen del curso ${course.title}`} className="h-64 w-full rounded-cell object-cover shadow-xl" /></div></section>
		<section className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-[1fr_320px]"><div><span className="data-cell-header">Programa de aprendizaje</span><h2 className="mt-2 font-display text-3xl font-bold text-ink">Módulos y clases</h2><CourseLessons course={course} /></div><aside className="h-fit border-l-4 border-blue-500 bg-blue-50 p-6"><p className="data-cell-header">Aplicación profesional</p><h2 className="mt-2 font-display text-xl font-bold text-ink">¿Para qué te servirá?</h2><p className="mt-3 text-sm leading-6 text-muted">{course.professionalUse}</p><div className="mt-6 border-t border-blue-200 pt-5"><p className="font-display font-bold text-ink">Incluye</p><ul className="mt-3 flex flex-col gap-2 text-sm text-muted"><li>• Clases prácticas paso a paso</li><li>• Ejercicios aplicados</li><li>• Proyecto de aprendizaje</li><li>• Evaluación y certificado</li></ul></div></aside></section>
	</main><Footer /></>;
}
