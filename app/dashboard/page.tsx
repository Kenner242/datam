import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";

const progreso = [
  { label: "Excel Avanzado", percent: 75 },
  { label: "Power BI", percent: 40 },
  { label: "Python", percent: 15 },
];

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <span className="data-cell-header">Panel del estudiante</span>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">
          Hola, bienvenido de nuevo 👋
        </h1>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="data-cell p-5">
            <p className="data-cell-header">Cursos activos</p>
            <p className="mt-2 font-display text-2xl font-bold text-ink">3</p>
          </div>
          <div className="data-cell p-5">
            <p className="data-cell-header">Certificados</p>
            <p className="mt-2 font-display text-2xl font-bold text-ink">1</p>
          </div>
          <div className="data-cell p-5">
            <p className="data-cell-header">Horas de estudio</p>
            <p className="mt-2 font-display text-2xl font-bold text-ink">18h</p>
          </div>
        </div>

        <div className="data-cell mt-6 p-6">
          <p className="data-cell-header mb-4">Mi progreso</p>
          <div className="flex flex-col gap-4">
            {progreso.map((p) => (
              <ProgressBar key={p.label} label={p.label} percent={p.percent} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
