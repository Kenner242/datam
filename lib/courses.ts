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
	presentationVideoUrl?: string;
	graduateProfile?: string;
	learningOutcomes?: LearningOutcome[];
	modules: CourseModule[];
};

const images = {
	excel: "/images/tools/excel.svg",
	powerBi: "/images/tools/power%20bi.png",
	python: "https://cdn.simpleicons.org/python/3776AB",
	sql: "https://cdn.simpleicons.org/postgresql/4169E1",
	english: "https://cdn.simpleicons.org/duolingo/58CC02",
	ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
	research: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
	web: "https://cdn.simpleicons.org/html5/E34F26",
	finance: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
};

const lesson = (title: string, topics: string[], videoUrl?: string): Lesson => ({ title, topics, videoUrl });
const module = (title: string, lessons: Lesson[]): CourseModule => ({ title, lessons });
const common = (slug: string, code: string, title: string, level: string, duration: string, description: string, image: string, summary: string, professionalUse: string, modules: CourseModule[]): Course => ({ slug, code, title, level, duration, description, image, summary, professionalUse, modules });

const baseCourses: Course[] = [
	// Excel
	common("excel-basico", "B1", "Excel Básico", "Básico", "4 semanas", "Primeros pasos para organizar y calcular información en Excel.", images.excel, "Aprenderás la interfaz, fórmulas esenciales y el orden de datos para empezar a trabajar con hojas de cálculo con confianza.", "Te permitirá llevar registros simples, calcular totales y presentar información ordenada en cualquier trabajo.", [module("Primeros pasos en Excel", [lesson("Interfaz y navegación", ["Celdas, filas y columnas", "Tipos de datos", "Guardar y compartir archivos"], "https://youtu.be/hoCmAgr-oLM?si=rrnP6V4Hs-V4ZSC6"), lesson("Fórmulas básicas", ["Suma, promedio y conteo", "Referencias relativas", "Orden de operaciones"])]), module("Organizar y presentar datos", [lesson("Tablas y formato", ["Formato como tabla", "Filtros simples", "Formato condicional básico"]), lesson("Funciones esenciales", ["Función SI", "CONTAR.SI", "BUSCARV básico"])])]),
	common("excel-intermedio", "B2", "Excel Intermedio", "Intermedio", "6 semanas", "Tablas dinámicas, fórmulas avanzadas y automatización.", images.excel, "Aprenderás a organizar, analizar y automatizar información en Excel mediante fórmulas avanzadas, tablas dinámicas y reportes claros.", "Te ayudará a crear reportes, controlar presupuestos, analizar ventas y presentar información para tomar decisiones.", [module("Fundamentos para trabajar con datos", [lesson("Estructura de una base de datos", ["Tablas y registros", "Tipos de datos", "Orden y filtros"]), lesson("Fórmulas esenciales", ["Referencias absolutas y relativas", "Funciones lógicas", "Funciones de texto y fecha"])]), module("Análisis y visualización", [lesson("Tablas dinámicas", ["Campos y segmentaciones", "Agrupación de información", "Indicadores de resumen"]), lesson("Dashboards en Excel", ["Gráficos adecuados", "Diseño de reportes", "Presentación de hallazgos"])]), module("Automatización aplicada", [lesson("Procesos eficientes", ["Validación de datos", "Plantillas reutilizables", "Introducción a macros"])])]),
	common("excel-avanzado", "B3", "Excel Avanzado", "Avanzado", "6 semanas", "Automatiza y modela datos combinando Power Query, Power Pivot y macros.", images.excel, "Dominarás fórmulas avanzadas, Power Query, Power Pivot y macros básicas para construir soluciones robustas de análisis en Excel.", "Te permitirá automatizar procesos repetitivos, consolidar múltiples fuentes y construir modelos de datos confiables para decisiones complejas.", [module("Conectar y transformar datos", [lesson("Importación organizada", ["Excel y CSV", "Tipos de origen", "Actualización de consultas"]), lesson("Preparar datos con Power Query", ["Valores nulos", "Dividir y combinar columnas", "Unir consultas"])]), module("Fórmulas y modelado avanzado", [lesson("Fórmulas de nivel avanzado", ["BUSCARX e INDICE/COINCIDIR", "Fórmulas matriciales", "Funciones anidadas"]), lesson("Power Pivot y modelo de datos", ["Tablas relacionadas", "Medidas con DAX básico", "Modelo de datos en Excel"])]), module("Automatización con macros", [lesson("Macros y VBA básico", ["Grabadora de macros", "Editor de VBA", "Protección y seguridad de archivos"])])]),
	// Power BI
	common("power-bi-basico", "B4", "Power BI Básico", "Básico", "5 semanas", "Dashboards reales conectando y modelando datos.", images.powerBi, "Construirás dashboards interactivos desde cero, conectando fuentes, limpiando datos y creando visualizaciones.", "Podrás apoyar decisiones comerciales y operativas con indicadores y paneles de resultados.", [module("Primeros pasos con Power BI", [lesson("Entorno y fuentes", ["Interfaz", "Importación de Excel y CSV", "Tipos de visualización"])]), module("Preparación y modelo de datos", [lesson("Datos listos para analizar", ["Limpieza básica", "Relaciones entre tablas", "Modelo estrella"])]), module("Dashboard final", [lesson("Indicadores para decisiones", ["Medidas básicas", "Filtros y segmentadores", "Publicación de un informe"])])]),
	common("power-bi-intermedio", "B5", "Power BI Intermedio", "Intermedio", "5 semanas", "Modela datos y crea medidas DAX intermedias para análisis más profundos.", images.powerBi, "Profundizarás en relaciones complejas, funciones DAX intermedias y técnicas de modelado para responder preguntas de negocio más avanzadas.", "Te permitirá construir modelos de datos escalables y métricas confiables para áreas comerciales, financieras u operativas.", [module("Modelado de datos intermedio", [lesson("Relaciones y cardinalidad", ["Relaciones activas e inactivas", "Cardinalidad uno a muchos", "Tablas de hechos y dimensiones"]), lesson("Tabla calendario", ["Funciones de fecha", "Calendario personalizado", "Marcado como tabla de fechas"])]), module("DAX intermedio", [lesson("Funciones CALCULATE y filtros", ["CALCULATE", "ALL y ALLSELECTED", "Contexto de fila y de filtro"]), lesson("Medidas de tiempo", ["Comparativos año contra año", "Acumulados", "Variaciones porcentuales"])])]),
	common("power-bi-avanzado", "B6", "Power BI Avanzado", "Avanzado", "6 semanas", "Seguridad, rendimiento y publicación profesional de soluciones en Power BI.", images.powerBi, "Aprenderás seguridad a nivel de fila, optimización del modelo y buenas prácticas para publicar y gobernar informes en Power BI Service.", "Te permitirá liderar proyectos de Business Intelligence con informes seguros, escalables y bien gobernados en una organización.", [module("Seguridad y gobierno de datos", [lesson("Seguridad a nivel de fila (RLS)", ["Roles estáticos y dinámicos", "Pruebas de roles", "Buenas prácticas de acceso"]), lesson("Publicación en Power BI Service", ["Workspaces", "Actualización programada", "Permisos y distribución"])]), module("Optimización y DAX avanzado", [lesson("Rendimiento del modelo", ["Reducción de columnas", "Variables en DAX", "Análisis de rendimiento"]), lesson("DAX avanzado", ["Funciones iteradoras", "Tablas virtuales", "Patrones de análisis de negocio"])])]),
	// SQL
	common("sql-basico", "B7", "SQL Básico", "Básico", "4 semanas", "Consultas, filtros y relaciones entre tablas.", images.sql, "Aprenderás a consultar bases de datos con SQL, seleccionar información relevante y unir tablas.", "Es una competencia clave para analistas y equipos que extraen información de sistemas empresariales.", [module("Consultas básicas", [lesson("Leer información", ["SELECT", "WHERE", "ORDER BY y LIMIT"])]), module("Cruce y resumen de datos", [lesson("Relaciones", ["JOIN", "GROUP BY", "Funciones de agregación"])]), module("Consultas para decisiones", [lesson("Análisis práctico", ["Subconsultas", "Indicadores", "Caso de negocio"])])]),
	common("sql-intermedio", "B8", "SQL Intermedio", "Intermedio", "4 semanas", "Combina, agrupa y organiza consultas más complejas con SQL.", images.sql, "Profundizarás en joins múltiples, subconsultas y funciones para responder preguntas de negocio con consultas más elaboradas.", "Te permitirá construir reportes y análisis que combinan varias tablas de un sistema empresarial.", [module("Combinar múltiples tablas", [lesson("Joins avanzados", ["INNER y LEFT JOIN combinados", "Uniones de tres o más tablas", "Alias y legibilidad"]), lesson("Subconsultas", ["Subconsultas en WHERE", "Subconsultas correlacionadas", "Subconsultas en el FROM"])]), module("Funciones y organización de datos", [lesson("Funciones de ventana básicas", ["ROW_NUMBER", "RANK", "Particiones con PARTITION BY"]), lesson("Vistas y CTE", ["Common Table Expressions", "Vistas reutilizables", "Consultas legibles"])])]),
	common("sql-avanzado", "B9", "SQL Avanzado", "Avanzado", "5 semanas", "Optimiza consultas y trabaja con procedimientos y transacciones.", images.sql, "Aprenderás optimización de consultas, funciones de ventana avanzadas, procedimientos almacenados y control de transacciones.", "Te permitirá administrar bases de datos de producción y construir consultas de alto rendimiento.", [module("Rendimiento y análisis avanzado", [lesson("Funciones de ventana avanzadas", ["LAG y LEAD", "Acumulados y promedios móviles", "Percentiles"]), lesson("Optimización de consultas", ["Índices", "Planes de ejecución", "Buenas prácticas de rendimiento"])]), module("Procedimientos y transacciones", [lesson("Procedimientos almacenados", ["Parámetros", "Reutilización de lógica", "Control de errores"]), lesson("Transacciones y seguridad", ["COMMIT y ROLLBACK", "Niveles de aislamiento", "Permisos de acceso"])])]),
	// Python
	common("python-basico", "B10", "Python Básico", "Básico", "5 semanas", "Lógica de programación y bases del lenguaje Python desde cero.", images.python, "Aprenderás variables, estructuras de control, funciones y buenas prácticas para escribir tus primeros programas en Python.", "Te dará las bases para automatizar tareas simples y continuar hacia el análisis de datos.", [module("Fundamentos del lenguaje", [lesson("Variables y tipos de datos", ["Números y texto", "Booleanos", "Entrada y salida de datos"]), lesson("Estructuras de control", ["Condicionales", "Ciclos for y while", "Buenas prácticas de código"])]), module("Estructuras de datos y funciones", [lesson("Listas y diccionarios", ["Listas", "Diccionarios", "Recorrido de estructuras"]), lesson("Funciones propias", ["Parámetros y retorno", "Funciones reutilizables", "Manejo básico de errores"])])]),
	common("python-intermedio", "B11", "Python Intermedio", "Intermedio", "8 semanas", "Pandas, visualización y automatización de reportes.", images.python, "Aprenderás a usar Python para cargar, limpiar, explorar y visualizar datos.", "Te permitirá automatizar reportes y analizar grandes volúmenes de información.", [module("Python y pensamiento lógico", [lesson("Bases del lenguaje", ["Variables", "Condicionales y ciclos", "Funciones"])]), module("Análisis con Pandas", [lesson("Trabajar con datos", ["DataFrames", "Limpieza", "Agrupaciones y métricas"])]), module("Proyecto de análisis", [lesson("Reporte automatizado", ["Gráficos", "Conclusiones", "Exportación de resultados"])])]),
	common("python-avanzado", "B12", "Python Avanzado", "Avanzado", "8 semanas", "Programación orientada a objetos, APIs y automatización avanzada.", images.python, "Aprenderás POO, consumo de APIs, buenas prácticas de testing y automatización de procesos con Python.", "Te permitirá construir scripts y aplicaciones más robustas, mantenibles y conectadas a otros sistemas.", [module("Programación orientada a objetos", [lesson("Clases y objetos", ["Atributos y métodos", "Encapsulamiento", "Herencia básica"]), lesson("Buenas prácticas de código", ["Módulos y paquetes", "Entornos virtuales", "Pruebas unitarias básicas"])]), module("Automatización y conexión de datos", [lesson("Consumo de APIs", ["Peticiones HTTP", "Formato JSON", "Autenticación básica"]), lesson("Automatización de procesos", ["Programación de tareas", "Manejo de archivos", "Proyecto de automatización"])])]),
	// Inglés
	common("ingles-basico", "B13", "Inglés Básico", "Básico", "6 semanas", "Comunicación esencial en inglés para el día a día.", images.english, "Aprenderás vocabulario, gramática básica y frases útiles para presentarte, describir rutinas y mantener conversaciones simples.", "Te permitirá comunicarte en situaciones cotidianas y comprender textos e instrucciones sencillas en inglés.", [module("Bases del idioma", [lesson("Presentaciones y saludos", ["Vocabulario personal", "Verbo to be", "Preguntas básicas"]), lesson("Presente simple", ["Rutinas diarias", "Adverbios de frecuencia", "Vocabulario cotidiano"])]), module("Comunicación cotidiana", [lesson("Vocabulario funcional", ["Números y horas", "Lugares y direcciones", "Compras simples"]), lesson("Conversaciones simples", ["Preguntar y responder", "Pronunciación básica", "Práctica auditiva"])])]),
	common("ingles-intermedio", "B14", "Inglés Intermedio", "Intermedio", "6 semanas", "Amplía tu fluidez con gramática intermedia y contextos laborales.", images.english, "Practicarás tiempos pasados, correos y conversaciones de contexto laboral para comunicarte con mayor fluidez.", "Te permitirá escribir correos, participar en reuniones simples y comprender textos de nivel intermedio.", [module("Gramática intermedia", [lesson("Pasado simple y continuo", ["Verbos regulares e irregulares", "Narrar experiencias", "Conectores de tiempo"]), lesson("Futuro y condicionales", ["Planes y predicciones", "Condicionales simples", "Expresar posibilidad"])]), module("Inglés para el trabajo", [lesson("Correos y mensajes", ["Estructura de un email", "Tono formal e informal", "Vocabulario de oficina"]), lesson("Conversación profesional", ["Reuniones simples", "Presentarse en el trabajo", "Small talk"])])]),
	common("ingles-avanzado", "B15", "Inglés Avanzado", "Avanzado", "7 semanas", "Comunicación profesional avanzada para negociar y presentar en inglés.", images.english, "Perfeccionarás la redacción profesional, presentaciones efectivas y estrategias de negociación en inglés.", "Te permitirá liderar presentaciones, negociar y comunicarte con seguridad en entornos internacionales.", [module("Comunicación profesional avanzada", [lesson("Redacción avanzada", ["Reportes y propuestas", "Cohesión y coherencia", "Registro formal"]), lesson("Presentaciones efectivas", ["Estructura de una presentación", "Lenguaje persuasivo", "Manejo de preguntas"])]), module("Negociación y fluidez", [lesson("Negociación en inglés", ["Vocabulario de negociación", "Argumentar una postura", "Llegar a acuerdos"]), lesson("Fluidez y matices", ["Expresiones idiomáticas", "Tono y matices", "Debate estructurado"])])]),
	// Programación y Desarrollo Web (curso único, sin niveles)
	common("programacion-desarrollo-web", "B16", "Programación y Desarrollo Web", "Principiante", "8 semanas", "Crea páginas web modernas desde la estructura hasta la publicación.", images.web, "Construirás una página web funcional aprendiendo HTML, CSS y JavaScript.", "Te permitirá crear portafolios, sitios para emprendimientos y prototipos digitales.", [module("Fundamentos de la web", [lesson("Cómo funciona una página", ["Navegador y servidor", "HTML semántico", "Estructura de un documento"]), lesson("Primer proyecto", ["Textos e imágenes", "Enlaces y formularios", "Organización de carpetas"])]), module("Diseño y estilos", [lesson("CSS desde cero", ["Selectores", "Colores y tipografía", "Modelo de caja"]), lesson("Diseño responsive", ["Flexbox y Grid", "Adaptación a celulares", "Accesibilidad"])]), module("Interactividad y publicación", [lesson("JavaScript básico", ["Variables y funciones", "Eventos", "Validación"]), lesson("Publicar un sitio", ["Git", "Hosting", "Proyecto final"])])]),
	// Introducción a la IA (curso único, sin niveles)
	common("introduccion-a-la-ia", "B17", "Introducción a la IA", "Principiante", "5 semanas", "Fundamentos prácticos de inteligencia artificial aplicada.", images.ai, "Conocerás conceptos esenciales de inteligencia artificial y utilizarás herramientas de forma responsable.", "Te permitirá identificar oportunidades de automatización y adaptarte a nuevas herramientas.", [module("Comprender la IA", [lesson("Conceptos esenciales", ["IA, datos y modelos", "Usos cotidianos", "Limitaciones y sesgos"])]), module("IA para aprender y trabajar", [lesson("Herramientas responsables", ["Prompts claros", "Verificación de resultados", "Privacidad y ética"])]), module("Proyecto aplicado", [lesson("Solución con IA", ["Definir un problema", "Prototipo", "Presentar resultados"])])]),
	// Investigación Aplicada (curso único, sin niveles)
	common("investigacion-aplicada", "B18", "Investigación Aplicada", "Principiante", "6 semanas", "Diseña investigaciones claras con datos, fuentes confiables y resultados útiles.", images.research, "Aprenderás a transformar una idea en una investigación ordenada, formulando problemas, objetivos y preguntas.", "Te ayudará a elaborar proyectos, diagnósticos, informes y propuestas con evidencia.", [module("Bases de la investigación", [lesson("Del problema a la pregunta", ["Identificación del problema", "Justificación", "Preguntas de investigación"]), lesson("Objetivos y variables", ["Objetivo general y específicos", "Variables e indicadores", "Alcance del estudio"])]), module("Fuentes y metodología", [lesson("Buscar información confiable", ["Fuentes académicas", "Antecedentes", "Citas y referencias"]), lesson("Diseño metodológico", ["Enfoques de investigación", "Población y muestra", "Instrumentos"])]), module("Análisis y presentación", [lesson("Resultados y conclusiones", ["Organización de datos", "Interpretación", "Informe final"])])]),
	// Finanzas para Emprendedores (curso único, sin niveles)
	common("finanzas-para-emprendedores", "B19", "Finanzas para Emprendedores", "Principiante", "5 semanas", "Organiza tus finanzas y toma mejores decisiones para tu negocio.", images.finance, "Aprenderás a ordenar ingresos y gastos, elaborar presupuestos, calcular costos y leer indicadores financieros.", "Te ayudará a controlar el flujo de caja, definir precios y evaluar inversiones.", [module("Orden financiero", [lesson("Ingresos y gastos", ["Clasificación", "Registro financiero", "Separar finanzas personales"]), lesson("Presupuesto", ["Metas", "Presupuesto mensual", "Escenarios"])]), module("Costos y precios", [lesson("Conocer los costos", ["Costos fijos y variables", "Punto de equilibrio", "Margen"]), lesson("Definir precios", ["Costos", "Valor para el cliente", "Competencia"])]), module("Decisiones y crecimiento", [lesson("Flujo de caja", ["Entradas y salidas", "Liquidez", "Proyección"]), lesson("Indicadores básicos", ["Rentabilidad", "Endeudamiento", "Plan financiero"])])]),
];

