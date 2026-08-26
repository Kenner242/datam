export type Lesson = { title: string; topics: string[]; videoUrl?: string };
export type BloomLevel = "recordar" | "comprender" | "aplicar" | "analizar" | "evaluar" | "crear";
export type LearningOutcome = { bloomLevel: BloomLevel; outcome: string };
export type CourseModule = { title: string; lessons: Lesson[]; bloomLevel?: BloomLevel; learningOutcome?: string };
export type Course = {
	slug: string;
	code: string;
	title: string;
	level: string;
	duration: string;
	description: string;
	image: string;
	summary: string;
	professionalUse: string;
	graduateProfile?: string;
	learningOutcomes?: LearningOutcome[];
	modules: CourseModule[];
};

const images = {
	excel: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
	powerBi: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
	python: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
	sql: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
	query: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
	ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
	research: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
	web: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
	finance: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=900&q=80",
};

const lesson = (title: string, topics: string[], videoUrl?: string): Lesson => ({ title, topics, videoUrl });
const module = (title: string, lessons: Lesson[]): CourseModule => ({ title, lessons });
const common = (slug: string, code: string, title: string, level: string, duration: string, description: string, image: string, summary: string, professionalUse: string, modules: CourseModule[]): Course => ({ slug, code, title, level, duration, description, image, summary, professionalUse, modules });

