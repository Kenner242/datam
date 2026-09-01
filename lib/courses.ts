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

// ===== POWER BI BÁSICO =====
const pbiB1: LessonContent = {
	introduction: "Power BI es la herramienta líder de Microsoft para crear dashboards interactivos a partir de datos de múltiples fuentes. En esta clase conocerás su interfaz, cómo importar datos desde Excel y CSV, y los tipos de visualización disponibles.",
	keyConcepts: [
		"Power BI Desktop tiene tres vistas principales: Informe (para diseñar), Datos (para ver las tablas) y Modelo (para relacionar tablas).",
		"Se pueden importar datos desde archivos Excel, CSV, bases de datos y servicios en la nube.",
		"Cada tipo de visualización (barras, líneas, tarjetas, mapas) comunica un tipo distinto de información.",
		"El panel 'Campos' muestra las tablas y columnas disponibles para construir visualizaciones.",
		"Guardar el trabajo en Power BI genera un archivo .pbix con datos, modelo y visualizaciones.",
	],
	realExample: { title: "Importar un archivo de ventas", description: "Con 'Obtener datos → Excel', seleccionas el archivo, eliges la hoja con la tabla de ventas y Power BI la carga lista para usar en visualizaciones." },
	practicalCase: { title: "Elegir la visualización correcta", description: "Un analista necesita mostrar la evolución de ventas mes a mes; elige un gráfico de líneas en lugar de uno circular, porque comunica mejor una tendencia en el tiempo." },
	guidedActivity: { title: "Importa tu primera fuente de datos", instructions: "1) Abre Power BI Desktop. 2) Usa 'Obtener datos' para importar un archivo Excel o CSV con una lista de ventas. 3) Explora el panel Campos y arrastra una columna numérica a una tarjeta. 4) Cambia el tipo de visualización a gráfico de barras. 5) Guarda el archivo .pbix." },
	reflectionQuestion: "¿Qué tipo de visualización usarías para comparar las ventas de 5 productos distintos, y por qué?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué es Power BI?", options: ["Una herramienta para crear dashboards interactivos a partir de datos", "Un editor de texto", "Un lenguaje de programación", "Un sistema operativo"], correctOption: 0 },
		{ prompt: "¿Cuáles son las tres vistas principales de Power BI Desktop?", options: ["Informe, Datos y Modelo", "Inicio, Insertar y Vista", "Archivo, Editar y Ver", "Tabla, Gráfico y Texto"], correctOption: 0 },
		{ prompt: "¿Desde dónde se pueden importar datos a Power BI?", options: ["Excel, CSV, bases de datos y servicios en la nube", "Solo desde Word", "Solo desde imágenes", "Solo desde PDF"], correctOption: 0 },
		{ prompt: "¿Qué muestra el panel 'Campos'?", options: ["Las tablas y columnas disponibles para construir visualizaciones", "El historial de cambios", "Los colores disponibles", "El idioma del programa"], correctOption: 0 },
		{ prompt: "¿Qué extensión tiene un archivo guardado en Power BI Desktop?", options: [".pbix", ".xlsx", ".csv", ".docx"], correctOption: 0 },
		{ prompt: "¿Qué gráfico es más adecuado para mostrar una tendencia en el tiempo?", options: ["Gráfico de líneas", "Gráfico circular", "Tarjeta", "Mapa"], correctOption: 0 },
		{ prompt: "En el ejemplo de importar ventas, ¿qué opción se usó?", options: ["Obtener datos → Excel", "Publicar informe", "Crear medida", "Crear relación"], correctOption: 0 },
		{ prompt: "En el caso práctico, ¿por qué se eligió un gráfico de líneas y no uno circular?", options: ["Porque comunica mejor una tendencia en el tiempo", "Porque tiene más colores", "Porque ocupa menos espacio", "Porque es más fácil de crear"], correctOption: 0 },
		{ prompt: "¿Qué vista de Power BI se usa para relacionar tablas?", options: ["Vista de modelo", "Vista de informe", "Vista de datos", "Vista de inicio"], correctOption: 0 },
		{ prompt: "¿Por qué es importante elegir el tipo de visualización correcto?", options: ["Porque cada gráfico comunica un tipo distinto de información", "Porque cambia el idioma del reporte", "Porque reduce el tamaño del archivo", "Porque es un requisito obligatorio sin razón"], correctOption: 0 },
	],
};

const pbiB2: LessonContent = {
	introduction: "Antes de construir un dashboard, los datos deben estar limpios y correctamente relacionados. En esta clase aprenderás limpieza básica de datos, cómo relacionar tablas y qué es un modelo estrella.",
	keyConcepts: [
		"La limpieza básica incluye quitar filas vacías, corregir tipos de datos y eliminar columnas innecesarias.",
		"Una relación conecta dos tablas a través de una columna en común (por ejemplo, ID de producto).",
		"El modelo estrella organiza una tabla de hechos (ventas) rodeada de tablas de dimensión (producto, cliente, fecha).",
		"Las relaciones deben tener cardinalidad clara; uno a muchos es la más común.",
		"Un modelo bien relacionado permite que los filtros de un gráfico afecten automáticamente a los demás.",
	],
	realExample: { title: "Relacionar ventas con productos", description: "La tabla Ventas tiene un ID de producto, y la tabla Productos tiene el mismo ID con el nombre y categoría. Al relacionarlas, puedes mostrar el nombre del producto en un gráfico de ventas." },
	practicalCase: { title: "Detectar una relación mal configurada", description: "Un dashboard muestra el mismo total en todos los productos. Al revisar el modelo, se descubre que la relación entre Ventas y Productos no estaba activa, por lo que los filtros no se aplicaban correctamente." },
	guidedActivity: { title: "Relaciona dos tablas y valida el modelo", instructions: "1) Importa una tabla de Ventas y una tabla de Productos. 2) En la Vista de modelo, crea una relación entre ambas usando el ID de producto. 3) Verifica que la cardinalidad sea 'Uno a varios'. 4) Crea un gráfico de barras con el nombre del producto y el total de ventas para confirmar que la relación funciona." },
	reflectionQuestion: "¿Qué problemas podría causar un modelo con relaciones mal configuradas en un reporte de negocio?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué incluye la limpieza básica de datos?", options: ["Quitar filas vacías y corregir tipos de datos", "Eliminar todas las columnas", "Cambiar el idioma del archivo", "Insertar imágenes"], correctOption: 0 },
		{ prompt: "¿Qué conecta una relación entre dos tablas?", options: ["Una columna en común", "El color de las celdas", "El nombre del archivo", "El tamaño de la tabla"], correctOption: 0 },
		{ prompt: "¿Qué organiza un modelo estrella?", options: ["Una tabla de hechos rodeada de tablas de dimensión", "Solo una tabla sin relaciones", "Un gráfico circular", "Un archivo CSV"], correctOption: 0 },
		{ prompt: "¿Qué cardinalidad es la más común en un modelo de datos?", options: ["Uno a varios", "Varios a varios", "Cero a uno", "Ninguna"], correctOption: 0 },
		{ prompt: "¿Qué logra un modelo bien relacionado?", options: ["Que los filtros afecten automáticamente a todos los gráficos", "Que el archivo pese menos", "Que se elimine la necesidad de datos", "Que cambien los colores automáticamente"], correctOption: 0 },
		{ prompt: "En el ejemplo de relacionar ventas con productos, ¿qué columna se usó?", options: ["El ID de producto", "El nombre del cliente", "La fecha de venta", "El color del producto"], correctOption: 0 },
		{ prompt: "En el caso práctico, ¿qué problema causó la relación inactiva?", options: ["El mismo total se mostraba en todos los productos", "El archivo no se pudo guardar", "Los gráficos desaparecieron", "El modelo se eliminó"], correctOption: 0 },
		{ prompt: "¿En qué vista de Power BI se crean las relaciones?", options: ["Vista de modelo", "Vista de informe", "Vista de datos", "Vista de inicio"], correctOption: 0 },
		{ prompt: "¿Qué tabla contiene los datos centrales en un modelo estrella (como las ventas)?", options: ["Tabla de hechos", "Tabla de dimensión", "Tabla calendario", "Tabla de errores"], correctOption: 0 },
		{ prompt: "¿Por qué es importante limpiar los datos antes de analizarlos?", options: ["Para evitar errores y resultados incorrectos en el análisis", "Para cambiar el idioma del programa", "Para que el archivo sea más pesado", "Para eliminar los gráficos"], correctOption: 0 },
	],
};

const pbiB3: LessonContent = {
	introduction: "Un dashboard es útil solo si comunica indicadores claros que ayuden a tomar decisiones. En esta clase aprenderás a crear medidas básicas, usar filtros y segmentadores, y publicar tu informe.",
	keyConcepts: [
		"Una medida es un cálculo (como una suma o promedio) creado con lenguaje DAX y usado en visualizaciones.",
		"Los filtros permiten limitar los datos mostrados en todo el informe, una página o una sola visualización.",
		"Los segmentadores son controles visuales que el usuario del reporte puede usar para filtrar interactivamente.",
		"Publicar un informe en Power BI Service permite compartirlo con otras personas de forma segura.",
		"Un buen dashboard combina pocos indicadores clave, bien organizados visualmente.",
	],
	realExample: { title: "Medida de ventas totales", description: "Con la medida Ventas Totales = SUM(Ventas[Monto]) puedes mostrar el total de ventas en una tarjeta que se actualiza automáticamente según los filtros aplicados." },
	practicalCase: { title: "Dashboard filtrable por región", description: "Un gerente comercial usa un segmentador de región para ver instantáneamente cómo cambian los indicadores de ventas al seleccionar cada zona del país." },
	guidedActivity: { title: "Construye un informe con medidas y segmentadores", instructions: "1) Crea una medida simple de ventas totales usando SUM. 2) Agrega un segmentador de región o categoría a tu informe. 3) Aplica un filtro de página para mostrar solo un periodo específico. 4) Publica el informe en Power BI Service (o simula el proceso si no tienes cuenta)." },
	reflectionQuestion: "¿Qué 3 indicadores clave incluirías en un dashboard de ventas para tu propio negocio o área de trabajo?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué es una medida en Power BI?", options: ["Un cálculo creado con DAX usado en visualizaciones", "Una imagen insertada en el informe", "Un tipo de relación entre tablas", "Un archivo CSV"], correctOption: 0 },
		{ prompt: "¿Qué permite hacer un filtro?", options: ["Limitar los datos mostrados en el informe", "Cambiar el idioma del programa", "Eliminar una tabla", "Crear una relación"], correctOption: 0 },
		{ prompt: "¿Qué es un segmentador?", options: ["Un control visual para filtrar interactivamente", "Una medida DAX", "Un tipo de gráfico circular", "Una tabla de hechos"], correctOption: 0 },
		{ prompt: "¿Qué permite hacer publicar un informe en Power BI Service?", options: ["Compartirlo de forma segura con otras personas", "Eliminar el archivo original", "Cambiar el modelo de datos", "Ocultar las visualizaciones"], correctOption: 0 },
		{ prompt: "¿Qué debe priorizar un buen dashboard?", options: ["Pocos indicadores clave bien organizados", "La mayor cantidad de gráficos posible", "Muchos colores llamativos", "Texto extenso sin gráficos"], correctOption: 0 },
		{ prompt: "En el ejemplo de ventas totales, ¿qué función DAX se usó?", options: ["SUM", "CALCULATE", "FILTER", "RELATED"], correctOption: 0 },
		{ prompt: "En el caso del dashboard filtrable, ¿qué segmentador se usó?", options: ["Región", "Producto", "Fecha", "Cliente"], correctOption: 0 },
		{ prompt: "¿A qué nivel se puede aplicar un filtro en Power BI?", options: ["Informe, página o visualización", "Solo a todo el archivo", "Solo a una celda", "Solo al modelo de datos"], correctOption: 0 },
		{ prompt: "¿Qué lenguaje se usa para crear medidas?", options: ["DAX", "SQL", "Python", "VBA"], correctOption: 0 },
		{ prompt: "¿Por qué es importante limitar la cantidad de indicadores en un dashboard?", options: ["Para facilitar la lectura y la toma de decisiones rápidas", "Para que el archivo pese menos", "Para cambiar el idioma del reporte", "Porque Power BI no permite más de tres gráficos"], correctOption: 0 },
	],
};

