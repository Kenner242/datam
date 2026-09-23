import type { LessonContent } from "@/lib/courses";

export type SlideOutline = { title: string; bullets: string[] };
export type MindMapBranch = { label: string; children: string[] };
export type MindMap = { root: string; branches: MindMapBranch[]; plainText: string };
export type GeneratedFlashcard = { question: string; answer: string };
export type GeneratedLessonMaterials = {
  slidesOutline: SlideOutline[];
  mindMap: MindMap;
  flashcards: GeneratedFlashcard[];
  textbookSummary: string;
};

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? text;
  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("La IA no devolvió un objeto JSON válido.");
  return fenced.slice(start, end + 1);
}

export function buildContentStudioPrompt(lesson: LessonContent) {
  return `Genera materiales educativos derivados SOLO de esta lección. Devuelve únicamente JSON válido, sin markdown ni texto adicional.

Lección:
Introducción: ${lesson.introduction}
Conceptos clave: ${lesson.keyConcepts.join(" | ")}
Ejemplo real: ${lesson.realExample.title} - ${lesson.realExample.description}

Contrato exacto:
{
  "slidesOutline": [{"title":"string","bullets":["string","string"]}],
  "mindMap": {"root":"string","branches":[{"label":"string","children":["string"]}],"plainText":"string"},
  "flashcards": [{"question":"string","answer":"string"}],
  "textbookSummary": "300 a 500 palabras"
}

Reglas: 5 a 8 diapositivas, 3 a 5 ramas, 8 a 12 flashcards. No copies literalmente las preguntas del quiz existente. No generes guidedActivity ni quiz. Usa español claro y accesible para estudiantes peruanos. La versión plainText debe ser legible por lectores de pantalla y bajo consumo de datos.`;
}

export async function generateLessonMaterials(lesson: LessonContent): Promise<GeneratedLessonMaterials> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("Falta GEMINI_API_KEY en el entorno del servidor.");
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: buildContentStudioPrompt(lesson) }] }], generationConfig: { temperature: 0.35, responseMimeType: "application/json" } }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error("La IA no pudo generar los materiales.");
  const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  return JSON.parse(extractJson(text)) as GeneratedLessonMaterials;
}