const baseCourses: Course[] = [
	common("excel-avanzado", "B1", "Excel Avanzado", "Intermedio", "6 semanas", "Tablas dinámicas, fórmulas avanzadas y automatización.", images.excel, "Aprenderás a organizar, analizar y automatizar información en Excel mediante fórmulas avanzadas, tablas dinámicas y reportes claros.", "Te ayudará a crear reportes, controlar presupuestos, analizar ventas y presentar información para tomar decisiones.", [module("Fundamentos para trabajar con datos", [lesson("Estructura de una base de datos", ["Tablas y registros", "Tipos de datos", "Orden y filtros"]), lesson("Fórmulas esenciales", ["Referencias absolutas y relativas", "Funciones lógicas", "Funciones de texto y fecha"])]), module("Análisis y visualización", [lesson("Tablas dinámicas", ["Campos y segmentaciones", "Agrupación de información", "Indicadores de resumen"]), lesson("Dashboards en Excel", ["Gráficos adecuados", "Diseño de reportes", "Presentación de hallazgos"])]), module("Automatización aplicada", [lesson("Procesos eficientes", ["Validación de datos", "Plantillas reutilizables", "Introducción a macros"])])]),
	common("power-bi-desde-cero", "B2", "Power BI desde Cero", "Principiante", "5 semanas", "Dashboards reales conectando y modelando datos.", images.powerBi, "Construirás dashboards interactivos desde cero, conectando fuentes, limpiando datos y creando visualizaciones.", "Podrás apoyar decisiones comerciales y operativas con indicadores y paneles de resultados.", [module("Primeros pasos con Power BI", [lesson("Entorno y fuentes", ["Interfaz", "Importación de Excel y CSV", "Tipos de visualización"])]), module("Preparación y modelo de datos", [lesson("Datos listos para analizar", ["Limpieza básica", "Relaciones entre tablas", "Modelo estrella"])]), module("Dashboard final", [lesson("Indicadores para decisiones", ["Medidas básicas", "Filtros y segmentadores", "Publicación de un informe"], "/videos/power-bi-desde-cero/modulo-03-dashboard-final/clase-01-indicadores/AQMv6X025x31BrL_5X8E6vOwYy__mKHKxAgtJWgX0h2JnPbEHYGAmKIChT0TlEPDAtMy7NUZMruaB4Om1i3gYR7cye6vWltXvbs.mp4")])]),
	common("python-para-datos", "B3", "Python para Datos", "Intermedio", "8 semanas", "Pandas, visualización y automatización de reportes.", images.python, "Aprenderás a usar Python para cargar, limpiar, explorar y visualizar datos.", "Te permitirá automatizar reportes y analizar grandes volúmenes de información.", [module("Python y pensamiento lógico", [lesson("Bases del lenguaje", ["Variables", "Condicionales y ciclos", "Funciones"])]), module("Análisis con Pandas", [lesson("Trabajar con datos", ["DataFrames", "Limpieza", "Agrupaciones y métricas"])]), module("Proyecto de análisis", [lesson("Reporte automatizado", ["Gráficos", "Conclusiones", "Exportación de resultados"])])]),
	common("sql-para-analisis", "B4", "SQL para Análisis", "Principiante", "4 semanas", "Consultas, filtros y relaciones entre tablas.", images.sql, "Aprenderás a consultar bases de datos con SQL, seleccionar información relevante y unir tablas.", "Es una competencia clave para analistas y equipos que extraen información de sistemas empresariales.", [module("Consultas básicas", [lesson("Leer información", ["SELECT", "WHERE", "ORDER BY y LIMIT"])]), module("Cruce y resumen de datos", [lesson("Relaciones", ["JOIN", "GROUP BY", "Funciones de agregación"])]), module("Consultas para decisiones", [lesson("Análisis práctico", ["Subconsultas", "Indicadores", "Caso de negocio"])])]),
	common("power-query", "B5", "Power Query", "Intermedio", "3 semanas", "Limpieza y transformación de datos paso a paso.", images.query, "Dominarás un flujo para importar, limpiar y transformar datos de distintas fuentes.", "Te ayudará a estandarizar bases de datos y ahorrar tiempo en reportes recurrentes.", [module("Conectar fuentes", [lesson("Importación organizada", ["Excel y CSV", "Tipos de origen", "Actualización de consultas"])]), module("Limpiar y transformar", [lesson("Preparar datos", ["Valores nulos", "Dividir y combinar columnas", "Unir consultas"])])]),
	common("introduccion-a-la-ia", "B6", "Introducción a la IA", "Principiante", "5 semanas", "Fundamentos prácticos de inteligencia artificial aplicada.", images.ai, "Conocerás conceptos esenciales de inteligencia artificial y utilizarás herramientas de forma responsable.", "Te permitirá identificar oportunidades de automatización y adaptarte a nuevas herramientas.", [module("Comprender la IA", [lesson("Conceptos esenciales", ["IA, datos y modelos", "Usos cotidianos", "Limitaciones y sesgos"])]), module("IA para aprender y trabajar", [lesson("Herramientas responsables", ["Prompts claros", "Verificación de resultados", "Privacidad y ética"])]), module("Proyecto aplicado", [lesson("Solución con IA", ["Definir un problema", "Prototipo", "Presentar resultados"])])]),
	common("investigacion-aplicada", "B7", "Investigación Aplicada", "Principiante", "6 semanas", "Diseña investigaciones claras con datos, fuentes confiables y resultados útiles.", images.research, "Aprenderás a transformar una idea en una investigación ordenada, formulando problemas, objetivos y preguntas.", "Te ayudará a elaborar proyectos, diagnósticos, informes y propuestas con evidencia.", [module("Bases de la investigación", [lesson("Del problema a la pregunta", ["Identificación del problema", "Justificación", "Preguntas de investigación"]), lesson("Objetivos y variables", ["Objetivo general y específicos", "Variables e indicadores", "Alcance del estudio"])]), module("Fuentes y metodología", [lesson("Buscar información confiable", ["Fuentes académicas", "Antecedentes", "Citas y referencias"]), lesson("Diseño metodológico", ["Enfoques de investigación", "Población y muestra", "Instrumentos"])]), module("Análisis y presentación", [lesson("Resultados y conclusiones", ["Organización de datos", "Interpretación", "Informe final"])])]),
	common("programacion-desarrollo-web", "B8", "Programación y Desarrollo Web", "Principiante", "8 semanas", "Crea páginas web modernas desde la estructura hasta la publicación.", images.web, "Construirás una página web funcional aprendiendo HTML, CSS y JavaScript.", "Te permitirá crear portafolios, sitios para emprendimientos y prototipos digitales.", [module("Fundamentos de la web", [lesson("Cómo funciona una página", ["Navegador y servidor", "HTML semántico", "Estructura de un documento"]), lesson("Primer proyecto", ["Textos e imágenes", "Enlaces y formularios", "Organización de carpetas"])]), module("Diseño y estilos", [lesson("CSS desde cero", ["Selectores", "Colores y tipografía", "Modelo de caja"]), lesson("Diseño responsive", ["Flexbox y Grid", "Adaptación a celulares", "Accesibilidad"])]), module("Interactividad y publicación", [lesson("JavaScript básico", ["Variables y funciones", "Eventos", "Validación"]), lesson("Publicar un sitio", ["Git", "Hosting", "Proyecto final"])])]),
	common("finanzas-para-emprendedores", "B9", "Finanzas para Emprendedores", "Principiante", "5 semanas", "Organiza tus finanzas y toma mejores decisiones para tu negocio.", images.finance, "Aprenderás a ordenar ingresos y gastos, elaborar presupuestos, calcular costos y leer indicadores financieros.", "Te ayudará a controlar el flujo de caja, definir precios y evaluar inversiones.", [module("Orden financiero", [lesson("Ingresos y gastos", ["Clasificación", "Registro financiero", "Separar finanzas personales"]), lesson("Presupuesto", ["Metas", "Presupuesto mensual", "Escenarios"])]), module("Costos y precios", [lesson("Conocer los costos", ["Costos fijos y variables", "Punto de equilibrio", "Margen"]), lesson("Definir precios", ["Costos", "Valor para el cliente", "Competencia"])]), module("Decisiones y crecimiento", [lesson("Flujo de caja", ["Entradas y salidas", "Liquidez", "Proyección"]), lesson("Indicadores básicos", ["Rentabilidad", "Endeudamiento", "Plan financiero"])])]),
];

