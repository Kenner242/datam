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

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === "TU_CLAVE_REAL_DE_GOOGLE_AI_STUDIO" || apiKey === "tu_clave_de_google_ai_studio") {
      return NextResponse.json({ error: "Dax no tiene una clave real de Gemini. Reemplaza el valor de GEMINI_API_KEY en .env.local y Vercel." }, { status: 503 });
    }

    const configuredModel = process.env.GEMINI_MODEL?.trim();
    const model = !configuredModel || configuredModel === "gemini-1.5-flash" || configuredModel === "gemini-1.5-flash-latest"
      ? "gemini-2.5-flash"
      : configuredModel;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { role: "system", parts: [{ text: buildSystemPrompt(body.language ?? "es-PE", body.courseSlug) }] },
        contents: messages.map(({ role, content }) => ({ role: role === "assistant" ? "model" : "user", parts: [{ text: content }] })),
        generationConfig: { temperature: 0.6, maxOutputTokens: 700 },
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      console.error("Gemini request failed", { status: response.status, model });
      const errorMessage = response.status === 400
        ? "Gemini rechazó la solicitud. Revisa el modelo configurado en Vercel."
        : response.status === 401 || response.status === 403
          ? "La clave de Gemini no es válida o no tiene permisos. Genera una nueva clave."
          : response.status === 404
            ? `El modelo ${model} no está disponible para esta API key.`
            : "Gemini no respondió correctamente. Intenta nuevamente en unos segundos.";
      return NextResponse.json({ error: errorMessage }, { status: 502 });
    }
    const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    return NextResponse.json({ reply: reply || "No pude generar una respuesta. Intenta de nuevo." });
  } catch {
    return NextResponse.json({ error: "No pude procesar la consulta de Dax." }, { status: 500 });
  }
}
