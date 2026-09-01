export type Lesson = { title: string; topics: string[]; content?: LessonContent };
export type BloomLevel = "recordar" | "comprender" | "aplicar" | "analizar" | "evaluar" | "crear";
export type LearningOutcome = { bloomLevel: BloomLevel; outcome: string };
export type CourseModule = { title: string; lessons: Lesson[]; bloomLevel?: BloomLevel; learningOutcome?: string };
export type LessonQuizQuestion = { prompt: string; options: string[]; correctOption: number };
export type LessonContent = {
	introduction: string;
	keyConcepts: string[];
	realExample: { title: string; description: string };
	practicalCase: { title: string; description: string };
	guidedActivity: { title: string; instructions: string };
	reflectionQuestion: string;
	imageUrl: string;
	imageAlt: string;
	quiz: LessonQuizQuestion[];
};
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

const lesson = (title: string, topics: string[], content?: LessonContent): Lesson => ({ title, topics, content });
const module = (title: string, lessons: Lesson[]): CourseModule => ({ title, lessons });
const common = (slug: string, code: string, title: string, level: string, duration: string, description: string, image: string, summary: string, professionalUse: string, modules: CourseModule[]): Course => ({ slug, code, title, level, duration, description, image, summary, professionalUse, modules });

// Contenido completo de ejemplo (plantilla para replicar en el resto de clases).
const excelTablasYFormatoContent: LessonContent = {
	introduction: "En el mundo actual, dominar Excel es fundamental en casi cualquier entorno profesional. Convertir un rango de celdas en una tabla de datos te permite ordenar, filtrar y dar formato a tu información de forma automática, sin importar cuántas filas nuevas agregues. En esta clase aprenderás a transformar listas simples en tablas dinámicas y a aplicar formato profesional en segundos.",
	keyConcepts: [
		"Rango vs. tabla: una tabla crece automáticamente al agregar filas o columnas nuevas.",
		"Fila de encabezados: la primera fila identifica cada columna y habilita filtros.",
		"Formato como tabla: aplica colores y estilos consistentes en un solo clic.",
		"Filtros simples: permiten mostrar solo los datos que cumplen una condición.",
		"Formato condicional básico: resalta automáticamente valores según una regla (por ejemplo, ventas menores a una meta).",
	],
	realExample: {
		title: "Base de cursos vendidos",
		description: "Imagina una lista con las columnas Curso, Duración, Cliente, Importe y Fecha. Al convertirla en tabla (ficha Insertar → Tabla), Excel agrega automaticamente flechas de filtro en cada encabezado y aplica un diseño alterno de colores para leer mejor cada fila.",
	},
	practicalCase: {
		title: "Filtrar cursos con importe mayor a S/ 500",
		description: "Usando la flecha de filtro de la columna Importe, selecciona 'Filtros de número → Mayor que...' e ingresa 500. La tabla mostrará solo los cursos que superan ese monto, sin afectar el resto de los datos ni las fórmulas que dependan de ellos.",
	},
	guidedActivity: {
		title: "Convierte tu propia lista en tabla",
		instructions: "1) Crea una lista con al menos 10 filas y 4 columnas (por ejemplo: Producto, Categoría, Precio, Stock). 2) Selecciona cualquier celda de la lista. 3) Ve a Insertar → Tabla y confirma que 'La tabla tiene encabezados' esté marcado. 4) Aplica un filtro a la columna Precio para mostrar solo los valores mayores al promedio. 5) Aplica formato condicional para resaltar en rojo el stock menor a 5 unidades.",
	},
	reflectionQuestion: "¿Por qué crees que una tabla dinámica es más confiable que un rango normal cuando trabajas con datos que se actualizan constantemente?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué ventaja principal tiene una tabla frente a un rango normal?", options: ["Se actualiza y crece automáticamente al agregar filas", "Ocupa menos espacio en el archivo", "Cambia el idioma de Excel", "Elimina automáticamente los duplicados"], correctOption: 0 },
		{ prompt: "¿Dónde se encuentra el botón para insertar una tabla?", options: ["Ficha Insertar → Tablas", "Ficha Inicio → Fuente", "Ficha Vista → Zoom", "Ficha Fórmulas → Auditoría"], correctOption: 0 },
		{ prompt: "¿Qué representa la fila de encabezados en una tabla?", options: ["El nombre de cada columna", "El total de la tabla", "Un comentario oculto", "El nombre del archivo"], correctOption: 0 },
		{ prompt: "¿Qué permite hacer un filtro simple en una tabla?", options: ["Mostrar solo los datos que cumplen una condición", "Cambiar el color de toda la hoja", "Eliminar columnas permanentemente", "Proteger el archivo con contraseña"], correctOption: 0 },
		{ prompt: "El formato condicional básico sirve para...", options: ["Resaltar automáticamente valores según una regla", "Cambiar el nombre de las columnas", "Convertir texto en números", "Ordenar hojas del libro"], correctOption: 0 },
		{ prompt: "Si agregas una fila nueva al final de una tabla, ¿qué sucede?", options: ["La tabla se expande e incluye la fila automáticamente", "Excel genera un error", "La fila queda fuera del formato", "Se borran los encabezados"], correctOption: 0 },
		{ prompt: "¿Qué opción del cuadro 'Crear tabla' indica que la primera fila son títulos?", options: ["La tabla tiene encabezados", "Tabla dinámica recomendada", "Formato numérico", "Autoajustar columnas"], correctOption: 0 },
		{ prompt: "¿Cuál de estas es una buena práctica antes de convertir un rango en tabla?", options: ["Verificar que no haya filas o columnas vacías en medio de los datos", "Eliminar todos los formatos previos", "Cambiar el nombre del archivo", "Cerrar Excel y volver a abrirlo"], correctOption: 0 },
		{ prompt: "¿Qué herramienta usarías para resaltar en rojo los productos con stock bajo?", options: ["Formato condicional", "Buscar y reemplazar", "Validación de datos", "Combinar celdas"], correctOption: 0 },
		{ prompt: "En el caso práctico de filtrar cursos con importe mayor a S/ 500, ¿qué tipo de filtro usaste?", options: ["Filtro de número → Mayor que", "Filtro de texto → Comienza con", "Filtro de fecha → Este mes", "Filtro de color"], correctOption: 0 },
	],
};

