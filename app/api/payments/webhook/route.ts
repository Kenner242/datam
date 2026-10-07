import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Webhook de Mercado Pago: confirma pagos y activa el plan en el servidor.
// Nunca se confía en una señal del cliente; solo se actualiza cuando el proveedor confirma.

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { type?: string; data?: { id?: string } };
    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ received: true });
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: "Proveedor de pagos no configurado." }, { status: 503 });
    }

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!paymentResponse.ok) {
      return NextResponse.json({ error: "No se pudo verificar el pago con el proveedor." }, { status: 502 });
    }

    const payment = (await paymentResponse.json()) as {
      status?: string;
      external_reference?: string;
      id?: number;
    };

    if (payment.status !== "approved") {
      return NextResponse.json({ received: true, status: payment.status });
    }

    const [userId, plan] = (payment.external_reference ?? "").split(":");
    if (!userId || !plan) {
      return NextResponse.json({ error: "Referencia de pago inválida." }, { status: 400 });
    }

    const service = createServiceClient();

    // Evitar activaciones duplicadas por el mismo pago.
    const reference = `mp-${payment.id ?? body.data.id}`;
    const { data: existing } = await service
      .from("subscriptions")
      .select("id")
      .eq("provider_reference", reference)
      .maybeSingle();
    if (existing) return NextResponse.json({ received: true, duplicated: true });

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await service.from("subscriptions").insert({
      user_id: userId,
      plan,
      status: "active",
      provider: "mercadopago",
      provider_reference: reference,
      expires_at: expiresAt.toISOString(),
    });

    await service.from("profiles").update({ plan }).eq("id", userId);

    return NextResponse.json({ received: true, activated: true });
  } catch (error) {
    console.error("Payment webhook failed:", error);
    return NextResponse.json({ error: "Error al procesar la confirmación del pago." }, { status: 500 });
  }
}