const currentTopics: Record<string, string[]> = {
	"excel-avanzado": ["Automatización de reportes", "Buenas prácticas de documentación"],
	"power-bi-desde-cero": ["KPIs comerciales", "Narrativa con datos"],
	"python-para-datos": ["Automatización con scripts", "Control de calidad del análisis"],
	"sql-para-analisis": ["CTE y consultas legibles", "Seguridad de acceso a datos"],
	"power-query": ["Parámetros y actualización", "Control de calidad de datos"],
	"introduccion-a-la-ia": ["Automatización de tareas", "IA generativa en el trabajo"],
	"investigacion-aplicada": ["Alfabetización informacional", "Presentación de evidencia"],
	"programacion-desarrollo-web": ["GitHub", "Seguridad básica", "Optimización para buscadores"],
	"finanzas-para-emprendedores": ["Flujo de caja proyectado", "Decisiones basadas en datos"],
};

const essentialTopics: Record<string, string[][]> = {
	"excel-avanzado": [["Formato de tablas", "Calidad de datos"], ["BUSCARX", "SUMAR.SI.CONJUNTO"], ["Campos calculados", "Segmentadores"], ["Jerarquía visual", "Diseño para decisiones"], ["Macros grabadas", "Protección de hojas"], ["Caso de ventas", "Dashboard final"]],
	"power-bi-desde-cero": [["Power Query", "Tipos de datos"], ["Tabla calendario", "Cardinalidad"], ["DAX básico", "Medidas y columnas"], ["KPIs comerciales", "Segmentadores"], ["Narrativa con datos", "Interacciones visuales"], ["Dashboard ejecutivo", "Publicación responsable"]],
	"python-para-datos": [["Entorno de trabajo", "Archivos CSV"], ["Listas y diccionarios", "Manejo de errores"], ["Lectura de archivos", "Valores nulos"], ["Filtros y agrupaciones", "Funciones de agregación"], ["Gráficos con Matplotlib", "Interpretación"], ["Reporte reproducible", "Exportación de resultados"]],
	"sql-para-analisis": [["Modelo relacional", "Claves primarias"], ["SELECT y alias", "Filtros con WHERE"], ["JOIN internos y externos", "Relaciones"], ["GROUP BY", "HAVING"], ["CTE y consultas legibles", "Subconsultas"], ["Indicadores de negocio", "Seguridad de acceso a datos"]],
	"power-query": [["Conectores", "Tipos de datos"], ["Filas y columnas", "Valores nulos"], ["Combinar consultas", "Anexar consultas"], ["Columnas condicionales", "Parámetros"], ["Actualización de consultas", "Control de calidad de datos"], ["Flujo de limpieza", "Documentación de pasos"]],
	"introduccion-a-la-ia": [["Tipos de IA", "Datos de entrenamiento"], ["Casos de uso", "Automatización de tareas"], ["Prompt con contexto", "Formato de respuesta"], ["Verificación de resultados", "Fuentes"], ["Privacidad y ética", "Sesgos"], ["Prototipo de solución", "Plan de implementación"]],
	"investigacion-aplicada": [["Delimitación del problema", "Justificación"], ["Preguntas de investigación", "Objetivos medibles"], ["Búsqueda académica", "Citas y referencias"], ["Enfoque metodológico", "Población y muestra"], ["Diseño de instrumentos", "Matriz de variables"], ["Análisis de resultados", "Conclusiones y recomendaciones"]],
	"programacion-desarrollo-web": [["HTML semántico", "Estructura de proyecto"], ["Formularios", "Accesibilidad web"], ["Selectores CSS", "Modelo de caja"], ["Flexbox", "Grid responsive"], ["Eventos", "Validación de formularios"], ["GitHub", "Publicación del sitio"]],
	"finanzas-para-emprendedores": [["Ingresos y gastos", "Registro financiero"], ["Metas financieras", "Presupuesto mensual"], ["Costos fijos y variables", "Punto de equilibrio"], ["Estrategia de precios", "Margen"], ["Flujo de caja", "Liquidez"], ["Proyecciones", "Decisiones basadas en datos"]],
};

