import type { Course, CourseCategory } from "@/lib/courses";

export type MissionMode = "diagnostico" | "practica" | "simulacion" | "refuerzo";

export type LearningMission = {
  id: string;
  title: string;
  brief: string;
  skill: string;
  category: CourseCategory;
  mode: MissionMode;
  xp: number;
  courseSlug: string;
  firstStep: string;
};

export const learningMissions: LearningMission[] = [
  {
    id: "ventas-excel",
    title: "Rescata las ventas de una tienda",
    brief: "Ordena una base de ventas, encuentra los productos con menor rendimiento y prepara una conclusión para la gerencia.",
    skill: "Tablas, filtros y análisis básico",
    category: "ofimatica",
    mode: "practica",
    xp: 120,
    courseSlug: "excel-basico",
    firstStep: "Explora la tabla y clasifica los datos antes de calcular.",
  },
  {
    id: "dashboard-power-bi",
    title: "Explica el tablero al equipo comercial",
    brief: "Construye indicadores claros y usa filtros para responder qué región necesita atención primero.",
    skill: "Dashboards y toma de decisiones",
    category: "datos",
    mode: "simulacion",
    xp: 180,
    courseSlug: "power-bi-basico",
    firstStep: "Identifica qué pregunta de negocio debe responder cada indicador.",
  },
  {
    id: "consulta-sql",
    title: "Encuentra la causa de una caída",
    brief: "Consulta ventas, productos y regiones para descubrir por qué el resultado mensual bajó 18%.",
    skill: "Consultas y relaciones",
    category: "datos",
    mode: "diagnostico",
    xp: 150,
    courseSlug: "sql-basico",
    firstStep: "Define qué columnas necesitas antes de escribir SELECT.",
  },
];

export function getRecommendedMission(courses: Course[], completedLessonCount: number) {
  void courses;
  const index = completedLessonCount === 0 ? 0 : Math.min(Math.floor(completedLessonCount / 3), learningMissions.length - 1);
  return learningMissions[index] ?? learningMissions[0];
}
