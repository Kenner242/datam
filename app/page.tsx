import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Facebook, Linkedin, MessageCircle, Instagram, Mail, Code2, Database, BarChart3, FileSpreadsheet } from "lucide-react";

const featuredCourses = [
  {
    slug: "excel-avanzado",
    code: "B1",
    title: "Excel Avanzado para Análisis de Datos",
    level: "Intermedio",
    duration: "6 semanas",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    description:
      "Tablas dinámicas, fórmulas avanzadas y automatización básica para el trabajo diario.",
  },
  {
    slug: "power-bi-desde-cero",
    code: "B2",
    title: "Power BI desde Cero",
    level: "Principiante",
    duration: "5 semanas",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    description:
      "Construye dashboards reales conectando y modelando datos de distintas fuentes.",
  },
  {
    slug: "python-para-datos",
    code: "B3",
    title: "Python para Análisis de Datos",
    level: "Intermedio",
    duration: "8 semanas",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    description:
      "Pandas, visualización y automatización de reportes con proyectos aplicados.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pt-24">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="px-4 py-2">
            <img src="/images/datam-logo.svg" alt="Logo de DataM" className="datam-logo-hero h-60 w-96 max-w-full object-contain" />
          </div>
          <p className="mt-4 font-display text-base font-bold uppercase tracking-[0.18em] text-blue-700 md:text-lg">
            Educación, Tecnología e Innovación
          </p>
          <p className="mt-2 text-sm text-muted">
            Una nueva plataforma peruana para aprender y crecer gratis.
          </p>
        </div>
        <div className="mx-auto mb-12 max-w-4xl overflow-hidden rounded-cell border border-blue-200 bg-blue-950 shadow-xl">
          <video
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="auto"
            aria-label="Video de presentación de la plataforma DataM"
            poster="/images/flayer_01.jpg"
            className="aspect-video w-full object-cover"
          >
            <source src="/videos/presentacion-datam/AQOBWwt4qxAdVReF2jAJAMIJiKqNM6FUJSmYtu9eIztFcJczSAx7v0zKoRWBuczr-aGYnp_JcwGtFlEBKjmdm6IupS8IuW2nH1ODJptIerWaxw.mp4" type="video/mp4" />
            Tu navegador no puede reproducir este video.
          </video>
          <p className="px-5 py-3 text-center text-xs text-blue-100">
            Conoce DataM y comienza tu camino de aprendizaje tecnológico.
          </p>
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <span className="data-cell-header">DataM · Educación tecnológica desde Perú</span>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
            Aprende habilidades para convertir tus ideas en oportunidades.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted">
            Formación accesible en datos, tecnología e innovación para jóvenes,
            estudiantes y emprendedores que quieren avanzar con herramientas reales.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/cursos"
              className="rounded-cell bg-ink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent"
            >
              Explorar cursos
            </a>
            <a
              href="/registro"
              className="rounded-cell border border-line bg-panel px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Empezar gratis
            </a>
          </div>
        </div>
      </section>

      {/* Cursos destacados */}
      <section className="border-t border-line bg-panel py-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="data-cell-header">Catálogo</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">
            Cursos destacados
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featuredCourses.map((c) => (
              <CourseCard key={c.code} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* Metodología */}
      <section id="metodologia" className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="data-cell-header">Nuestra misión</span>
          <h2 className="mt-2 max-w-2xl font-display text-2xl font-bold text-ink">
            Aprender tecnología no debería depender de dónde naciste ni de cuánto puedes pagar.
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="data-cell p-5">
              <p className="font-display font-bold text-ink">Práctica real</p>
              <p className="mt-2 text-sm text-muted">
                Cada módulo termina en un proyecto aplicado, no solo teoría.
              </p>
            </div>
            <div className="data-cell p-5">
              <p className="font-display font-bold text-ink">Progreso visible</p>
              <p className="mt-2 text-sm text-muted">
                Tu dashboard muestra exactamente qué avanzaste y qué falta.
              </p>
            </div>
            <div className="data-cell p-5">
              <p className="font-display font-bold text-ink">Certificación</p>
              <p className="mt-2 text-sm text-muted">
                Al completar el curso y aprobar la evaluación, obtienes tu certificado verificable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="nosotros" className="border-t border-blue-100 bg-blue-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="data-cell-header">Identidad DataM</span>
          <h2 className="mt-2 max-w-3xl font-display text-2xl font-bold text-ink md:text-3xl">
            Conocimiento que se transforma en posibilidades reales.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="data-cell border-t-4 border-accent p-6">
              <p className="data-cell-header">Quiénes somos</p>
              <h3 className="mt-2 font-display text-xl font-bold text-ink">DataM</h3>
              <p className="mt-3 text-sm leading-6 text-muted">Startup peruana de educación e innovación tecnológica que acerca el conocimiento a jóvenes, estudiantes y emprendedores.</p>
            </article>
            <article className="data-cell border-t-4 border-blue-600 p-6">
              <p className="data-cell-header">Nuestra misión</p>
              <h3 className="mt-2 font-display text-xl font-bold text-ink">Impulsar capacidades</h3>
              <p className="mt-3 text-sm leading-6 text-muted">Conectar competencias digitales y profesionales con necesidades reales para abrir oportunidades de crecimiento.</p>
            </article>
            <article className="data-cell border-t-4 border-green-600 p-6">
              <p className="data-cell-header">Nuestra visión</p>
              <h3 className="mt-2 font-display text-xl font-bold text-ink">Transformar el país</h3>
              <p className="mt-3 text-sm leading-6 text-muted">Ser una plataforma peruana referente, formando personas capaces de transformar ideas y contribuir al desarrollo del país.</p>
            </article>
          </div>
          <div className="mt-10 border-t border-blue-200 pt-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-blue-700">Redes sociales</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://www.facebook.com/profile.php?id=61556093215403" target="_blank" rel="noreferrer" aria-label="Facebook de DataM" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-blue-500 hover:text-blue-700">
                <Facebook aria-hidden="true" className="h-5 w-5 text-[#1877F2]" /> Facebook
              </a>
              <a href="https://www.linkedin.com/feed/update/urn:li:activity:7401323804922384384" target="_blank" rel="noreferrer" aria-label="LinkedIn de DataM" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-blue-500 hover:text-blue-700">
                <Linkedin aria-hidden="true" className="h-5 w-5 text-[#0A66C2]" /> LinkedIn
              </a>
              <a href="https://chat.whatsapp.com/EFX2VJi9CoXGVU8SVVu6ZL" target="_blank" rel="noreferrer" aria-label="Comunidad de WhatsApp de DataM" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-green-500 hover:text-green-700">
                <MessageCircle aria-hidden="true" className="h-5 w-5 text-[#25D366]" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="fundador" className="border-t border-line bg-panel py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <span className="data-cell-header">FUNDADOR</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">
              La persona detrás de DataM
            </h2>
          </div>
          <div className="grid items-center gap-10 md:grid-cols-[280px_1fr]">
            <div className="mx-auto w-full max-w-[280px] overflow-hidden border border-line bg-base shadow-sm">
              <img src="/images/foto - kenner.jpg" alt="Villavicencio Salhuana Kenner Estibens, fundador de DataM" className="h-auto w-full object-contain mix-blend-multiply" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue-700">Fundador de DataM · Administración y Finanzas · Tecnología e Innovación</p>
              <h3 className="mt-3 font-display text-2xl font-bold text-ink md:text-3xl">Villavicencio Salhuana Kenner Estibens</h3>
              <div className="mt-6 space-y-4 text-base leading-8 text-muted">
                <p>Soy <strong className="font-display text-ink">Villavicencio Salhuana Kenner Estibens</strong>, estudiante de 21 años, apasionado por la tecnología, los datos y la innovación. Mi camino nace de una convicción: <strong className="font-display text-ink">el conocimiento no debería quedarse en las aulas ni estar reservado para unos pocos; debe convertirse en una herramienta capaz de abrir oportunidades y transformar realidades.</strong></p>
                <p>He encontrado en la tecnología una forma de aprender, crear y encontrar soluciones a problemas reales. Esa experiencia me llevó a crear <strong className="font-display text-ink">DataM</strong>, con el propósito de construir algo que vaya más allá de una plataforma educativa: un espacio donde las personas puedan descubrir su potencial, adquirir nuevas capacidades y encontrar en el conocimiento una posibilidad para avanzar.</p>
                <p>Creo en quienes tienen ganas de aprender aunque todavía no sepan por dónde empezar; en quienes tienen una idea, pero necesitan las herramientas para hacerla realidad; y en quienes buscan una oportunidad para demostrar todo lo que pueden lograr.</p>
                <p><strong className="font-display text-ink">DataM representa esa visión: convertir el acceso al conocimiento en posibilidades reales.</strong></p>
                <p>Mi propósito es seguir aprendiendo, compartir lo aprendido y construir soluciones que conecten <strong className="font-display text-ink">educación, tecnología e innovación</strong>, contribuyendo a formar personas capaces de crear, resolver problemas y transformar su entorno.</p>
                <p><strong className="font-display text-ink">Porque una oportunidad puede cambiar un momento, pero el conocimiento puede cambiar un futuro.</strong></p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="mailto:kenersalhuana@gmail.com" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-accent hover:text-accent"><Mail aria-hidden="true" className="h-5 w-5 text-accent" /> Correo</a>
                <a href="https://www.facebook.com/stiven.pachas.3" target="_blank" rel="noreferrer" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-blue-500 hover:text-blue-700"><Facebook aria-hidden="true" className="h-5 w-5 text-[#1877F2]" /> Facebook</a>
                <a href="https://www.linkedin.com/in/kenner-estibens-villvicencio-salhuana-8a9b822a3/?skipRedirect=true" target="_blank" rel="noreferrer" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-blue-500 hover:text-blue-700"><Linkedin aria-hidden="true" className="h-5 w-5 text-[#0A66C2]" /> LinkedIn</a>
                <a href="https://www.instagram.com/kener_stiven24?igsi=c2ZiaDM4d2N0MDRz" target="_blank" rel="noreferrer" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-pink-400 hover:text-pink-600"><Instagram aria-hidden="true" className="h-5 w-5 text-pink-600" /> Instagram</a>
                <a href="https://www.tiktok.com/@datam" target="_blank" rel="noreferrer" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-ink"><MessageCircle aria-hidden="true" className="h-5 w-5 text-ink" /> TikTok</a>
                <a href="https://chat.whatsapp.com/EFX2VJi9CoXGVU8SVVu6ZL" target="_blank" rel="noreferrer" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-green-500 hover:text-green-700"><MessageCircle aria-hidden="true" className="h-5 w-5 text-[#25D366]" /> WhatsApp</a>
              </div>
            </div>
          </div>
          <div className="relative mx-auto mt-16 flex max-w-2xl items-center justify-center gap-8 overflow-hidden border-y border-blue-100 py-7 text-blue-600">
            <Code2 className="tech-float h-8 w-8" aria-label="Programación" />
            <Database className="tech-float-delay h-8 w-8" aria-label="Bases de datos" />
            <BarChart3 className="tech-float h-8 w-8" aria-label="Análisis de datos" />
            <FileSpreadsheet className="tech-float-delay h-8 w-8" aria-label="Hojas de cálculo" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