// ===== POWER BI INTERMEDIO =====
const pbiI1: LessonContent = {
	introduction: "Un modelo de datos confiable depende de relaciones bien configuradas. En esta clase profundizarás en relaciones activas e inactivas, la cardinalidad uno a muchos, y la estructura de tablas de hechos y dimensiones.",
	keyConcepts: [
		"Una relación activa se usa automáticamente en los cálculos; una relación inactiva debe activarse con la función USERELATIONSHIP dentro de una medida.",
		"La cardinalidad 'uno a muchos' significa que un valor de la tabla de dimensión se repite muchas veces en la tabla de hechos.",
		"Las tablas de hechos contienen datos transaccionales (ventas, pedidos); las tablas de dimensión describen esos datos (producto, cliente, fecha).",
		"Solo puede haber una relación activa entre dos tablas a la vez, aunque existan varias posibles.",
		"Un modelo con relaciones claras facilita la creación de medidas DAX correctas.",
	],
	realExample: { title: "Dos fechas, una relación activa", description: "Una tabla de Ventas tiene Fecha de pedido y Fecha de entrega. Solo una relación con la tabla Calendario puede estar activa; la otra se usa mediante USERELATIONSHIP en medidas específicas." },
	practicalCase: { title: "Corregir un total duplicado por relación mal diseñada", description: "Un modelo con cardinalidad 'varios a varios' entre dos tablas genera totales inflados. Al rediseñar el modelo con una tabla de dimensión intermedia, los totales vuelven a ser correctos." },
	guidedActivity: { title: "Diseña un modelo con relaciones correctas", instructions: "1) Crea una tabla de hechos (Ventas) y dos tablas de dimensión (Producto, Cliente). 2) Relaciona ambas con cardinalidad uno a muchos. 3) Agrega una segunda fecha en Ventas y crea una segunda relación con Calendario (quedará inactiva). 4) Crea una medida que use USERELATIONSHIP para activar la segunda relación cuando sea necesario." },
	reflectionQuestion: "¿Por qué crees que Power BI solo permite una relación activa entre dos tablas a la vez?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué diferencia a una relación activa de una inactiva?", options: ["La activa se usa automáticamente; la inactiva requiere USERELATIONSHIP", "La inactiva es más rápida", "La activa no permite filtros", "No existe diferencia real"], correctOption: 0 },
		{ prompt: "¿Qué significa la cardinalidad 'uno a muchos'?", options: ["Un valor de dimensión se repite muchas veces en la tabla de hechos", "Cada fila es única en ambas tablas", "No existe relación entre las tablas", "Los datos se duplican automáticamente"], correctOption: 0 },
		{ prompt: "¿Qué contienen las tablas de hechos?", options: ["Datos transaccionales como ventas o pedidos", "Solo nombres de productos", "Solo fechas", "Solo colores"], correctOption: 0 },
		{ prompt: "¿Qué describen las tablas de dimensión?", options: ["Los datos de las tablas de hechos, como producto o cliente", "Solo errores del modelo", "Solo medidas DAX", "Solo gráficos"], correctOption: 0 },
		{ prompt: "¿Cuántas relaciones activas puede haber entre dos tablas a la vez?", options: ["Solo una", "Dos", "Tantas como se quiera", "Ninguna"], correctOption: 0 },
		{ prompt: "En el ejemplo de las dos fechas, ¿qué función activa la relación inactiva dentro de una medida?", options: ["USERELATIONSHIP", "CALCULATE", "SUM", "FILTER"], correctOption: 0 },
		{ prompt: "En el caso del total duplicado, ¿qué cardinalidad causó el problema?", options: ["Varios a varios", "Uno a varios", "Uno a uno", "Ninguna"], correctOption: 0 },
		{ prompt: "¿Qué facilita un modelo con relaciones claras?", options: ["La creación de medidas DAX correctas", "Un archivo más pesado", "Menos visualizaciones", "Un idioma distinto"], correctOption: 0 },
		{ prompt: "¿Qué tabla describe atributos como nombre y categoría de un producto?", options: ["Tabla de dimensión", "Tabla de hechos", "Tabla calendario", "Tabla de errores"], correctOption: 0 },
		{ prompt: "¿Por qué es importante distinguir tablas de hechos y de dimensión?", options: ["Para diseñar un modelo de datos escalable y correcto", "Para cambiar el idioma del informe", "Para reducir el número de gráficos", "No tiene importancia real"], correctOption: 0 },
	],
};

const pbiI2: LessonContent = {
	introduction: "Una tabla calendario es esencial para cualquier análisis basado en tiempo. En esta clase aprenderás a crear funciones de fecha, construir un calendario personalizado y marcarlo como tabla de fechas oficial del modelo.",
	keyConcepts: [
		"Una tabla calendario contiene una fila por cada día de un rango de fechas, con columnas como Año, Mes y Trimestre.",
		"Las funciones de fecha en DAX (YEAR, MONTH, CALENDAR) ayudan a construir y analizar esta tabla.",
		"Un calendario personalizado permite adaptar el año fiscal o agrupar fechas según las necesidades del negocio.",
		"Marcar una tabla 'como tabla de fechas' habilita funciones de inteligencia de tiempo como comparativos año contra año.",
		"Toda tabla calendario debe relacionarse con la columna de fecha de la tabla de hechos.",
	],
	realExample: { title: "Crear un calendario con CALENDAR", description: "Con la función CALENDAR(fecha_inicio, fecha_fin) se genera automáticamente una tabla con todas las fechas del rango indicado, lista para enriquecer con columnas de año y mes." },
	practicalCase: { title: "Comparar el año fiscal de una empresa", description: "Una empresa cuyo año fiscal inicia en julio necesita un calendario personalizado que agrupe los meses según ese ciclo, distinto al año calendario tradicional." },
	guidedActivity: { title: "Construye tu tabla calendario", instructions: "1) Crea una tabla calendario con la función CALENDAR cubriendo el rango de tus datos de ventas. 2) Agrega columnas de Año, Mes y Trimestre usando funciones DAX. 3) Marca la tabla como 'Tabla de fechas'. 4) Relaciona la tabla con la columna de fecha de tu tabla de ventas." },
	reflectionQuestion: "¿Por qué es mejor usar una tabla calendario separada en lugar de solo la columna de fecha de la tabla de ventas?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué contiene una tabla calendario?", options: ["Una fila por cada día de un rango de fechas", "Solo los meses del año", "Solo los productos vendidos", "Solo los nombres de los clientes"], correctOption: 0 },
		{ prompt: "¿Qué función de DAX genera un rango de fechas?", options: ["CALENDAR", "SUM", "FILTER", "RELATED"], correctOption: 0 },
		{ prompt: "¿Para qué sirve un calendario personalizado?", options: ["Para adaptar el año fiscal o agrupar fechas según el negocio", "Para eliminar columnas", "Para cambiar el idioma del informe", "Para crear gráficos circulares"], correctOption: 0 },
		{ prompt: "¿Qué habilita marcar una tabla 'como tabla de fechas'?", options: ["Funciones de inteligencia de tiempo como comparativos año contra año", "Colores adicionales", "Más visualizaciones", "Menos relaciones"], correctOption: 0 },
		{ prompt: "¿Con qué debe relacionarse la tabla calendario?", options: ["La columna de fecha de la tabla de hechos", "El nombre del producto", "El ID del cliente", "El color de la visualización"], correctOption: 0 },
		{ prompt: "En el ejemplo de crear un calendario, ¿qué función se usó?", options: ["CALENDAR(fecha_inicio, fecha_fin)", "SUM(fecha_inicio)", "FILTER(fecha_inicio)", "CALCULATE(fecha_inicio)"], correctOption: 0 },
		{ prompt: "En el caso del año fiscal, ¿por qué se necesitó un calendario personalizado?", options: ["Porque el año fiscal no coincide con el año calendario tradicional", "Porque la empresa no vende todo el año", "Porque no había datos suficientes", "Porque el modelo no tenía relaciones"], correctOption: 0 },
		{ prompt: "¿Qué columnas suele tener una tabla calendario enriquecida?", options: ["Año, Mes y Trimestre", "Solo el nombre del cliente", "Solo el precio", "Solo el color del producto"], correctOption: 0 },
		{ prompt: "¿Qué tipo de análisis se facilita con una buena tabla calendario?", options: ["Comparativos de tiempo como año contra año", "Análisis de colores", "Análisis de texto", "Análisis de imágenes"], correctOption: 0 },
		{ prompt: "¿Por qué es mejor usar una tabla calendario separada?", options: ["Permite un análisis de tiempo más flexible y correcto", "Porque ocupa menos espacio en el archivo", "Porque Power BI lo exige siempre", "Porque cambia el idioma del modelo"], correctOption: 0 },
	],
};

const pbiI3: LessonContent = {
	introduction: "CALCULATE es la función más poderosa de DAX porque modifica el contexto de filtro de una medida. En esta clase aprenderás CALCULATE, las funciones ALL y ALLSELECTED, y la diferencia entre contexto de fila y de filtro.",
	keyConcepts: [
		"CALCULATE evalúa una expresión modificando el contexto de filtro con condiciones adicionales.",
		"ALL elimina todos los filtros de una tabla o columna, útil para calcular totales generales.",
		"ALLSELECTED elimina los filtros agregados por el usuario pero respeta los del reporte.",
		"El contexto de fila se refiere a la fila actual que se está evaluando; el contexto de filtro son las restricciones activas por los filtros del reporte.",
		"Entender estos contextos es la base para escribir medidas DAX avanzadas correctamente.",
	],
	realExample: { title: "Porcentaje del total con ALL", description: "Con % del total = DIVIDE(SUM(Ventas[Monto]), CALCULATE(SUM(Ventas[Monto]), ALL(Ventas))) se calcula qué porcentaje representa cada categoría sobre el total general, sin importar los filtros aplicados." },
	practicalCase: { title: "Comparar la venta de una región contra el total filtrado", description: "Un analista usa ALLSELECTED para comparar el desempeño de una región específica contra el total de las regiones que el usuario haya seleccionado en el reporte, no contra todas las regiones existentes." },
	guidedActivity: { title: "Practica CALCULATE, ALL y ALLSELECTED", instructions: "1) Crea una medida de ventas totales con SUM. 2) Crea una segunda medida que calcule el total general ignorando filtros usando CALCULATE y ALL. 3) Crea una tercera medida con ALLSELECTED para comparar contra la selección del usuario. 4) Compara los tres resultados en una tabla con distintos filtros aplicados." },
	reflectionQuestion: "¿En qué situación usarías ALLSELECTED en lugar de ALL para un cálculo de porcentaje?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué hace la función CALCULATE?", options: ["Evalúa una expresión modificando el contexto de filtro", "Suma un rango de celdas", "Cuenta filas de una tabla", "Elimina relaciones del modelo"], correctOption: 0 },
		{ prompt: "¿Qué hace la función ALL?", options: ["Elimina todos los filtros de una tabla o columna", "Aplica todos los filtros posibles", "Crea una nueva relación", "Cambia el tipo de dato"], correctOption: 0 },
		{ prompt: "¿Qué diferencia a ALLSELECTED de ALL?", options: ["ALLSELECTED respeta los filtros del reporte, pero ignora los del usuario", "ALLSELECTED es más lenta", "ALLSELECTED no existe en DAX", "No hay ninguna diferencia"], correctOption: 0 },
		{ prompt: "¿Qué es el contexto de fila?", options: ["La fila actual que se está evaluando", "Los filtros del reporte", "El nombre de la tabla", "El color de la visualización"], correctOption: 0 },
		{ prompt: "¿Qué es el contexto de filtro?", options: ["Las restricciones activas por los filtros del reporte", "El nombre de la medida", "El tipo de dato de una columna", "El idioma del informe"], correctOption: 0 },
		{ prompt: "En el ejemplo del porcentaje del total, ¿qué función se combinó con CALCULATE?", options: ["ALL", "SUM", "FILTER", "RELATED"], correctOption: 0 },
		{ prompt: "En el caso de comparar una región contra el total filtrado, ¿qué función se usó?", options: ["ALLSELECTED", "ALL", "CALCULATE", "SUM"], correctOption: 0 },
		{ prompt: "¿Por qué es importante entender el contexto de filtro en DAX?", options: ["Es la base para escribir medidas avanzadas correctamente", "Porque cambia el idioma del modelo", "Porque reduce el tamaño del archivo", "Porque elimina errores de ortografía"], correctOption: 0 },
		{ prompt: "¿Qué función usarías para calcular un total general ignorando todos los filtros?", options: ["CALCULATE con ALL", "SUM simple", "COUNT", "RELATED"], correctOption: 0 },
		{ prompt: "¿Por qué CALCULATE se considera la función más poderosa de DAX?", options: ["Porque permite modificar el contexto de filtro de cualquier expresión", "Porque cambia el color de los gráficos", "Porque elimina relaciones automáticamente", "Porque traduce el informe"], correctOption: 0 },
	],
};

