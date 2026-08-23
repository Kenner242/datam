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
            <article><h2 className="font-display text-2xl font-bold text-ink">¿Qué es DataM?</h2><p className="mt-3"><strong className="font-display text-ink">DataM es una iniciativa peruana de educación e innovación tecnológica</strong> que nace para acercar el conocimiento a las personas y convertir la tecnología en una herramienta para crear oportunidades. Construimos un espacio donde estudiantes, jóvenes y emprendedores puedan desarrollar capacidades, descubrir nuevas posibilidades y transformar sus ideas en soluciones reales. Creemos que aprender tecnología no consiste únicamente en conocer herramientas, sino en adquirir la capacidad de pensar, crear, resolver problemas y adaptarse a un mundo en constante evolución.</p></article>
            <article><h2 className="font-display text-2xl font-bold text-ink">Misión</h2><p className="mt-3"><strong className="font-display text-ink">Impulsar el desarrollo de capacidades digitales y profesionales</strong> mediante una educación accesible, práctica e innovadora, conectando conocimiento y tecnología con las necesidades reales de las personas y su entorno. Buscamos que cada aprendizaje pueda convertirse en una herramienta para crecer, crear y generar nuevas oportunidades.</p></article>
            <article><h2 className="font-display text-2xl font-bold text-ink">Visión</h2><p className="mt-3"><strong className="font-display text-ink">Ser una plataforma peruana referente en educación e innovación tecnológica</strong>, reconocida por impulsar personas capaces de utilizar el conocimiento y la tecnología para transformar sus ideas, resolver desafíos y contribuir al desarrollo del país.</p></article>
          </div>
          <Link href="/" className="mt-10 inline-block text-sm font-medium text-accent hover:underline">← Volver al inicio</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