const excelInterfazContent: LessonContent = {
	introduction: "Antes de crear cualquier hoja de cálculo, es esencial conocer el entorno de trabajo de Excel: cómo se organiza la información en celdas, filas y columnas, y cómo guardar tu trabajo de forma segura. Esta clase te da las bases para moverte con confianza dentro del programa.",
	keyConcepts: [
		"Una hoja de cálculo se organiza en filas (números) y columnas (letras); cada celda se identifica con una combinación única, por ejemplo B4.",
		"Los tipos de datos más comunes son texto, números, fechas y valores lógicos (verdadero/falso).",
		"La barra de fórmulas muestra el contenido real de la celda seleccionada, aunque en pantalla se vea con formato.",
		"Guardar con Ctrl+S evita perder tu trabajo; puedes elegir formato .xlsx para editar o .pdf para compartir sin permitir cambios.",
		"Puedes navegar rápidamente con las flechas del teclado o con Ctrl+Flecha para saltar al final de una lista de datos.",
	],
	realExample: {
		title: "Ficha de datos de un cliente",
		description: "La celda A1 puede contener el texto \"Nombre\", B1 el nombre real del cliente, A2 \"Teléfono\" y B2 el número. Aunque se ve como una tabla simple, cada celda guarda un dato independiente que se puede usar después en fórmulas.",
	},
	practicalCase: {
		title: "Organizar una lista de contactos",
		description: "Un asistente administrativo recibe una lista desordenada de contactos por correo. Al pasarla a Excel y ubicar cada dato en su columna correspondiente (Nombre, Teléfono, Correo), puede después ordenar, buscar y filtrar la información fácilmente.",
	},
	guidedActivity: {
		title: "Crea tu primera hoja de datos",
		instructions: "1) Abre un libro nuevo en Excel. 2) En la celda A1 escribe \"Producto\", en B1 \"Precio\", en C1 \"Stock\". 3) Completa 5 filas con productos reales. 4) Guarda el archivo con Ctrl+S usando el nombre \"mi_primera_hoja\". 5) Verifica que cada dato quedó en el tipo correcto (texto para nombres, números para precios).",
	},
	reflectionQuestion: "¿Qué problemas podrían surgir si mezclas texto y números en la misma columna de una hoja de cálculo?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Cómo se identifica una celda en Excel?", options: ["Con la letra de su columna y el número de su fila", "Solo con un número", "Con el nombre de la hoja", "Con un color asignado"], correctOption: 0 },
		{ prompt: "¿Qué muestra la barra de fórmulas?", options: ["El contenido real de la celda seleccionada", "El nombre del archivo", "La cantidad de hojas del libro", "El idioma de Excel"], correctOption: 0 },
		{ prompt: "¿Cuál es un tipo de dato válido en Excel?", options: ["Fecha", "Macro", "Hipervínculo oculto", "Etiqueta HTML"], correctOption: 0 },
		{ prompt: "¿Qué combinación de teclas guarda un archivo?", options: ["Ctrl+S", "Ctrl+P", "Ctrl+Z", "Ctrl+N"], correctOption: 0 },
		{ prompt: "¿Qué formato eliges si quieres compartir un archivo sin que se pueda editar?", options: ["PDF", "XLSX", "CSV", "TXT"], correctOption: 0 },
		{ prompt: "¿Qué combinación de teclas te lleva al final de una lista de datos?", options: ["Ctrl + flecha", "Alt + flecha", "Shift + Tab", "Ctrl + Inicio"], correctOption: 0 },
		{ prompt: "En el ejemplo de la ficha de cliente, ¿qué contiene la celda B1?", options: ["El nombre del cliente", "La palabra 'Nombre'", "El teléfono", "Un total"], correctOption: 0 },
		{ prompt: "¿Por qué es importante ubicar cada dato en su propia columna?", options: ["Para poder ordenar, filtrar y buscar la información fácilmente", "Para que el archivo pese más", "Para cambiar el idioma de Excel", "Para ocultar la hoja automáticamente"], correctOption: 0 },
		{ prompt: "¿Qué tipo de valor representa 'verdadero' o 'falso' en Excel?", options: ["Valor lógico", "Valor de texto", "Valor de fecha", "Valor de moneda"], correctOption: 0 },
		{ prompt: "¿Qué deberías revisar después de escribir datos en una hoja nueva?", options: ["Que cada dato quedó en el tipo correcto (texto, número, fecha)", "Que el archivo tenga muchos colores", "Que el nombre del archivo sea largo", "Que la hoja esté oculta"], correctOption: 0 },
	],
};

