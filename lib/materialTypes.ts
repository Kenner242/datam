// Tipos y helpers de materiales seguros para el cliente (sin fs/path).
export type MaterialType = "plantilla" | "guia" | "solucion";
export type LessonMaterial = { label: string; href: string; sizeKB: number; ext: string };
export type LessonMaterials = Partial<Record<MaterialType, LessonMaterial>>;

export function lessonMaterialsKey(moduleIndex: number, lessonIndex: number) {
	return `${String(moduleIndex + 1).padStart(2, "0")}-${String(lessonIndex + 1).padStart(2, "0")}`;
}