const pbiI4: LessonContent = {
	introduction: "Las medidas de tiempo permiten comparar el desempeño de un negocio a través de distintos periodos. En esta clase aprenderás a construir comparativos año contra año, acumulados y variaciones porcentuales.",
	keyConcepts: [
		"Un comparativo año contra año (YoY) compara un periodo actual con el mismo periodo del año anterior.",
		"Un acumulado (o 'year to date') suma los valores desde el inicio del año hasta la fecha actual del filtro.",
		"Las variaciones porcentuales muestran cuánto creció o disminuyó un indicador respecto a un periodo anterior.",
		"Funciones como SAMEPERIODLASTYEAR y DATESYTD facilitan estos cálculos cuando existe una tabla calendario correcta.",
		"Estas medidas son clave para reportes ejecutivos que evalúan el crecimiento de un negocio.",
	],
	realExample: { title: "Ventas del mismo mes el año anterior", description: "Con Ventas año anterior = CALCULATE(SUM(Ventas[Monto]), SAMEPERIODLASTYEAR(Calendario[Fecha])) se obtiene el monto vendido en el mismo periodo del año pasado." },
	practicalCase: { title: "Calcular el crecimiento porcentual mensual", description: "Un gerente financiero necesita saber si las ventas crecieron o cayeron respecto al año anterior. Con una medida de variación porcentual, el reporte muestra automáticamente '+12%' o '-5%' junto al indicador." },
	guidedActivity: { title: "Construye indicadores de tiempo", instructions: "1) Con tu tabla calendario ya relacionada, crea una medida de ventas del año anterior usando SAMEPERIODLASTYEAR. 2) Crea una medida de acumulado anual con DATESYTD. 3) Crea una medida de variación porcentual comparando el año actual contra el anterior. 4) Muestra los tres indicadores en tarjetas dentro de un mismo informe." },
	reflectionQuestion: "¿Por qué es más útil mostrar una variación porcentual junto a un indicador, en lugar de solo el número absoluto?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué compara un indicador año contra año (YoY)?", options: ["Un periodo actual con el mismo periodo del año anterior", "Dos productos distintos", "Dos regiones distintas", "Dos vendedores distintos"], correctOption: 0 },
		{ prompt: "¿Qué calcula un acumulado o 'year to date'?", options: ["La suma desde el inicio del año hasta la fecha del filtro", "El promedio de todo el histórico", "El valor máximo de un solo día", "El total de un solo mes"], correctOption: 0 },
		{ prompt: "¿Qué muestra una variación porcentual?", options: ["Cuánto creció o disminuyó un indicador respecto a un periodo anterior", "El nombre del producto más vendido", "El color del gráfico", "El idioma del informe"], correctOption: 0 },
		{ prompt: "¿Qué función DAX compara con el mismo periodo del año anterior?", options: ["SAMEPERIODLASTYEAR", "DATESYTD", "ALL", "FILTER"], correctOption: 0 },
		{ prompt: "¿Qué función DAX calcula un acumulado anual?", options: ["DATESYTD", "SAMEPERIODLASTYEAR", "CALCULATE", "RELATED"], correctOption: 0 },
		{ prompt: "En el ejemplo de ventas del año anterior, ¿qué función se combinó con CALCULATE?", options: ["SAMEPERIODLASTYEAR", "DATESYTD", "ALL", "SUM"], correctOption: 0 },
		{ prompt: "En el caso del crecimiento porcentual, ¿qué mostró el reporte?", options: ["Un signo + o - junto al porcentaje de variación", "Solo el nombre del mes", "Solo un gráfico circular", "Solo el nombre del vendedor"], correctOption: 0 },
		{ prompt: "¿Qué se necesita para que estas medidas de tiempo funcionen correctamente?", options: ["Una tabla calendario correctamente relacionada", "Un archivo CSV adicional", "Un segmentador de color", "Una relación varios a varios"], correctOption: 0 },
		{ prompt: "¿Por qué son clave estas medidas en reportes ejecutivos?", options: ["Porque evalúan el crecimiento real de un negocio en el tiempo", "Porque cambian el idioma del reporte", "Porque reducen el tamaño del archivo", "Porque eliminan la necesidad de datos históricos"], correctOption: 0 },
		{ prompt: "¿Por qué es más útil una variación porcentual que solo un número absoluto?", options: ["Porque da contexto sobre si el desempeño mejoró o empeoró", "Porque ocupa menos espacio visual", "Porque es más fácil de calcular", "Porque no requiere una tabla calendario"], correctOption: 0 },
	],
};

// ===== POWER BI AVANZADO =====
const pbiA1: LessonContent = {
	introduction: "La seguridad a nivel de fila (RLS) permite que distintos usuarios vean solo la información que les corresponde dentro del mismo informe. En esta clase aprenderás a crear roles estáticos y dinámicos, probarlos y aplicar buenas prácticas de acceso.",
	keyConcepts: [
		"RLS (Row-Level Security) restringe qué filas de datos puede ver cada usuario según su rol.",
		"Un rol estático filtra datos con un valor fijo (por ejemplo, solo la región 'Norte').",
		"Un rol dinámico filtra datos según el usuario que inició sesión, comparando su correo con una columna de la tabla.",
		"Los roles se prueban con la opción 'Ver como roles' antes de publicar el informe.",
		"Una buena práctica es documentar qué rol corresponde a cada grupo de usuarios antes de publicar.",
	],
	realExample: { title: "Rol estático por región", description: "Un rol llamado 'Región Norte' filtra la tabla de ventas con la condición Región = \"Norte\", de modo que los usuarios asignados a ese rol solo ven esa información." },
	practicalCase: { title: "Rol dinámico según el vendedor", description: "Un rol dinámico usa la fórmula [Correo] = USERPRINCIPALNAME() para que cada vendedor vea automáticamente solo sus propias ventas al iniciar sesión, sin crear un rol por cada persona." },
	guidedActivity: { title: "Configura y prueba seguridad a nivel de fila", instructions: "1) Crea un rol estático que filtre una región específica de tu tabla de ventas. 2) Crea un rol dinámico que compare el campo Vendedor con USERPRINCIPALNAME(). 3) Usa 'Ver como roles' para probar ambos roles antes de publicar. 4) Documenta qué usuarios deberían asignarse a cada rol." },
	reflectionQuestion: "¿Por qué es más escalable un rol dinámico que crear un rol estático para cada vendedor de la empresa?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué controla la seguridad a nivel de fila (RLS)?", options: ["Qué filas de datos puede ver cada usuario", "El color de las visualizaciones", "El idioma del informe", "El tipo de gráfico disponible"], correctOption: 0 },
		{ prompt: "¿Qué caracteriza a un rol estático?", options: ["Filtra datos con un valor fijo", "Cambia según el usuario que inicia sesión", "No aplica ningún filtro", "Solo funciona con fechas"], correctOption: 0 },
		{ prompt: "¿Qué caracteriza a un rol dinámico?", options: ["Filtra datos según el usuario que inició sesión", "Filtra siempre el mismo valor fijo", "No requiere ninguna fórmula", "Solo se aplica a administradores"], correctOption: 0 },
		{ prompt: "¿Qué función se usa comúnmente en roles dinámicos?", options: ["USERPRINCIPALNAME()", "SUM()", "CALENDAR()", "ALLSELECTED()"], correctOption: 0 },
		{ prompt: "¿Cómo se prueban los roles antes de publicar?", options: ["Con la opción 'Ver como roles'", "Publicando directamente sin revisar", "Cambiando el idioma del informe", "Eliminando las relaciones del modelo"], correctOption: 0 },
		{ prompt: "En el ejemplo del rol estático, ¿qué condición se aplicó?", options: ["Región = \"Norte\"", "Vendedor = usuario actual", "Fecha = hoy", "Producto = todos"], correctOption: 0 },
		{ prompt: "En el caso del rol dinámico por vendedor, ¿qué se comparó?", options: ["El campo Vendedor con USERPRINCIPALNAME()", "El nombre del producto con el precio", "La fecha con el calendario", "El color con la categoría"], correctOption: 0 },
		{ prompt: "¿Qué buena práctica se recomienda antes de publicar roles?", options: ["Documentar qué usuarios corresponden a cada rol", "Eliminar todos los roles existentes", "Cambiar el modelo de datos completo", "Ocultar todas las visualizaciones"], correctOption: 0 },
		{ prompt: "¿Por qué un rol dinámico es más escalable que uno estático por cada vendedor?", options: ["Porque un solo rol se adapta automáticamente a cada usuario", "Porque no requiere ninguna fórmula", "Porque es más lento de configurar", "Porque no se puede probar"], correctOption: 0 },
		{ prompt: "¿Por qué es importante RLS en informes empresariales?", options: ["Porque protege información sensible según el usuario", "Porque mejora el diseño visual del informe", "Porque acelera la carga de datos", "Porque traduce el contenido automáticamente"], correctOption: 0 },
	],
};

const pbiA2: LessonContent = {
	introduction: "Publicar y administrar informes en Power BI Service permite compartir el trabajo de forma profesional dentro de una organización. En esta clase aprenderás sobre workspaces, actualización programada, permisos y distribución.",
	keyConcepts: [
		"Un workspace es un espacio de trabajo en Power BI Service donde se organizan informes, dashboards y conjuntos de datos.",
		"La actualización programada permite que los datos del informe se refresquen automáticamente sin intervención manual.",
		"Los permisos determinan quién puede ver, editar o administrar un informe dentro de un workspace.",
		"La distribución de informes puede hacerse mediante apps, enlaces directos o incrustación en otras plataformas.",
		"Una buena gobernanza de workspaces evita informes duplicados y desactualizados dentro de una organización.",
	],
	realExample: { title: "Actualización automática cada mañana", description: "Un informe conectado a una base de datos empresarial se configura para actualizarse automáticamente todos los días a las 6:00 a.m., asegurando que la gerencia siempre vea datos frescos." },
	practicalCase: { title: "Distribuir un informe solo al equipo comercial", description: "Una empresa crea una app en Power BI Service y asigna permisos de solo lectura al equipo comercial, evitando que modifiquen accidentalmente el informe original." },
	guidedActivity: { title: "Organiza la publicación de un informe", instructions: "1) Crea un workspace para tu área o proyecto. 2) Publica tu informe de Power BI Desktop en ese workspace. 3) Configura una actualización programada (o describe cómo lo harías si no tienes una fuente en la nube). 4) Define qué permisos asignarías a distintos roles (visualización, edición, administración)." },
	reflectionQuestion: "¿Qué riesgos existen si todos los usuarios de una organización tienen permisos de edición sobre el mismo informe?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué es un workspace en Power BI Service?", options: ["Un espacio donde se organizan informes, dashboards y conjuntos de datos", "Un tipo de gráfico", "Una función DAX", "Un archivo CSV"], correctOption: 0 },
		{ prompt: "¿Qué permite la actualización programada?", options: ["Que los datos se refresquen automáticamente sin intervención manual", "Que el informe cambie de idioma", "Que se eliminen visualizaciones antiguas", "Que se genere un nuevo modelo de datos"], correctOption: 0 },
		{ prompt: "¿Qué determinan los permisos en un workspace?", options: ["Quién puede ver, editar o administrar un informe", "El color de las visualizaciones", "El tipo de gráfico disponible", "El idioma del sistema"], correctOption: 0 },
		{ prompt: "¿Cómo se puede distribuir un informe de Power BI?", options: ["Mediante apps, enlaces directos o incrustación", "Solo imprimiéndolo en papel", "Solo enviándolo por correo como imagen", "No se puede distribuir"], correctOption: 0 },
		{ prompt: "¿Qué evita una buena gobernanza de workspaces?", options: ["Informes duplicados y desactualizados", "El uso de medidas DAX", "La creación de relaciones", "El uso de segmentadores"], correctOption: 0 },
		{ prompt: "En el ejemplo de actualización automática, ¿a qué hora se configuró?", options: ["6:00 a.m. todos los días", "Una vez al mes", "Solo los fines de semana", "Nunca se actualiza"], correctOption: 0 },
		{ prompt: "En el caso de distribuir al equipo comercial, ¿qué tipo de permiso se asignó?", options: ["Solo lectura", "Edición completa", "Administración total", "Ningún permiso"], correctOption: 0 },
		{ prompt: "¿Qué se organiza dentro de un workspace?", options: ["Informes, dashboards y conjuntos de datos", "Solo archivos de texto", "Solo imágenes", "Solo videos"], correctOption: 0 },
		{ prompt: "¿Qué riesgo existe si todos tienen permisos de edición?", options: ["Modificaciones accidentales o no autorizadas del informe original", "El informe se actualiza más rápido", "Los datos se vuelven más seguros", "No existe ningún riesgo"], correctOption: 0 },
		{ prompt: "¿Por qué es importante gobernar bien los workspaces en una organización?", options: ["Para mantener informes confiables, seguros y actualizados", "Para cambiar el idioma de los reportes", "Para reducir el número de usuarios", "Para eliminar la necesidad de permisos"], correctOption: 0 },
	],
};

