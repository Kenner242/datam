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

// ===== EXCEL BÁSICO =====
const excelB1T1: LessonContent = {
	introduction: "Microsoft Excel es el programa de hojas de cálculo más usado en el entorno empresarial para organizar, calcular y analizar información. En esta clase conocerás para qué se usa en las empresas, cómo está organizada su interfaz y cómo moverte entre libros y hojas con confianza.",
	keyConcepts: [
		"Excel es un programa de hojas de cálculo usado para organizar datos, hacer cálculos y crear reportes en cualquier tipo de negocio.",
		"La Cinta de opciones agrupa los comandos de Excel por fichas: Inicio, Insertar, Fórmulas, Datos, entre otras.",
		"La barra de herramientas de acceso rápido permite ejecutar comandos frecuentes como guardar o deshacer en un clic.",
		"Un libro de Excel puede contener varias hojas de cálculo, identificadas por pestañas en la parte inferior.",
		"Empresas de todos los sectores usan Excel para presupuestos, control de inventario, reportes de ventas y análisis de datos.",
	],
	realExample: { title: "Reporte mensual de una tienda", description: "Una tienda de ropa usa un libro con una hoja para ventas, otra para inventario y otra para gastos. El dueño cambia entre pestañas para revisar el negocio completo en un solo archivo." },
	practicalCase: { title: "Explorar la Cinta de opciones", description: "Un nuevo colaborador necesita ubicar el comando para insertar una tabla. Recorriendo la ficha Insertar en la Cinta de opciones lo encuentra rápidamente, sin memorizar atajos." },
	guidedActivity: { title: "Reconoce el entorno de Excel", instructions: "1) Abre Excel y crea un libro nuevo. 2) Explora las fichas Inicio, Insertar y Datos de la Cinta de opciones. 3) Agrega dos hojas nuevas y cámbiales el nombre (por ejemplo 'Ventas' y 'Gastos'). 4) Guarda el archivo usando la barra de acceso rápido." },
	reflectionQuestion: "¿En qué área de tu trabajo o vida diaria podrías usar un libro de Excel con varias hojas para organizar información?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué es Microsoft Excel?", options: ["Un programa de hojas de cálculo para organizar, calcular y analizar datos", "Un editor de texto", "Un programa de diseño gráfico", "Un sistema operativo"], correctOption: 0 },
		{ prompt: "¿Dónde se agrupan los comandos de Excel por categorías?", options: ["En la Cinta de opciones", "En el Panel de notas", "En la Barra de estado", "En el Explorador de archivos"], correctOption: 0 },
		{ prompt: "¿Qué puede contener un libro de Excel?", options: ["Una o varias hojas de cálculo", "Solo una imagen", "Un único gráfico", "Un solo comentario"], correctOption: 0 },
		{ prompt: "¿Para qué sirve la barra de acceso rápido?", options: ["Para ejecutar comandos frecuentes como guardar en un clic", "Para cambiar el idioma del programa", "Para insertar imágenes", "Para proteger el archivo"], correctOption: 0 },
		{ prompt: "¿En qué ficha de la Cinta encontrarías el comando para insertar una tabla?", options: ["Insertar", "Inicio", "Vista", "Revisar"], correctOption: 0 },
		{ prompt: "¿Cómo se identifican las hojas dentro de un libro?", options: ["Con pestañas en la parte inferior", "Con un número de página", "Con un color de fondo fijo", "No se pueden identificar"], correctOption: 0 },
		{ prompt: "¿Qué tipo de empresas usan Excel?", options: ["Empresas de todos los sectores", "Solo empresas tecnológicas", "Solo bancos", "Ninguna empresa"], correctOption: 0 },
		{ prompt: "En el ejemplo de la tienda de ropa, ¿qué contiene cada hoja del libro?", options: ["Ventas, inventario y gastos por separado", "Solo un logotipo", "Un mismo dato repetido", "Nada, están vacías"], correctOption: 0 },
		{ prompt: "¿Qué acción te permite cambiar el nombre de una hoja?", options: ["Hacer doble clic en su pestaña", "Cerrar Excel", "Cambiar el idioma", "Eliminar el libro"], correctOption: 0 },
		{ prompt: "¿Por qué es útil conocer la interfaz de Excel antes de trabajar con datos?", options: ["Porque permite ubicar rápidamente los comandos que necesitas", "Porque cambia el color de las celdas", "Porque acelera la velocidad del computador", "Porque no es necesario, se aprende solo"], correctOption: 0 },
	],
};

const excelB1T2: LessonContent = {
	introduction: "Una buena gestión de datos es la base de cualquier hoja de cálculo confiable. En esta clase aprenderás a identificar tipos de datos, dar formato a las celdas, ajustar filas y columnas, combinar celdas cuando sea necesario y crear tablas para mantener tu información organizada.",
	keyConcepts: [
		"Los tipos de datos principales en Excel son texto, número, fecha y valor lógico (verdadero/falso).",
		"El formato de celdas permite mostrar los datos como moneda, porcentaje, fecha u otros formatos sin cambiar el valor real.",
		"Ajustar el ancho de columnas y alto de filas mejora la legibilidad de la información.",
		"Ajustar texto permite que el contenido largo de una celda se muestre en varias líneas sin cortarse.",
		"Combinar celdas une varias celdas en una sola, útil para títulos, pero puede complicar los cálculos si se abusa de ella.",
		"Crear una tabla convierte una lista en una estructura dinámica con filtros y formato automático.",
	],
	realExample: { title: "Ficha de inventario", description: "Una columna con precios se formatea como moneda (S/), otra con fechas de ingreso se formatea como fecha, y el título del reporte se combina en una sola celda centrada." },
	practicalCase: { title: "Preparar una lista de empleados", description: "Un área de Recursos Humanos recibe una lista con nombres, fechas de ingreso y sueldos sin formato. Al aplicar el formato correcto a cada columna, el reporte se vuelve fácil de leer y presentar." },
	guidedActivity: { title: "Da formato profesional a una lista", instructions: "1) Crea una lista con columnas Nombre, Fecha de ingreso y Sueldo. 2) Aplica formato de fecha a la columna correspondiente y formato de moneda al sueldo. 3) Ajusta el ancho de las columnas para que el texto no se corte. 4) Combina las celdas del título superior y céntralo. 5) Convierte la lista en tabla." },
	reflectionQuestion: "¿Por qué es importante que el tipo de dato de una columna sea consistente en todas sus filas?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Cuáles son tipos de datos comunes en Excel?", options: ["Texto, número, fecha y valor lógico", "Solo texto", "Solo números", "Imágenes y videos"], correctOption: 0 },
		{ prompt: "¿Qué hace el formato de celdas?", options: ["Cambia cómo se muestra el dato sin alterar su valor real", "Borra el contenido de la celda", "Convierte números en texto permanentemente", "Elimina los decimales del número"], correctOption: 0 },
		{ prompt: "¿Qué beneficio tiene ajustar el ancho de una columna?", options: ["Mejora la legibilidad de la información", "Cambia el tipo de dato", "Elimina duplicados", "Bloquea la hoja"], correctOption: 0 },
		{ prompt: "¿Para qué sirve 'Ajustar texto'?", options: ["Para que el contenido largo se muestre en varias líneas", "Para traducir el texto", "Para contar palabras", "Para cambiar el idioma del texto"], correctOption: 0 },
		{ prompt: "¿Qué riesgo tiene abusar de combinar celdas?", options: ["Puede complicar los cálculos y el ordenamiento de datos", "Hace que el archivo pese menos", "Mejora automáticamente las fórmulas", "Es obligatorio para crear tablas"], correctOption: 0 },
		{ prompt: "¿Qué logra convertir una lista en tabla?", options: ["Una estructura dinámica con filtros y formato automático", "Eliminar todas las fórmulas", "Cambiar el nombre del archivo", "Ocultar las columnas"], correctOption: 0 },
		{ prompt: "En el ejemplo del inventario, ¿qué formato se aplicó a los precios?", options: ["Formato de moneda", "Formato de fecha", "Formato de texto", "Formato de porcentaje"], correctOption: 0 },
		{ prompt: "¿Qué formato usarías para una columna de fechas de ingreso?", options: ["Formato de fecha", "Formato de moneda", "Formato de texto", "Formato científico"], correctOption: 0 },
		{ prompt: "¿Por qué es importante mantener consistencia en el tipo de dato de una columna?", options: ["Para que las fórmulas y filtros funcionen correctamente", "Para que la hoja tenga más colores", "Para reducir el tamaño del archivo", "No tiene ninguna importancia"], correctOption: 0 },
		{ prompt: "¿Qué deberías hacer antes de convertir una lista de empleados en tabla?", options: ["Verificar que cada columna tenga un encabezado claro", "Eliminar todos los encabezados", "Cambiar el nombre de la hoja", "Combinar todas las celdas"], correctOption: 0 },
	],
};

