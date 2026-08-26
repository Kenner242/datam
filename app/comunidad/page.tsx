import { ArrowUpRight, BookOpen, BriefcaseBusiness, MessageCircle, Users } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const communityUrl = "https://chat.whatsapp.com/EFX2VJi9CoXGVU8SVVu6ZL";

const spaces = [
  {
    icon: BookOpen,
    title: "Resuelve tus dudas",
    description: "Comparte preguntas sobre clases, ejercicios y herramientas con estudiantes que están aprendiendo contigo.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Comparte tus avances",
    description: "Publica proyectos, recursos útiles y aprendizajes que puedan ayudar a otros miembros de la comunidad.",
  },
  {
    icon: Users,
    title: "Conecta con tu red",
    description: "Conoce personas interesadas en datos, tecnología, investigación y desarrollo profesional.",
  },
];

export default function ComunidadPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-blue-200 bg-blue-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[minmax(0,1fr)_460px] md:items-center md:py-16">
            <div className="max-w-3xl">
              <p className="data-cell-header">Comunidad DataM</p>
              <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-ink md:text-5xl">Aprender es mejor cuando avanzamos juntos.</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted">Un espacio para estudiantes de DataM que quieren resolver dudas, compartir proyectos y crecer profesionalmente con tecnología.</p>
              <p className="mt-5 font-display text-sm font-bold text-ink">Únete, participa y construye tu futuro junto a la comunidad.</p>
              <a href={communityUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-cell bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-ink"><MessageCircle className="h-5 w-5" /> Unirme por WhatsApp <ArrowUpRight className="h-4 w-4" /></a>
            </div>
            <figure className="relative mx-auto flex h-96 w-full max-w-md items-end justify-center overflow-hidden border-b-4 border-accent bg-white/60 md:h-[500px] md:max-w-none">
              <img src="/images/kener_01.png" alt="Kenner, fundador de DataM, invitando a los estudiantes a la comunidad" className="h-[96%] w-[96%] object-contain object-bottom brightness-90 contrast-110 drop-shadow-2xl" />
              <figcaption className="absolute bottom-4 left-4 rounded-cell bg-ink px-4 py-2 text-sm font-medium text-white md:left-6">Comunidad DataM · Aprende acompañado</figcaption>
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="data-cell-header">Tu espacio de aprendizaje</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Participa, practica y comparte.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {spaces.map(({ icon: Icon, title, description }) => (
              <article key={title} className="data-cell p-5">
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-5 font-display text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-line bg-panel">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="data-cell-header">Acuerdos de comunidad</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink">Un lugar útil y respetuoso.</h2>
            </div>
            <ol className="grid gap-4 text-sm text-muted md:grid-cols-2">
              <li className="border-l-2 border-accent pl-4"><strong className="text-ink">Pregunta con contexto.</strong><br />Indica el curso, clase y qué intentaste antes de pedir ayuda.</li>
              <li className="border-l-2 border-accent pl-4"><strong className="text-ink">Comparte para aprender.</strong><br />Explica soluciones y da crédito a los recursos que uses.</li>
              <li className="border-l-2 border-accent pl-4"><strong className="text-ink">Mantén el respeto.</strong><br />Las diferencias son bienvenidas; los ataques personales no.</li>
              <li className="border-l-2 border-accent pl-4"><strong className="text-ink">Cuida tu información.</strong><br />No publiques datos personales, contraseñas o archivos sensibles.</li>
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="data-cell-header">Comienza hoy</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Tu siguiente aprendizaje puede empezar con una conversación.</h2>
          <a href={communityUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-cell bg-ink px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent"><MessageCircle className="h-5 w-5" /> Entrar a la comunidad</a>
        </section>
      </main>
      <Footer />
    </>
  );
}
