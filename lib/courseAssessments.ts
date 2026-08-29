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
  {
    prompt: "¿Qué actitud ayuda más a superar un error durante la práctica?",
    options: ["Revisar el error y corregirlo", "Ignorarlo y continuar", "Borrar todo el trabajo", "Culpar a la herramienta"],
    correctOption: 0,
  },
  {
    prompt: "¿Por qué es importante seguir el orden de los módulos de un curso?",
    options: ["Porque cada tema se construye sobre el anterior", "Porque es un requisito sin razón", "Para tardar más tiempo", "No es importante"],
    correctOption: 0,
  },
  {
    prompt: "¿Qué debes hacer si un concepto no queda claro?",
    options: ["Repasar el material y practicar de nuevo", "Avanzar sin entenderlo", "Adivinar en el examen", "Copiar la respuesta de otra persona"],
    correctOption: 0,
  },
  {
    prompt: "¿Cuál es un buen hábito antes de enviar un proyecto final?",
    options: ["Revisar que cumple con todos los requisitos pedidos", "Enviarlo sin revisar", "Cambiar el formato al azar", "Omitir las instrucciones"],
    correctOption: 0,
  },
  {
    prompt: "¿Qué papel cumple la práctica constante en el aprendizaje de una herramienta?",
    options: ["Refuerza la habilidad y la memoria a largo plazo", "No tiene ningún efecto", "Solo sirve para pasar el tiempo", "Reemplaza la teoría por completo"],
    correctOption: 0,
  },
  {
    prompt: "¿Qué se recomienda hacer con la retroalimentación de un revisor?",
    options: ["Aplicarla para mejorar el proyecto", "Ignorarla completamente", "Discutir sin analizarla", "Borrar el proyecto"],
    correctOption: 0,
  },
];