const excelB1T3: LessonContent = {
	introduction: "Las fórmulas básicas te permiten calcular totales, promedios y otros indicadores sin hacer cuentas manuales. En esta clase dominarás SUMA, PROMEDIO, MAX, MIN y CONTAR, aplicándolas a casos empresariales reales.",
	keyConcepts: [
		"SUMA(rango) suma todos los valores numéricos de un rango de celdas.",
		"PROMEDIO(rango) calcula la media aritmética de un conjunto de valores.",
		"MAX(rango) y MIN(rango) devuelven el valor más alto y más bajo de un rango.",
		"CONTAR(rango) cuenta cuántas celdas de un rango contienen números.",
		"Estas funciones son la base de reportes empresariales como ventas totales, ticket promedio o el mejor vendedor del mes.",
	],
	realExample: { title: "Resumen de ventas mensuales", description: "Con una columna de ventas diarias, =SUMA() da el total del mes, =PROMEDIO() el ticket promedio, =MAX() la mejor venta del mes y =MIN() la más baja." },
	practicalCase: { title: "Evaluar el desempeño de un equipo comercial", description: "Un gerente de ventas usa =MAX() para identificar al vendedor con mayor monto vendido y =CONTAR() para saber cuántos vendedores cumplieron su meta mínima de ventas registradas." },
	guidedActivity: { title: "Construye un resumen de indicadores", instructions: "1) Crea una lista de ventas diarias de un mes (30 filas). 2) Calcula el total con SUMA. 3) Calcula el promedio diario con PROMEDIO. 4) Encuentra la venta más alta y más baja con MAX y MIN. 5) Cuenta cuántos días tuvieron ventas registradas con CONTAR." },
	reflectionQuestion: "¿Qué decisiones de negocio podrías tomar al conocer el promedio, el máximo y el mínimo de tus ventas mensuales?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué hace la función SUMA?", options: ["Suma todos los valores numéricos de un rango", "Cuenta celdas vacías", "Busca un valor en una tabla", "Cambia el formato de una celda"], correctOption: 0 },
		{ prompt: "¿Qué calcula la función PROMEDIO?", options: ["La media aritmética de un conjunto de valores", "El valor más alto de un rango", "El número de celdas con texto", "La suma total de un rango"], correctOption: 0 },
		{ prompt: "¿Qué devuelve la función MAX?", options: ["El valor más alto de un rango", "El valor más bajo de un rango", "El promedio de un rango", "El total de un rango"], correctOption: 0 },
		{ prompt: "¿Qué devuelve la función MIN?", options: ["El valor más bajo de un rango", "El valor más alto de un rango", "La suma de un rango", "El conteo de un rango"], correctOption: 0 },
		{ prompt: "¿Qué cuenta la función CONTAR?", options: ["Cuántas celdas de un rango contienen números", "Cuántas celdas están vacías", "Cuántas hojas tiene el libro", "Cuántos colores tiene la hoja"], correctOption: 0 },
		{ prompt: "En el ejemplo de ventas mensuales, ¿qué función usarías para el total del mes?", options: ["SUMA", "MAX", "MIN", "CONTAR"], correctOption: 0 },
		{ prompt: "¿Qué función usaría un gerente para identificar al mejor vendedor por monto?", options: ["MAX", "MIN", "PROMEDIO", "CONTAR"], correctOption: 0 },
		{ prompt: "¿Qué indicador obtienes al calcular el promedio de ventas diarias?", options: ["El ticket promedio de ventas", "El total acumulado", "El número de productos", "El nombre del mejor vendedor"], correctOption: 0 },
		{ prompt: "¿Qué función te dice cuántos días tuvieron ventas registradas?", options: ["CONTAR", "SUMA", "MAX", "MIN"], correctOption: 0 },
		{ prompt: "¿Por qué son importantes SUMA, PROMEDIO, MAX, MIN y CONTAR en un negocio?", options: ["Porque permiten construir reportes e indicadores clave sin cálculos manuales", "Porque cambian el diseño de la hoja", "Porque traducen los datos a otro idioma", "Porque eliminan errores de ortografía"], correctOption: 0 },
	],
};

const excelB1T4: LessonContent = {
	introduction: "Un buen formato y diseño convierte una hoja de datos en un reporte profesional y fácil de leer. En esta clase aprenderás formato de números, formato condicional, bordes, colores y estilos de tabla para presentar tu información con impacto visual.",
	keyConcepts: [
		"El formato de números permite mostrar cifras como moneda, porcentaje o con separadores de miles sin cambiar el valor real.",
		"El formato condicional resalta automáticamente celdas según una regla, por ejemplo valores por debajo de una meta.",
		"Los bordes y colores ayudan a separar visualmente secciones de un reporte.",
		"Los estilos de tabla predefinidos aplican un diseño coherente y profesional en un solo clic.",
		"Un diseño profesional prioriza la claridad: colores consistentes, buen contraste y jerarquía visual clara.",
	],
	realExample: { title: "Reporte de cumplimiento de metas", description: "Una tabla de ventas usa formato condicional para resaltar en rojo las filas por debajo de la meta y en verde las que la superan, permitiendo identificar el desempeño de un vistazo." },
	practicalCase: { title: "Presentar un reporte a la gerencia", description: "Un analista debe entregar un reporte semanal. Aplicando un estilo de tabla profesional, bordes claros y formato de moneda a los montos, logra un documento fácil de interpretar en la reunión gerencial." },
	guidedActivity: { title: "Diseña un reporte profesional", instructions: "1) Toma una tabla de ventas con montos y metas. 2) Aplica formato de moneda a los montos. 3) Aplica formato condicional para resaltar en rojo las ventas menores a la meta. 4) Aplica un estilo de tabla predefinido. 5) Agrega bordes al título del reporte." },
	reflectionQuestion: "¿Cómo puede el formato y diseño de un reporte influir en la rapidez con la que alguien toma una decisión?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué permite el formato de números?", options: ["Mostrar cifras como moneda o porcentaje sin cambiar el valor real", "Eliminar decimales permanentemente", "Convertir números en texto", "Ocultar la celda"], correctOption: 0 },
		{ prompt: "¿Qué hace el formato condicional?", options: ["Resalta automáticamente celdas según una regla", "Cambia el idioma de la hoja", "Combina celdas automáticamente", "Elimina duplicados"], correctOption: 0 },
		{ prompt: "¿Para qué sirven los bordes y colores en un reporte?", options: ["Para separar visualmente secciones del reporte", "Para cambiar el tipo de dato", "Para proteger el archivo", "Para reducir el tamaño del archivo"], correctOption: 0 },
		{ prompt: "¿Qué logra un estilo de tabla predefinido?", options: ["Un diseño coherente y profesional en un clic", "Eliminar todas las fórmulas", "Cambiar el nombre de las columnas", "Ocultar los datos"], correctOption: 0 },
		{ prompt: "¿Qué prioriza un buen diseño profesional?", options: ["Claridad, buen contraste y jerarquía visual", "Muchos colores llamativos", "Texto pequeño y denso", "Bordes en todas las celdas sin excepción"], correctOption: 0 },
		{ prompt: "En el ejemplo de cumplimiento de metas, ¿qué color se usó para ventas por debajo de la meta?", options: ["Rojo", "Verde", "Azul", "Amarillo"], correctOption: 0 },
		{ prompt: "¿Qué formato aplicarías a una columna de montos en soles?", options: ["Formato de moneda", "Formato de fecha", "Formato de texto", "Formato científico"], correctOption: 0 },
		{ prompt: "¿Por qué el analista del caso práctico aplicó un estilo de tabla profesional?", options: ["Para presentar un reporte claro y fácil de interpretar en gerencia", "Para ocultar los datos", "Para cambiar el idioma del reporte", "Para reducir el número de columnas"], correctOption: 0 },
		{ prompt: "¿Qué elemento visual ayuda a destacar el título de un reporte?", options: ["Bordes y combinación de celdas", "Formato de número", "Función CONTAR", "Referencia relativa"], correctOption: 0 },
		{ prompt: "¿Cómo influye el diseño de un reporte en la toma de decisiones?", options: ["Permite identificar información clave más rápido", "No tiene ninguna influencia", "Hace que los datos sean más precisos", "Cambia los resultados de las fórmulas"], correctOption: 0 },
	],
};

