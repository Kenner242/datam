import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UpgradeButton from "@/components/UpgradeButton";
import { Check, Building2, Sparkles, GraduationCap } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Gratuito",
    price: "S/ 0",
    period: "para siempre",
    description: "Aprende sin costo con cursos seleccionados, ejercicios básicos y tu progreso gamificado.",
    features: ["Cursos seleccionados", "Ejercicios básicos", "Seguimiento del progreso", "Comunidad DataM", "Dax IA básico"],
    cta: "Empezar gratis",
    href: "/registro",
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "S/ 19",
    period: "por mes",
    description: "Acceso completo con certificados verificables, laboratorios avanzados y Dax IA ampliado.",
    features: ["Todos los cursos", "Certificados verificables", "Laboratorios avanzados", "Dax IA ampliado", "Proyectos revisados", "Seguimiento avanzado"],
    cta: "Actualizar a Premium",
    href: "/registro",
    highlight: true,
  },
  {
    id: "institutional",
    name: "Institucional",
    price: "A convenir",
    period: "por organización",
    description: "Licencias para colegios, institutos y empresas con panel de seguimiento y reportes.",
    features: ["Panel de gestión", "Asignación de rutas", "Informes de aprendizaje", "Cupos patrocinados", "Soporte prioritario"],
    cta: "Solicitar demostración",
    href: "/instituciones",
    highlight: false,
  },
];

export default function PlansPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-blue-200 bg-blue-50">
          <div className="mx-auto max-w-6xl px-6 py-14 text-center">
            <p className="data-cell-header">Planes DataM</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">Aprende gratis. Valida tu dominio.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
              DataM democratiza la educación tecnológica: aprender es siempre gratuito; pagas solo por la validación y los beneficios avanzados.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.id} className={`data-cell flex flex-col p-6 ${plan.highlight ? "border-2 border-accent shadow-lg" : ""}`}>
                {plan.highlight && <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white"><Sparkles className="h-3.5 w-3.5" /> Recomendado</span>}
                <h2 className="font-display text-xl font-bold text-ink">{plan.name}</h2>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-ink">{plan.price}</span>
                  <span className="text-sm text-muted">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{plan.description}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-ink">
                      <Check className="h-4 w-4 shrink-0 text-green-600" /> {feature}
                    </li>
                  ))}
                </ul>
                {plan.id === "premium" ? <UpgradeButton plan="premium" /> : (
                  <Link href={plan.href} className={`mt-6 rounded-cell px-4 py-3 text-center text-sm font-bold transition-colors ${plan.highlight ? "bg-ink text-white hover:bg-accent" : "border border-line bg-panel text-ink hover:border-accent hover:text-accent"}`}>
                    {plan.cta}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-blue-200 bg-blue-950 py-14 text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-blue-200">Para instituciones y empresas</p>
              <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">DataM para instituciones</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100">
                Colegios, institutos y empresas pueden capacitar a sus estudiantes o colaboradores con panel de seguimiento, asignación de rutas y reportes de aprendizaje.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/instituciones" className="rounded-cell bg-white px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-blue-100">
                  <Building2 className="mr-2 inline h-4 w-4" /> Solicitar demostración
                </Link>
                <Link href="/alianzas" className="rounded-cell border border-blue-300 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-900">
                  Alianzas y patrocinio
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              {["Gestión de estudiantes y grupos", "Asignación de rutas formativas", "Informes de participación", "Cupos financiados por patrocinadores"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-cell border border-blue-700/50 bg-blue-900/50 p-4">
                  <GraduationCap className="h-5 w-5 shrink-0 text-accent2" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
