import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/lib/courses";

export default function CursosPage() {
  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <span className="data-cell-header">Catálogo completo</span>
        <div className="mb-10 flex flex-col items-center px-6 py-4 text-center">
          <img src="/images/datam-logo.svg" alt="DataM" className="h-40 w-60 max-w-full object-contain" />
          <p className="mt-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Aprende gratis desde Perú</p>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Cursos</h1>
        <p className="mt-2 max-w-lg text-sm text-muted">
          Elige un curso y avanza a tu ritmo. Cada uno incluye material descargable,
          evaluaciones y certificado.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.code} {...c} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