// ===== EXCEL INTERMEDIO =====
const excelI1: LessonContent = {
	introduction: "Las funciones intermedias te permiten evaluar múltiples condiciones y controlar errores en tus fórmulas. En esta clase trabajarás con SI, SI.CONJUNTO, Y, O y SI.ERROR aplicadas a casos empresariales reales.",
	keyConcepts: [
		"SI evalúa una condición simple y devuelve un resultado u otro.",
		"SI.CONJUNTO evalúa varias condiciones en orden y devuelve el resultado de la primera que se cumpla, evitando anidar múltiples SI.",
		"Y(condición1, condición2...) devuelve VERDADERO solo si todas las condiciones se cumplen.",
		"O(condición1, condición2...) devuelve VERDADERO si al menos una condición se cumple.",
		"SI.ERROR muestra un valor alternativo cuando una fórmula genera un error, evitando que el reporte se vea con errores visibles.",
	],
	realExample: { title: "Clasificar el desempeño de ventas", description: "Con SI.CONJUNTO se puede clasificar una venta como 'Baja', 'Media' o 'Alta' según distintos rangos de monto, sin anidar varias funciones SI." },
	practicalCase: { title: "Aprobar un crédito según dos condiciones", description: "Un analista financiero usa Y() para aprobar un crédito solo si el cliente tiene ingresos suficientes Y buen historial crediticio, evitando aprobar casos que cumplan solo una condición." },
	guidedActivity: { title: "Automatiza una clasificación con condiciones múltiples", instructions: "1) Crea una lista de ventas con montos. 2) Usa SI.CONJUNTO para clasificarlas en 'Baja', 'Media' o 'Alta'. 3) Usa Y() para marcar los clientes que cumplen dos condiciones (por ejemplo, monto alto Y cliente frecuente). 4) Aplica SI.ERROR a una fórmula de división para evitar mostrar #DIV/0!." },
	reflectionQuestion: "¿En qué proceso de tu trabajo podrías reemplazar varias funciones SI anidadas por una sola SI.CONJUNTO?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué evalúa la función SI?", options: ["Una condición simple y devuelve un resultado u otro", "Varias hojas del libro", "El nombre del archivo", "El formato de una celda"], correctOption: 0 },
		{ prompt: "¿Qué ventaja tiene SI.CONJUNTO frente a anidar varios SI?", options: ["Evalúa varias condiciones en orden de forma más clara", "Es más lenta que SI", "No permite condiciones múltiples", "Solo funciona con texto"], correctOption: 0 },
		{ prompt: "¿Cuándo devuelve VERDADERO la función Y?", options: ["Solo si todas las condiciones se cumplen", "Si al menos una condición se cumple", "Siempre devuelve VERDADERO", "Nunca devuelve VERDADERO"], correctOption: 0 },
		{ prompt: "¿Cuándo devuelve VERDADERO la función O?", options: ["Si al menos una condición se cumple", "Solo si todas las condiciones se cumplen", "Solo si el valor es cero", "Nunca"], correctOption: 0 },
		{ prompt: "¿Para qué sirve SI.ERROR?", options: ["Para mostrar un valor alternativo cuando una fórmula genera un error", "Para eliminar errores de ortografía", "Para contar errores en la hoja", "Para proteger el archivo"], correctOption: 0 },
		{ prompt: "En el ejemplo de clasificación de ventas, ¿qué función se usó?", options: ["SI.CONJUNTO", "CONTAR.SI", "BUSCARV", "Y"], correctOption: 0 },
		{ prompt: "En el caso del crédito, ¿qué función asegura que se cumplan dos condiciones a la vez?", options: ["Y", "O", "SI.ERROR", "CONTAR"], correctOption: 0 },
		{ prompt: "¿Qué error evita mostrar la función SI.ERROR?", options: ["#DIV/0! y otros errores de fórmula", "Errores de ortografía", "Errores de formato de celda", "Errores de impresión"], correctOption: 0 },
		{ prompt: "¿Qué tipo de valor devuelven las funciones Y y O?", options: ["VERDADERO o FALSO", "Un número", "Un texto", "Una fecha"], correctOption: 0 },
		{ prompt: "¿Por qué son útiles estas funciones en casos empresariales?", options: ["Porque automatizan decisiones basadas en condiciones reales del negocio", "Porque cambian el color de las celdas", "Porque traducen el contenido", "Porque reducen el tamaño del archivo"], correctOption: 0 },
	],
};

const excelI2: LessonContent = {
	introduction: "Buscar información relacionada entre distintas tablas es una de las tareas más comunes en el análisis de datos. En esta clase aprenderás BUSCARV, BUSCARX, BUSCARH, ÍNDICE y COINCIDIR para relacionar información de forma precisa.",
	keyConcepts: [
		"BUSCARV busca un valor en la primera columna de una tabla y devuelve un dato de otra columna a la derecha.",
		"BUSCARX es la evolución moderna de BUSCARV: busca en cualquier dirección (no solo a la derecha) y es más flexible.",
		"BUSCARH funciona igual que BUSCARV pero busca en filas en lugar de columnas.",
		"COINCIDIR devuelve la posición de un valor dentro de un rango.",
		"ÍNDICE devuelve el valor de una celda según su posición de fila y columna; combinado con COINCIDIR, permite búsquedas muy flexibles.",
	],
	realExample: { title: "Traer el precio de un producto por su código", description: "Con BUSCARX puedes buscar un código de producto en una tabla y traer su precio, sin importar si la columna de precios está a la izquierda o derecha del código." },
	practicalCase: { title: "Relacionar ventas con nombres de vendedores", description: "Un reporte de ventas tiene el ID del vendedor, pero no su nombre. Usando BUSCARV (o ÍNDICE + COINCIDIR) se trae el nombre completo desde una tabla de empleados." },
	guidedActivity: { title: "Relaciona dos tablas con funciones de búsqueda", instructions: "1) Crea una tabla de productos con código y precio. 2) Crea una segunda tabla de ventas que solo tenga el código de producto. 3) Usa BUSCARV o BUSCARX para traer el precio a la tabla de ventas. 4) Practica con ÍNDICE y COINCIDIR para lograr el mismo resultado de otra forma." },
	reflectionQuestion: "¿Por qué BUSCARX se considera más flexible que BUSCARV en reportes empresariales modernos?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué hace BUSCARV?", options: ["Busca un valor en la primera columna y devuelve un dato de otra columna a la derecha", "Cuenta celdas con texto", "Suma un rango de celdas", "Cambia el formato de una celda"], correctOption: 0 },
		{ prompt: "¿Qué ventaja tiene BUSCARX sobre BUSCARV?", options: ["Puede buscar en cualquier dirección, no solo a la derecha", "Solo funciona con números", "Es más lenta", "No permite tablas grandes"], correctOption: 0 },
		{ prompt: "¿En qué se diferencia BUSCARH de BUSCARV?", options: ["BUSCARH busca en filas en lugar de columnas", "BUSCARH no existe en Excel", "BUSCARH solo funciona con texto", "BUSCARH es más lenta que BUSCARV"], correctOption: 0 },
		{ prompt: "¿Qué devuelve la función COINCIDIR?", options: ["La posición de un valor dentro de un rango", "El valor máximo de un rango", "El promedio de un rango", "El nombre de una hoja"], correctOption: 0 },
		{ prompt: "¿Qué hace la función ÍNDICE?", options: ["Devuelve el valor de una celda según su posición de fila y columna", "Cuenta cuántas celdas tienen números", "Suma un rango de celdas", "Cambia el color de una celda"], correctOption: 0 },
		{ prompt: "¿Qué combinación de funciones ofrece búsquedas muy flexibles?", options: ["ÍNDICE y COINCIDIR", "SUMA y PROMEDIO", "MAX y MIN", "Y y O"], correctOption: 0 },
		{ prompt: "En el ejemplo del producto por código, ¿qué función se usó?", options: ["BUSCARX", "CONTAR.SI", "SUMAR.SI", "SI.ERROR"], correctOption: 0 },
		{ prompt: "En el caso de relacionar ventas con vendedores, ¿qué se buscó?", options: ["El nombre del vendedor a partir de su ID", "El precio de un producto", "El total de ventas", "La fecha de venta"], correctOption: 0 },
		{ prompt: "¿Qué debes verificar antes de usar BUSCARV?", options: ["Que el valor buscado esté en la primera columna del rango", "Que la hoja tenga colores", "Que el archivo sea .pdf", "Que la tabla esté oculta"], correctOption: 0 },
		{ prompt: "¿Por qué son importantes estas funciones de búsqueda en el análisis de datos?", options: ["Porque permiten relacionar información entre distintas tablas de forma precisa", "Porque cambian el idioma del archivo", "Porque reducen el tamaño del archivo", "Porque eliminan errores de ortografía"], correctOption: 0 },
	],
};