const pbiA3: LessonContent = {
	introduction: "Un modelo de datos grande puede volverse lento si no se optimiza correctamente. En esta clase aprenderás a mejorar el rendimiento reduciendo columnas innecesarias, usando variables en DAX y analizando el rendimiento del modelo.",
	keyConcepts: [
		"Reducir columnas innecesarias en el modelo disminuye el tamaño del archivo y mejora la velocidad de carga.",
		"Las variables en DAX (VAR) evitan recalcular la misma expresión varias veces dentro de una medida, mejorando el rendimiento y la legibilidad.",
		"El Analizador de rendimiento de Power BI identifica qué visualización o consulta tarda más en cargar.",
		"Evitar columnas calculadas innecesarias en favor de medidas mejora el rendimiento general del modelo.",
		"Un modelo optimizado responde más rápido a los usuarios y consume menos recursos del servidor.",
	],
	realExample: { title: "Usar VAR para evitar recálculos", description: "En lugar de repetir SUM(Ventas[Monto]) tres veces dentro de una misma medida, se usa VAR TotalVentas = SUM(Ventas[Monto]) una sola vez y se reutiliza, mejorando el rendimiento." },
	practicalCase: { title: "Detectar una visualización lenta", description: "Usando el Analizador de rendimiento, un desarrollador descubre que un gráfico específico tarda 4 segundos en cargar debido a una medida mal optimizada, y la corrige usando variables." },
	guidedActivity: { title: "Optimiza tu modelo de datos", instructions: "1) Revisa tu modelo y elimina columnas que no se usan en ninguna visualización. 2) Reescribe una medida compleja usando VAR para evitar cálculos repetidos. 3) Usa el Analizador de rendimiento para identificar la visualización más lenta de tu informe. 4) Documenta qué cambios aplicarías para mejorarla." },
	reflectionQuestion: "¿Qué impacto tiene un modelo lento en la experiencia de los usuarios finales de un informe empresarial?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué logra reducir columnas innecesarias en el modelo?", options: ["Disminuir el tamaño del archivo y mejorar la velocidad", "Aumentar el número de relaciones", "Cambiar el idioma del informe", "Eliminar todas las medidas"], correctOption: 0 },
		{ prompt: "¿Qué evita el uso de variables (VAR) en DAX?", options: ["Recalcular la misma expresión varias veces", "Crear relaciones entre tablas", "Usar funciones de tiempo", "Aplicar seguridad a nivel de fila"], correctOption: 0 },
		{ prompt: "¿Qué identifica el Analizador de rendimiento?", options: ["Qué visualización o consulta tarda más en cargar", "El color de los gráficos", "El idioma del informe", "El número de usuarios conectados"], correctOption: 0 },
		{ prompt: "¿Qué se recomienda evitar en favor de las medidas?", options: ["Columnas calculadas innecesarias", "Las tablas de dimensión", "Las relaciones activas", "Los segmentadores"], correctOption: 0 },
		{ prompt: "¿Qué logra un modelo optimizado?", options: ["Responder más rápido y consumir menos recursos", "Ocultar todas las visualizaciones", "Eliminar la necesidad de relaciones", "Cambiar el idioma automáticamente"], correctOption: 0 },
		{ prompt: "En el ejemplo de usar VAR, ¿qué se evitó repetir?", options: ["SUM(Ventas[Monto]) tres veces", "Una relación entre tablas", "Un segmentador de región", "Una tabla calendario"], correctOption: 0 },
		{ prompt: "En el caso de la visualización lenta, ¿qué herramienta se usó para detectarla?", options: ["El Analizador de rendimiento", "El panel de Campos", "La Vista de datos", "El Editor de consultas"], correctOption: 0 },
		{ prompt: "¿Qué beneficio tiene mejorar la legibilidad de una medida con variables?", options: ["Facilita entender y mantener la fórmula en el futuro", "Cambia el color de la visualización", "Elimina la necesidad de relaciones", "Aumenta el tamaño del archivo"], correctOption: 0 },
		{ prompt: "¿Qué impacto tiene un modelo lento en los usuarios finales?", options: ["Una mala experiencia y demoras al interactuar con el informe", "Ningún impacto real", "Mejora la seguridad del informe", "Reduce automáticamente los errores"], correctOption: 0 },
		{ prompt: "¿Por qué es importante optimizar el rendimiento en modelos grandes?", options: ["Para que el informe siga siendo usable a medida que crecen los datos", "Para cambiar el idioma del sistema", "Para eliminar la necesidad de seguridad", "Para reducir el número de usuarios"], correctOption: 0 },
	],
};

const pbiA4: LessonContent = {
	introduction: "El DAX avanzado permite resolver problemas de análisis complejos que no se pueden lograr con fórmulas simples. En esta clase conocerás las funciones iteradoras, las tablas virtuales y patrones comunes de análisis de negocio.",
	keyConcepts: [
		"Las funciones iteradoras (como SUMX, AVERAGEX) recorren fila por fila una tabla para calcular un resultado, permitiendo cálculos más complejos que SUM simple.",
		"Una tabla virtual es una tabla temporal creada dentro de una fórmula DAX (con funciones como FILTER o SUMMARIZE) que no existe físicamente en el modelo.",
		"Los patrones de análisis de negocio incluyen cálculos como ranking de productos, clientes top N, o rentabilidad por línea de negocio.",
		"Combinar iteradoras con tablas virtuales permite resolver preguntas de negocio muy específicas.",
		"El DAX avanzado requiere entender bien el contexto de fila y de filtro estudiados en niveles anteriores.",
	],
	realExample: { title: "Calcular utilidad con SUMX", description: "Con Utilidad = SUMX(Ventas, Ventas[Cantidad] * (Ventas[PrecioVenta] - Ventas[Costo])) se calcula la utilidad real fila por fila, sumando el resultado de cada operación en lugar de un solo total agregado." },
	practicalCase: { title: "Top 5 clientes por facturación", description: "Usando una tabla virtual con TOPN y SUMMARIZE, un analista genera automáticamente la lista de los 5 clientes que más facturación generaron en el trimestre, sin crear una tabla física adicional." },
	guidedActivity: { title: "Aplica patrones avanzados de DAX", instructions: "1) Crea una medida de utilidad usando SUMX sobre cantidad, precio y costo. 2) Crea una tabla virtual con SUMMARIZE que agrupe ventas por cliente. 3) Usa TOPN sobre esa tabla virtual para identificar los 5 clientes principales. 4) Muestra el resultado en una tabla o gráfico de barras." },
	reflectionQuestion: "¿Qué tipo de pregunta de negocio de tu área te gustaría resolver usando funciones iteradoras y tablas virtuales?",
	imageUrl: "/images/tools/power%20bi.png",
	imageAlt: "Ícono de Power BI",
	quiz: [
		{ prompt: "¿Qué hacen las funciones iteradoras como SUMX?", options: ["Recorren fila por fila una tabla para calcular un resultado", "Eliminan relaciones del modelo", "Cambian el idioma del informe", "Solo funcionan con texto"], correctOption: 0 },
		{ prompt: "¿Qué es una tabla virtual en DAX?", options: ["Una tabla temporal creada dentro de una fórmula que no existe físicamente", "Una tabla importada desde Excel", "Una tabla de seguridad", "Una tabla calendario"], correctOption: 0 },
		{ prompt: "¿Qué función se usa para crear una tabla virtual agrupada?", options: ["SUMMARIZE", "SUM", "RELATED", "ALLSELECTED"], correctOption: 0 },
		{ prompt: "¿Qué patrón de análisis identifica a los mejores clientes o productos?", options: ["Top N (como Top 5 clientes)", "Comparativo año contra año", "Seguridad a nivel de fila", "Actualización programada"], correctOption: 0 },
		{ prompt: "¿Qué requiere dominar el DAX avanzado?", options: ["Entender bien el contexto de fila y de filtro", "Solo conocer Excel básico", "Solo saber crear gráficos", "Solo conocer Power Query"], correctOption: 0 },
		{ prompt: "En el ejemplo de calcular utilidad, ¿qué función se usó?", options: ["SUMX", "SUM", "AVERAGE", "COUNT"], correctOption: 0 },
		{ prompt: "En el caso del Top 5 clientes, ¿qué función identificó a los principales?", options: ["TOPN", "FILTER", "ALL", "CALCULATE"], correctOption: 0 },
		{ prompt: "¿Por qué SUMX permite cálculos más complejos que SUM?", options: ["Porque evalúa una expresión fila por fila antes de sumar", "Porque es más rápida siempre", "Porque no requiere relaciones", "Porque cambia el modelo de datos"], correctOption: 0 },
		{ prompt: "¿Qué tipo de resultado produce combinar iteradoras con tablas virtuales?", options: ["Respuestas a preguntas de negocio muy específicas", "Solo cambios de color en el informe", "Solo relaciones nuevas", "Solo tablas calendario"], correctOption: 0 },
		{ prompt: "¿Por qué es valioso el DAX avanzado en el análisis empresarial?", options: ["Permite resolver problemas de análisis que las fórmulas simples no pueden", "Porque reemplaza la necesidad de tener datos", "Porque cambia el idioma del reporte", "Porque elimina la necesidad de seguridad"], correctOption: 0 },
	],
};

// ===== SQL BÁSICO =====
const sqlB1: LessonContent = {
	introduction: "SQL es el lenguaje universal para consultar bases de datos. En esta clase aprenderás a leer información con SELECT, filtrar resultados con WHERE y ordenar o limitar los resultados con ORDER BY y LIMIT.",
	keyConcepts: [
		"SELECT columna1, columna2 FROM tabla; recupera columnas específicas de una tabla.",
		"WHERE filtra las filas que cumplen una condición, por ejemplo país = 'Perú'.",
		"ORDER BY ordena los resultados de forma ascendente (ASC) o descendente (DESC).",
		"LIMIT restringe el número de filas devueltas, útil para revisar una muestra de datos.",
		"SELECT * FROM tabla; trae todas las columnas, pero es mejor especificar solo las necesarias en producción.",
	],
	realExample: { title: "Clientes de Lima ordenados por compra", description: "SELECT nombre, monto FROM clientes WHERE ciudad = 'Lima' ORDER BY monto DESC LIMIT 10; devuelve los 10 clientes de Lima con mayor monto de compra." },
	practicalCase: { title: "Revisar una muestra antes de un reporte completo", description: "Un analista usa LIMIT 20 para revisar una muestra pequeña de una tabla de millones de registros antes de construir una consulta más compleja sobre toda la base." },
	guidedActivity: { title: "Construye tu primera consulta SELECT", instructions: "1) Escribe un SELECT que traiga nombre y precio de una tabla de productos. 2) Agrega un WHERE que filtre productos con precio mayor a un valor. 3) Ordena los resultados con ORDER BY de mayor a menor precio. 4) Limita el resultado a los primeros 5 registros con LIMIT." },
	reflectionQuestion: "¿Por qué es una buena práctica evitar SELECT * en consultas de producción?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Qué hace SELECT?", options: ["Recupera columnas específicas de una tabla", "Elimina filas de una tabla", "Crea una nueva tabla", "Cambia el tipo de dato de una columna"], correctOption: 0 },
		{ prompt: "¿Qué hace WHERE?", options: ["Filtra las filas que cumplen una condición", "Ordena los resultados", "Limita el número de filas", "Une dos tablas"], correctOption: 0 },
		{ prompt: "¿Qué hace ORDER BY?", options: ["Ordena los resultados de forma ascendente o descendente", "Filtra filas", "Cuenta registros", "Elimina duplicados"], correctOption: 0 },
		{ prompt: "¿Qué hace LIMIT?", options: ["Restringe el número de filas devueltas", "Ordena los resultados", "Filtra por una condición", "Cambia el nombre de una columna"], correctOption: 0 },
		{ prompt: "¿Qué trae SELECT * FROM tabla;?", options: ["Todas las columnas de la tabla", "Solo la primera columna", "Solo las filas duplicadas", "Ninguna columna"], correctOption: 0 },
		{ prompt: "En el ejemplo de clientes de Lima, ¿qué condición se aplicó en WHERE?", options: ["ciudad = 'Lima'", "monto > 1000", "nombre = 'Ana'", "id = 1"], correctOption: 0 },
		{ prompt: "¿Qué orden usa DESC en ORDER BY?", options: ["Descendente, de mayor a menor", "Ascendente, de menor a mayor", "Alfabético inverso siempre", "Aleatorio"], correctOption: 0 },
		{ prompt: "En el caso práctico, ¿para qué se usó LIMIT 20?", options: ["Para revisar una muestra antes de un reporte completo", "Para eliminar registros", "Para crear una tabla nueva", "Para cambiar el tipo de dato"], correctOption: 0 },
		{ prompt: "¿Por qué es mejor especificar columnas en lugar de usar SELECT *?", options: ["Porque mejora el rendimiento y la claridad de la consulta", "Porque es obligatorio en SQL", "Porque elimina errores de sintaxis", "Porque cambia el nombre de la tabla"], correctOption: 0 },
		{ prompt: "¿Qué cláusula usarías para mostrar solo los primeros 5 resultados?", options: ["LIMIT 5", "WHERE 5", "ORDER BY 5", "GROUP BY 5"], correctOption: 0 },
	],
};

