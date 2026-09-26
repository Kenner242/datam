import { NextRequest, NextResponse } from "next/server";
import { generateLessonMaterials } from "@/lib/contentStudio";
import type { LessonContent } from "@/lib/courses";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-key", { global: { headers: { Authorization: request.headers.get("Authorization") ?? "" } } });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError && /jwt.{0,40}(issued|future)|issued.{0,40}future|token.{0,40}future/i.test(authError.message)) {
      return NextResponse.json({ error: "Tu token de sesión tiene una fecha futura. Sincroniza la fecha y hora del equipo y vuelve a iniciar sesión." }, { status: 401 });
    }
    if (!user) return NextResponse.json({ error: "Debes iniciar sesión para generar materiales." }, { status: 401 });
    const role = user.app_metadata?.role;
    if (role !== "admin" && role !== "creator") return NextResponse.json({ error: "No tienes permisos para generar materiales." }, { status: 403 });
    const body = (await request.json()) as { lessonContent?: LessonContent };
    if (!body.lessonContent) return NextResponse.json({ error: "Falta el contenido de la lección." }, { status: 400 });
    const materials = await generateLessonMaterials(body.lessonContent);
    return NextResponse.json({ materials });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron generar los materiales.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
