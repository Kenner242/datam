"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error("Supabase login error:", authError);
      setError(
        authError.message.toLowerCase().includes("invalid login credentials")
          ? "El correo o la contraseña no son correctos."
          : authError.message.toLowerCase().includes("email not confirmed")
            ? "Confirma tu correo electrónico antes de iniciar sesión."
            : authError.message,
      );
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handlePasswordRecovery() {
    if (!email) {
      setError("Escribe tu correo para enviarte un enlace de recuperación.");
      return;
    }
    setError("");
    setMessage("");
    setIsRecovering(true);
    const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (recoveryError) setError(recoveryError.message);
    else setMessage("Te enviamos un enlace para crear una nueva contraseña.");
    setIsRecovering(false);
  }

  return (
    <>
      <Navbar />
      <section className="mx-auto flex max-w-md flex-col px-6 py-20">
        <span className="data-cell-header">Acceso</span>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">
          Iniciar sesión
        </h1>

        <form onSubmit={handleSubmit} className="data-cell mt-6 flex flex-col gap-4 p-6">
          <label className="flex flex-col gap-1 text-sm">
            Correo electrónico
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-cell border border-line bg-base px-3 py-2 text-sm outline-none focus:border-accent"
              placeholder="tucorreo@ejemplo.com"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Contraseña
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-cell border border-line bg-base px-3 py-2 text-sm outline-none focus:border-accent"
              placeholder="••••••••"
            />
          </label>
          <button type="button" onClick={handlePasswordRecovery} disabled={isRecovering} className="self-start text-sm font-medium text-accent hover:underline">
            {isRecovering ? "Enviando enlace..." : "¿Olvidaste tu contraseña?"}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-cell bg-ink py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          {message && <p role="status" className="text-sm text-green-700">{message}</p>}
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-medium text-accent hover:underline">
            Regístrate
          </Link>
        </p>
      </section>
    </>
  );
}
