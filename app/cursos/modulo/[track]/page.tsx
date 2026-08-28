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
				<section className="bg-blue-950 py-10 text-white sm:py-14">
					<div className="mx-auto grid max-w-6xl gap-5 px-4 sm:gap-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(180px,240px)] md:items-center">
						<div>
							<Link href="/cursos" className="text-sm text-blue-200 hover:text-white">← Volver al catálogo</Link>
							<p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-blue-200 sm:mt-8">Módulo · {levels.length} niveles</p>
							<h1 className="mt-3 break-words font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">{moduleTitle}</h1>
							<p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:mt-5 sm:text-base sm:leading-7">{levels[0].description}</p>
						</div>
						<div className="flex aspect-square max-h-40 items-center justify-center rounded-cell bg-white/10 p-5 sm:p-6">
							<img src={levels[0].image} alt={`Herramienta ${moduleTitle}`} className="h-20 w-20 object-contain sm:h-24 sm:w-24" />
						</div>
					</div>
				</section>

				<section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
					<span className="data-cell-header">Ruta de aprendizaje</span>
					<h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">Elige tu nivel</h2>
					<p className="mt-2 text-sm text-muted">Avanza en orden: cada nivel se apoya en lo aprendido en el anterior.</p>

					<ol className="mt-8 flex flex-col gap-4">
						{levels.map((level, index) => (
							<li key={level.slug} className="data-cell flex items-start gap-3 p-4 sm:items-center sm:gap-5 sm:p-5">
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
									className="shrink-0 rounded-full bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 sm:px-5"
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