const currentTopics: Record<string, string[]> = {
	"excel-basico": ["Plantillas listas para usar", "Buenas prácticas de organización"],
	"excel-intermedio": ["Automatización de reportes", "Buenas prácticas de documentación"],
	"excel-avanzado": ["Automatización con macros", "Modelos de datos escalables"],
	"power-bi-basico": ["KPIs comerciales", "Narrativa con datos"],
	"power-bi-intermedio": ["Modelos de datos escalables", "Medidas reutilizables"],
	"power-bi-avanzado": ["Gobierno de datos", "Publicación segura en Power BI Service"],
	"sql-basico": ["CTE y consultas legibles", "Seguridad de acceso a datos"],
	"sql-intermedio": ["Consultas legibles y mantenibles", "Reportes multi-tabla"],
	"sql-avanzado": ["Optimización de rendimiento", "Seguridad de bases de datos"],
	"python-basico": ["Automatización de tareas simples", "Bases para análisis de datos"],
	"python-intermedio": ["Automatización con scripts", "Control de calidad del análisis"],
	"python-avanzado": ["Integración con APIs", "Automatización de procesos"],
	"ingles-basico": ["Comunicación cotidiana", "Comprensión de instrucciones simples"],
	"ingles-intermedio": ["Correos de trabajo", "Conversación profesional"],
	"ingles-avanzado": ["Presentaciones profesionales", "Negociación en inglés"],
	"programacion-desarrollo-web": ["GitHub", "Seguridad básica", "Optimización para buscadores"],
	"introduccion-a-la-ia": ["Automatización de tareas", "IA generativa en el trabajo"],
	"investigacion-aplicada": ["Alfabetización informacional", "Presentación de evidencia"],
	"finanzas-para-emprendedores": ["Flujo de caja proyectado", "Decisiones basadas en datos"],
};