const excelI3: LessonContent = {
	introduction: "Gestionar bases de datos en Excel implica mantener la información ordenada, confiable y libre de errores. En esta clase aprenderás a ordenar datos, aplicar filtros avanzados, validar la entrada de información, segmentar registros y eliminar duplicados.",
	keyConcepts: [
		"Ordenar datos permite organizar una lista de menor a mayor, alfabéticamente o por color/criterio personalizado.",
		"Los filtros avanzados permiten combinar varios criterios de búsqueda a la vez, más allá del filtro simple.",
		"La validación de datos restringe lo que se puede escribir en una celda (por ejemplo, solo números entre 1 y 100).",
		"La segmentación de datos permite dividir la información en grupos visuales para analizarla más fácilmente.",
		"Eliminar duplicados limpia una base de datos de registros repetidos que distorsionan los análisis.",
	],
	realExample: { title: "Limpieza de una base de clientes", description: "Una base de clientes con registros repetidos se limpia usando 'Eliminar duplicados', y luego se valida que el campo de correo tenga el formato correcto." },
	practicalCase: { title: "Filtrar clientes por múltiples criterios", description: "Un equipo comercial necesita ver solo los clientes de Lima que compraron más de S/ 1000 en el último mes. Con un filtro avanzado se combinan ambos criterios en un solo resultado." },
	guidedActivity: { title: "Organiza y limpia una base de datos", instructions: "1) Crea una lista de clientes con nombre, ciudad y monto de compra (incluye registros duplicados). 2) Ordena la lista por monto de compra de mayor a menor. 3) Aplica un filtro avanzado para mostrar solo clientes de una ciudad con monto mayor a un valor. 4) Usa 'Eliminar duplicados' para limpiar la lista. 5) Aplica validación de datos a la columna de monto para permitir solo números positivos." },
	reflectionQuestion: "¿Qué problemas puede causar una base de datos con registros duplicados en un reporte empresarial?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué permite hacer 'Ordenar datos'?", options: ["Organizar una lista de menor a mayor, alfabéticamente o por criterio personalizado", "Eliminar columnas", "Cambiar el tipo de dato", "Combinar celdas"], correctOption: 0 },
		{ prompt: "¿Qué ventaja tienen los filtros avanzados frente a los simples?", options: ["Permiten combinar varios criterios de búsqueda a la vez", "Solo funcionan con una columna", "Eliminan datos permanentemente", "No se pueden deshacer"], correctOption: 0 },
		{ prompt: "¿Para qué sirve la validación de datos?", options: ["Para restringir lo que se puede escribir en una celda", "Para eliminar duplicados", "Para ordenar una lista", "Para dar formato de moneda"], correctOption: 0 },
		{ prompt: "¿Qué logra la segmentación de datos?", options: ["Dividir la información en grupos visuales para analizarla mejor", "Eliminar filas vacías", "Cambiar el nombre de las columnas", "Proteger el archivo con contraseña"], correctOption: 0 },
		{ prompt: "¿Qué problema resuelve 'Eliminar duplicados'?", options: ["Registros repetidos que distorsionan los análisis", "Errores de fórmula", "Columnas vacías", "Errores de formato"], correctOption: 0 },
		{ prompt: "En el ejemplo de limpieza de base de clientes, ¿qué se validó además de eliminar duplicados?", options: ["El formato correcto del correo", "El color de la celda", "El nombre de la hoja", "El tamaño del archivo"], correctOption: 0 },
		{ prompt: "En el caso práctico de filtrar clientes, ¿cuántos criterios se combinaron?", options: ["Dos: ciudad y monto de compra", "Uno: solo ciudad", "Tres: ciudad, monto y fecha", "Ninguno"], correctOption: 0 },
		{ prompt: "¿Qué tipo de validación permitiría solo números entre 1 y 100?", options: ["Validación de datos con un rango numérico", "Formato condicional", "Filtro simple", "Combinar celdas"], correctOption: 0 },
		{ prompt: "¿Por qué es importante ordenar los datos antes de analizarlos?", options: ["Facilita identificar patrones y valores extremos", "Cambia el resultado de las fórmulas", "Elimina los encabezados", "Reduce el tamaño del archivo"], correctOption: 0 },
		{ prompt: "¿Qué consecuencia tiene una base de datos mal gestionada en una empresa?", options: ["Reportes y decisiones basadas en información incorrecta", "Ninguna consecuencia relevante", "El archivo se abre más rápido", "Los colores de la hoja cambian"], correctOption: 0 },
	],
};

const excelI4: LessonContent = {
	introduction: "Las tablas dinámicas son una de las herramientas más poderosas de Excel para resumir y analizar grandes volúmenes de datos sin escribir fórmulas complejas. En esta clase aprenderás a crearlas, segmentarlas, agruparlas y construir un dashboard básico.",
	keyConcepts: [
		"Una tabla dinámica resume datos de una base grande agrupándolos por categorías (por ejemplo, ventas por región).",
		"Los segmentadores de datos permiten filtrar visualmente una tabla dinámica con un solo clic.",
		"La agrupación permite combinar fechas por mes/año o valores numéricos por rangos.",
		"El análisis de información con tablas dinámicas revela patrones que serían difíciles de ver en una lista larga.",
		"Un dashboard básico combina varias tablas y gráficos dinámicos en una sola vista para tomar decisiones rápidas.",
	],
	realExample: { title: "Ventas totales por región y mes", description: "Con una tabla dinámica, una base de miles de ventas se resume en segundos mostrando el total vendido por región y por mes, sin escribir una sola fórmula." },
	practicalCase: { title: "Analizar el producto más vendido por trimestre", description: "Un analista agrupa las fechas de venta por trimestre y usa una tabla dinámica para identificar qué producto generó más ingresos en cada periodo." },
	guidedActivity: { title: "Crea tu primera tabla dinámica", instructions: "1) Parte de una base de ventas con columnas Fecha, Región, Producto y Monto. 2) Inserta una tabla dinámica y arrastra Región a filas y Monto a valores. 3) Agrega un segmentador de datos por Producto. 4) Agrupa las fechas por mes. 5) Agrega un gráfico dinámico para formar un pequeño dashboard." },
	reflectionQuestion: "¿Qué decisiones podrías tomar más rápido usando una tabla dinámica en lugar de revisar una lista larga de datos manualmente?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué hace una tabla dinámica?", options: ["Resume datos de una base grande agrupándolos por categorías", "Elimina duplicados automáticamente", "Cambia el formato de las celdas", "Traduce el contenido de la hoja"], correctOption: 0 },
		{ prompt: "¿Para qué sirve un segmentador de datos?", options: ["Para filtrar visualmente una tabla dinámica con un clic", "Para sumar valores", "Para ordenar alfabéticamente", "Para proteger el archivo"], correctOption: 0 },
		{ prompt: "¿Qué permite la agrupación en una tabla dinámica?", options: ["Combinar fechas por mes/año o valores por rangos", "Eliminar columnas", "Cambiar el nombre de la hoja", "Insertar imágenes"], correctOption: 0 },
		{ prompt: "¿Qué ventaja tiene analizar información con tablas dinámicas?", options: ["Revela patrones difíciles de ver en una lista larga", "Cambia los valores originales de los datos", "Reduce el tamaño del archivo", "Elimina la necesidad de tener datos"], correctOption: 0 },
		{ prompt: "¿Qué combina un dashboard básico?", options: ["Varias tablas y gráficos dinámicos en una sola vista", "Solo texto sin datos", "Un único número aislado", "Una lista sin formato"], correctOption: 0 },
		{ prompt: "En el ejemplo de ventas por región y mes, ¿qué se colocó en 'filas' y 'valores'?", options: ["Región en filas y Monto en valores", "Fecha en valores y Producto en filas", "Monto en filas y Región en valores", "Producto en valores"], correctOption: 0 },
		{ prompt: "En el caso del producto más vendido por trimestre, ¿qué se agrupó?", options: ["Las fechas de venta por trimestre", "Los nombres de los clientes", "Las regiones de venta", "Los códigos de producto"], correctOption: 0 },
		{ prompt: "¿Qué elemento agregarías para ver la evolución de ventas visualmente en el dashboard?", options: ["Un gráfico dinámico", "Una validación de datos", "Un formato condicional", "Una función SI"], correctOption: 0 },
		{ prompt: "¿Qué dato de origen necesitas antes de crear una tabla dinámica?", options: ["Una base de datos ordenada con encabezados claros", "Un archivo protegido con contraseña", "Un gráfico ya creado", "Un segmentador previo"], correctOption: 0 },
		{ prompt: "¿Por qué las tablas dinámicas son clave en el análisis empresarial?", options: ["Permiten resumir y analizar grandes volúmenes de datos rápidamente", "Porque cambian el idioma del archivo", "Porque eliminan la necesidad de revisar datos", "Porque solo sirven para textos cortos"], correctOption: 0 },
	],
};