const sqlB2: LessonContent = {
	introduction: "Los datos empresariales suelen estar distribuidos en varias tablas relacionadas. En esta clase aprenderás a unir tablas con JOIN, agrupar información con GROUP BY y calcular resúmenes con funciones de agregación.",
	keyConcepts: [
		"JOIN combina filas de dos tablas basándose en una columna relacionada, como un ID de cliente.",
		"INNER JOIN devuelve solo las filas que coinciden en ambas tablas.",
		"GROUP BY agrupa filas que comparten un valor para aplicar funciones de agregación sobre cada grupo.",
		"Las funciones de agregación (SUM, COUNT, AVG, MAX, MIN) resumen los datos de un grupo en un solo valor.",
		"HAVING filtra los resultados después de agrupar, a diferencia de WHERE que filtra antes de agrupar.",
	],
	realExample: { title: "Total de ventas por cliente", description: "SELECT clientes.nombre, SUM(ventas.monto) FROM ventas JOIN clientes ON ventas.cliente_id = clientes.id GROUP BY clientes.nombre; muestra el total vendido a cada cliente." },
	practicalCase: { title: "Clientes con más de 5 compras", description: "Usando GROUP BY y HAVING COUNT(*) > 5, un analista identifica qué clientes han realizado más de 5 compras, información clave para programas de fidelización." },
	guidedActivity: { title: "Combina y resume información de dos tablas", instructions: "1) Une una tabla de ventas con una tabla de productos usando JOIN. 2) Agrupa por producto con GROUP BY. 3) Calcula el total vendido de cada producto con SUM. 4) Filtra con HAVING para mostrar solo productos con ventas totales mayores a un valor." },
	reflectionQuestion: "¿Qué diferencia práctica existe entre usar WHERE y usar HAVING en una consulta con GROUP BY?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Qué hace JOIN?", options: ["Combina filas de dos tablas basándose en una columna relacionada", "Elimina filas duplicadas", "Ordena los resultados", "Limita el número de filas"], correctOption: 0 },
		{ prompt: "¿Qué devuelve INNER JOIN?", options: ["Solo las filas que coinciden en ambas tablas", "Todas las filas de ambas tablas", "Solo las filas sin coincidencia", "Ninguna fila"], correctOption: 0 },
		{ prompt: "¿Qué hace GROUP BY?", options: ["Agrupa filas que comparten un valor", "Ordena alfabéticamente", "Elimina columnas", "Crea una nueva tabla"], correctOption: 0 },
		{ prompt: "¿Qué tipo de funciones se usan sobre datos agrupados?", options: ["Funciones de agregación como SUM, COUNT, AVG", "Funciones de texto únicamente", "Funciones de fecha únicamente", "Ninguna función especial"], correctOption: 0 },
		{ prompt: "¿Qué diferencia a HAVING de WHERE?", options: ["HAVING filtra después de agrupar, WHERE filtra antes", "HAVING y WHERE son idénticos", "WHERE solo funciona con JOIN", "HAVING no permite condiciones"], correctOption: 0 },
		{ prompt: "En el ejemplo de total de ventas por cliente, ¿qué función de agregación se usó?", options: ["SUM", "COUNT", "AVG", "MAX"], correctOption: 0 },
		{ prompt: "En el caso de clientes con más de 5 compras, ¿qué función se usó con HAVING?", options: ["COUNT(*)", "SUM(*)", "AVG(*)", "MAX(*)"], correctOption: 0 },
		{ prompt: "¿Qué columna se usa típicamente para unir dos tablas con JOIN?", options: ["Una columna en común, como un ID", "El nombre de la tabla", "El color de la fila", "El número de columnas"], correctOption: 0 },
		{ prompt: "¿Qué función de agregación calcula un promedio?", options: ["AVG", "SUM", "COUNT", "MAX"], correctOption: 0 },
		{ prompt: "¿Por qué son importantes JOIN y GROUP BY en el análisis de datos empresariales?", options: ["Porque permiten combinar y resumir información de varias tablas", "Porque cambian el idioma de la base de datos", "Porque eliminan la necesidad de tener datos", "Porque solo sirven para tablas pequeñas"], correctOption: 0 },
	],
};

const sqlB3: LessonContent = {
	introduction: "Con subconsultas puedes resolver preguntas de negocio que requieren varios pasos dentro de una sola consulta. En esta clase aprenderás a construir subconsultas, calcular indicadores y resolver un caso de negocio completo.",
	keyConcepts: [
		"Una subconsulta es una consulta dentro de otra consulta, usada en WHERE, FROM o SELECT.",
		"Las subconsultas en WHERE filtran comparando contra el resultado de otra consulta, por ejemplo clientes con compras mayores al promedio.",
		"Un indicador de negocio (KPI) se calcula normalmente combinando funciones de agregación con condiciones específicas.",
		"Las subconsultas correlacionadas dependen de la fila actual de la consulta externa para ejecutarse.",
		"Resolver un caso de negocio real implica traducir una pregunta en lenguaje natural a una consulta SQL estructurada.",
	],
	realExample: { title: "Clientes con compras sobre el promedio", description: "SELECT nombre FROM clientes WHERE monto_total > (SELECT AVG(monto_total) FROM clientes); identifica los clientes que compraron más que el promedio general." },
	practicalCase: { title: "Producto más vendido por categoría", description: "Usando una subconsulta en el FROM, un analista calcula el total vendido por producto y luego selecciona el máximo de cada categoría para conocer el producto estrella de cada línea." },
	guidedActivity: { title: "Resuelve un caso de negocio con subconsultas", instructions: "1) Calcula el promedio de ventas de una tabla. 2) Escribe una subconsulta en WHERE que filtre los registros por encima de ese promedio. 3) Construye un indicador simple, por ejemplo el porcentaje de clientes sobre el promedio. 4) Documenta la pregunta de negocio que responde tu consulta." },
	reflectionQuestion: "¿Qué pregunta de negocio de tu área te gustaría resolver usando una subconsulta en SQL?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Qué es una subconsulta?", options: ["Una consulta dentro de otra consulta", "Una tabla temporal física", "Un tipo de índice", "Un procedimiento almacenado"], correctOption: 0 },
		{ prompt: "¿Dónde se pueden usar subconsultas?", options: ["En WHERE, FROM o SELECT", "Solo en WHERE", "Solo en ORDER BY", "Solo en GROUP BY"], correctOption: 0 },
		{ prompt: "¿Qué hace una subconsulta en WHERE?", options: ["Filtra comparando contra el resultado de otra consulta", "Ordena los resultados", "Crea una nueva tabla", "Elimina duplicados"], correctOption: 0 },
		{ prompt: "¿Qué caracteriza a una subconsulta correlacionada?", options: ["Depende de la fila actual de la consulta externa", "Se ejecuta una sola vez siempre", "No puede usarse en WHERE", "Solo funciona con JOIN"], correctOption: 0 },
		{ prompt: "¿Qué es un KPI en el contexto de SQL?", options: ["Un indicador de negocio calculado con agregaciones y condiciones", "Un tipo de índice", "Una función de texto", "Un tipo de JOIN"], correctOption: 0 },
		{ prompt: "En el ejemplo de clientes sobre el promedio, ¿qué función se usó dentro de la subconsulta?", options: ["AVG", "SUM", "COUNT", "MAX"], correctOption: 0 },
		{ prompt: "En el caso del producto más vendido por categoría, ¿dónde se usó la subconsulta?", options: ["En el FROM", "En el WHERE", "En el ORDER BY", "En el GROUP BY"], correctOption: 0 },
		{ prompt: "¿Qué habilidad es clave para resolver un caso de negocio con SQL?", options: ["Traducir una pregunta en lenguaje natural a una consulta estructurada", "Memorizar todos los comandos SQL", "Usar siempre SELECT *", "Evitar el uso de JOIN"], correctOption: 0 },
		{ prompt: "¿Qué tipo de consulta ayuda a comparar un valor individual contra un promedio general?", options: ["Una subconsulta en WHERE", "Un JOIN simple", "Un ORDER BY", "Un LIMIT"], correctOption: 0 },
		{ prompt: "¿Por qué son valiosas las subconsultas en el análisis de datos?", options: ["Porque permiten resolver preguntas de negocio en varios pasos dentro de una sola consulta", "Porque hacen la consulta más corta siempre", "Porque eliminan la necesidad de JOIN", "Porque cambian el tipo de dato automáticamente"], correctOption: 0 },
	],
};

// ===== SQL INTERMEDIO =====
const sqlI1: LessonContent = {
	introduction: "A medida que los sistemas crecen, es común necesitar combinar más de dos tablas a la vez. En esta clase aprenderás a combinar INNER y LEFT JOIN, unir tres o más tablas y usar alias para mantener tus consultas legibles.",
	keyConcepts: [
		"LEFT JOIN devuelve todas las filas de la tabla izquierda, aunque no haya coincidencia en la derecha (con NULL en ese caso).",
		"Se pueden combinar varios tipos de JOIN en una misma consulta para responder preguntas más complejas.",
		"Unir tres o más tablas requiere encadenar JOIN, cada uno con su propia condición ON.",
		"Los alias (AS) acortan los nombres de tablas y columnas, haciendo las consultas más legibles.",
		"Un buen alias es corto pero descriptivo, por ejemplo 'v' para ventas y 'c' para clientes.",
	],
	realExample: { title: "Clientes con o sin compras", description: "SELECT c.nombre, v.monto FROM clientes c LEFT JOIN ventas v ON c.id = v.cliente_id; muestra todos los clientes, incluso los que no tienen ninguna venta registrada." },
	practicalCase: { title: "Reporte de ventas con producto y vendedor", description: "Un reporte combina las tablas Ventas, Productos y Vendedores con dos JOIN encadenados para mostrar en una sola fila el producto vendido, su categoría y el nombre del vendedor." },
	guidedActivity: { title: "Combina tres tablas con alias claros", instructions: "1) Une tres tablas relacionadas (por ejemplo Ventas, Productos y Clientes) usando INNER JOIN. 2) Cambia uno de los JOIN a LEFT JOIN y observa cómo cambian los resultados. 3) Agrega alias cortos a cada tabla. 4) Verifica que la consulta sea legible y fácil de entender." },
	reflectionQuestion: "¿En qué situación real usarías un LEFT JOIN en lugar de un INNER JOIN?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Qué devuelve LEFT JOIN?", options: ["Todas las filas de la tabla izquierda, con NULL si no hay coincidencia", "Solo las filas que coinciden en ambas tablas", "Solo las filas de la tabla derecha", "Ninguna fila si hay NULL"], correctOption: 0 },
		{ prompt: "¿Qué permite unir tres o más tablas?", options: ["Encadenar varios JOIN con su propia condición ON", "Usar solo WHERE", "Usar solo GROUP BY", "No es posible unir más de dos tablas"], correctOption: 0 },
		{ prompt: "¿Para qué sirven los alias en SQL?", options: ["Para acortar nombres y hacer las consultas más legibles", "Para eliminar columnas", "Para crear índices", "Para cambiar el tipo de dato"], correctOption: 0 },
		{ prompt: "¿Qué diferencia a INNER JOIN de LEFT JOIN?", options: ["INNER JOIN solo devuelve coincidencias en ambas tablas", "LEFT JOIN nunca devuelve NULL", "INNER JOIN siempre devuelve más filas", "No hay ninguna diferencia"], correctOption: 0 },
		{ prompt: "¿Qué palabra clave se usa para crear un alias?", options: ["AS", "JOIN", "WHERE", "GROUP"], correctOption: 0 },
		{ prompt: "En el ejemplo de clientes con o sin compras, ¿qué tipo de JOIN se usó?", options: ["LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "FULL JOIN"], correctOption: 0 },
		{ prompt: "En el caso del reporte de ventas, ¿cuántas tablas se combinaron?", options: ["Tres: Ventas, Productos y Vendedores", "Solo dos", "Cuatro", "Ninguna, solo una tabla"], correctOption: 0 },
		{ prompt: "¿Qué valor aparece cuando no hay coincidencia en un LEFT JOIN?", options: ["NULL", "Cero", "Un texto vacío", "Un error"], correctOption: 0 },
		{ prompt: "¿Qué característica debe tener un buen alias?", options: ["Ser corto pero descriptivo", "Ser lo más largo posible", "Ser un número", "No debe usarse nunca"], correctOption: 0 },
		{ prompt: "¿Por qué es importante la legibilidad en consultas con múltiples JOIN?", options: ["Para facilitar el mantenimiento y comprensión de la consulta", "Para que la consulta sea más lenta", "Para evitar el uso de alias", "Para reducir el número de tablas"], correctOption: 0 },
	],
};

