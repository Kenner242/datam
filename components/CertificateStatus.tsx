"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Printer } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Course } from "@/lib/courses";

export default function CertificateStatus({ course }: { course: Course }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isEligible, setIsEligible] = useState(false);
  const [studentName, setStudentName] = useState("Estudiante DataM");

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setStudentName((auth.user.user_metadata.full_name as string | undefined) || auth.user.email || "Estudiante DataM");

      const [{ data: attempts }, { data: project }] = await Promise.all([
        supabase.from("exam_attempts").select("passed").eq("user_id", auth.user.id).eq("course_slug", course.slug).eq("passed", true).limit(1),
        supabase.from("project_submissions").select("status").eq("user_id", auth.user.id).eq("course_slug", course.slug).eq("status", "approved").maybeSingle(),
      ]);
      setIsEligible(Boolean(attempts?.length && project));
      setIsLoading(false);
    }

    void load();
  }, [course.slug]);

  if (isLoading) return <main className="mx-auto max-w-4xl px-6 py-16"><p className="text-sm text-muted">Verificando requisitos del certificado...</p></main>;

  if (!isEligible) return <main className="mx-auto max-w-4xl px-6 py-16"><section className="data-cell p-7"><h1 className="font-display text-3xl font-bold text-ink">Certificado aún no disponible</h1><p className="mt-3 text-sm text-muted">Debes aprobar la evaluación final y recibir la aprobación de tu proyecto para habilitarlo.</p><Link href={`/cursos/${course.slug}/evaluacion`} className="mt-5 inline-flex rounded-cell bg-ink px-4 py-2 text-sm font-bold text-white">Ver estado de evaluación</Link></section></main>;

  return <main className="mx-auto max-w-4xl px-6 py-16"><section className="border-8 border-blue-950 bg-white p-8 text-center shadow-lg md:p-14"><p className="font-mono text-xs uppercase tracking-[0.18em] text-blue-700">DataM certifica que</p><h1 className="mt-7 font-display text-4xl font-bold text-ink md:text-5xl">{studentName}</h1><p className="mx-auto mt-7 max-w-lg text-sm leading-6 text-muted">ha completado satisfactoriamente la ruta académica, la evaluación final y el proyecto práctico del curso</p><h2 className="mt-5 font-display text-3xl font-bold text-blue-800">{course.title}</h2><p className="mt-5 text-sm text-muted">Emitido por DataM · {new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}</p><div className="mt-8 flex justify-center"><CheckCircle2 className="h-8 w-8 text-green-700" /></div></section><div className="mt-6 flex justify-center"><button onClick={() => window.print()} className="flex items-center gap-2 rounded-cell bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-accent"><Printer className="h-4 w-4" /> Imprimir o guardar como PDF</button></div></main>;
}
