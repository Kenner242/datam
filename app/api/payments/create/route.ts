import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/server";

// Crea un cargo en Culqi (tarjetas, Yape y Plin) para el plan Premium.
// Culqi tokeniza la tarjeta en el cliente; el servidor solo recibe el token y confirma el cargo.
// El plan se activa únicamente cuando el cargo queda confirmado.

const PLAN_PRICES: Record<string, { amount: number; title: string }> = {
  premium: { amount: 1900, title: "DataM Premium (1 mes)" }, // centavos: 1900 = S/ 19
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { plan?: string; tokenId?: string; email?: string };
    const plan = body.plan ?? "premium";
    const price = PLAN_PRICES[plan];
    if (!price) return NextResponse.json({ error: "Plan no válido." }, { status: 400 });
    if (!body.tokenId) return NextResponse.json({ error: "Falta el token de pago generado por Culqi." }, { status: 400 });

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Debes iniciar sesión para actualizar tu plan." }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) return NextResponse.json({ error: "Configuración de Supabase incompleta." }, { status: 500 });

    const userClient = createClient(supabaseUrl, anonKey);
    const { data: userData, error: userError } = await userClient.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Sesión no válida. Vuelve a iniciar sesión." }, { status: 401 });
    }

    const culqiKey = process.env.CULQI_SECRET_KEY;
    if (!culqiKey) {
      return NextResponse.json({ error: "El proveedor de pagos no está configurado. Añade CULQI_SECRET_KEY en las variables de entorno." }, { status: 503 });
    }

    // Crear el cargo en Culqi
    const chargeResponse = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${culqiKey}` },
      body: JSON.stringify({
        amount: price.amount,
        currency_code: "PEN",
        email: body.email ?? userData.user.email,
        source_id: body.tokenId,
        description: price.title,
        metadata: { user_id: userData.user.id, plan },
      }),
    });

    const charge = (await chargeResponse.json()) as { id?: string; outcome?: { type?: string }; object?: string };

    if (!chargeResponse.ok || charge.outcome?.type !== "venta_exitosa") {
      return NextResponse.json({ error: "El pago fue rechazado. Revisa tu tarjeta o saldo e inténtalo de nuevo." }, { status: 402 });
    }

    // Activar el plan solo cuando el cargo está confirmado
    const service = createServiceClient();
    const reference = `culqi-${charge.id}`;
    const { data: existing } = await service.from("subscriptions").select("id").eq("provider_reference", reference).maybeSingle();
    if (!existing) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      await service.from("subscriptions").insert({
        user_id: userData.user.id,
        plan,
        status: "active",
        provider: "culqi",
        provider_reference: reference,
        expires_at: expiresAt.toISOString(),
      });
      await service.from("profiles").update({ plan }).eq("id", userData.user.id);
    }

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Culqi payment failed:", error);
    return NextResponse.json({ error: "No se pudo procesar el pago. Intenta nuevamente." }, { status: 500 });
  }
}