const excelI5: LessonContent = {
	introduction: "Los gráficos convierten datos numéricos en imágenes fáciles de interpretar. En esta clase aprenderás a crear gráficos de barras, circulares y combinados, aplicando buenas prácticas de visualización de datos en casos empresariales.",
	keyConcepts: [
		"Los gráficos de barras son ideales para comparar valores entre categorías (por ejemplo, ventas por vendedor).",
		"Los gráficos circulares muestran la proporción de cada categoría respecto a un total.",
		"Los gráficos combinados mezclan dos tipos de gráfico (por ejemplo, barras y línea) para comparar métricas distintas en un solo gráfico.",
		"Una buena visualización de datos evita el exceso de colores y etiquetas innecesarias que distraen del mensaje principal.",
		"El tipo de gráfico correcto depende de la pregunta que quieres responder: comparar, mostrar proporción o ver una tendencia.",
	],
	realExample: { title: "Comparar ventas por vendedor", description: "Un gráfico de barras horizontal muestra claramente qué vendedor tuvo el mejor desempeño del mes, comparando montos de forma visual e inmediata." },
	practicalCase: { title: "Mostrar la participación de mercado por producto", description: "Un gráfico circular muestra qué porcentaje de las ventas totales corresponde a cada línea de producto, ayudando a priorizar inversión en la más rentable." },
	guidedActivity: { title: "Crea un set de gráficos profesionales", instructions: "1) Con una base de ventas por vendedor, crea un gráfico de barras. 2) Con una base de ventas por categoría de producto, crea un gráfico circular. 3) Crea un gráfico combinado que muestre ventas mensuales (barras) y meta acumulada (línea). 4) Ajusta títulos y colores para una presentación clara." },
	reflectionQuestion: "¿Qué tipo de gráfico elegirías para mostrar la evolución de tus ventas mes a mes, y por qué?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Para qué es ideal un gráfico de barras?", options: ["Comparar valores entre categorías", "Mostrar proporciones de un total", "Mostrar solo un valor único", "Ocultar información sensible"], correctOption: 0 },
		{ prompt: "¿Qué muestra un gráfico circular?", options: ["La proporción de cada categoría respecto a un total", "La evolución en el tiempo", "Comparaciones entre dos métricas distintas", "Solo valores negativos"], correctOption: 0 },
		{ prompt: "¿Qué combina un gráfico combinado?", options: ["Dos tipos de gráfico, como barras y línea", "Dos hojas de cálculo", "Dos libros de Excel", "Dos tablas dinámicas"], correctOption: 0 },
		{ prompt: "¿Qué debe evitar una buena visualización de datos?", options: ["El exceso de colores y etiquetas innecesarias", "El uso de títulos", "El uso de ejes numéricos", "El uso de leyendas"], correctOption: 0 },
		{ prompt: "¿De qué depende elegir el tipo de gráfico correcto?", options: ["De la pregunta que se quiere responder con los datos", "Del color favorito del analista", "Del tamaño del archivo", "Del número de hojas del libro"], correctOption: 0 },
		{ prompt: "En el ejemplo de comparar ventas por vendedor, ¿qué gráfico se usó?", options: ["Gráfico de barras", "Gráfico circular", "Gráfico de líneas", "Gráfico combinado"], correctOption: 0 },
		{ prompt: "En el caso de participación de mercado por producto, ¿qué gráfico es más adecuado?", options: ["Gráfico circular", "Gráfico de barras", "Gráfico combinado", "Ninguno"], correctOption: 0 },
		{ prompt: "¿Qué gráfico usarías para comparar ventas mensuales con una meta acumulada?", options: ["Gráfico combinado (barras y línea)", "Gráfico circular", "Solo texto", "Formato condicional"], correctOption: 0 },
		{ prompt: "¿Qué elemento del gráfico ayuda a que el lector entienda rápidamente el mensaje?", options: ["Un título claro y colores consistentes", "Muchas etiquetas superpuestas", "Colores aleatorios", "Ausencia de leyenda"], correctOption: 0 },
		{ prompt: "¿Por qué son importantes los gráficos en un reporte empresarial?", options: ["Porque comunican información de forma más rápida y clara que una tabla de números", "Porque hacen el archivo más pesado", "Porque reemplazan la necesidad de tener datos correctos", "Porque son obligatorios en todo archivo de Excel"], correctOption: 0 },
	],
};

// ===== EXCEL AVANZADO =====
const excelA1: LessonContent = {
	introduction: "Las funciones avanzadas de suma y conteo condicional permiten construir reportes empresariales precisos sin depender de tablas dinámicas. En esta clase dominarás SUMAR.SI, SUMAR.SI.CONJUNTO, CONTAR.SI, CONTAR.SI.CONJUNTO y PROMEDIO.SI.",
	keyConcepts: [
		"SUMAR.SI suma los valores de un rango que cumplen un solo criterio.",
		"SUMAR.SI.CONJUNTO suma valores que cumplen múltiples criterios a la vez.",
		"CONTAR.SI cuenta celdas que cumplen un criterio; CONTAR.SI.CONJUNTO cuenta celdas que cumplen varios criterios.",
		"PROMEDIO.SI calcula el promedio de un rango que cumple una condición específica.",
		"Estas funciones permiten construir reportes segmentados (por región, producto o periodo) sin usar tablas dinámicas.",
	],
	realExample: { title: "Ventas totales de un producto específico", description: "Con =SUMAR.SI(rango_producto,\"Laptop\",rango_monto) se obtiene el total vendido solo del producto 'Laptop', sin filtrar manualmente la base de datos." },
	practicalCase: { title: "Ventas de un vendedor en una región y periodo específico", description: "Un gerente necesita el total vendido por 'Ana' en la región 'Norte' durante 'Enero'. Con SUMAR.SI.CONJUNTO combina los tres criterios en una sola fórmula." },
	guidedActivity: { title: "Construye un reporte segmentado con funciones condicionales", instructions: "1) Parte de una base de ventas con Vendedor, Región, Mes y Monto. 2) Usa SUMAR.SI para el total de un vendedor específico. 3) Usa SUMAR.SI.CONJUNTO para el total de ese vendedor en una región y mes específicos. 4) Usa CONTAR.SI.CONJUNTO para contar cuántas ventas cumplen esos mismos criterios. 5) Usa PROMEDIO.SI para el ticket promedio de ese vendedor." },
	reflectionQuestion: "¿En qué reportes de tu trabajo podrías reemplazar filtros manuales por fórmulas SUMAR.SI.CONJUNTO?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué hace SUMAR.SI?", options: ["Suma los valores de un rango que cumplen un solo criterio", "Cuenta celdas con texto", "Busca un valor en una tabla", "Calcula el máximo de un rango"], correctOption: 0 },
		{ prompt: "¿Qué diferencia a SUMAR.SI.CONJUNTO de SUMAR.SI?", options: ["Permite evaluar múltiples criterios a la vez", "Solo funciona con fechas", "No permite rangos numéricos", "Es una función obsoleta"], correctOption: 0 },
		{ prompt: "¿Qué cuenta CONTAR.SI.CONJUNTO?", options: ["Celdas que cumplen varios criterios a la vez", "Todas las celdas de la hoja", "Solo celdas vacías", "Solo celdas con errores"], correctOption: 0 },
		{ prompt: "¿Qué calcula PROMEDIO.SI?", options: ["El promedio de un rango que cumple una condición específica", "El total de un rango", "El valor máximo de un rango", "El número de celdas de un rango"], correctOption: 0 },
		{ prompt: "¿Qué ventaja tienen estas funciones frente a filtrar manualmente?", options: ["Permiten construir reportes segmentados automáticamente", "Eliminan la necesidad de tener datos", "Cambian el formato de la hoja", "Traducen el contenido"], correctOption: 0 },
		{ prompt: "En el ejemplo de ventas de un producto, ¿qué función se usó?", options: ["SUMAR.SI", "CONTAR.SI", "PROMEDIO.SI", "BUSCARV"], correctOption: 0 },
		{ prompt: "En el caso del vendedor por región y mes, ¿cuántos criterios se combinaron?", options: ["Tres: vendedor, región y mes", "Uno: solo vendedor", "Dos: región y mes", "Ninguno"], correctOption: 0 },
		{ prompt: "¿Qué función usarías para saber cuántas ventas cumplen tres condiciones a la vez?", options: ["CONTAR.SI.CONJUNTO", "CONTAR.SI", "SUMAR.SI", "PROMEDIO.SI"], correctOption: 0 },
		{ prompt: "¿Qué obtienes al aplicar PROMEDIO.SI a las ventas de un vendedor?", options: ["Su ticket promedio de venta", "Su total de ventas", "El número de ventas realizadas", "El nombre del producto más vendido"], correctOption: 0 },
		{ prompt: "¿Por qué son clave estas funciones en reportes empresariales avanzados?", options: ["Porque automatizan análisis segmentados sin tablas dinámicas", "Porque cambian el idioma del reporte", "Porque reducen el tamaño del archivo", "Porque eliminan errores de ortografía"], correctOption: 0 },
	],
};