const sqlI2: LessonContent = {
	introduction: "Las subconsultas intermedias permiten resolver preguntas más complejas combinando distintos niveles de análisis. En esta clase profundizarás en subconsultas en WHERE, subconsultas correlacionadas y subconsultas en el FROM.",
	keyConcepts: [
		"Una subconsulta en WHERE compara un valor contra el resultado de otra consulta independiente.",
		"Una subconsulta correlacionada se ejecuta una vez por cada fila de la consulta externa, ya que depende de ella.",
		"Una subconsulta en el FROM se trata como una tabla temporal sobre la que se puede consultar de nuevo.",
		"Las subconsultas correlacionadas suelen ser más lentas que las independientes por ejecutarse repetidamente.",
		"Elegir entre subconsulta y JOIN depende de la claridad y el rendimiento que se necesite.",
	],
	realExample: { title: "Empleados que ganan más que el promedio de su área", description: "Una subconsulta correlacionada compara el sueldo de cada empleado contra el promedio de su propia área, ejecutándose una vez por cada fila de empleados." },
	practicalCase: { title: "Resumen de ventas mensuales como tabla temporal", description: "Una subconsulta en el FROM calcula el total de ventas por mes, y la consulta externa filtra los meses donde ese total superó una meta específica." },
	guidedActivity: { title: "Practica los tres tipos de subconsultas", instructions: "1) Escribe una subconsulta en WHERE que compare un valor contra un promedio general. 2) Escribe una subconsulta correlacionada que compare cada fila contra el promedio de su propio grupo. 3) Escribe una subconsulta en el FROM que resuma datos por categoría. 4) Compara los resultados y la legibilidad de cada enfoque." },
	reflectionQuestion: "¿Por qué una subconsulta correlacionada puede ser más lenta que una subconsulta independiente?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Qué compara una subconsulta en WHERE?", options: ["Un valor contra el resultado de otra consulta independiente", "Dos tablas completas", "El nombre de dos columnas", "El tipo de dato de una tabla"], correctOption: 0 },
		{ prompt: "¿Qué caracteriza a una subconsulta correlacionada?", options: ["Se ejecuta una vez por cada fila de la consulta externa", "Se ejecuta solo una vez en total", "No puede usarse en WHERE", "Siempre es más rápida que un JOIN"], correctOption: 0 },
		{ prompt: "¿Cómo se trata una subconsulta en el FROM?", options: ["Como una tabla temporal", "Como una columna nueva", "Como un índice", "Como un procedimiento almacenado"], correctOption: 0 },
		{ prompt: "¿Por qué las subconsultas correlacionadas pueden ser más lentas?", options: ["Porque se ejecutan repetidamente por cada fila", "Porque no usan índices nunca", "Porque no permiten condiciones", "Porque siempre usan JOIN"], correctOption: 0 },
		{ prompt: "¿De qué depende elegir entre subconsulta y JOIN?", options: ["De la claridad y el rendimiento necesarios", "Del color de la base de datos", "Del nombre del motor SQL", "De la cantidad de usuarios conectados"], correctOption: 0 },
		{ prompt: "En el ejemplo de empleados que ganan más que el promedio de su área, ¿qué tipo de subconsulta se usó?", options: ["Correlacionada", "Independiente", "En el FROM", "Ninguna"], correctOption: 0 },
		{ prompt: "En el caso del resumen de ventas mensuales, ¿dónde se ubicó la subconsulta?", options: ["En el FROM", "En el WHERE", "En el GROUP BY", "En el ORDER BY"], correctOption: 0 },
		{ prompt: "¿Qué tipo de subconsulta se ejecuta una sola vez, sin depender de la fila externa?", options: ["Independiente", "Correlacionada", "En el FROM únicamente", "Ninguna de las anteriores"], correctOption: 0 },
		{ prompt: "¿Qué ventaja tiene una subconsulta en el FROM?", options: ["Permite reutilizar un resultado resumido como si fuera una tabla", "Elimina la necesidad de JOIN siempre", "Es más rápida que cualquier índice", "No requiere condiciones"], correctOption: 0 },
		{ prompt: "¿Por qué son útiles las subconsultas intermedias en el análisis de datos?", options: ["Porque permiten resolver preguntas de negocio en varios niveles de detalle", "Porque reemplazan todas las tablas físicas", "Porque eliminan la necesidad de bases de datos", "Porque solo funcionan con texto"], correctOption: 0 },
	],
};

const sqlI3: LessonContent = {
	introduction: "Las funciones de ventana permiten realizar cálculos a través de un conjunto de filas relacionadas sin necesidad de agrupar y perder el detalle de cada fila. En esta clase aprenderás ROW_NUMBER, RANK y PARTITION BY.",
	keyConcepts: [
		"ROW_NUMBER() asigna un número secuencial único a cada fila según un orden definido.",
		"RANK() asigna una posición de ranking, dejando huecos si hay empates.",
		"PARTITION BY divide los datos en grupos para que la función de ventana se aplique dentro de cada grupo por separado.",
		"Las funciones de ventana se escriben con la cláusula OVER().",
		"A diferencia de GROUP BY, las funciones de ventana no reducen el número de filas del resultado.",
	],
	realExample: { title: "Numerar ventas por cliente", description: "SELECT nombre, monto, ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY monto DESC) AS posicion FROM ventas; numera las ventas de cada cliente de mayor a menor monto." },
	practicalCase: { title: "Ranking de vendedores por región", description: "Usando RANK() con PARTITION BY región, una empresa identifica al mejor vendedor de cada región sin perder el detalle individual de cada vendedor en el resultado." },
	guidedActivity: { title: "Aplica funciones de ventana con particiones", instructions: "1) Usa ROW_NUMBER() para numerar las filas de una tabla de ventas ordenadas por monto. 2) Agrega PARTITION BY para numerar las ventas dentro de cada cliente o región por separado. 3) Cambia ROW_NUMBER() por RANK() y observa la diferencia cuando hay valores empatados. 4) Filtra el resultado para mostrar solo la posición 1 de cada partición." },
	reflectionQuestion: "¿Qué diferencia práctica existe entre ROW_NUMBER() y RANK() cuando hay valores empatados?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Qué hace ROW_NUMBER()?", options: ["Asigna un número secuencial único a cada fila según un orden", "Suma los valores de una columna", "Elimina duplicados", "Cambia el tipo de dato"], correctOption: 0 },
		{ prompt: "¿Qué hace RANK()?", options: ["Asigna una posición de ranking, dejando huecos si hay empates", "Cuenta el número de filas", "Ordena alfabéticamente", "Filtra por una condición"], correctOption: 0 },
		{ prompt: "¿Qué hace PARTITION BY?", options: ["Divide los datos en grupos para aplicar la función por separado en cada uno", "Elimina una tabla", "Crea un índice", "Cambia el nombre de una columna"], correctOption: 0 },
		{ prompt: "¿Con qué cláusula se escriben las funciones de ventana?", options: ["OVER()", "GROUP BY", "HAVING", "LIMIT"], correctOption: 0 },
		{ prompt: "¿Qué diferencia a las funciones de ventana de GROUP BY?", options: ["No reducen el número de filas del resultado", "Siempre agrupan los datos en una sola fila", "No permiten ordenar los datos", "Solo funcionan con fechas"], correctOption: 0 },
		{ prompt: "En el ejemplo de numerar ventas por cliente, ¿qué función se usó?", options: ["ROW_NUMBER()", "RANK()", "SUM()", "COUNT()"], correctOption: 0 },
		{ prompt: "En el caso del ranking de vendedores por región, ¿qué función se usó?", options: ["RANK()", "ROW_NUMBER()", "AVG()", "LAG()"], correctOption: 0 },
		{ prompt: "¿Qué ocurre con RANK() cuando hay un empate?", options: ["Dejan un hueco en la numeración siguiente", "Se genera un error", "Se ignoran los valores empatados", "Se eliminan las filas duplicadas"], correctOption: 0 },
		{ prompt: "¿Qué permite identificar filtrar por la posición 1 de cada partición?", options: ["El mejor registro de cada grupo", "El peor registro de cada grupo", "El promedio de cada grupo", "El total general"], correctOption: 0 },
		{ prompt: "¿Por qué son útiles las funciones de ventana en el análisis de datos?", options: ["Porque permiten cálculos por grupo sin perder el detalle de cada fila", "Porque eliminan la necesidad de JOIN", "Porque solo sirven para tablas pequeñas", "Porque reemplazan las subconsultas por completo"], correctOption: 0 },
	],
};

const sqlI4: LessonContent = {
	introduction: "Las vistas y las CTE (Common Table Expressions) ayudan a organizar consultas complejas en partes más claras y reutilizables. En esta clase aprenderás a crear ambas y por qué mejoran la legibilidad de tus consultas SQL.",
	keyConcepts: [
		"Una CTE se define con WITH nombre AS (consulta) y se usa como una tabla temporal dentro de la misma consulta.",
		"Una vista (VIEW) guarda una consulta como si fuera una tabla virtual reutilizable en el tiempo.",
		"Las CTE son ideales para dividir consultas complejas en pasos lógicos y legibles.",
		"Las vistas son útiles cuando varias personas o reportes necesitan la misma consulta repetidamente.",
		"Tanto las CTE como las vistas no almacenan datos físicamente; se recalculan cada vez que se consultan.",
	],
	realExample: { title: "CTE para ventas mensuales", description: "WITH ventas_mensuales AS (SELECT mes, SUM(monto) AS total FROM ventas GROUP BY mes) SELECT * FROM ventas_mensuales WHERE total > 10000; organiza el cálculo en un paso claro antes de filtrarlo." },
	practicalCase: { title: "Vista reutilizable para reportes de gerencia", description: "Una empresa crea la vista vista_ventas_resumen para que distintos reportes de gerencia consulten siempre la misma lógica de negocio sin repetir la consulta completa cada vez." },
	guidedActivity: { title: "Organiza tus consultas con CTE y vistas", instructions: "1) Escribe una CTE que resuma las ventas por categoría. 2) Usa esa CTE en una consulta externa para filtrar solo las categorías con ventas mayores a un valor. 3) Convierte la misma lógica en una vista con CREATE VIEW. 4) Consulta la vista como si fuera una tabla normal." },
	reflectionQuestion: "¿En qué situación preferirías usar una vista en lugar de una CTE?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Cómo se define una CTE?", options: ["Con WITH nombre AS (consulta)", "Con CREATE TABLE", "Con INSERT INTO", "Con DELETE FROM"], correctOption: 0 },
		{ prompt: "¿Qué es una vista (VIEW) en SQL?", options: ["Una consulta guardada como tabla virtual reutilizable", "Un tipo de índice", "Un procedimiento almacenado", "Una función de ventana"], correctOption: 0 },
		{ prompt: "¿Para qué son ideales las CTE?", options: ["Para dividir consultas complejas en pasos lógicos", "Para eliminar tablas", "Para crear índices", "Para cambiar permisos de usuario"], correctOption: 0 },
		{ prompt: "¿Cuándo son útiles las vistas?", options: ["Cuando varias personas o reportes necesitan la misma consulta repetidamente", "Solo quen una consulta se usa una vez", "Cuando se necesita eliminar datos", "Cuando no hay relaciones entre tablas"], correctOption: 0 },
		{ prompt: "¿Las CTE y vistas almacenan datos físicamente?", options: ["No, se recalculan cada vez que se consultan", "Sí, siempre guardan una copia física", "Solo las vistas almacenan datos", "Solo las CTE almacenan datos"], correctOption: 0 },
		{ prompt: "En el ejemplo de ventas mensuales, ¿qué palabra clave se usó para crear la CTE?", options: ["WITH", "CREATE", "SELECT INTO", "VIEW"], correctOption: 0 },
		{ prompt: "En el caso de la vista reutilizable, ¿qué instrucción se usó para crearla?", options: ["CREATE VIEW", "CREATE TABLE", "CREATE INDEX", "CREATE PROCEDURE"], correctOption: 0 },
		{ prompt: "¿Qué mejora el uso de CTE en consultas complejas?", options: ["La legibilidad y organización de la consulta", "La velocidad de escritura de datos", "El número de tablas físicas", "El tipo de motor de base de datos"], correctOption: 0 },
		{ prompt: "¿Qué tienen en común las CTE y las vistas?", options: ["Ambas actúan como tablas virtuales sin almacenar datos físicamente", "Ambas requieren permisos de administrador", "Ambas eliminan datos automáticamente", "Ambas son exclusivas de un solo motor de base de datos"], correctOption: 0 },
		{ prompt: "¿Por qué son valiosas las vistas en reportes empresariales?", options: ["Porque centralizan la lógica de negocio para que todos consulten lo mismo", "Porque eliminan la necesidad de tablas", "Porque cambian el tipo de dato automáticamente", "Porque solo funcionan con una tabla"], correctOption: 0 },
	],
};

