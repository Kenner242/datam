import { BookOpenCheck, Languages, Mic, ShieldCheck, Sparkles, Target } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DaxLaunchButton from "@/components/DaxLaunchButton";

const capabilities = [
  {
    icon: Target,
    title: "Tutoría personalizada",
    description: "Explica cada tema según el curso, módulo y clase en la que te encuentras, con ejemplos aplicados al contexto peruano.",
  },
  {
    icon: BookOpenCheck,
    title: "Guía paso a paso",
    description: "Prioriza el razonamiento antes que la respuesta final, para que comprendas el procedimiento y no solo el resultado.",
  },
  {
    icon: Mic,
    title: "Voz y dictado",
    description: "Puedes hablarle a Dax por micrófono y escuchar sus respuestas en voz, sin necesidad de escribir todo el tiempo.",
  },
  {
    icon: Languages,
    title: "Español y quechua",
    description: "Responde en español peruano y ofrece soporte en quechua para acompañar a más estudiantes en su idioma.",
  },
  {
    icon: ShieldCheck,
    title: "Uso responsable",
    description: "Nunca solicita contraseñas ni datos sensibles, y no inventa cursos, certificaciones ni resultados que DataM no ofrece.",
  },
  {
    icon: Sparkles,
    title: "Impulsado por Gemini",
    description: "Utiliza modelos de IA generativa de Google Gemini para generar explicaciones claras y adaptadas a cada estudiante.",
  },
];

export default function DaxPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-blue-200 bg-blue-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1fr_260px] md:items-center md:py-20">
            <div>
              <p className="data-cell-header">Tutor inteligente de DataM</p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">Conoce a Dax</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
                Dax es el tutor inteligente de DataM, impulsado por IA generativa y modelos de Google Gemini.
                Te acompaña en tus cursos con explicaciones claras, ejemplos prácticos y una guía adaptada a tu ritmo de aprendizaje.
              </p>
              <DaxLaunchButton className="mt-8 inline-flex rounded-cell bg-ink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent" />
            </div>
            <figure className="mx-auto h-48 w-48 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
              <img src="/images/tools/agente_IA.png" alt="Dax, tutor inteligente de DataM" className="h-full w-full object-cover object-top" />
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <span className="data-cell-header">Qué puede hacer Dax</span>
          <h2 className="mt-2 max-w-2xl font-display text-2xl font-bold text-ink md:text-3xl">
            Un acompañante académico disponible en toda la plataforma.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <article key={title} className="data-cell p-5">
                <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                <p className="mt-4 font-display font-bold text-ink">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-line bg-blue-950 py-16 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-blue-200">Disponible en toda la plataforma</p>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
              Encuentra a Dax en la esquina de cualquier página
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-100">
              El ícono flotante de Dax te acompaña mientras estudias tus cursos. Puedes moverlo a cualquier
              parte de la pantalla y abrirlo cuando lo necesites, sin perder tu progreso.
            </p>
            <DaxLaunchButton className="mt-7 inline-flex rounded-cell bg-white px-6 py-3 text-sm font-bold text-ink transition-colors hover:bg-blue-100" label="Hablar con Dax ahora" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