const excelA2: LessonContent = {
	introduction: "Las herramientas de análisis de datos de Excel permiten simular escenarios y encontrar la mejor decisión ante la incertidumbre. En esta clase conocerás Escenarios, Buscar objetivo, Tablas de datos, Solver y el análisis de sensibilidad.",
	keyConcepts: [
		"Los Escenarios permiten guardar y comparar distintos conjuntos de valores de entrada y ver su efecto en un resultado.",
		"Buscar objetivo encuentra el valor de entrada necesario para lograr un resultado deseado en una fórmula.",
		"Las Tablas de datos muestran cómo cambia un resultado al variar una o dos variables de entrada.",
		"Solver resuelve problemas de optimización con restricciones (por ejemplo, maximizar ganancia con recursos limitados).",
		"El análisis de sensibilidad evalúa cómo los cambios en una variable afectan el resultado final de un modelo.",
	],
	realExample: { title: "¿Cuántas unidades debo vender para llegar a mi meta?", description: "Con Buscar objetivo, defines la utilidad deseada y Excel calcula automáticamente cuántas unidades necesitas vender para alcanzarla." },
	practicalCase: { title: "Comparar tres escenarios de precios", description: "Una empresa evalúa tres escenarios de precio (bajo, medio, alto) y su impacto en la utilidad usando la herramienta Escenarios, sin duplicar la hoja tres veces." },
	guidedActivity: { title: "Simula decisiones con herramientas de análisis", instructions: "1) Crea un modelo simple de utilidad = (precio - costo) x unidades vendidas. 2) Usa Buscar objetivo para encontrar las unidades necesarias para una utilidad meta. 3) Crea 3 Escenarios con distintos precios y compáralos. 4) Genera una Tabla de datos que muestre la utilidad al variar el precio y las unidades vendidas." },
	reflectionQuestion: "¿Qué decisión de negocio te gustaría simular usando Buscar objetivo o Escenarios antes de tomarla en la realidad?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué permite hacer la herramienta Escenarios?", options: ["Guardar y comparar distintos conjuntos de valores de entrada", "Eliminar duplicados", "Crear gráficos automáticamente", "Proteger la hoja"], correctOption: 0 },
		{ prompt: "¿Qué hace Buscar objetivo?", options: ["Encuentra el valor de entrada necesario para lograr un resultado deseado", "Suma un rango de celdas", "Cuenta celdas con texto", "Crea una tabla dinámica"], correctOption: 0 },
		{ prompt: "¿Qué muestra una Tabla de datos en análisis de escenarios?", options: ["Cómo cambia un resultado al variar una o dos variables", "El historial de cambios del archivo", "Los errores de fórmula de la hoja", "El número de hojas del libro"], correctOption: 0 },
		{ prompt: "¿Para qué se usa Solver?", options: ["Para resolver problemas de optimización con restricciones", "Para dar formato a una tabla", "Para eliminar filas vacías", "Para traducir el contenido de la hoja"], correctOption: 0 },
		{ prompt: "¿Qué evalúa el análisis de sensibilidad?", options: ["Cómo los cambios en una variable afectan el resultado final", "El color de las celdas", "El número de usuarios del archivo", "El idioma de la hoja"], correctOption: 0 },
		{ prompt: "En el ejemplo de unidades para llegar a la meta, ¿qué herramienta se usó?", options: ["Buscar objetivo", "Solver", "Tabla de datos", "Escenarios"], correctOption: 0 },
		{ prompt: "En el caso de comparar precios, ¿qué herramienta evita duplicar la hoja tres veces?", options: ["Escenarios", "Buscar objetivo", "Solver", "Validación de datos"], correctOption: 0 },
		{ prompt: "¿Qué tipo de problema resuelve Solver mejor que Buscar objetivo?", options: ["Problemas de optimización con varias restricciones", "Sumar un rango simple", "Contar celdas vacías", "Cambiar el formato de una celda"], correctOption: 0 },
		{ prompt: "¿Qué variables podrías analizar en una Tabla de datos de dos variables?", options: ["Precio y unidades vendidas, por ejemplo", "Solo el nombre del producto", "El color de la celda", "El idioma del archivo"], correctOption: 0 },
		{ prompt: "¿Por qué es valioso el análisis de datos avanzado en la toma de decisiones?", options: ["Permite anticipar resultados antes de tomar una decisión real", "Porque cambia automáticamente los precios del mercado", "Porque elimina la necesidad de tener datos reales", "Porque solo sirve para presentaciones"], correctOption: 0 },
	],
};

const excelA3: LessonContent = {
	introduction: "Power Query es la herramienta de Excel para importar, limpiar y transformar datos de múltiples fuentes antes de analizarlos. En esta clase aprenderás el flujo completo: importar, limpiar, transformar y automatizar la actualización de tus datos.",
	keyConcepts: [
		"Power Query permite importar datos desde Excel, CSV, bases de datos y otras fuentes externas.",
		"La limpieza de datos incluye quitar espacios, corregir mayúsculas/minúsculas y eliminar valores nulos.",
		"La transformación de datos incluye dividir columnas, combinar tablas y cambiar tipos de datos.",
		"Cada paso aplicado en Power Query queda registrado y se puede editar o eliminar sin rehacer todo el proceso.",
		"La automatización permite actualizar el reporte con un clic cuando cambian los datos de origen, sin repetir el proceso manual.",
	],
	realExample: { title: "Consolidar ventas de tres sucursales", description: "Con Power Query se importan tres archivos CSV de distintas sucursales, se combinan en una sola tabla y se limpian los formatos de fecha antes de analizarlos." },
	practicalCase: { title: "Preparar una base de clientes con datos inconsistentes", description: "Una base de clientes tiene nombres con mayúsculas mezcladas y espacios extra. Con Power Query se estandariza el texto y se eliminan los espacios en un solo proceso repetible." },
	guidedActivity: { title: "Importa y transforma datos con Power Query", instructions: "1) Importa un archivo CSV con datos de ventas usando Power Query. 2) Elimina columnas innecesarias y corrige el tipo de dato de la columna Fecha. 3) Estandariza el texto de la columna Ciudad (mayúsculas). 4) Aplica los cambios y actualiza la consulta para reflejar los datos en tu hoja." },
	reflectionQuestion: "¿Qué proceso repetitivo de limpieza de datos en tu trabajo podrías automatizar con Power Query?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué permite hacer Power Query?", options: ["Importar, limpiar y transformar datos de múltiples fuentes", "Solo crear gráficos", "Solo cambiar el color de las celdas", "Solo proteger archivos"], correctOption: 0 },
		{ prompt: "¿Qué incluye la limpieza de datos en Power Query?", options: ["Quitar espacios y corregir mayúsculas/minúsculas", "Cambiar el idioma del archivo", "Eliminar todas las fórmulas", "Insertar imágenes"], correctOption: 0 },
		{ prompt: "¿Qué incluye la transformación de datos?", options: ["Dividir columnas, combinar tablas y cambiar tipos de datos", "Eliminar el archivo original", "Cambiar el nombre del libro", "Insertar gráficos automáticamente"], correctOption: 0 },
		{ prompt: "¿Qué ventaja tiene que los pasos de Power Query queden registrados?", options: ["Se pueden editar o eliminar sin rehacer todo el proceso", "Ocupan menos espacio en disco", "Se ejecutan más rápido siempre", "No se pueden modificar nunca"], correctOption: 0 },
		{ prompt: "¿Qué logra la automatización de Power Query?", options: ["Actualizar el reporte con un clic cuando cambian los datos de origen", "Eliminar la necesidad de tener datos", "Cambiar el diseño de los gráficos", "Traducir el contenido del archivo"], correctOption: 0 },
		{ prompt: "En el ejemplo de consolidar ventas, ¿cuántas fuentes se combinaron?", options: ["Tres archivos CSV de distintas sucursales", "Un solo archivo", "Dos bases de datos", "Ninguna fuente externa"], correctOption: 0 },
		{ prompt: "En el caso de la base de clientes, ¿qué inconsistencia se corrigió?", options: ["Mayúsculas mezcladas y espacios extra en el texto", "Errores de fórmula", "Colores incorrectos", "Gráficos duplicados"], correctOption: 0 },
		{ prompt: "¿Qué tipo de archivo puedes importar con Power Query además de Excel?", options: ["CSV y bases de datos externas", "Solo archivos de audio", "Solo archivos de video", "Solo archivos PDF"], correctOption: 0 },
		{ prompt: "¿Qué deberías revisar antes de finalizar una consulta en Power Query?", options: ["Que los tipos de datos de cada columna sean correctos", "Que la hoja tenga muchos colores", "Que el archivo esté protegido con contraseña", "Que el gráfico esté insertado"], correctOption: 0 },
		{ prompt: "¿Por qué Power Query es clave en el análisis empresarial moderno?", options: ["Porque ahorra tiempo al automatizar la preparación de datos", "Porque reemplaza la necesidad de tener datos reales", "Porque solo sirve para presentaciones", "Porque cambia el idioma del archivo"], correctOption: 0 },
	],
};

