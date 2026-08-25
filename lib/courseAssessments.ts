export type AssessmentQuestion = {
  prompt: string;
  options: string[];
  correctOption: number;
};

export type CourseAssessment = {
  projectTitle: string;
  projectInstructions: string;
  acceptedFormats: string;
  questions: AssessmentQuestion[];
};

const sharedQuestions: AssessmentQuestion[] = [
  {
    prompt: "¿Cuál es la mejor forma de consolidar una habilidad nueva?",
    options: ["Memorizar definiciones", "Aplicarla en una práctica con datos reales", "Ver el video varias veces", "Saltar a la siguiente clase"],
    correctOption: 1,
  },
  {
    prompt: "Antes de presentar un resultado, ¿qué debes comprobar?",
    options: ["Que tenga muchos colores", "Que responda al objetivo planteado", "Que use una herramienta avanzada", "Que sea lo más largo posible"],
    correctOption: 1,
  },
];

const assessments: Record<string, CourseAssessment> = {
  "excel-avanzado": {
    projectTitle: "Dashboard de ventas en Excel",
    projectInstructions: "Crea un archivo con una base de ventas, fórmulas de análisis, una tabla dinámica y un dashboard que permita identificar el producto o región con mejor desempeño.",
    acceptedFormats: "Comparte un enlace de OneDrive, Google Drive o GitHub con tu archivo .xlsx.",
    questions: [
      { prompt: "¿Qué herramienta resume información por categorías en Excel?", options: ["Tabla dinámica", "Formato condicional", "Buscar y reemplazar", "Validación de datos"], correctOption: 0 },
      { prompt: "¿Qué referencia no cambia al copiar una fórmula?", options: ["Relativa", "Absoluta", "Mixta", "Circular"], correctOption: 1 },
      ...sharedQuestions,
    ],
  },
  "power-bi-desde-cero": {
    projectTitle: "Dashboard comercial en Power BI",
    projectInstructions: "Construye un dashboard con ventas, fecha, producto y región. Incluye al menos tres indicadores, segmentadores y una conclusión de negocio.",
    acceptedFormats: "Comparte un enlace de OneDrive, Google Drive o Power BI Service con tu archivo .pbix o informe publicado.",
    questions: [
      { prompt: "¿Qué elemento permite filtrar varias visualizaciones en Power BI?", options: ["Segmentador", "Marcador", "Tema", "Tooltip"], correctOption: 0 },
      { prompt: "¿Qué modelo organiza hechos y dimensiones para análisis?", options: ["Modelo estrella", "Modelo circular", "Modelo lineal", "Modelo de texto"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "python-para-datos": {
    projectTitle: "Reporte automatizado con Python",
    projectInstructions: "Analiza un archivo CSV con Pandas, limpia datos relevantes, calcula al menos dos métricas y genera un gráfico con una conclusión.",
    acceptedFormats: "Comparte un enlace de GitHub, Google Drive o Colab con tu archivo .ipynb o .py.",
    questions: [
      { prompt: "¿Qué estructura usa Pandas para trabajar con datos tabulares?", options: ["DataFrame", "Variable global", "Lista CSS", "Tabla dinámica"], correctOption: 0 },
      { prompt: "¿Qué acción es clave antes de analizar una base?", options: ["Limpiar y revisar datos", "Cambiar todos los nombres", "Eliminar columnas al azar", "Exportar sin revisar"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "sql-para-analisis": {
    projectTitle: "Consulta de indicadores con SQL",
    projectInstructions: "Diseña consultas que filtren información, unan dos tablas y calculen un indicador de negocio usando una base de práctica.",
    acceptedFormats: "Comparte un enlace de GitHub, Google Drive o un archivo .sql.",
    questions: [
      { prompt: "¿Qué cláusula se usa para combinar registros de dos tablas relacionadas?", options: ["JOIN", "ORDER BY", "LIMIT", "DELETE"], correctOption: 0 },
      { prompt: "¿Qué instrucción agrupa resultados para calcular totales?", options: ["GROUP BY", "WHERE", "SELECT", "VALUES"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "power-query": {
    projectTitle: "Proceso de limpieza de datos",
    projectInstructions: "Importa una base con problemas de calidad, transforma sus columnas y deja una consulta lista para actualizar y analizar.",
    acceptedFormats: "Comparte un enlace de OneDrive, Google Drive o un archivo .xlsx con la consulta.",
    questions: [
      { prompt: "¿Para qué sirve Power Query?", options: ["Importar y transformar datos", "Diseñar diapositivas", "Enviar correos", "Crear contraseñas"], correctOption: 0 },
      { prompt: "¿Qué mejora la repetición de un proceso de limpieza?", options: ["Pasos documentados y actualizables", "Copiar datos manualmente", "Eliminar el origen", "Usar capturas"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "introduccion-a-la-ia": {
    projectTitle: "Propuesta de IA responsable",
    projectInstructions: "Define un problema cotidiano, plantea una solución apoyada por IA, redacta prompts de prueba e identifica riesgos y validaciones necesarias.",
    acceptedFormats: "Comparte un enlace de Google Drive, Notion o un archivo PDF.",
    questions: [
      { prompt: "¿Qué debes hacer con una respuesta generada por IA antes de usarla?", options: ["Verificarla", "Publicarla sin revisar", "Copiarla siempre", "Ocultar su origen"], correctOption: 0 },
      { prompt: "¿Qué información no debes incluir en un prompt público?", options: ["Datos personales sensibles", "Objetivo de la tarea", "Formato deseado", "Contexto permitido"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "investigacion-aplicada": {
    projectTitle: "Mini proyecto de investigación",
    projectInstructions: "Formula un problema, objetivos, preguntas, metodología y una conclusión basada en fuentes confiables.",
    acceptedFormats: "Comparte un enlace de Google Drive o un archivo .docx o PDF.",
    questions: [
      { prompt: "¿Qué debe responder un objetivo de investigación?", options: ["Qué se busca lograr", "El color del informe", "La opinión personal", "El nombre del archivo"], correctOption: 0 },
      { prompt: "¿Por qué se citan las fuentes?", options: ["Para respaldar y atribuir información", "Para llenar páginas", "Para evitar analizar", "Para usar más texto"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "programacion-desarrollo-web": {
    projectTitle: "Sitio web funcional",
    projectInstructions: "Crea una página web responsive con estructura semántica, estilos propios y una interacción básica en JavaScript.",
    acceptedFormats: "Comparte el enlace publicado y el repositorio de GitHub.",
    questions: [
      { prompt: "¿Qué lenguaje aporta estructura semántica a una página web?", options: ["HTML", "CSS", "SQL", "Power BI"], correctOption: 0 },
      { prompt: "¿Qué técnica ayuda a adaptar un sitio a celulares?", options: ["Diseño responsive", "Texto fijo", "Imágenes sin tamaño", "Solo escritorio"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "finanzas-para-emprendedores": {
    projectTitle: "Plan financiero de un emprendimiento",
    projectInstructions: "Elabora un presupuesto con ingresos, gastos, costos, precios y una proyección de flujo de caja para un negocio simple.",
    acceptedFormats: "Comparte un enlace de OneDrive, Google Drive o un archivo .xlsx.",
    questions: [
      { prompt: "¿Qué muestra el flujo de caja?", options: ["Entradas y salidas de dinero", "Solo las ventas", "El logo del negocio", "Las horas de trabajo"], correctOption: 0 },
      { prompt: "¿Qué costo se mantiene aunque no se venda?", options: ["Costo fijo", "Costo variable", "Descuento", "Ingreso"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
};

export function getCourseAssessment(courseSlug: string) {
  return assessments[courseSlug];
}