// ===== SQL AVANZADO =====
const sqlA1: LessonContent = {
	introduction: "Las funciones de ventana avanzadas permiten comparar una fila con las filas anteriores o siguientes, calcular acumulados y analizar percentiles. En esta clase profundizarás en LAG, LEAD, acumulados, promedios móviles y percentiles.",
	keyConcepts: [
		"LAG() obtiene el valor de una fila anterior dentro de la misma partición.",
		"LEAD() obtiene el valor de una fila siguiente dentro de la misma partición.",
		"Un acumulado (running total) suma progresivamente los valores anteriores usando SUM() OVER (ORDER BY ...).",
		"Un promedio móvil calcula el promedio de un rango de filas cercanas, suavizando variaciones temporales.",
		"Los percentiles (como PERCENT_RANK) indican la posición relativa de un valor dentro de una distribución.",
	],
	realExample: { title: "Comparar la venta de un mes con el mes anterior", description: "SELECT mes, monto, LAG(monto) OVER (ORDER BY mes) AS mes_anterior FROM ventas_mensuales; permite comparar cada mes con el inmediatamente anterior en la misma consulta." },
	practicalCase: { title: "Detectar tendencia con promedio móvil", description: "Un analista financiero calcula un promedio móvil de 3 meses sobre las ventas para suavizar variaciones y detectar la tendencia real del negocio, sin ruido de meses atípicos." },
	guidedActivity: { title: "Analiza tendencias con funciones de ventana avanzadas", instructions: "1) Usa LAG() para comparar el valor de una fila con la fila anterior. 2) Usa LEAD() para comparar con la fila siguiente. 3) Calcula un acumulado con SUM() OVER (ORDER BY ...). 4) Calcula un promedio móvil de 3 periodos usando AVG() OVER con un rango de filas." },
	reflectionQuestion: "¿En qué reporte de tu trabajo sería útil comparar cada periodo con el anterior usando LAG()?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Qué hace LAG()?", options: ["Obtiene el valor de una fila anterior dentro de la partición", "Obtiene el valor de una fila siguiente", "Suma todos los valores de la tabla", "Elimina una fila"], correctOption: 0 },
		{ prompt: "¿Qué hace LEAD()?", options: ["Obtiene el valor de una fila siguiente dentro de la partición", "Obtiene el valor de una fila anterior", "Cuenta las filas de la tabla", "Ordena los resultados"], correctOption: 0 },
		{ prompt: "¿Qué calcula un acumulado (running total)?", options: ["La suma progresiva de los valores anteriores", "El promedio de toda la tabla", "El valor máximo de la tabla", "El número total de filas"], correctOption: 0 },
		{ prompt: "¿Qué logra un promedio móvil?", options: ["Suavizar variaciones temporales en los datos", "Eliminar valores duplicados", "Cambiar el tipo de dato", "Crear un nuevo índice"], correctOption: 0 },
		{ prompt: "¿Qué indican los percentiles?", options: ["La posición relativa de un valor dentro de una distribución", "El total de una columna", "El nombre de una tabla", "El tipo de un dato"], correctOption: 0 },
		{ prompt: "En el ejemplo de comparar meses, ¿qué función se usó?", options: ["LAG()", "LEAD()", "RANK()", "SUM()"], correctOption: 0 },
		{ prompt: "En el caso del promedio móvil, ¿de cuántos meses fue el promedio?", options: ["3 meses", "6 meses", "12 meses", "1 mes"], correctOption: 0 },
		{ prompt: "¿Qué cláusula acompaña a las funciones de ventana avanzadas?", options: ["OVER()", "GROUP BY", "HAVING", "LIMIT"], correctOption: 0 },
		{ prompt: "¿Qué función usarías para comparar con el valor del periodo siguiente?", options: ["LEAD()", "LAG()", "RANK()", "COUNT()"], correctOption: 0 },
		{ prompt: "¿Por qué son valiosas estas funciones en análisis financiero?", options: ["Porque permiten detectar tendencias y comparar periodos sin perder el detalle de cada fila", "Porque eliminan la necesidad de tener datos históricos", "Porque cambian el idioma del reporte", "Porque reemplazan las tablas de hechos"], correctOption: 0 },
	],
};

const sqlA2: LessonContent = {
	introduction: "Una consulta puede volverse muy lenta si la base de datos crece sin una optimización adecuada. En esta clase aprenderás sobre índices, planes de ejecución y buenas prácticas de rendimiento.",
	keyConcepts: [
		"Un índice acelera la búsqueda de datos en una columna, similar al índice de un libro.",
		"Los índices mejoran las lecturas pero pueden ralentizar las escrituras (INSERT, UPDATE, DELETE).",
		"Un plan de ejecución muestra cómo la base de datos va a procesar una consulta antes de ejecutarla.",
		"Evitar SELECT * y usar filtros con índices mejora significativamente el rendimiento.",
		"Las funciones aplicadas sobre una columna filtrada (como UPPER(columna)) pueden impedir que se use un índice existente.",
	],
	realExample: { title: "Crear un índice sobre una columna de búsqueda frecuente", description: "CREATE INDEX idx_cliente_id ON ventas(cliente_id); acelera las consultas que filtran o unen por cliente_id, especialmente en tablas con millones de filas." },
	practicalCase: { title: "Diagnosticar una consulta lenta con el plan de ejecución", description: "Un administrador de base de datos usa EXPLAIN para revisar el plan de ejecución de una consulta lenta y descubre que falta un índice en la columna usada en el WHERE." },
	guidedActivity: { title: "Optimiza una consulta con índices", instructions: "1) Identifica una consulta que use una columna frecuentemente en WHERE o JOIN. 2) Crea un índice sobre esa columna. 3) Usa EXPLAIN (o el equivalente de tu motor) para revisar el plan de ejecución antes y después del índice. 4) Documenta la mejora observada." },
	reflectionQuestion: "¿Por qué no conviene crear índices en absolutamente todas las columnas de una tabla?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Qué hace un índice en una base de datos?", options: ["Acelera la búsqueda de datos en una columna", "Elimina filas duplicadas", "Cambia el tipo de dato", "Crea una nueva tabla"], correctOption: 0 },
		{ prompt: "¿Qué efecto secundario pueden tener los índices?", options: ["Ralentizar las operaciones de escritura", "Eliminar la necesidad de JOIN", "Acelerar siempre todas las consultas sin excepción", "Cambiar el nombre de las columnas"], correctOption: 0 },
		{ prompt: "¿Qué muestra un plan de ejecución?", options: ["Cómo la base de datos procesará una consulta", "El historial de usuarios conectados", "El color de las tablas", "El idioma del motor de base de datos"], correctOption: 0 },
		{ prompt: "¿Qué práctica ayuda a mejorar el rendimiento de una consulta?", options: ["Evitar SELECT * y usar filtros con índices", "Usar siempre SELECT * en cada consulta", "Eliminar todos los índices existentes", "Ignorar los planes de ejecución"], correctOption: 0 },
		{ prompt: "¿Qué puede impedir el uso de un índice existente?", options: ["Aplicar una función sobre la columna filtrada", "Usar WHERE en la consulta", "Usar un alias en la tabla", "Ordenar los resultados con ORDER BY"], correctOption: 0 },
		{ prompt: "En el ejemplo de crear un índice, ¿qué instrucción se usó?", options: ["CREATE INDEX", "CREATE TABLE", "CREATE VIEW", "CREATE PROCEDURE"], correctOption: 0 },
		{ prompt: "En el caso de diagnosticar una consulta lenta, ¿qué herramienta se usó?", options: ["EXPLAIN", "SELECT", "GROUP BY", "HAVING"], correctOption: 0 },
		{ prompt: "¿Qué tipo de operaciones se benefician más de un índice?", options: ["Las lecturas (SELECT) frecuentes", "Las eliminaciones masivas", "Los cambios de tipo de dato", "Las copias de seguridad"], correctOption: 0 },
		{ prompt: "¿Por qué no conviene indexar todas las columnas?", options: ["Porque ralentiza las escrituras y ocupa más espacio", "Porque los índices son ilegales en SQL", "Porque elimina las relaciones entre tablas", "Porque cambia el idioma del sistema"], correctOption: 0 },
		{ prompt: "¿Por qué es importante la optimización de consultas en bases de datos de producción?", options: ["Para mantener el rendimiento a medida que crecen los datos", "Para cambiar el diseño visual de los reportes", "Para eliminar la necesidad de seguridad", "Para reducir el número de usuarios"], correctOption: 0 },
	],
};

const sqlA3: LessonContent = {
	introduction: "Los procedimientos almacenados permiten encapsular lógica de negocio dentro de la base de datos, de forma reutilizable y con manejo de errores. En esta clase aprenderás a crear procedimientos con parámetros, reutilizar lógica y controlar errores.",
	keyConcepts: [
		"Un procedimiento almacenado es un bloque de código SQL guardado en la base de datos, ejecutable con una sola instrucción.",
		"Los parámetros permiten que un procedimiento reciba valores distintos cada vez que se ejecuta.",
		"Reutilizar procedimientos evita duplicar la misma lógica en múltiples aplicaciones o reportes.",
		"El control de errores (TRY/CATCH o equivalente) evita que un procedimiento falle silenciosamente.",
		"Los procedimientos almacenados suelen ejecutarse más rápido que enviar consultas individuales repetidamente.",
	],
	realExample: { title: "Procedimiento para registrar una venta", description: "CREATE PROCEDURE registrar_venta(@cliente_id INT, @monto DECIMAL) permite insertar una nueva venta con solo llamar al procedimiento y pasar los datos necesarios." },
	practicalCase: { title: "Controlar un error de stock insuficiente", description: "Un procedimiento de venta verifica el stock disponible antes de insertar la venta; si no hay stock suficiente, captura el error y devuelve un mensaje claro en lugar de fallar sin explicación." },
	guidedActivity: { title: "Diseña un procedimiento con validación", instructions: "1) Diseña un procedimiento almacenado que reciba dos parámetros, por ejemplo cliente y monto. 2) Define la lógica que inserta un registro usando esos parámetros. 3) Agrega una validación, por ejemplo que el monto sea mayor a cero. 4) Agrega manejo de errores para capturar y reportar cualquier fallo." },
	reflectionQuestion: "¿Qué proceso repetitivo de tu trabajo podrías convertir en un procedimiento almacenado reutilizable?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Qué es un procedimiento almacenado?", options: ["Un bloque de código SQL guardado en la base de datos, ejecutable con una instrucción", "Un tipo de índice", "Una vista temporal", "Una función de ventana"], correctOption: 0 },
		{ prompt: "¿Para qué sirven los parámetros en un procedimiento?", options: ["Para recibir valores distintos en cada ejecución", "Para eliminar tablas", "Para crear índices automáticamente", "Para cambiar el idioma del sistema"], correctOption: 0 },
		{ prompt: "¿Qué evita reutilizar procedimientos almacenados?", options: ["Duplicar la misma lógica en múltiples aplicaciones", "Crear más tablas de las necesarias", "Usar JOIN en las consultas", "Aplicar seguridad a nivel de fila"], correctOption: 0 },
		{ prompt: "¿Qué previene el control de errores en un procedimiento?", options: ["Que falle silenciosamente sin explicación", "Que se ejecute más rápido", "Que reciba parámetros", "Que se guarde en la base de datos"], correctOption: 0 },
		{ prompt: "¿Qué ventaja de rendimiento suelen tener los procedimientos almacenados?", options: ["Ejecutarse más rápido que consultas individuales repetidas", "Ocupar menos espacio en disco siempre", "Eliminar la necesidad de índices", "Cambiar el tipo de dato automáticamente"], correctOption: 0 },
		{ prompt: "En el ejemplo de registrar una venta, ¿qué parámetros recibió el procedimiento?", options: ["Cliente y monto", "Solo el nombre del producto", "Solo la fecha", "Ningún parámetro"], correctOption: 0 },
		{ prompt: "En el caso del stock insuficiente, ¿qué hizo el procedimiento al detectar el error?", options: ["Capturó el error y devolvió un mensaje claro", "Detuvo la base de datos completa", "Eliminó la tabla de ventas", "Ignoró el problema silenciosamente"], correctOption: 0 },
		{ prompt: "¿Qué validación se sugiere agregar en la actividad guiada?", options: ["Que el monto sea mayor a cero", "Que el nombre del cliente sea único", "Que la fecha sea futura", "Que el producto tenga descuento"], correctOption: 0 },
		{ prompt: "¿Qué tipo de lógica es ideal para convertir en procedimiento almacenado?", options: ["Procesos repetitivos usados en varias aplicaciones o reportes", "Consultas que se ejecutan una sola vez", "Datos que nunca cambian", "Solo consultas de solo lectura"], correctOption: 0 },
		{ prompt: "¿Por qué son valiosos los procedimientos almacenados en sistemas de producción?", options: ["Porque centralizan y protegen la lógica de negocio dentro de la base de datos", "Porque eliminan la necesidad de bases de datos", "Porque cambian el idioma de las consultas", "Porque solo funcionan con una tabla"], correctOption: 0 },
	],
};

