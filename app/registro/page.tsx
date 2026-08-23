"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase/client";

export default function RegistroPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (authError) {
      console.error("Supabase signup error:", authError);
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setMessage("Cuenta creada. Revisa tu correo para confirmar la dirección.");
    setIsLoading(false);
  }

  return (
    <>
      <Navbar />
      <section className="mx-auto flex max-w-md flex-col px-6 py-20">
        <span className="data-cell-header">Nueva cuenta</span>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">
          Crear cuenta en DataM
        </h1>

        <form onSubmit={handleSubmit} className="data-cell mt-6 flex flex-col gap-4 p-6">
          <label className="flex flex-col gap-1 text-sm">
            Nombre completo
            <input
              type="text"
              name="fullName"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="rounded-cell border border-line bg-base px-3 py-2 text-sm outline-none focus:border-accent"
              placeholder="Tu nombre"
            />
          </label>
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
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-cell border border-line bg-base px-3 py-2 text-sm outline-none focus:border-accent"
              placeholder="Mínimo 8 caracteres"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-cell bg-ink py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent"
          >
            {isLoading ? "Creando cuenta..." : "Registrarme"}
          </button>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          {message && <p role="status" className="text-sm text-green-700">{message}</p>}
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Inicia sesión
          </Link>
        </p>
      </section>
    </>
  );
}