const assessments: Record<string, CourseAssessment> = {
  "excel-basico": {
    projectTitle: "Registro ordenado en Excel",
    projectInstructions: "Crea una hoja de cálculo con una base de datos simple, aplica formato de tabla, filtros y al menos tres fórmulas básicas (SUMA, PROMEDIO, SI).",
    acceptedFormats: "Comparte un enlace de OneDrive, Google Drive o GitHub con tu archivo .xlsx.",
    questions: [
      { prompt: "¿Qué función suma valores que cumplen una condición?", options: ["SUMAR.SI", "PROMEDIO", "CONTAR", "BUSCARV"], correctOption: 0 },
      { prompt: "¿Qué referencia cambia al copiar una fórmula hacia otra celda?", options: ["Relativa", "Absoluta", "Mixta con $ en fila y columna", "Ninguna"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "excel-intermedio": {
    projectTitle: "Dashboard de ventas en Excel",
    projectInstructions: "Crea un archivo con una base de ventas, fórmulas de análisis, una tabla dinámica y un dashboard que permita identificar el producto o región con mejor desempeño.",
    acceptedFormats: "Comparte un enlace de OneDrive, Google Drive o GitHub con tu archivo .xlsx.",
    questions: [
      { prompt: "¿Qué herramienta resume información por categorías en Excel?", options: ["Tabla dinámica", "Formato condicional", "Buscar y reemplazar", "Validación de datos"], correctOption: 0 },
      { prompt: "¿Qué referencia no cambia al copiar una fórmula?", options: ["Relativa", "Absoluta", "Mixta", "Circular"], correctOption: 1 },
      ...sharedQuestions,
    ],
  },
  "excel-avanzado": {
    projectTitle: "Modelo de datos automatizado en Excel",
    projectInstructions: "Importa y transforma datos con Power Query, crea un modelo con Power Pivot y automatiza al menos una tarea con una macro grabada.",
    acceptedFormats: "Comparte un enlace de OneDrive, Google Drive o GitHub con tu archivo .xlsx habilitado para macros.",
    questions: [
      { prompt: "¿Qué herramienta se usa para importar y transformar datos antes de analizarlos?", options: ["Power Query", "Formato condicional", "Buscar y reemplazar", "Validación de datos"], correctOption: 0 },
      { prompt: "¿Qué permite automatizar tareas repetitivas en Excel?", options: ["Una macro", "Un filtro", "Un comentario", "Un hipervínculo"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "power-bi-basico": {
    projectTitle: "Dashboard comercial en Power BI",
    projectInstructions: "Construye un dashboard con ventas, fecha, producto y región. Incluye al menos tres indicadores, segmentadores y una conclusión de negocio.",
    acceptedFormats: "Comparte un enlace de OneDrive, Google Drive o Power BI Service con tu archivo .pbix o informe publicado.",
    questions: [
      { prompt: "¿Qué elemento permite filtrar varias visualizaciones en Power BI?", options: ["Segmentador", "Marcador", "Tema", "Tooltip"], correctOption: 0 },
      { prompt: "¿Qué modelo organiza hechos y dimensiones para análisis?", options: ["Modelo estrella", "Modelo circular", "Modelo lineal", "Modelo de texto"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "power-bi-intermedio": {
    projectTitle: "Modelo de datos con medidas DAX",
    projectInstructions: "Diseña un modelo con una tabla calendario y relaciones correctas, y crea al menos tres medidas DAX que comparen periodos.",
    acceptedFormats: "Comparte un enlace de OneDrive, Google Drive o Power BI Service con tu archivo .pbix.",
    questions: [
      { prompt: "¿Qué función se usa para modificar el contexto de filtro en DAX?", options: ["CALCULATE", "SUM", "IF", "COUNT"], correctOption: 0 },
      { prompt: "¿Para qué sirve una tabla calendario?", options: ["Calcular indicadores de tiempo", "Guardar imágenes", "Ordenar columnas de texto", "Crear segmentadores visuales"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "power-bi-avanzado": {
    projectTitle: "Informe seguro y publicado en Power BI Service",
    projectInstructions: "Aplica seguridad a nivel de fila (RLS) a un modelo, prueba al menos dos roles y publica el informe con actualización programada.",
    acceptedFormats: "Comparte un enlace de Power BI Service con el informe publicado y la configuración de roles documentada.",
    questions: [
      { prompt: "¿Qué mecanismo restringe los datos que ve cada usuario en Power BI?", options: ["Seguridad a nivel de fila (RLS)", "Un marcador", "Un tema visual", "Un tooltip"], correctOption: 0 },
      { prompt: "¿Dónde se publican y comparten los informes de Power BI?", options: ["Power BI Service", "Un correo electrónico", "Una hoja de Excel", "Un documento PDF"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "sql-basico": {
    projectTitle: "Consulta de indicadores con SQL",
    projectInstructions: "Diseña consultas que filtren información, unan dos tablas y calculen un indicador de negocio usando una base de práctica.",
    acceptedFormats: "Comparte un enlace de GitHub, Google Drive o un archivo .sql.",
    questions: [
      { prompt: "¿Qué cláusula se usa para combinar registros de dos tablas relacionadas?", options: ["JOIN", "ORDER BY", "LIMIT", "DELETE"], correctOption: 0 },
      { prompt: "¿Qué instrucción agrupa resultados para calcular totales?", options: ["GROUP BY", "WHERE", "SELECT", "VALUES"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "sql-intermedio": {
    projectTitle: "Reporte con múltiples tablas y subconsultas",
    projectInstructions: "Escribe consultas que combinen al menos tres tablas, incluyan una subconsulta y una vista o CTE reutilizable.",
    acceptedFormats: "Comparte un enlace de GitHub, Google Drive o un archivo .sql.",
    questions: [
      { prompt: "¿Qué permite reutilizar una consulta compleja dentro de otra?", options: ["Una CTE", "Un ORDER BY", "Un LIMIT", "Un DELETE"], correctOption: 0 },
      { prompt: "¿Qué función asigna un número de fila dentro de una partición?", options: ["ROW_NUMBER", "SUM", "AVG", "COUNT"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "sql-avanzado": {
    projectTitle: "Optimización y procedimiento almacenado",
    projectInstructions: "Optimiza una consulta lenta usando índices, y crea un procedimiento almacenado que reciba parámetros y controle errores.",
    acceptedFormats: "Comparte un enlace de GitHub, Google Drive o un archivo .sql.",
    questions: [
      { prompt: "¿Qué estructura mejora el rendimiento de búsquedas frecuentes?", options: ["Un índice", "Un comentario", "Un alias", "Un LIMIT"], correctOption: 0 },
      { prompt: "¿Qué instrucción confirma los cambios de una transacción?", options: ["COMMIT", "SELECT", "JOIN", "WHERE"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "python-basico": {
    projectTitle: "Programa básico en Python",
    projectInstructions: "Escribe un programa que use variables, condicionales, un ciclo y al menos una función propia para resolver un problema simple.",
    acceptedFormats: "Comparte un enlace de GitHub, Google Drive o Colab con tu archivo .py.",
    questions: [
      { prompt: "¿Qué estructura repite instrucciones mientras se cumple una condición?", options: ["Ciclo while", "Diccionario", "Función", "Comentario"], correctOption: 0 },
      { prompt: "¿Qué permite reutilizar un bloque de código con distintos valores?", options: ["Una función", "Una variable global", "Un comentario", "Un print"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "python-intermedio": {
    projectTitle: "Reporte automatizado con Python",
    projectInstructions: "Analiza un archivo CSV con Pandas, limpia datos relevantes, calcula al menos dos métricas y genera un gráfico con una conclusión.",
    acceptedFormats: "Comparte un enlace de GitHub, Google Drive o Colab con tu archivo .ipynb o .py.",
    questions: [
      { prompt: "¿Qué estructura usa Pandas para trabajar con datos tabulares?", options: ["DataFrame", "Variable global", "Lista CSS", "Tabla dinámica"], correctOption: 0 },
      { prompt: "¿Qué acción es clave antes de analizar una base?", options: ["Limpiar y revisar datos", "Cambiar todos los nombres", "Eliminar columnas al azar", "Exportar sin revisar"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "python-avanzado": {
    projectTitle: "Script orientado a objetos con consumo de API",
    projectInstructions: "Crea al menos una clase con métodos propios y un script que consuma una API pública, maneje errores y guarde el resultado en un archivo.",
    acceptedFormats: "Comparte un enlace de GitHub con tu repositorio y archivo .py.",
    questions: [
      { prompt: "¿Qué palabra clave define una clase en Python?", options: ["class", "def", "import", "return"], correctOption: 0 },
      { prompt: "¿Qué formato usan comúnmente las respuestas de una API?", options: ["JSON", "XLSX", "DOCX", "PPTX"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "ingles-basico": {
    projectTitle: "Presentación personal en inglés",
    projectInstructions: "Graba o escribe una presentación breve sobre ti usando presente simple, incluyendo tu rutina diaria y datos personales básicos.",
    acceptedFormats: "Comparte un enlace de Google Drive con un audio, video o documento de texto.",
    questions: [
      { prompt: "¿Qué verbo se usa para describir estados y características (soy, estoy)?", options: ["To be", "To do", "To have", "To go"], correctOption: 0 },
      { prompt: "¿Qué tiempo verbal se usa para describir rutinas diarias?", options: ["Presente simple", "Pasado simple", "Futuro", "Presente perfecto"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "ingles-intermedio": {
    projectTitle: "Correo profesional en inglés",
    projectInstructions: "Redacta un correo formal en inglés solicitando información o proponiendo una reunión, usando pasado o futuro según corresponda.",
    acceptedFormats: "Comparte un enlace de Google Drive o un archivo PDF/Word con tu correo.",
    questions: [
      { prompt: "¿Qué tono se recomienda usar en un correo de trabajo?", options: ["Formal", "Muy informal", "Con abreviaciones", "Sin saludo"], correctOption: 0 },
      { prompt: "¿Qué tiempo verbal se usa para narrar experiencias pasadas?", options: ["Pasado simple", "Presente simple", "Futuro", "Imperativo"], correctOption: 0 },
      ...sharedQuestions,
    ],
  },
  "ingles-avanzado": {
    projectTitle: "Presentación de negociación en inglés",
    projectInstructions: "Prepara una presentación o simulación de negociación en inglés, incluyendo una propuesta, argumentos y respuesta a posibles objeciones.",
    acceptedFormats: "Comparte un enlace de Google Drive con un video, audio o documento de la presentación.",
    questions: [
      { prompt: "¿Qué elemento es clave en una negociación efectiva?", options: ["Argumentar una postura con claridad", "Hablar sin escuchar", "Evitar llegar a acuerdos", "Usar solo vocabulario informal"], correctOption: 0 },
      { prompt: "¿Qué característica debe tener un reporte profesional en inglés?", options: ["Cohesión y registro formal", "Errores intencionales", "Lenguaje coloquial", "Frases inconexas"], correctOption: 0 },
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
