"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { courses } from "@/lib/courses";
import CourseCard from "./CourseCard";

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
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
        <h1 className="mb-2 font-display text-4xl font-bold text-ink">
          Cursos de DataM
        </h1>
        <p className="mb-8 text-lg text-muted">
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
              className="w-full border-none bg-transparent py-4 pl-12 pr-4 text-ink placeholder-muted focus:outline-none focus:ring-0"
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
              ? `Cursos encontrados: ${filteredCourses.length}`
              : "Todos los cursos"}
          </h2>

          {filteredCourses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {filteredCourses.map((course) => (
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
