import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseEnrollmentButton from "@/components/CourseEnrollmentButton";
import CourseLessons from "@/components/CourseLessons";
import StudySetPanel from "@/components/StudySetPanel";
import PythonCourseExperience from "@/components/PythonCourseExperience";
import { courses, getCourse } from "@/lib/courses";
import { getCourseMaterials } from "@/lib/materials";

const bloomLabels: Record<string, string> = { recordar: "Recordar", comprender: "Comprender", aplicar: "Aplicar", analizar: "Analizar", evaluar: "Evaluar", crear: "Crear" };

export function generateStaticParams() { return courses.map((course) => ({ slug: course.slug })); }

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const course = getCourse(slug);
	if (!course) notFound();
	const materials = getCourseMaterials(course.slug);
	return <><Navbar /><main className="course-theme">
		<section className="course-hero py-10 text-white sm:py-14"><div className="mx-auto grid max-w-6xl gap-5 px-4 sm:gap-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(220px,360px)] md:items-center"><div><Link href="/cursos" className="text-sm text-blue-200 hover:text-white">← Volver al catálogo</Link><p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-blue-200 sm:mt-8">{course.code} · {course.level} · {course.duration}</p><h1 className="mt-3 break-words font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">{course.title}</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:mt-5 sm:text-base sm:leading-7">{course.summary}</p><CourseEnrollmentButton courseSlug={course.slug} /></div><div className="course-hero-image"><img src={course.image} alt={`Imagen del curso ${course.title}`} className="aspect-video w-full rounded-cell object-contain sm:aspect-[4/3] md:h-64" /></div></div></section>
		<section className="course-program mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]"><div><span className="data-cell-header">Programa de aprendizaje</span><h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">Módulos y clases</h2>{course.slug === "python-basico" ? <PythonCourseExperience course={course} /> : <><details className="data-cell mt-6"><summary className="cursor-pointer px-4 py-4 text-sm font-medium text-blue-200 sm:px-5">Ver perfil de egreso y resultados de aprendizaje</summary><div className="border-t border-slate-700 p-4 sm:p-5"><p className="data-cell-header">Perfil de egreso</p><p className="mt-2 text-sm leading-6 text-blue-100">{course.graduateProfile}</p><div className="mt-5 border-t border-slate-700 pt-4"><p className="data-cell-header">Resultados de aprendizaje</p><ol className="mt-3 grid gap-3 sm:grid-cols-2">{course.learningOutcomes?.map((result, index) => <li key={result.bloomLevel} className="border-l-2 border-accent pl-3 text-sm text-blue-100"><span className="font-mono text-xs uppercase text-blue-300">RA {String(index + 1).padStart(2, "0")} · {bloomLabels[result.bloomLevel]}</span><p className="mt-1 leading-5">{result.outcome}</p></li>)}</ol></div></div></details><CourseLessons course={course} materials={materials} /></>}</div><aside className="course-professional h-fit p-4 sm:p-6"><p className="data-cell-header">Aplicación profesional</p><h2 className="mt-2 font-display text-xl font-bold text-white">¿Para qué te servirá?</h2><p className="mt-3 text-sm leading-6 text-blue-100">{course.professionalUse}</p><div className="mt-6 border-t border-slate-700 pt-5"><p className="font-display font-bold text-white">Incluye</p><ul className="mt-3 flex flex-col gap-2 text-sm text-blue-100"><li>• Clases prácticas paso a paso</li><li>• Ejercicios aplicados</li><li>• Proyecto de aprendizaje</li><li>• Evaluación y certificado</li></ul></div></aside></section>
	<section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6"><StudySetPanel course={course} /></section></main><Footer /></>;
}