const excelA4: LessonContent = {
	introduction: "Las macros y VBA permiten automatizar tareas repetitivas en Excel, ahorrando tiempo y reduciendo errores manuales. En esta clase conocerás los fundamentos de VBA, cómo grabar macros y cómo crear formularios básicos.",
	keyConcepts: [
		"VBA (Visual Basic for Applications) es el lenguaje de programación integrado en Excel para automatizar tareas.",
		"Grabar una macro registra los pasos que realizas para poder repetirlos automáticamente después.",
		"Automatizar tareas con macros reduce errores humanos en procesos repetitivos como formatear reportes.",
		"Los formularios permiten crear interfaces simples (botones, cuadros de texto) para que otros usuarios interactúen con tu archivo sin ver las fórmulas.",
		"Antes de ejecutar macros de otras personas, siempre debes verificar su origen por seguridad.",
	],
	realExample: { title: "Automatizar el formato de un reporte semanal", description: "Una macro grabada aplica automáticamente el formato de tabla, colores y filtros a un reporte semanal, un proceso que antes tomaba varios minutos manuales." },
	practicalCase: { title: "Botón para generar un reporte con un clic", description: "Un analista crea un botón en la hoja que, al presionarlo, ejecuta una macro que copia los datos del mes, los formatea y genera el reporte final automáticamente." },
	guidedActivity: { title: "Graba tu primera macro", instructions: "1) Activa la ficha Programador en Excel. 2) Graba una macro que aplique formato de tabla a un rango de datos. 3) Detén la grabación y ejecuta la macro en otro rango similar para probar que funciona. 4) Asigna la macro a un botón en la hoja." },
	reflectionQuestion: "¿Qué tarea repetitiva de tu trabajo semanal podrías automatizar con una macro grabada?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué es VBA?", options: ["El lenguaje de programación integrado en Excel para automatizar tareas", "Un tipo de gráfico", "Una función de búsqueda", "Un formato de celda"], correctOption: 0 },
		{ prompt: "¿Qué hace grabar una macro?", options: ["Registra los pasos realizados para repetirlos automáticamente", "Elimina las fórmulas de la hoja", "Cambia el idioma del archivo", "Crea una tabla dinámica"], correctOption: 0 },
		{ prompt: "¿Qué beneficio tiene automatizar tareas con macros?", options: ["Reduce errores humanos en procesos repetitivos", "Aumenta el tamaño del archivo sin motivo", "Elimina la necesidad de tener datos", "Cambia el formato de número automáticamente sin control"], correctOption: 0 },
		{ prompt: "¿Para qué sirven los formularios en Excel?", options: ["Para crear interfaces simples que interactúen con el archivo", "Para eliminar columnas", "Para dar formato de moneda", "Para ordenar datos alfabéticamente"], correctOption: 0 },
		{ prompt: "¿Qué debes verificar antes de ejecutar macros de otra persona?", options: ["Su origen, por motivos de seguridad", "El color de la hoja", "El idioma del archivo", "El tamaño de la fuente"], correctOption: 0 },
		{ prompt: "En el ejemplo del reporte semanal, ¿qué automatizó la macro?", options: ["El formato de tabla, colores y filtros", "El envío de correos", "La creación de gráficos 3D", "La traducción del reporte"], correctOption: 0 },
		{ prompt: "En el caso del botón para generar reportes, ¿qué acción dispara la macro?", options: ["Presionar el botón asignado en la hoja", "Cerrar el archivo", "Cambiar el nombre de la hoja", "Abrir otro libro de Excel"], correctOption: 0 },
		{ prompt: "¿Qué ficha de Excel debes activar para grabar macros?", options: ["Programador", "Insertar", "Revisar", "Vista"], correctOption: 0 },
		{ prompt: "¿Qué puedes hacer después de grabar una macro?", options: ["Ejecutarla en otro rango similar para repetir el proceso", "Solo verla, no se puede ejecutar de nuevo", "Convertirla en un gráfico", "Eliminarla automáticamente"], correctOption: 0 },
		{ prompt: "¿Por qué son valiosas las macros en un entorno empresarial?", options: ["Ahorran tiempo automatizando tareas repetitivas", "Porque cambian el idioma del sistema operativo", "Porque eliminan la necesidad de revisar datos", "Porque solo sirven para uso personal"], correctOption: 0 },
	],
};

const excelA5: LessonContent = {
	introduction: "Un dashboard ejecutivo resume los indicadores más importantes de un negocio en una sola vista. En esta clase aprenderás a diseñar KPIs y construir dashboards financieros, comerciales y gerenciales con Excel.",
	keyConcepts: [
		"Un KPI (indicador clave de desempeño) mide si un objetivo de negocio se está cumpliendo o no.",
		"Un dashboard financiero muestra indicadores como ingresos, gastos, utilidad y flujo de caja.",
		"Un dashboard comercial se enfoca en ventas, metas alcanzadas y desempeño por vendedor o región.",
		"Un dashboard gerencial combina indicadores de distintas áreas para dar una visión general del negocio.",
		"Un buen dashboard prioriza pocos indicadores clave y evita saturar la vista con demasiada información.",
	],
	realExample: { title: "Dashboard financiero mensual", description: "Un dashboard financiero muestra en tarjetas los ingresos, gastos y utilidad del mes, junto a un gráfico de tendencia de los últimos 6 meses." },
	practicalCase: { title: "Dashboard comercial para la gerencia de ventas", description: "Un dashboard comercial muestra el cumplimiento de meta por vendedor, el producto más vendido y un mapa de calor de ventas por región, todo en una sola pantalla." },
	guidedActivity: { title: "Diseña tu propio dashboard ejecutivo", instructions: "1) Define 4 KPIs relevantes para un negocio (por ejemplo: ingresos, utilidad, ventas totales, meta cumplida). 2) Construye una tabla dinámica que alimente cada KPI. 3) Diseña tarjetas o gráficos para mostrar cada indicador. 4) Organiza el dashboard en una sola hoja, priorizando claridad sobre cantidad de información." },
	reflectionQuestion: "¿Qué 3 a 5 indicadores serían los más importantes para un dashboard ejecutivo de tu área de trabajo?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué mide un KPI?", options: ["Si un objetivo de negocio se está cumpliendo o no", "El color de una celda", "El idioma del archivo", "El número de hojas del libro"], correctOption: 0 },
		{ prompt: "¿Qué muestra un dashboard financiero?", options: ["Ingresos, gastos, utilidad y flujo de caja", "Solo el nombre de la empresa", "Solo gráficos circulares", "Solo texto sin datos"], correctOption: 0 },
		{ prompt: "¿En qué se enfoca un dashboard comercial?", options: ["Ventas, metas alcanzadas y desempeño por vendedor o región", "Solo en gastos administrativos", "Solo en el organigrama de la empresa", "Solo en el clima laboral"], correctOption: 0 },
		{ prompt: "¿Qué combina un dashboard gerencial?", options: ["Indicadores de distintas áreas para una visión general", "Solo un indicador financiero", "Solo colores decorativos", "Solo texto descriptivo"], correctOption: 0 },
		{ prompt: "¿Qué debe priorizar un buen dashboard?", options: ["Pocos indicadores clave y claridad visual", "La mayor cantidad de datos posible", "Muchos colores llamativos", "Textos largos y detallados"], correctOption: 0 },
		{ prompt: "En el ejemplo del dashboard financiero, ¿qué se mostró junto a los indicadores?", options: ["Un gráfico de tendencia de los últimos 6 meses", "Una lista de empleados", "Un mapa del mundo", "Un formulario de contacto"], correctOption: 0 },
		{ prompt: "En el caso del dashboard comercial, ¿qué elemento visual se usó para las ventas por región?", options: ["Un mapa de calor", "Un formulario", "Una macro", "Una validación de datos"], correctOption: 0 },
		{ prompt: "¿Qué herramienta de Excel suele alimentar los indicadores de un dashboard?", options: ["Tablas dinámicas", "Formato condicional únicamente", "Combinar celdas", "Ajustar texto"], correctOption: 0 },
		{ prompt: "¿Cuántos KPIs se sugiere priorizar en un dashboard ejecutivo según la actividad guiada?", options: ["Entre 4 y 5 indicadores relevantes", "Más de 20 indicadores", "Solo 1 indicador", "Ninguno, solo texto"], correctOption: 0 },
		{ prompt: "¿Por qué son valiosos los dashboards ejecutivos en una empresa?", options: ["Permiten tomar decisiones rápidas con una vista clara del negocio", "Porque reemplazan la necesidad de tener datos reales", "Porque cambian el idioma del sistema", "Porque solo sirven para decoración"], correctOption: 0 },
	],
};

