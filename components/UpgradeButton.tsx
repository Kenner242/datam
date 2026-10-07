"use client";

import { useState } from "react";
import { getCurrentUserSafely } from "@/lib/supabase/session";

// Usa el widget oficial de Culqi (Culqi.js) para tokenizar la tarjeta.
// Los datos de la tarjeta nunca pasan por los servidores de DataM.

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

export default function UpgradeButton({ plan = "premium" }: { plan?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    setLoading(true); setError("");
    try {
      const { user } = await getCurrentUserSafely();
      if (!user) { window.location.href = "/login?next=/planes"; return; }
      const { data: sessionData } = await (await import("@/lib/supabase/client")).supabase.auth.getSession();
      const sessionToken = sessionData.session?.access_token;
      if (!sessionToken) { window.location.href = "/login?next=/planes"; return; }

      const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
      if (!publicKey) {
        setError("Culqi no está configurado. Añade NEXT_PUBLIC_CULQI_PUBLIC_KEY en las variables de entorno.");
        setLoading(false);
        return;
      }

      await loadCulqiScript();
      if (!window.Culqi) throw new Error("Culqi no se cargó correctamente.");

      window.Culqi.publicKey = publicKey;
      window.Culqi.settings({ title: "DataM Premium", currency: "PEN", amount: 1900 });

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
    <div>
      <button type="button" onClick={handleUpgrade} disabled={loading} className="w-full rounded-cell bg-ink px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-accent disabled:opacity-60">
        {loading ? "Abriendo pago seguro..." : "Actualizar a Premium"}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-center text-xs text-muted">Paga con tarjeta, Yape o Plin de forma segura con Culqi.</p>
    </div>
  );
}
