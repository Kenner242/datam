"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase/client";
import { CheckCircle2, Handshake } from "lucide-react";

export default function AlianzasPage() {
  const [organization, setOrganization] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [seats, setSeats] = useState("");
  const [program, setProgram] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    const { error: insertError } = await supabase.from("sponsorship_requests").insert({
      organization: organization.trim(),
      contact_name: contactName.trim(),
      email: email.trim(),
      seats_count: seats.trim() ? Number(seats) : null,
      program: program.trim(),
      message: message.trim(),
    });
    if (insertError) { setError(insertError.message); setLoading(false); return; }
    setSubmitted(true); setLoading(false);
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-blue-200 bg-blue-50">
          <div className="mx-auto max-w-6xl px-6 py-14 text-center">
            <p className="data-cell-header">DataM Impacto</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">Alianzas y patrocinio educativo</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
              Empresas y fundaciones financian cupos gratuitos para estudiantes que no pueden pagar. Tú eliges el programa; nosotros lo administramos y medimos el impacto.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Cómo funciona</h2>
              <ol className="mt-5 space-y-4 text-sm leading-6 text-muted">
                <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">1</span><span>Eliges el programa formativo (ej. "Analista de Datos Junior") y el número de cupos a financiar.</span></li>
                <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">2</span><span>DataM administra las inscripciones y ofrece la formación gratuita a los beneficiarios.</span></li>
                <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">3</span><span>Recibes un informe agregado de participación y finalización, sin datos personales de los estudiantes.</span></li>
              </ol>
              <div className="mt-6 rounded-cell border border-line bg-panel p-5">
                <p className="data-cell-header">Programas disponibles para patrocinio</p>
                <ul className="mt-3 space-y-2 text-sm text-ink">
                  <li>• Analista de Datos Junior (Excel + SQL + Power BI)</li>
                  <li>• Programador Python Inicial</li>
                  <li>• Asistente Administrativo Digital (Excel + Inglés)</li>
                  <li>• Investigador Académico (Biblioteca IA + Estadística)</li>
                </ul>
              </div>
            </div>

            {submitted ? (
              <div className="data-cell p-8 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
                <h2 className="mt-4 font-display text-xl font-bold text-ink">Solicitud recibida</h2>
                <p className="mt-2 text-sm text-muted">Te contactaremos para coordinar el programa patrocinado y los cupos financiados.</p>
                <Link href="/" className="mt-6 inline-flex rounded-cell bg-ink px-5 py-3 text-sm font-bold text-white">Volver al inicio</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="data-cell flex flex-col gap-4 p-6 sm:p-8">
                <p className="data-cell-header">Financiar cupos educativos</p>
                <label className="flex flex-col gap-1 text-sm">Empresa o fundación
                  <input required value={organization} onChange={(e) => setOrganization(e.target.value)} className="rounded-cell border border-line px-3 py-2" placeholder="Nombre de la organización" />
                </label>
                <label className="flex flex-col gap-1 text-sm">Persona de contacto
                  <input required value={contactName} onChange={(e) => setContactName(e.target.value)} className="rounded-cell border border-line px-3 py-2" placeholder="Nombre y apellido" />
                </label>
                <label className="flex flex-col gap-1 text-sm">Correo
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-cell border border-line px-3 py-2" placeholder="contacto@empresa.com" />
                </label>
                <label className="flex flex-col gap-1 text-sm">Cupos a financiar
                  <input required type="number" min={1} value={seats} onChange={(e) => setSeats(e.target.value)} className="rounded-cell border border-line px-3 py-2" placeholder="Ej. 200" />
                </label>
                <label className="flex flex-col gap-1 text-sm">Programa a patrocinar
                  <input required value={program} onChange={(e) => setProgram(e.target.value)} className="rounded-cell border border-line px-3 py-2" placeholder="Ej. Analista de Datos Junior" />
                </label>
                <label className="flex flex-col gap-1 text-sm">Mensaje adicional
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="rounded-cell border border-line px-3 py-2" placeholder="Objetivos, plazos, presupuesto..." />
                </label>
                <button type="submit" disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2 rounded-cell bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-accent disabled:opacity-60">
                  <Handshake className="h-4 w-4" /> {loading ? "Enviando..." : "Solicitar patrocinio"}
                </button>
                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