const bloomLevels: BloomLevel[] = ["recordar", "comprender", "aplicar", "analizar", "evaluar", "crear"];

const graduateProfiles: Record<string, string> = {
	"excel-avanzado": "Al finalizar, el estudiante organiza, analiza y automatiza información en Excel para elaborar reportes y dashboards que apoyen decisiones de negocio.",
	"power-bi-desde-cero": "Al finalizar, el estudiante construye y comunica dashboards interactivos en Power BI a partir de datos preparados para la toma de decisiones.",
	"python-para-datos": "Al finalizar, el estudiante desarrolla scripts de Python para limpiar, analizar y visualizar datos, generando reportes reproducibles.",
	"sql-para-analisis": "Al finalizar, el estudiante consulta y relaciona bases de datos con SQL para responder preguntas de negocio mediante indicadores confiables.",
	"power-query": "Al finalizar, el estudiante diseña procesos reutilizables de importación, limpieza y transformación de datos con Power Query.",
	"introduccion-a-la-ia": "Al finalizar, el estudiante identifica oportunidades de uso responsable de IA y propone soluciones verificables para tareas reales.",
	"investigacion-aplicada": "Al finalizar, el estudiante diseña y comunica una investigación aplicada con problema, metodología, evidencia y conclusiones claras.",
	"programacion-desarrollo-web": "Al finalizar, el estudiante crea y publica una página web responsive que integra estructura, estilos e interacciones básicas.",
	"finanzas-para-emprendedores": "Al finalizar, el estudiante elabora herramientas financieras para controlar, proyectar y decidir sobre un emprendimiento.",
};

function learningOutcomes(courseTitle: string): LearningOutcome[] {
	return [
		{ bloomLevel: "recordar", outcome: `Identifica los conceptos, herramientas y términos fundamentales de ${courseTitle}.` },
		{ bloomLevel: "comprender", outcome: `Explica cómo los conceptos de ${courseTitle} se relacionan con una necesidad real.` },
		{ bloomLevel: "aplicar", outcome: `Aplica procedimientos de ${courseTitle} para resolver un ejercicio guiado.` },
		{ bloomLevel: "analizar", outcome: `Analiza datos, resultados o decisiones mediante las herramientas de ${courseTitle}.` },
		{ bloomLevel: "evaluar", outcome: `Evalúa la calidad de una solución de ${courseTitle} usando criterios definidos.` },
		{ bloomLevel: "crear", outcome: `Crea un proyecto funcional de ${courseTitle} que responda a una situación real.` },
	];
}

export const courses: Course[] = baseCourses.map((course) => ({
	...course,
	graduateProfile: graduateProfiles[course.slug],
	learningOutcomes: learningOutcomes(course.title),
	modules: course.modules.map((courseModule, moduleIndex) => ({
		...courseModule,
		bloomLevel: bloomLevels[Math.min(moduleIndex * 2, bloomLevels.length - 1)],
		learningOutcome: learningOutcomes(course.title)[Math.min(moduleIndex * 2, bloomLevels.length - 1)].outcome,
		lessons: courseModule.lessons.map((lesson, lessonIndex) => ({
			...lesson,
			topics: moduleIndex === course.modules.length - 1 && lessonIndex === courseModule.lessons.length - 1
				? [...lesson.topics, ...(essentialTopics[course.slug]?.slice(-2).flat() ?? []), ...(currentTopics[course.slug] ?? [])]
				: [...lesson.topics, ...(essentialTopics[course.slug]?.[moduleIndex * 2 + lessonIndex] ?? [])],
		})),
	})),
}));

export function getCourse(slug: string) { return courses.find((course) => course.slug === slug); }
