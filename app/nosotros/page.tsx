import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="bg-blue-50/50">
        <section className="mx-auto max-w-5xl px-6 py-20">
          <span className="data-cell-header">Sobre DataM</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold text-ink md:text-5xl">Educación, tecnología e innovación para crear oportunidades</h1>
          <div className="mt-10 max-w-4xl space-y-10 text-base leading-8 text-muted">
            <article><h2 className="font-display text-2xl font-bold text-ink">¿Qué es DataM?</h2><p className="mt-3"><strong className="font-display text-ink">DataM es una startup peruana de educación e innovación tecnológica.</strong> Busca acercar el conocimiento a jóvenes y usar la tecnología como herramienta para crear oportunidades, desarrollando capacidades en estudiantes y emprendedores.</p></article>
            <article><h2 className="font-display text-2xl font-bold text-ink">Misión</h2><p className="mt-3"><strong className="font-display text-ink">Impulsar competencias digitales y profesionales</strong> mediante educación accesible e innovadora, conectando tecnología con necesidades reales para generar oportunidades de crecimiento.</p></article>
            <article><h2 className="font-display text-2xl font-bold text-ink">Visión</h2><p className="mt-3"><strong className="font-display text-ink">Ser la plataforma peruana referente en educación tecnológica</strong>, formando personas capaces de transformar ideas y contribuir al desarrollo del país.</p></article>
          </div>
          <Link href="/" className="mt-10 inline-block text-sm font-medium text-accent hover:underline">← Volver al inicio</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