const excelFormulasBasicasContent: LessonContent = {
	introduction: "Las fórmulas son el corazón de Excel: te permiten transformar datos en información útil sin calcular manualmente. En esta clase aprenderás las funciones más usadas (SUMA, PROMEDIO, CONTAR), cómo funcionan las referencias relativas al copiar una fórmula, y el orden en que Excel resuelve las operaciones matemáticas.",
	keyConcepts: [
		"Toda fórmula comienza con el signo =; sin él, Excel interpreta el contenido como texto.",
		"SUMA(rango) suma valores, PROMEDIO(rango) calcula la media, CONTAR(rango) cuenta celdas con números.",
		"Una referencia relativa (como A2) cambia automáticamente al copiar la fórmula a otra celda.",
		"El orden de operaciones en Excel sigue la misma prioridad que en matemáticas: paréntesis, exponentes, multiplicación/división, luego suma/resta.",
		"Los errores comunes como #DIV/0! o #VALOR! indican que la fórmula recibió un dato incorrecto o una división entre cero.",
	],
	realExample: {
		title: "Calcular el total de ventas de la semana",
		description: "Si en las celdas B2:B8 tienes las ventas diarias, la fórmula =SUMA(B2:B8) te da el total automáticamente. Si agregas un nuevo día en B9, solo necesitas ajustar el rango para incluirlo.",
	},
	practicalCase: {
		title: "Promedio de calificaciones de un curso",
		description: "Un profesor tiene las notas de 30 estudiantes en la columna C. Con =PROMEDIO(C2:C31) obtiene el promedio general del grupo en segundos, y con =CONTAR(C2:C31) verifica cuántos estudiantes rindieron el examen.",
	},
	guidedActivity: {
		title: "Construye tu primera hoja de cálculo con fórmulas",
		instructions: "1) Crea una lista de 8 gastos personales con su monto. 2) En una celda usa =SUMA() para el total. 3) En otra celda usa =PROMEDIO() para el gasto promedio. 4) En otra usa =CONTAR() para saber cuántos gastos registraste. 5) Copia la fórmula de suma a una columna adicional y observa cómo cambia la referencia.",
	},
	reflectionQuestion: "¿Qué diferencia práctica existe entre usar una fórmula y escribir el resultado manualmente, especialmente si los datos cambian con frecuencia?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Con qué símbolo debe iniciar toda fórmula en Excel?", options: ["=", "+", "#", "@"], correctOption: 0 },
		{ prompt: "¿Qué función suma un rango de celdas?", options: ["SUMA", "PROMEDIO", "CONTAR", "BUSCARV"], correctOption: 0 },
		{ prompt: "¿Qué función calcula el promedio de un rango?", options: ["PROMEDIO", "SUMA", "SI", "CONTAR.SI"], correctOption: 0 },
		{ prompt: "¿Qué hace la función CONTAR?", options: ["Cuenta cuántas celdas de un rango contienen números", "Suma los valores de un rango", "Busca un valor en una tabla", "Cambia el formato de una celda"], correctOption: 0 },
		{ prompt: "¿Qué sucede con una referencia relativa al copiar una fórmula a otra celda?", options: ["Cambia automáticamente según la nueva posición", "Se mantiene siempre igual", "Se convierte en texto", "Genera un error"], correctOption: 0 },
		{ prompt: "Según el orden de operaciones, ¿qué se resuelve primero?", options: ["Lo que está entre paréntesis", "Las sumas", "Las restas", "Las divisiones"], correctOption: 0 },
		{ prompt: "¿Qué error aparece si divides un número entre cero?", options: ["#DIV/0!", "#VALOR!", "#NOMBRE?", "#N/A"], correctOption: 0 },
		{ prompt: "En el ejemplo de ventas semanales, ¿qué fórmula usarías para el total?", options: ["=SUMA(B2:B8)", "=PROMEDIO(B2:B8)", "=CONTAR(B2:B8)", "=SI(B2:B8)"], correctOption: 0 },
		{ prompt: "¿Qué indica el error #VALOR!?", options: ["Que la fórmula recibió un tipo de dato incorrecto", "Que falta guardar el archivo", "Que la hoja está protegida", "Que el rango es muy grande"], correctOption: 0 },
		{ prompt: "¿Por qué es útil usar fórmulas en lugar de calcular manualmente?", options: ["Porque se recalculan automáticamente si los datos cambian", "Porque ocupan menos espacio en pantalla", "Porque cambian el color de la celda", "Porque no requieren revisar los datos"], correctOption: 0 },
	],
};