const essentialTopics: Record<string, string[][]> = {
	"excel-basico": [["Buenas prácticas de nomenclatura", "Orden de celdas"], ["Prioridad de operadores", "Errores comunes de fórmulas"], ["Diseño de tablas simples", "Consistencia de datos"], ["Validación con listas", "Casos prácticos de negocio"]],
	"excel-intermedio": [["Formato de tablas", "Calidad de datos"], ["BUSCARX", "SUMAR.SI.CONJUNTO"], ["Campos calculados", "Segmentadores"], ["Jerarquía visual", "Diseño para decisiones"], ["Macros grabadas", "Protección de hojas"], ["Caso de ventas", "Dashboard final"]],
	"excel-avanzado": [["Conectores de datos", "Actualización automática"], ["Transformación de columnas", "Consultas reutilizables"], ["Búsquedas dinámicas", "Fórmulas anidadas"], ["Relaciones de tablas", "Medidas DAX básicas"]],
	"power-bi-basico": [["Power Query", "Tipos de datos"], ["Tabla calendario", "Cardinalidad"], ["DAX básico", "Medidas y columnas"], ["KPIs comerciales", "Segmentadores"], ["Narrativa con datos", "Interacciones visuales"], ["Dashboard ejecutivo", "Publicación responsable"]],
	"power-bi-intermedio": [["Relaciones activas e inactivas", "Modelo estrella avanzado"], ["Tablas de fechas personalizadas", "Funciones de tiempo"], ["Contexto de filtro", "Funciones ALL"], ["Comparativos temporales", "Indicadores acumulados"]],
	"power-bi-avanzado": [["Roles estáticos y dinámicos", "Pruebas de seguridad"], ["Workspaces", "Actualización programada"], ["Optimización del modelo", "Variables en DAX"], ["Tablas virtuales", "Patrones de análisis"]],
	"sql-basico": [["Modelo relacional", "Claves primarias"], ["SELECT y alias", "Filtros con WHERE"], ["JOIN internos y externos", "Relaciones"], ["GROUP BY", "HAVING"], ["CTE y consultas legibles", "Subconsultas"], ["Indicadores de negocio", "Seguridad de acceso a datos"]],
	"sql-intermedio": [["Uniones múltiples", "Alias legibles"], ["Subconsultas correlacionadas", "Subconsultas en el FROM"], ["Funciones de ventana básicas", "Particiones de datos"], ["CTE reutilizables", "Vistas de consulta"]],
	"sql-avanzado": [["LAG y LEAD", "Promedios móviles"], ["Índices", "Planes de ejecución"], ["Procedimientos parametrizados", "Control de errores"], ["Transacciones seguras", "Niveles de aislamiento"]],
	"python-basico": [["Sintaxis clara", "Buenas prácticas de código"], ["Condicionales anidados", "Ciclos eficientes"], ["Recorrido de listas", "Acceso a diccionarios"], ["Funciones reutilizables", "Manejo básico de errores"]],
	"python-intermedio": [["Entorno de trabajo", "Archivos CSV"], ["Listas y diccionarios", "Manejo de errores"], ["Lectura de archivos", "Valores nulos"], ["Filtros y agrupaciones", "Funciones de agregación"], ["Gráficos con Matplotlib", "Interpretación"], ["Reporte reproducible", "Exportación de resultados"]],
	"python-avanzado": [["Atributos y métodos", "Herencia básica"], ["Módulos y entornos virtuales", "Pruebas unitarias"], ["Peticiones HTTP", "Autenticación de APIs"], ["Programación de tareas", "Automatización de archivos"]],
	"ingles-basico": [["Vocabulario personal", "Preguntas básicas"], ["Rutinas diarias", "Adverbios de frecuencia"], ["Números y direcciones", "Vocabulario de compras"], ["Preguntas y respuestas", "Pronunciación básica"]],
	"ingles-intermedio": [["Verbos irregulares", "Narración de experiencias"], ["Condicionales simples", "Expresar posibilidad"], ["Estructura de un email", "Tono formal e informal"], ["Reuniones simples", "Small talk profesional"]],
	"ingles-avanzado": [["Reportes y propuestas", "Registro formal"], ["Estructura de una presentación", "Lenguaje persuasivo"], ["Vocabulario de negociación", "Argumentación"], ["Expresiones idiomáticas", "Debate estructurado"]],
	"programacion-desarrollo-web": [["HTML semántico", "Estructura de proyecto"], ["Formularios", "Accesibilidad web"], ["Selectores CSS", "Modelo de caja"], ["Flexbox", "Grid responsive"], ["Eventos", "Validación de formularios"], ["GitHub", "Publicación del sitio"]],
	"introduccion-a-la-ia": [["Tipos de IA", "Datos de entrenamiento"], ["Casos de uso", "Automatización de tareas"], ["Prompt con contexto", "Formato de respuesta"], ["Verificación de resultados", "Fuentes"], ["Privacidad y ética", "Sesgos"], ["Prototipo de solución", "Plan de implementación"]],
	"investigacion-aplicada": [["Delimitación del problema", "Justificación"], ["Preguntas de investigación", "Objetivos medibles"], ["Búsqueda académica", "Citas y referencias"], ["Enfoque metodológico", "Población y muestra"], ["Diseño de instrumentos", "Matriz de variables"], ["Análisis de resultados", "Conclusiones y recomendaciones"]],
	"finanzas-para-emprendedores": [["Ingresos y gastos", "Registro financiero"], ["Metas financieras", "Presupuesto mensual"], ["Costos fijos y variables", "Punto de equilibrio"], ["Estrategia de precios", "Margen"], ["Flujo de caja", "Liquidez"], ["Proyecciones", "Decisiones basadas en datos"]],
};

