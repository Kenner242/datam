import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/lib/courses";

type ChatMessage = { role: "user" | "assistant"; content: string };

type DaxRequest = {
  messages?: ChatMessage[];
  language?: "es-PE" | "qu-PE";
  courseSlug?: string;
};

function buildSystemPrompt(language: "es-PE" | "qu-PE", courseSlug?: string) {
  const course = courses.find((item) => item.slug === courseSlug);
  const catalog = courses.map((item) => `- ${item.title}: ${item.description}`).join("\n");
  const courseContext = course ? `Curso actual: ${course.title}. Perfil de egreso: ${course.graduateProfile ?? "No definido"}.` : "El estudiante no indicó un curso específico.";
  const languageInstruction = language === "qu-PE"
    ? "Responde en quechua peruano cuando puedas hacerlo con precisión. Si un término técnico no tiene una traducción clara, conserva el término original y explícalo brevemente en español."
    : "Responde en español claro, con ejemplos cercanos al contexto peruano cuando ayuden.";

  return `Eres Dax, el tutor virtual de DataM, una plataforma peruana de educación tecnológica. ${languageInstruction}
${courseContext}

Catálogo disponible:
${catalog}

Reglas:
- Explica de forma breve, amable y paso a paso.
- Prioriza ejemplos y acciones que el estudiante pueda practicar.
- No inventes cursos, funciones, resultados ni certificaciones.
- No entregues respuestas académicas sin explicar el razonamiento.
- Si falta información, pide el curso, módulo o tema antes de asumir.
- No solicites contraseñas, claves API ni datos personales sensibles.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DaxRequest;
    const messages = body.messages?.filter((message) => message.content.trim()).slice(-12);
    if (!messages?.length) return NextResponse.json({ error: "Escribe una consulta para Dax." }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Dax aún no está configurado en el servidor." }, { status: 503 });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
        max_tokens: 700,
        system: buildSystemPrompt(body.language ?? "es-PE", body.courseSlug),
        messages: messages.map(({ role, content }) => ({ role: role === "assistant" ? "assistant" : "user", content })),
      }),
    });

    if (!response.ok) return NextResponse.json({ error: "El servicio de Dax no respondió correctamente." }, { status: 502 });
    const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
    const reply = data.content?.filter((block) => block.type === "text").map((block) => block.text ?? "").join("\n").trim();
    return NextResponse.json({ reply: reply || "No pude generar una respuesta. Intenta de nuevo." });
  } catch {
    return NextResponse.json({ error: "No pude procesar la consulta de Dax." }, { status: 500 });
  }
}