const sqlA4: LessonContent = {
	introduction: "Las transacciones garantizan que un conjunto de operaciones se ejecute de forma completa o no se ejecute en absoluto, protegiendo la integridad de los datos. En esta clase aprenderás COMMIT y ROLLBACK, niveles de aislamiento y permisos de acceso.",
	keyConcepts: [
		"Una transacción agrupa varias operaciones SQL para que se ejecuten todas juntas o ninguna.",
		"COMMIT confirma los cambios de una transacción de forma permanente.",
		"ROLLBACK deshace todos los cambios de una transacción si algo falla.",
		"Los niveles de aislamiento controlan cómo las transacciones concurrentes se afectan entre sí, por ejemplo evitando lecturas sucias.",
		"Los permisos de acceso (GRANT/REVOKE) determinan qué usuarios pueden leer, escribir o administrar una base de datos.",
	],
	realExample: { title: "Transferencia entre cuentas", description: "Una transferencia bancaria resta dinero de una cuenta y lo suma a otra dentro de una misma transacción; si falla el segundo paso, ROLLBACK deshace también el primero para no perder dinero." },
	practicalCase: { title: "Evitar una venta duplicada por fallo de conexión", description: "Un sistema de ventas usa una transacción para registrar la venta y descontar el stock; si la conexión falla antes de completar ambos pasos, ROLLBACK evita que se registre una venta sin descontar el stock." },
	guidedActivity: { title: "Diseña una transacción segura", instructions: "1) Diseña una transacción que incluya dos operaciones relacionadas, por ejemplo insertar una venta y actualizar un stock. 2) Simula un escenario exitoso terminando con COMMIT. 3) Simula un escenario de error y aplica ROLLBACK. 4) Investiga qué nivel de aislamiento usa por defecto el motor de base de datos que conoces." },
	reflectionQuestion: "¿Qué consecuencias tendría un sistema de ventas que no usara transacciones al registrar una compra?",
	imageUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
	imageAlt: "Ícono de bases de datos SQL",
	quiz: [
		{ prompt: "¿Qué agrupa una transacción?", options: ["Varias operaciones SQL para que se ejecuten todas juntas o ninguna", "Solo una operación de lectura", "Solo consultas SELECT", "Solo la creación de tablas"], correctOption: 0 },
		{ prompt: "¿Qué hace COMMIT?", options: ["Confirma los cambios de una transacción de forma permanente", "Deshace los cambios de una transacción", "Elimina una tabla", "Crea un nuevo índice"], correctOption: 0 },
		{ prompt: "¿Qué hace ROLLBACK?", options: ["Deshace todos los cambios de una transacción si algo falla", "Confirma los cambios de forma permanente", "Crea una vista nueva", "Elimina un procedimiento almacenado"], correctOption: 0 },
		{ prompt: "¿Qué controlan los niveles de aislamiento?", options: ["Cómo las transacciones concurrentes se afectan entre sí", "El color de las tablas", "El tipo de dato de una columna", "El idioma del motor de base de datos"], correctOption: 0 },
		{ prompt: "¿Qué instrucciones se usan para gestionar permisos de acceso?", options: ["GRANT y REVOKE", "COMMIT y ROLLBACK", "SELECT e INSERT", "CREATE y DROP"], correctOption: 0 },
		{ prompt: "En el ejemplo de la transferencia entre cuentas, ¿qué evitó ROLLBACK?", options: ["Perder dinero si fallaba el segundo paso", "Que la transacción se ejecutara más rápido", "Que se creara una tabla nueva", "Que se generara un índice"], correctOption: 0 },
		{ prompt: "En el caso de la venta duplicada, ¿qué dos operaciones se incluyeron en la transacción?", options: ["Registrar la venta y actualizar el stock", "Eliminar el cliente y crear un reporte", "Crear un índice y una vista", "Cambiar el permiso de un usuario"], correctOption: 0 },
		{ prompt: "¿Qué problema previenen los niveles de aislamiento?", options: ["Lecturas sucias u otros conflictos entre transacciones concurrentes", "La pérdida de índices", "El uso de procedimientos almacenados", "La necesidad de hacer COMMIT"], correctOption: 0 },
		{ prompt: "¿Qué determina GRANT/REVOKE?", options: ["Qué usuarios pueden leer, escribir o administrar una base de datos", "El tipo de dato de una tabla", "El nombre de un procedimiento", "El plan de ejecución de una consulta"], correctOption: 0 },
		{ prompt: "¿Por qué son esenciales las transacciones en sistemas financieros o de ventas?", options: ["Porque protegen la integridad de los datos ante fallos", "Porque hacen las consultas más cortas", "Porque eliminan la necesidad de índices", "Porque cambian el idioma del sistema"], correctOption: 0 },
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
	common("power-bi-basico", "B4", "Power BI Básico", "Básico", "5 semanas", "Dashboards reales conectando y modelando datos.", images.powerBi, "Construirás dashboards interactivos desde cero, conectando fuentes, limpiando datos y creando visualizaciones.", "Podrás apoyar decisiones comerciales y operativas con indicadores y paneles de resultados.", [module("Primeros pasos con Power BI", [lesson("Entorno y fuentes", ["Interfaz", "Importación de Excel y CSV", "Tipos de visualización"], pbiB1)]), module("Preparación y modelo de datos", [lesson("Datos listos para analizar", ["Limpieza básica", "Relaciones entre tablas", "Modelo estrella"], pbiB2)]), module("Dashboard final", [lesson("Indicadores para decisiones", ["Medidas básicas", "Filtros y segmentadores", "Publicación de un informe"], pbiB3)])]),
	common("power-bi-intermedio", "B5", "Power BI Intermedio", "Intermedio", "5 semanas", "Modela datos y crea medidas DAX intermedias para análisis más profundos.", images.powerBi, "Profundizarás en relaciones complejas, funciones DAX intermedias y técnicas de modelado para responder preguntas de negocio más avanzadas.", "Te permitirá construir modelos de datos escalables y métricas confiables para áreas comerciales, financieras u operativas.", [module("Modelado de datos intermedio", [lesson("Relaciones y cardinalidad", ["Relaciones activas e inactivas", "Cardinalidad uno a muchos", "Tablas de hechos y dimensiones"], pbiI1), lesson("Tabla calendario", ["Funciones de fecha", "Calendario personalizado", "Marcado como tabla de fechas"], pbiI2)]), module("DAX intermedio", [lesson("Funciones CALCULATE y filtros", ["CALCULATE", "ALL y ALLSELECTED", "Contexto de fila y de filtro"], pbiI3), lesson("Medidas de tiempo", ["Comparativos año contra año", "Acumulados", "Variaciones porcentuales"], pbiI4)])]),
	common("power-bi-avanzado", "B6", "Power BI Avanzado", "Avanzado", "6 semanas", "Seguridad, rendimiento y publicación profesional de soluciones en Power BI.", images.powerBi, "Aprenderás seguridad a nivel de fila, optimización del modelo y buenas prácticas para publicar y gobernar informes en Power BI Service.", "Te permitirá liderar proyectos de Business Intelligence con informes seguros, escalables y bien gobernados en una organización.", [module("Seguridad y gobierno de datos", [lesson("Seguridad a nivel de fila (RLS)", ["Roles estáticos y dinámicos", "Pruebas de roles", "Buenas prácticas de acceso"], pbiA1), lesson("Publicación en Power BI Service", ["Workspaces", "Actualización programada", "Permisos y distribución"], pbiA2)]), module("Optimización y DAX avanzado", [lesson("Rendimiento del modelo", ["Reducción de columnas", "Variables en DAX", "Análisis de rendimiento"], pbiA3), lesson("DAX avanzado", ["Funciones iteradoras", "Tablas virtuales", "Patrones de análisis de negocio"], pbiA4)])]),
	// SQL
	common("sql-basico", "B7", "SQL Básico", "Básico", "4 semanas", "Consultas, filtros y relaciones entre tablas.", images.sql, "Aprenderás a consultar bases de datos con SQL, seleccionar información relevante y unir tablas.", "Es una competencia clave para analistas y equipos que extraen información de sistemas empresariales.", [module("Consultas básicas", [lesson("Leer información", ["SELECT", "WHERE", "ORDER BY y LIMIT"], sqlB1)]), module("Cruce y resumen de datos", [lesson("Relaciones", ["JOIN", "GROUP BY", "Funciones de agregación"], sqlB2)]), module("Consultas para decisiones", [lesson("Análisis práctico", ["Subconsultas", "Indicadores", "Caso de negocio"], sqlB3)])]),
	common("sql-intermedio", "B8", "SQL Intermedio", "Intermedio", "4 semanas", "Combina, agrupa y organiza consultas más complejas con SQL.", images.sql, "Profundizarás en joins múltiples, subconsultas y funciones para responder preguntas de negocio con consultas más elaboradas.", "Te permitirá construir reportes y análisis que combinan varias tablas de un sistema empresarial.", [module("Combinar múltiples tablas", [lesson("Joins avanzados", ["INNER y LEFT JOIN combinados", "Uniones de tres o más tablas", "Alias y legibilidad"], sqlI1), lesson("Subconsultas", ["Subconsultas en WHERE", "Subconsultas correlacionadas", "Subconsultas en el FROM"], sqlI2)]), module("Funciones y organización de datos", [lesson("Funciones de ventana básicas", ["ROW_NUMBER", "RANK", "Particiones con PARTITION BY"], sqlI3), lesson("Vistas y CTE", ["Common Table Expressions", "Vistas reutilizables", "Consultas legibles"], sqlI4)])]),
	common("sql-avanzado", "B9", "SQL Avanzado", "Avanzado", "5 semanas", "Optimiza consultas y trabaja con procedimientos y transacciones.", images.sql, "Aprenderás optimización de consultas, funciones de ventana avanzadas, procedimientos almacenados y control de transacciones.", "Te permitirá administrar bases de datos de producción y construir consultas de alto rendimiento.", [module("Rendimiento y análisis avanzado", [lesson("Funciones de ventana avanzadas", ["LAG y LEAD", "Acumulados y promedios móviles", "Percentiles"], sqlA1), lesson("Optimización de consultas", ["Índices", "Planes de ejecución", "Buenas prácticas de rendimiento"], sqlA2)]), module("Procedimientos y transacciones", [lesson("Procedimientos almacenados", ["Parámetros", "Reutilización de lógica", "Control de errores"], sqlA3), lesson("Transacciones y seguridad", ["COMMIT y ROLLBACK", "Niveles de aislamiento", "Permisos de acceso"], sqlA4)])]),
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

