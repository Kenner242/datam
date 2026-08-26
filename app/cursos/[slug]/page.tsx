import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseEnrollmentButton from "@/components/CourseEnrollmentButton";
import CourseLessons from "@/components/CourseLessons";
import { courses, getCourse } from "@/lib/courses";

const bloomLabels: Record<string, string> = { recordar: "Recordar", comprender: "Comprender", aplicar: "Aplicar", analizar: "Analizar", evaluar: "Evaluar", crear: "Crear" };

export function generateStaticParams() { return courses.map((course) => ({ slug: course.slug })); }

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const course = getCourse(slug);
	if (!course) notFound();
	return <><Navbar /><main>
		<section className="bg-blue-950 py-14 text-white"><div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1fr_360px] md:items-center"><div><Link href="/cursos" className="text-sm text-blue-200 hover:text-white">← Volver al catálogo</Link><p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-blue-200">{course.code} · {course.level} · {course.duration}</p><h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">{course.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-blue-100">{course.summary}</p><CourseEnrollmentButton courseSlug={course.slug} /></div><img src={course.image} alt={`Imagen del curso ${course.title}`} className="h-64 w-full rounded-cell object-cover shadow-xl" /></div></section>
		<section className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-[1fr_320px]"><div><span className="data-cell-header">Programa de aprendizaje</span><h2 className="mt-2 font-display text-3xl font-bold text-ink">Competencias y módulos</h2><section className="data-cell mt-6 p-5"><p className="data-cell-header">Perfil de egreso</p><p className="mt-2 text-sm leading-6 text-muted">{course.graduateProfile}</p><div className="mt-5 border-t border-line pt-4"><p className="data-cell-header">Resultados de aprendizaje</p><ol className="mt-3 grid gap-3 sm:grid-cols-2">{course.learningOutcomes?.map((result, index) => <li key={result.bloomLevel} className="border-l-2 border-accent pl-3 text-sm text-muted"><span className="font-mono text-xs uppercase text-blue-700">RA {String(index + 1).padStart(2, "0")} · {bloomLabels[result.bloomLevel]}</span><p className="mt-1 leading-5">{result.outcome}</p></li>)}</ol></div></section><CourseLessons course={course} /></div><aside className="h-fit border-l-4 border-blue-500 bg-blue-50 p-6"><p className="data-cell-header">Aplicación profesional</p><h2 className="mt-2 font-display text-xl font-bold text-ink">¿Para qué te servirá?</h2><p className="mt-3 text-sm leading-6 text-muted">{course.professionalUse}</p><div className="mt-6 border-t border-blue-200 pt-5"><p className="font-display font-bold text-ink">Incluye</p><ul className="mt-3 flex flex-col gap-2 text-sm text-muted"><li>• Clases prácticas paso a paso</li><li>• Ejercicios aplicados</li><li>• Proyecto de aprendizaje</li><li>• Evaluación y certificado</li></ul></div></aside></section>
	</main><Footer /></>;
}
