"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUserSafely } from "@/lib/supabase/session";
import { supabase } from "@/lib/supabase/client";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

function PaymentStatusContent() {
  const params = useSearchParams();
  const resultado = params.get("resultado");
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getCurrentUserSafely().then(async ({ user }) => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
      setPlan((data?.plan as string | undefined) ?? "free");
      setLoading(false);
    });
  }, []);

  const isPremium = plan === "premium" || plan === "institutional";

  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center">
      {resultado === "exito" && (loading ? (
        <Clock3 className="mx-auto h-12 w-12 text-blue-500" />
      ) : isPremium ? (
        <>
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-5 font-display text-3xl font-bold text-ink">¡Premium activado!</h1>
          <p className="mt-3 text-sm text-muted">Tu plan ya está activo. Ahora tienes acceso a certificados verificables y funciones avanzadas.</p>
        </>
      ) : (
        <>
          <Clock3 className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="mt-5 font-display text-3xl font-bold text-ink">Pago recibido</h1>
          <p className="mt-3 text-sm text-muted">Estamos confirmando tu pago con el proveedor. Tu plan se activará automáticamente en unos segundos.</p>
        </>
      ))}
      {resultado === "pendiente" && (
        <>
          <Clock3 className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="mt-5 font-display text-3xl font-bold text-ink">Pago pendiente</h1>
          <p className="mt-3 text-sm text-muted">El pago está siendo procesado por el proveedor. Te avisaremos cuando se confirme.</p>
        </>
      )}
      {resultado === "fallo" && (
        <>
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-5 font-display text-3xl font-bold text-ink">El pago no se completó</h1>
          <p className="mt-3 text-sm text-muted">No se realizó ningún cobro. Puedes intentarlo nuevamente con otro medio de pago.</p>
        </>
      )}
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/dashboard" className="rounded-cell bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-accent">Ir a mi perfil</Link>
        <Link href="/planes" className="rounded-cell border border-line px-5 py-3 text-sm font-bold text-ink hover:border-accent">Ver planes</Link>
      </div>
    </section>
  );
}

export default function PaymentStatusPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<main className="mx-auto max-w-xl px-6 py-20 text-center text-sm text-muted">Verificando estado del pago...</main>}>
        <PaymentStatusContent />
      </Suspense>
      <Footer />
    </>
  );
}