const bloomLevels: BloomLevel[] = ["recordar", "comprender", "aplicar", "analizar", "evaluar", "crear"];

const graduateProfiles: Record<string, string> = {
	"excel-basico": "Al finalizar, el estudiante organiza información y aplica fórmulas básicas en Excel para llevar registros y cálculos simples de forma ordenada.",
	"excel-intermedio": "Al finalizar, el estudiante organiza, analiza y automatiza información en Excel para elaborar reportes y dashboards que apoyen decisiones de negocio.",
	"excel-avanzado": "Al finalizar, el estudiante automatiza procesos y modela datos en Excel combinando Power Query, Power Pivot y macros para soluciones avanzadas de análisis.",
	"power-bi-basico": "Al finalizar, el estudiante construye y comunica dashboards interactivos en Power BI a partir de datos preparados para la toma de decisiones.",
	"power-bi-intermedio": "Al finalizar, el estudiante modela relaciones complejas y construye medidas DAX intermedias en Power BI para análisis de negocio más profundos.",
	"power-bi-avanzado": "Al finalizar, el estudiante publica y gobierna soluciones de Power BI aplicando seguridad a nivel de fila, optimización del modelo y DAX avanzado.",
	"sql-basico": "Al finalizar, el estudiante consulta y relaciona bases de datos con SQL para responder preguntas de negocio mediante indicadores confiables.",
	"sql-intermedio": "Al finalizar, el estudiante combina múltiples tablas y construye consultas SQL más elaboradas usando subconsultas, funciones de ventana básicas y vistas.",
	"sql-avanzado": "Al finalizar, el estudiante optimiza consultas y administra procedimientos y transacciones en SQL para entornos de producción.",
	"python-basico": "Al finalizar, el estudiante escribe programas básicos en Python usando variables, estructuras de control, funciones y estructuras de datos simples.",
	"python-intermedio": "Al finalizar, el estudiante desarrolla scripts de Python para limpiar, analizar y visualizar datos, generando reportes reproducibles.",
	"python-avanzado": "Al finalizar, el estudiante aplica programación orientada a objetos y automatiza procesos en Python integrando APIs y buenas prácticas de código.",
	"ingles-basico": "Al finalizar, el estudiante se comunica en situaciones cotidianas en inglés usando vocabulario y gramática básica.",
	"ingles-intermedio": "Al finalizar, el estudiante se comunica con mayor fluidez en inglés, redactando correos y participando en conversaciones de contexto laboral.",
	"ingles-avanzado": "Al finalizar, el estudiante se comunica con fluidez profesional en inglés, presentando, negociando y redactando documentos de nivel avanzado.",
	"programacion-desarrollo-web": "Al finalizar, el estudiante crea y publica una página web responsive que integra estructura, estilos e interacciones básicas.",
	"introduccion-a-la-ia": "Al finalizar, el estudiante identifica oportunidades de uso responsable de IA y propone soluciones verificables para tareas reales.",
	"investigacion-aplicada": "Al finalizar, el estudiante diseña y comunica una investigación aplicada con problema, metodología, evidencia y conclusiones claras.",
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

// Video de presentación por curso (opcional). Pega aquí el enlace de YouTube de cada curso.
const presentationVideos: Record<string, string> = {
	"excel-basico": "",
	"excel-intermedio": "",
	"excel-avanzado": "",
	"power-bi-basico": "",
	"power-bi-intermedio": "",
	"power-bi-avanzado": "",
	"sql-basico": "",
	"sql-intermedio": "",
	"sql-avanzado": "",
	"python-basico": "",
	"python-intermedio": "",
	"python-avanzado": "",
	"ingles-basico": "",
	"ingles-intermedio": "",
	"ingles-avanzado": "",
	"programacion-desarrollo-web": "",
	"introduccion-a-la-ia": "",
	"investigacion-aplicada": "",
	"finanzas-para-emprendedores": "",
};

export const courses: Course[] = baseCourses.map((course) => ({
	...course,
	presentationVideoUrl: presentationVideos[course.slug] || undefined,
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

// Temas agrupados en un solo módulo con 3 niveles (Básico/Intermedio/Avanzado); el resto son cursos únicos.
export const GROUPED_TRACKS = new Set(["excel", "python", "sql", "ingles", "power-bi"]);
const LEVEL_ORDER: Record<string, number> = { Básico: 0, Intermedio: 1, Avanzado: 2 };

export function getTrack(slug: string) {
	return slug.replace(/-(basico|intermedio|avanzado)$/, "");
}

export function getModuleLevels(track: string) {
	return courses
		.filter((course) => getTrack(course.slug) === track && GROUPED_TRACKS.has(track))
		.sort((a, b) => (LEVEL_ORDER[a.level] ?? 0) - (LEVEL_ORDER[b.level] ?? 0));
}

export function getAllModuleTracks() {
	return Array.from(new Set(courses.map((course) => getTrack(course.slug)).filter((track) => GROUPED_TRACKS.has(track))));
}

