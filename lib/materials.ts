import fs from "node:fs";
import path from "node:path";

export type MaterialType = "plantilla" | "guia" | "solucion";
export type LessonMaterial = { label: string; href: string; sizeKB: number; ext: string };
export type LessonMaterials = Partial<Record<MaterialType, LessonMaterial>>;

const MATERIAL_LABELS: Record<MaterialType, string> = {
	plantilla: "Archivo de trabajo",
	guia: "Guía y resumen",
	solucion: "Solución final",
};

const FILENAME_PATTERN = /^(\d{2})-(\d{2})-(plantilla|guia|solucion)\.([a-zA-Z0-9]+)$/;
const materialsRoot = path.join(process.cwd(), "public", "materiales");

// Escanea public/materiales/{slug} y agrupa los archivos por clase (modulo-clase).
export function getCourseMaterials(slug: string): Record<string, LessonMaterials> {
	const courseDir = path.join(materialsRoot, slug);
	const result: Record<string, LessonMaterials> = {};
	if (!fs.existsSync(courseDir)) return result;

	const files = fs.readdirSync(courseDir, { withFileTypes: true }).filter((entry) => entry.isFile());

	for (const file of files) {
		const match = file.name.match(FILENAME_PATTERN);
		if (!match) continue;
		const [, moduleNum, lessonNum, type, ext] = match;
		const key = `${moduleNum}-${lessonNum}`;
		const materialType = type as MaterialType;
		const stats = fs.statSync(path.join(courseDir, file.name));

		result[key] = {
			...result[key],
			[materialType]: {
				label: MATERIAL_LABELS[materialType],
				href: `/materiales/${slug}/${encodeURIComponent(file.name)}`,
				sizeKB: Math.max(1, Math.round(stats.size / 1024)),
				ext: ext.toUpperCase(),
			},
		};
	}

	return result;
}

export function lessonMaterialsKey(moduleIndex: number, lessonIndex: number) {
	return `${String(moduleIndex + 1).padStart(2, "0")}-${String(lessonIndex + 1).padStart(2, "0")}`;
}
