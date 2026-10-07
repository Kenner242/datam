"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase/client";
import { Building2, CheckCircle2 } from "lucide-react";

export default function InstitutionsPage() {
  const [organization, setOrganization] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    const { error: insertError } = await supabase.from("institution_requests").insert({
      organization: organization.trim(),
      contact_name: contactName.trim(),
      email: email.trim(),
      students_count: students.trim() ? Number(students) : null,
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
            <p className="data-cell-header">DataM para instituciones</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">Capacita a tu institución con rutas verificables.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
              Colegios, institutos y empresas gestionan grupos, asignan cursos y consultan reportes de aprendizaje con licencias institucionales.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-14">
          {submitted ? (
            <div className="data-cell p-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
              <h2 className="mt-4 font-display text-xl font-bold text-ink">Solicitud recibida</h2>
              <p className="mt-2 text-sm text-muted">Te contactaremos en menos de 48 horas para coordinar la demostración de DataM Institucional.</p>
              <Link href="/" className="mt-6 inline-flex rounded-cell bg-ink px-5 py-3 text-sm font-bold text-white">Volver al inicio</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="data-cell flex flex-col gap-4 p-6 sm:p-8">
              <p className="data-cell-header">Solicitar demostración</p>
              <label className="flex flex-col gap-1 text-sm">Institución u organización
                <input required value={organization} onChange={(e) => setOrganization(e.target.value)} className="rounded-cell border border-line px-3 py-2" placeholder="Colegio, instituto o empresa" />
              </label>
              <label className="flex flex-col gap-1 text-sm">Persona de contacto
                <input required value={contactName} onChange={(e) => setContactName(e.target.value)} className="rounded-cell border border-line px-3 py-2" placeholder="Nombre y apellido" />
              </label>
              <label className="flex flex-col gap-1 text-sm">Correo institucional
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-cell border border-line px-3 py-2" placeholder="contacto@institucion.edu.pe" />
              </label>
              <label className="flex flex-col gap-1 text-sm">Número estimado de estudiantes
                <input type="number" min={1} value={students} onChange={(e) => setStudents(e.target.value)} className="rounded-cell border border-line px-3 py-2" placeholder="Ej. 150" />
              </label>
              <label className="flex flex-col gap-1 text-sm">¿Qué necesitas?
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="rounded-cell border border-line px-3 py-2" placeholder="Cursos, reportes, integración, presupuesto..." />
              </label>
              <button type="submit" disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2 rounded-cell bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-accent disabled:opacity-60">
                <Building2 className="h-4 w-4" /> {loading ? "Enviando..." : "Solicitar demostración"}
              </button>
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
