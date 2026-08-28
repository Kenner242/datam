import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllModuleTracks, getModuleLevels } from "@/lib/courses";

export function generateStaticParams() {
	return getAllModuleTracks().map((track) => ({ track }));
}

export default async function CourseModulePage({ params }: { params: Promise<{ track: string }> }) {
	const { track } = await params;
	const levels = getModuleLevels(track);
	if (levels.length === 0) notFound();

	const moduleTitle = levels[0].title.replace(/\s*(Básico|Intermedio|Avanzado)$/, "");

	return (
		<>
			<Navbar />
			<main>
				<section className="bg-blue-950 py-14 text-white">
					<div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1fr_240px] md:items-center">
						<div>
							<Link href="/cursos" className="text-sm text-blue-200 hover:text-white">← Volver al catálogo</Link>
							<p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-blue-200">Módulo · {levels.length} niveles</p>
							<h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">{moduleTitle}</h1>
							<p className="mt-5 max-w-2xl text-base leading-7 text-blue-100">{levels[0].description}</p>
						</div>
						<div className="flex h-40 items-center justify-center rounded-cell bg-white/10 p-6">
							<img src={levels[0].image} alt={`Herramienta ${moduleTitle}`} className="h-24 w-24 object-contain" />
						</div>
					</div>
				</section>

				<section className="mx-auto max-w-4xl px-6 py-14">
					<span className="data-cell-header">Ruta de aprendizaje</span>
					<h2 className="mt-2 font-display text-3xl font-bold text-ink">Elige tu nivel</h2>
					<p className="mt-2 text-sm text-muted">Avanza en orden: cada nivel se apoya en lo aprendido en el anterior.</p>

					<ol className="mt-8 flex flex-col gap-4">
						{levels.map((level, index) => (
							<li key={level.slug} className="data-cell flex items-center gap-5 p-5">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-950 font-display text-lg font-bold text-white">
									{index + 1}
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<span className="font-display text-lg font-bold text-ink">{level.level}</span>
										<span className="rounded-cell bg-base px-2 py-1 text-xs font-medium text-muted">Nivel {index + 1}</span>
									</div>
									<p className="mt-1 text-sm text-muted">{level.description}</p>
									<span className="mt-2 inline-block font-mono text-xs text-muted">{level.code} · {level.duration}</span>
								</div>
								<Link
									href={`/cursos/${level.slug}`}
									className="shrink-0 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
								>
									Ver nivel →
								</Link>
							</li>
						))}
					</ol>
				</section>
			</main>
			<Footer />
		</>
	);
}
