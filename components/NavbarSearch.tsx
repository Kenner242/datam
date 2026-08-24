"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { courses } from "@/lib/courses";

type SearchResult = {
  type: "course" | "module";
  courseSlug: string;
  courseName: string;
  moduleName?: string;
  courseCode: string;
};

export default function NavbarSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrar cursos y módulos dinámicamente
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered: SearchResult[] = [];

    courses.forEach((course) => {
      // Buscar en nombre del curso
      if (course.title.toLowerCase().includes(lowerSearch)) {
        filtered.push({
          type: "course",
          courseSlug: course.slug,
          courseName: course.title,
          courseCode: course.code,
        });
      }

      // Buscar en módulos del curso
      course.modules.forEach((module) => {
        if (module.title.toLowerCase().includes(lowerSearch)) {
          filtered.push({
            type: "module",
            courseSlug: course.slug,
            courseName: course.title,
            moduleName: module.title,
            courseCode: course.code,
          });
        }
      });
    });

    setResults(filtered.slice(0, 8)); // Limitar a 8 resultados
    setIsOpen(filtered.length > 0);
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
  };

  const handleResultClick = () => {
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative hidden w-80 md:block">
      {/* Buscador */}
      <div className="relative flex items-center rounded-cell border border-line bg-white transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
        <Search className="absolute left-3 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="¿Qué habilidad deseas aprender?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setIsOpen(true)}
          className="w-full border-none bg-transparent py-2 pl-9 pr-3 text-sm placeholder-muted focus:outline-none focus:ring-0"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="mr-2 text-muted hover:text-ink transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-line bg-white shadow-lg z-40">
          <div className="max-h-96 overflow-y-auto">
            {results.map((result, idx) => (
              <Link
                key={`${result.courseSlug}-${result.moduleName || 'course'}-${idx}`}
                href={`/cursos/${result.courseSlug}`}
                onClick={handleResultClick}
                className="block border-b border-line/50 px-4 py-3 last:border-b-0 hover:bg-blue-50 transition-colors"
              >
                <div className="text-sm font-medium text-ink">
                  {result.courseName}
                </div>
                {result.moduleName && (
                  <div className="text-xs text-muted">
                    📚 Módulo: {result.moduleName}
                  </div>
                )}
                <div className="text-xs text-accent font-medium">
                  {result.type === "course" ? "Curso" : "Dentro de este curso"}
                </div>
              </Link>
            ))}
          </div>

          {results.length > 0 && (
            <div className="border-t border-line/50 px-4 py-2 text-center">
              <Link
                href={`/cursos?q=${encodeURIComponent(searchTerm)}`}
                onClick={handleResultClick}
                className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Ver todos los resultados ({results.length})
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Sin resultados */}
      {isOpen && searchTerm && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-line bg-white shadow-lg z-40 px-4 py-3 text-center">
          <p className="text-sm text-muted">No encontramos "{searchTerm}"</p>
          <p className="text-xs text-muted/70 mt-1">Intenta con otro término</p>
        </div>
      )}
    </div>
  );
}
