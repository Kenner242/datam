"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { courses, GROUPED_TRACKS, getTrack } from "@/lib/courses";
import CourseCard from "./CourseCard";
import CourseModuleGroup from "./CourseModuleGroup";

const trends = [
  "Python",
  "Excel",
  "Power BI",
  "SQL",
  "Artificial Intelligence",
  "Data Analytics",
  "Machine Learning",
  "JavaScript",
  "Financial Analysis",
  "Research Methods",
];

const LEVEL_ORDER: Record<string, number> = { Básico: 0, Intermedio: 1, Avanzado: 2 };

export default function CourseSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses;

    const lowerSearch = searchTerm.toLowerCase();
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerSearch) ||
        course.description.toLowerCase().includes(lowerSearch) ||
        course.summary.toLowerCase().includes(lowerSearch) ||
        course.professionalUse.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

  const { groups, singleCourses } = useMemo(() => {
    const groupMap = new Map<string, typeof courses>();
    const singles: typeof courses = [];

    for (const course of filteredCourses) {
      const track = getTrack(course.slug);
      if (GROUPED_TRACKS.has(track)) {
        const existing = groupMap.get(track) ?? [];
        existing.push(course);
        groupMap.set(track, existing);
      } else {
        singles.push(course);
      }
    }

    const groupList = Array.from(groupMap.entries()).map(([track, levels]) => ({
      track,
      levels: [...levels].sort((a, b) => (LEVEL_ORDER[a.level] ?? 0) - (LEVEL_ORDER[b.level] ?? 0)),
    }));

    return { groups: groupList, singleCourses: singles };
  }, [filteredCourses]);

  const totalResults = groups.length + singleCourses.length;

  const handleTrendClick = (trend: string) => {
    setSearchTerm(trend);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Búscador Principal */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="mb-2 font-display text-3xl font-bold text-ink sm:text-3xl md:text-4xl">
          Cursos de DataM
        </h1>
        <p className="mb-8 text-base leading-6 text-muted sm:text-lg sm:leading-7">
          Desarrolla tus habilidades en análisis de datos, programación y más
        </p>

        {/* Buscador */}
        <div className="relative mb-12">
          <div className="relative flex items-center rounded-full border-2 border-accent bg-white shadow-lg transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
            <Search className="absolute left-4 h-5 w-5 text-accent" />
            <input
              type="text"
              placeholder="¿Qué habilidad deseas desarrollar?"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full border-none bg-transparent py-4 pl-12 pr-4 text-base text-ink placeholder-muted focus:outline-none focus:ring-0 sm:text-lg"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="mr-3 rounded-full bg-accent/10 p-2 text-accent hover:bg-accent/20 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tendencias */}
        <div className="mb-12">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">
            Tendencias en habilidades
          </h2>
          <div className="flex flex-wrap gap-3">
            {trends.map((trend) => (
              <button
                key={trend}
                onClick={() => handleTrendClick(trend)}
                className="rounded-full border border-line bg-panel px-4 py-2 text-sm font-medium text-ink transition-all hover:border-accent hover:bg-blue-50 hover:text-accent active:scale-95"
              >
                {trend}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div>
          <h2 className="mb-6 font-display text-2xl font-bold text-ink">
            {searchTerm
              ? `Cursos encontrados: ${totalResults}`
              : "Todos los cursos"}
          </h2>

          {totalResults > 0 ? (
            <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {groups.map(({ track, levels }) => (
                <CourseModuleGroup
                  key={track}
                  track={track}
                  title={levels[0].title.replace(/\s*(Básico|Intermedio|Avanzado)$/, "")}
                  image={levels[0].image}
                  description={levels[0].description}
                  professionalUse={levels[levels.length - 1].professionalUse}
                  levels={levels}
                />
              ))}
              {singleCourses.map((course) => (
                <CourseCard key={course.code} {...course} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-line bg-blue-50 py-16 text-center">
              <p className="text-lg font-semibold text-ink">
                No encontramos cursos con "{searchTerm}"
              </p>
              <p className="mt-2 text-sm text-muted">
                Intenta con otra búsqueda o explora nuestras tendencias
              </p>
              <button
                onClick={handleClear}
                className="mt-4 rounded-lg bg-accent px-6 py-2 text-white font-medium hover:bg-accent/90 transition-colors"
              >
                Ver todos los cursos
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

