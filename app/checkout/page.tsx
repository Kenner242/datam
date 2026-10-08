"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUserSafely } from "@/lib/supabase/session";
import { ShieldCheck } from "lucide-react";

const PLAN_DETAILS: Record<string, { name: string; price: string; amount: number; description: string; includes: string[] }> = {
  premium: {
    name: "Plan Premium",
    price: "S/ 19",
    amount: 1900,
    description: "Acceso completo a todos los cursos, certificados verificables, laboratorios avanzados y Dax IA ampliado.",
    includes: ["Todos los cursos", "Certificados verificables", "Laboratorios avanzados", "Dax IA ampliado", "Proyectos revisados", "Seguimiento avanzado"],
  },
};

declare global {
  interface Window {
    Culqi?: {
      publicKey: string;
      settings: (options: { title: string; currency: string; amount: number }) => void;
      open: () => void;
      token?: { id: string };
    };
    culqi?: () => void;
  }
}

function loadCulqiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Culqi) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.culqi.com/js/v4";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Culqi."));
    document.head.appendChild(script);
  });
}

function CheckoutContent() {
  const params = useSearchParams();
  const plan = params.get("plan") ?? "premium";
  const details = PLAN_DETAILS[plan] ?? PLAN_DETAILS.premium;
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void getCurrentUserSafely().then(({ user }) => {
      if (user) setUserName((user.user_metadata.full_name as string | undefined) || user.email || "");
    });
  }, []);

  async function handlePay() {
    setLoading(true); setError("");
    try {
      const { user } = await getCurrentUserSafely();
      if (!user) { window.location.href = "/login?next=/checkout?plan=" + plan; return; }
      const { data: sessionData } = await (await import("@/lib/supabase/client")).supabase.auth.getSession();
      const sessionToken = sessionData.session?.access_token;
      if (!sessionToken) { window.location.href = "/login?next=/checkout?plan=" + plan; return; }

      const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
      if (!publicKey) {
        setError("Culqi no está configurado. Añade NEXT_PUBLIC_CULQI_PUBLIC_KEY en las variables de entorno.");
        setLoading(false);
        return;
      }

      await loadCulqiScript();
      if (!window.Culqi) throw new Error("Culqi no se cargó correctamente.");

      window.Culqi.publicKey = publicKey;
      window.Culqi.settings({ title: details.name, currency: "PEN", amount: details.amount });

      window.culqi = async () => {
        const tokenId = window.Culqi?.token?.id;
        if (!tokenId) {
          setError("No se generó el token de pago. Revisa los datos de tu tarjeta.");
          setLoading(false);
          return;
        }
        const response = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
          body: JSON.stringify({ plan, tokenId, email: user.email }),
        });
        const data = (await response.json()) as { success?: boolean; error?: string };
        if (!response.ok || !data.success) {
          setError(data.error ?? "El pago fue rechazado. Intenta con otro medio.");
          setLoading(false);
          return;
        }
        window.location.href = "/planes/estado?resultado=exito";
      };

      window.Culqi.open();
    } catch {
      setError("No se pudo conectar con el proveedor de pagos. Intenta nuevamente.");
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-14">
      <p className="data-cell-header">Confirmar compra</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink">Resumen de tu pedido</h1>

      <div className="mt-6 data-cell p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-lg font-bold text-ink">{details.name}</p>
            <p className="mt-1 text-sm text-muted">{details.description}</p>
          </div>
          <span className="font-display text-2xl font-bold text-ink">{details.price}</span>
        </div>
        <ul className="mt-4 space-y-2 border-t border-line pt-4">
          {details.includes.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-ink">
              <ShieldCheck className="h-4 w-4 shrink-0 text-green-600" /> {item}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4">
          <span className="font-bold text-ink">Total</span>
          <span className="font-display text-xl font-bold text-ink">{details.price}</span>
        </div>
      </div>

      <div className="mt-6 data-cell p-6">
        <p className="data-cell-header">Datos de facturación</p>
        {userName ? (
          <p className="mt-2 text-sm text-ink">Facturado a: <b>{userName}</b></p>
        ) : (
          <p className="mt-2 text-sm text-muted">Inicia sesión para continuar con tu compra.</p>
        )}
      </div>

      <div className="mt-6">
        <button type="button" onClick={handlePay} disabled={loading} className="w-full rounded-cell bg-ink px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-accent disabled:opacity-60">
          {loading ? "Abriendo pago seguro..." : `Pagar ${details.price} con Culqi`}
        </button>
        {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Pago seguro con Culqi. Aceptamos tarjetas, Yape y Plin. Los datos de tu tarjeta nunca pasan por DataM.
      </p>
      <div className="mt-4 text-center">
        <Link href="/planes" className="text-sm text-accent hover:underline">← Volver a planes</Link>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<main className="mx-auto max-w-2xl px-6 py-14 text-center text-sm text-muted">Cargando resumen...</main>}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </>
  );
}