const excelA6: LessonContent = {
	introduction: "Excel puede integrarse con herramientas de inteligencia de negocios como Power BI para llevar el análisis empresarial a otro nivel. En esta clase conocerás cómo se conectan ambas herramientas, qué es el modelado de datos y cómo se generan reportes ejecutivos para la toma de decisiones.",
	keyConcepts: [
		"Los datos y modelos creados en Excel (como tablas y Power Pivot) pueden importarse o conectarse directamente en Power BI.",
		"El modelado de datos organiza tablas relacionadas entre sí (por ejemplo, ventas y productos) para análisis más potentes.",
		"El análisis empresarial combina datos de distintas áreas (ventas, finanzas, operaciones) para una visión integral del negocio.",
		"Los reportes ejecutivos resumen la información más relevante para que la gerencia tome decisiones informadas.",
		"La toma de decisiones basada en datos reduce el riesgo de decisiones basadas solo en intuición.",
	],
	realExample: { title: "De Excel a Power BI", description: "Un modelo de datos construido en Excel con Power Pivot se conecta directamente a Power BI para crear un dashboard interactivo compartido con todo el equipo gerencial." },
	practicalCase: { title: "Reporte ejecutivo integral", description: "Una empresa combina datos de ventas, gastos e inventario en un solo modelo de datos para generar un reporte ejecutivo que la gerencia revisa semanalmente antes de tomar decisiones." },
	guidedActivity: { title: "Diseña un flujo de inteligencia de negocios", instructions: "1) Identifica qué tablas de tu negocio se relacionarían entre sí (ventas, productos, clientes). 2) Diseña el modelo de datos indicando qué columna conecta cada tabla. 3) Define qué reporte ejecutivo se generaría con ese modelo. 4) Describe qué decisión de negocio se tomaría con base en ese reporte." },
	reflectionQuestion: "¿Qué ventaja tiene combinar Excel y Power BI frente a usar solo una de las dos herramientas?",
	imageUrl: "/images/tools/excel.svg",
	imageAlt: "Ícono de Microsoft Excel",
	quiz: [
		{ prompt: "¿Qué se puede conectar entre Excel y Power BI?", options: ["Los datos y modelos creados en Excel, como Power Pivot", "Solo los colores de las celdas", "Solo los comentarios de las hojas", "Solo los nombres de los archivos"], correctOption: 0 },
		{ prompt: "¿Qué organiza el modelado de datos?", options: ["Tablas relacionadas entre sí para análisis más potentes", "El color de fondo de las hojas", "El idioma del archivo", "El número de columnas visibles"], correctOption: 0 },
		{ prompt: "¿Qué combina el análisis empresarial?", options: ["Datos de distintas áreas para una visión integral del negocio", "Solo los datos de un vendedor", "Solo el logotipo de la empresa", "Solo los comentarios del archivo"], correctOption: 0 },
		{ prompt: "¿Qué resumen los reportes ejecutivos?", options: ["La información más relevante para decisiones gerenciales", "Todos los datos sin filtrar", "Solo errores de fórmula", "Solo el historial de cambios"], correctOption: 0 },
		{ prompt: "¿Qué reduce la toma de decisiones basada en datos?", options: ["El riesgo de decisiones basadas solo en intuición", "La cantidad de datos disponibles", "La necesidad de reportes", "El uso de Excel en general"], correctOption: 0 },
		{ prompt: "En el ejemplo 'De Excel a Power BI', ¿qué herramienta de Excel se conectó?", options: ["Power Pivot", "Solver", "Buscar objetivo", "Validación de datos"], correctOption: 0 },
		{ prompt: "En el caso del reporte ejecutivo integral, ¿qué áreas se combinaron?", options: ["Ventas, gastos e inventario", "Solo recursos humanos", "Solo marketing", "Solo tecnología"], correctOption: 0 },
		{ prompt: "¿Qué debe definirse al diseñar un modelo de datos con varias tablas?", options: ["Qué columna conecta cada tabla entre sí", "El color de cada hoja", "El nombre del archivo", "El idioma del sistema"], correctOption: 0 },
		{ prompt: "¿Con qué frecuencia se revisó el reporte ejecutivo en el caso práctico?", options: ["Semanalmente", "Una vez al año", "Cada hora", "Nunca se revisó"], correctOption: 0 },
		{ prompt: "¿Por qué es valiosa la inteligencia de negocios con Excel y Power BI?", options: ["Porque permite un análisis empresarial más completo para decisiones informadas", "Porque reemplaza completamente la necesidad de Excel", "Porque solo sirve para presentaciones visuales", "Porque cambia el idioma de los reportes"], correctOption: 0 },
	],
};


const baseCourses: Course[] = [
	// Excel
	common("excel-basico", "B1", "Excel Básico", "Básico", "4 semanas", "Primeros pasos para organizar y calcular información en Excel.", images.excel, "Aprenderás la interfaz, la gestión de datos, fórmulas básicas y el formato profesional para empezar a trabajar con hojas de cálculo con confianza.", "Te permitirá llevar registros simples, calcular totales y presentar información ordenada en cualquier trabajo.", [
		module("Tema 1: Introducción a Excel", [lesson("Introducción a Excel", ["¿Qué es Microsoft Excel?", "Aplicaciones en empresas y negocios", "Interfaz de usuario", "Cinta de opciones", "Barras de herramientas", "Libros y hojas de cálculo"], excelB1T1)]),
		module("Tema 2: Gestión de Datos", [lesson("Gestión de Datos", ["Tipos de datos", "Formato de celdas", "Filas y columnas", "Ajuste de texto", "Combinar celdas", "Creación de tablas"], excelB1T2)]),
		module("Tema 3: Fórmulas Básicas", [lesson("Fórmulas Básicas", ["SUMA", "PROMEDIO", "MAX", "MIN", "CONTAR", "Casos empresariales"], excelB1T3)]),
		module("Tema 4: Formato y Diseño", [lesson("Formato y Diseño", ["Formato de números", "Formato condicional", "Bordes y colores", "Estilos de tabla", "Diseño profesional"], excelB1T4)]),
	]),
	common("excel-intermedio", "B2", "Excel Intermedio", "Intermedio", "6 semanas", "Funciones intermedias, búsqueda de datos, tablas dinámicas y gráficos profesionales.", images.excel, "Aprenderás funciones condicionales, búsqueda y referencias, gestión de bases de datos, tablas dinámicas y gráficos profesionales para analizar información con mayor profundidad.", "Te ayudará a crear reportes, controlar presupuestos, analizar ventas y presentar información para tomar decisiones.", [
		module("Tema 1: Funciones Intermedias", [lesson("Funciones Intermedias", ["SI", "SI.CONJUNTO", "Y", "O", "SI.ERROR", "Casos empresariales"], excelI1)]),
		module("Tema 2: Búsqueda y Referencias", [lesson("Búsqueda y Referencias", ["BUSCARV", "BUSCARX", "BUSCARH", "ÍNDICE", "COINCIDIR", "Aplicaciones reales"], excelI2)]),
		module("Tema 3: Gestión de Bases de Datos", [lesson("Gestión de Bases de Datos", ["Ordenar datos", "Filtros avanzados", "Validación de datos", "Segmentación", "Eliminación de duplicados"], excelI3)]),
		module("Tema 4: Tablas Dinámicas", [lesson("Tablas Dinámicas", ["Creación de tablas dinámicas", "Segmentación de datos", "Agrupación", "Análisis de información", "Dashboard básico"], excelI4)]),
		module("Tema 5: Gráficos Profesionales", [lesson("Gráficos Profesionales", ["Gráficos de barras", "Gráficos circulares", "Gráficos combinados", "Visualización de datos", "Casos empresariales"], excelI5)]),
	]),
	common("excel-avanzado", "B3", "Excel Avanzado", "Avanzado", "6 semanas", "Funciones avanzadas, análisis de datos, Power Query, macros VBA e inteligencia de negocios.", images.excel, "Dominarás funciones avanzadas, análisis de datos, Power Query, macros y VBA, dashboards ejecutivos e inteligencia de negocios para construir soluciones robustas de análisis en Excel.", "Te permitirá automatizar procesos repetitivos, consolidar múltiples fuentes y construir modelos de datos confiables para decisiones complejas.", [
		module("Tema 1: Funciones Avanzadas", [lesson("Funciones Avanzadas", ["SUMAR.SI", "SUMAR.SI.CONJUNTO", "CONTAR.SI", "CONTAR.SI.CONJUNTO", "PROMEDIO.SI", "Casos empresariales"], excelA1)]),
		module("Tema 2: Análisis de Datos", [lesson("Análisis de Datos", ["Escenarios", "Buscar objetivo", "Tablas de datos", "Solver", "Análisis de sensibilidad"], excelA2)]),
		module("Tema 3: Power Query", [lesson("Power Query", ["Importación de datos", "Limpieza de datos", "Transformación de datos", "Automatización", "Casos reales"], excelA3)]),
		module("Tema 4: Macros y VBA", [lesson("Macros y VBA", ["Introducción a VBA", "Grabación de macros", "Automatización de tareas", "Formularios", "Casos empresariales"], excelA4)]),
		module("Tema 5: Dashboards Ejecutivos", [lesson("Dashboards Ejecutivos", ["Diseño de KPIs", "Indicadores de gestión", "Dashboard financiero", "Dashboard comercial", "Dashboard gerencial"], excelA5)]),
		module("Tema 6: Inteligencia de Negocios con Excel", [lesson("Inteligencia de Negocios con Excel", ["Integración con Power BI", "Modelado de datos", "Análisis empresarial", "Reportes ejecutivos", "Toma de decisiones"], excelA6)]),
	]),
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

