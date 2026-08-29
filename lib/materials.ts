import fs from "node:fs";
import path from "node:path";
import type { LessonMaterials, MaterialType } from "@/lib/materialTypes";

const MATERIAL_LABELS: Record<MaterialType, string> = {
	plantilla: "Archivo de trabajo",
	guia: "Guía y resumen",
	solucion: "Solución final",
};

const MODULE_PATTERN = /^modulo-(\d{2})-/;
const LESSON_PATTERN = /^clase-(\d{2})-/;
const MATERIAL_PATTERN = /^(plantilla|guia|solucion)\.([a-zA-Z0-9]+)$/;
const materialsRoot = path.join(process.cwd(), "public", "materiales");

// Escanea public/materiales/{curso}/modulo-{nn}/clase-{nn} y agrupa los archivos por clase.
export function getCourseMaterials(slug: string): Record<string, LessonMaterials> {
	const courseDir = path.join(materialsRoot, slug);
	const result: Record<string, LessonMaterials> = {};
	if (!fs.existsSync(courseDir)) return result;

	for (const moduleEntry of fs.readdirSync(courseDir, { withFileTypes: true })) {
		const moduleMatch = moduleEntry.name.match(MODULE_PATTERN);
		if (!moduleEntry.isDirectory() || !moduleMatch) continue;
		const moduleDir = path.join(courseDir, moduleEntry.name);

		for (const lessonEntry of fs.readdirSync(moduleDir, { withFileTypes: true })) {
			const lessonMatch = lessonEntry.name.match(LESSON_PATTERN);
			if (!lessonEntry.isDirectory() || !lessonMatch) continue;
			const lessonDir = path.join(moduleDir, lessonEntry.name);
			const key = `${moduleMatch[1]}-${lessonMatch[1]}`;

			for (const file of fs.readdirSync(lessonDir, { withFileTypes: true })) {
				const materialMatch = file.name.match(MATERIAL_PATTERN);
				if (!file.isFile() || !materialMatch) continue;
				const [, type, ext] = materialMatch;
				const materialType = type as MaterialType;
				const stats = fs.statSync(path.join(lessonDir, file.name));

				result[key] = {
					...result[key],
					[materialType]: {
						label: MATERIAL_LABELS[materialType],
						href: `/materiales/${slug}/${encodeURIComponent(moduleEntry.name)}/${encodeURIComponent(lessonEntry.name)}/${encodeURIComponent(file.name)}`,
						sizeKB: Math.max(1, Math.round(stats.size / 1024)),
						ext: ext.toUpperCase(),
					},
				};
			}
		}
	}

	return result;
}