const excelFuncionesEsencialesContent: LessonContent = {
	introduction: "Con las funciones esenciales de Excel puedes tomar decisiones automáticas dentro de tu hoja de cálculo. En esta clase aprenderás a usar SI para evaluar condiciones, CONTAR.SI para contar datos que cumplen un criterio, y BUSCARV para encontrar información relacionada entre distintas columnas o tablas.",
	keyConcepts: [
		"La función SI evalúa una condición y devuelve un resultado si es verdadera y otro si es falsa: =SI(condición, valor_si_verdadero, valor_si_falso).",
		"CONTAR.SI cuenta celdas que cumplen un criterio específico, por ejemplo cuántas ventas superan una meta.",
		"BUSCARV busca un valor en la primera columna de una tabla y devuelve un dato relacionado de otra columna.",
		"El último argumento de BUSCARV (FALSO) asegura una coincidencia exacta y evita resultados incorrectos.",
		"Combinar estas funciones te permite automatizar reportes sin revisar los datos manualmente.",
	],
	realExample: {
		title: "Aprobado o desaprobado según la nota",
		description: "Con la fórmula =SI(B2>=70,\"Aprobado\",\"Desaprobado\") Excel evalúa automáticamente cada nota y muestra el resultado correspondiente en la columna de estado.",
	},
	practicalCase: {
		title: "Contar clientes de una ciudad específica",
		description: "Un vendedor tiene una lista de clientes con la columna Ciudad. Usando =CONTAR.SI(C2:C200,\"Lima\") obtiene al instante cuántos clientes son de Lima, sin revisar fila por fila.",
	},
	guidedActivity: {
		title: "Automatiza una tabla con SI, CONTAR.SI y BUSCARV",
		instructions: "1) Crea una tabla de estudiantes con nombre y nota. 2) Usa SI para mostrar 'Aprobado' o 'Desaprobado' según si la nota es mayor o igual a 70. 3) Usa CONTAR.SI para contar cuántos estudiantes aprobaron. 4) Crea una segunda tabla pequeña con el nombre del curso y su código, y usa BUSCARV para traer el código del curso a la tabla principal según el nombre del estudiante.",
	},
	reflectionQuestion: "¿En qué situaciones de tu vida diaria o trabajo podrías usar una función como SI para tomar decisiones automáticas con datos?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué hace la función SI?", options: ["Evalúa una condición y devuelve un resultado distinto según si es verdadera o falsa", "Suma un rango de celdas", "Cuenta el número de hojas del libro", "Cambia el color de una celda"], correctOption: 0 },
		{ prompt: "¿Qué estructura tiene la función SI?", options: ["=SI(condición, valor_si_verdadero, valor_si_falso)", "=SI(rango)", "=SI(texto)", "=SI(columna, fila)"], correctOption: 0 },
		{ prompt: "¿Para qué sirve CONTAR.SI?", options: ["Para contar celdas que cumplen un criterio específico", "Para sumar todos los valores de una hoja", "Para ordenar una tabla alfabéticamente", "Para proteger una hoja con contraseña"], correctOption: 0 },
		{ prompt: "¿Qué hace BUSCARV?", options: ["Busca un valor en una columna y devuelve un dato relacionado de otra columna", "Cuenta cuántas veces se repite un valor", "Suma solo los valores positivos", "Cambia el formato numérico de una celda"], correctOption: 0 },
		{ prompt: "¿Qué argumento de BUSCARV asegura una coincidencia exacta?", options: ["FALSO", "VERDADERO", "CERO", "NULO"], correctOption: 0 },
		{ prompt: "En el ejemplo de aprobados, ¿qué condición se evaluó?", options: ["Si la nota es mayor o igual a 70", "Si el nombre empieza con A", "Si la celda está vacía", "Si el número es par"], correctOption: 0 },
		{ prompt: "¿Qué fórmula usarías para contar clientes de Lima en el rango C2:C200?", options: ["=CONTAR.SI(C2:C200,\"Lima\")", "=SUMA(C2:C200)", "=SI(C2:C200,\"Lima\")", "=BUSCARV(\"Lima\",C2:C200,1,FALSO)"], correctOption: 0 },
		{ prompt: "¿Qué ventaja tiene combinar SI, CONTAR.SI y BUSCARV?", options: ["Automatizar reportes sin revisar los datos manualmente", "Reducir el tamaño del archivo", "Cambiar el idioma de Excel", "Evitar guardar el archivo"], correctOption: 0 },
		{ prompt: "¿Qué devuelve BUSCARV si no encuentra el valor buscado?", options: ["Un error como #N/A", "El valor 0", "Un texto vacío", "La primera fila de la tabla"], correctOption: 0 },
		{ prompt: "¿Qué debes verificar antes de usar BUSCARV?", options: ["Que el valor buscado esté en la primera columna del rango de búsqueda", "Que la hoja tenga colores", "Que el archivo sea .pdf", "Que la tabla esté oculta"], correctOption: 0 },
	],
};

const baseCourses: Course[] = [
	// Excel
	common("excel-basico", "B1", "Excel Básico", "Básico", "4 semanas", "Primeros pasos para organizar y calcular información en Excel.", images.excel, "Aprenderás la interfaz, fórmulas esenciales y el orden de datos para empezar a trabajar con hojas de cálculo con confianza.", "Te permitirá llevar registros simples, calcular totales y presentar información ordenada en cualquier trabajo.", [module("Primeros pasos en Excel", [lesson("Interfaz y navegación", ["Celdas, filas y columnas", "Tipos de datos", "Guardar y compartir archivos"], excelInterfazContent), lesson("Fórmulas básicas", ["Suma, promedio y conteo", "Referencias relativas", "Orden de operaciones"], excelFormulasBasicasContent)]), module("Organizar y presentar datos", [lesson("Tablas y formato", ["Formato como tabla", "Filtros simples", "Formato condicional básico"], excelTablasYFormatoContent), lesson("Funciones esenciales", ["Función SI", "CONTAR.SI", "BUSCARV básico"], excelFuncionesEsencialesContent)])]),
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

