# Materiales descargables por curso

Aquí subes los archivos que los estudiantes podrán descargar dentro de cada clase (plantilla de trabajo, guía/resumen y solución final). No necesitas tocar código: entra a la carpeta del curso, módulo y clase correspondiente, luego copia tus archivos con uno de los nombres indicados abajo. La plataforma los mostrará automáticamente.

## Cómo nombrar cada archivo

La ruta se organiza así:

`{curso}/modulo-{nn}-{nombre}/clase-{nn}-{nombre}/{tipo}.{extension}`

- `tipo`: uno de estos 3 nombres exactos: `plantilla`, `guia`, `solucion`.
- `extension`: la que corresponda a tu archivo (`xlsx`, `pdf`, `docx`, `pbix`, `sql`, `py`, `ipynb`, `zip`, etc.).

Ejemplo para Excel Intermedio, Módulo 02, clase Dashboards en Excel:

```
excel-intermedio/
	modulo-02-analisis-y-visualizacion/
		clase-02-dashboards-en-excel/
			plantilla.xlsx
			guia.pdf
			solucion.xlsx
```

Puedes subir 1, 2 o los 3 archivos por clase. Si una clase no tiene archivos todavía, la plataforma muestra "Los materiales de esta clase estarán disponibles próximamente" — así que puedes ir subiendo material de forma progresiva sin romper nada.

## Carpetas ya creadas

Cada curso tiene sus carpetas de módulos y clases creadas dentro de `public/materiales/`, listas para recibir tus archivos. Usa la misma organización que en `public/videos/`.

### Excel
- `excel-basico/` — M01 Primeros pasos en Excel: C01 Interfaz y navegación · C02 Fórmulas básicas | M02 Organizar y presentar datos: C01 Tablas y formato · C02 Funciones esenciales
- `excel-intermedio/` — M01 Fundamentos para trabajar con datos: C01 Estructura de una base de datos · C02 Fórmulas esenciales | M02 Análisis y visualización: C01 Tablas dinámicas · C02 Dashboards en Excel | M03 Automatización aplicada: C01 Procesos eficientes
- `excel-avanzado/` — M01 Conectar y transformar datos: C01 Importación organizada · C02 Preparar datos con Power Query | M02 Fórmulas y modelado avanzado: C01 Fórmulas de nivel avanzado · C02 Power Pivot y modelo de datos | M03 Automatización con macros: C01 Macros y VBA básico

### Power BI
- `power-bi-basico/` — M01 Primeros pasos con Power BI: C01 Entorno y fuentes | M02 Preparación y modelo de datos: C01 Datos listos para analizar | M03 Dashboard final: C01 Indicadores para decisiones
- `power-bi-intermedio/` — M01 Modelado de datos intermedio: C01 Relaciones y cardinalidad · C02 Tabla calendario | M02 DAX intermedio: C01 Funciones CALCULATE y filtros · C02 Medidas de tiempo
- `power-bi-avanzado/` — M01 Seguridad y gobierno de datos: C01 Seguridad a nivel de fila (RLS) · C02 Publicación en Power BI Service | M02 Optimización y DAX avanzado: C01 Rendimiento del modelo · C02 DAX avanzado

### SQL
- `sql-basico/` — M01 Consultas básicas: C01 Leer información | M02 Cruce y resumen de datos: C01 Relaciones | M03 Consultas para decisiones: C01 Análisis práctico
- `sql-intermedio/` — M01 Combinar múltiples tablas: C01 Joins avanzados · C02 Subconsultas | M02 Funciones y organización de datos: C01 Funciones de ventana básicas · C02 Vistas y CTE
- `sql-avanzado/` — M01 Rendimiento y análisis avanzado: C01 Funciones de ventana avanzadas · C02 Optimización de consultas | M02 Procedimientos y transacciones: C01 Procedimientos almacenados · C02 Transacciones y seguridad

### Python
- `python-basico/` — M01 Fundamentos del lenguaje: C01 Variables y tipos de datos · C02 Estructuras de control | M02 Estructuras de datos y funciones: C01 Listas y diccionarios · C02 Funciones propias
- `python-intermedio/` — M01 Python y pensamiento lógico: C01 Bases del lenguaje | M02 Análisis con Pandas: C01 Trabajar con datos | M03 Proyecto de análisis: C01 Reporte automatizado
- `python-avanzado/` — M01 Programación orientada a objetos: C01 Clases y objetos · C02 Buenas prácticas de código | M02 Automatización y conexión de datos: C01 Consumo de APIs · C02 Automatización de procesos

### Inglés
- `ingles-basico/` — M01 Bases del idioma: C01 Presentaciones y saludos · C02 Presente simple | M02 Comunicación cotidiana: C01 Vocabulario funcional · C02 Conversaciones simples
- `ingles-intermedio/` — M01 Gramática intermedia: C01 Pasado simple y continuo · C02 Futuro y condicionales | M02 Inglés para el trabajo: C01 Correos y mensajes · C02 Conversación profesional
- `ingles-avanzado/` — M01 Comunicación profesional avanzada: C01 Redacción avanzada · C02 Presentaciones efectivas | M02 Negociación y fluidez: C01 Negociación en inglés · C02 Fluidez y matices

### Cursos únicos (sin niveles)
- `programacion-desarrollo-web/` — M01 Fundamentos de la web: C01 Cómo funciona una página · C02 Primer proyecto | M02 Diseño y estilos: C01 CSS desde cero · C02 Diseño responsive | M03 Interactividad y publicación: C01 JavaScript básico · C02 Publicar un sitio
- `introduccion-a-la-ia/` — M01 Comprender la IA: C01 Conceptos esenciales | M02 IA para aprender y trabajar: C01 Herramientas responsables | M03 Proyecto aplicado: C01 Solución con IA
- `investigacion-aplicada/` — M01 Bases de la investigación: C01 Del problema a la pregunta · C02 Objetivos y variables | M02 Fuentes y metodología: C01 Buscar información confiable · C02 Diseño metodológico | M03 Análisis y presentación: C01 Resultados y conclusiones
- `finanzas-para-emprendedores/` — M01 Orden financiero: C01 Ingresos y gastos · C02 Presupuesto | M02 Costos y precios: C01 Conocer los costos · C02 Definir precios | M03 Decisiones y crecimiento: C01 Flujo de caja · C02 Indicadores básicos

Ejemplo completo para "Excel Intermedio", clase "Dashboards en Excel" (módulo 02, clase 02):

```
public/materiales/excel-intermedio/02-02-plantilla.xlsx
public/materiales/excel-intermedio/02-02-guia.pdf
public/materiales/excel-intermedio/02-02-solucion.xlsx
```
