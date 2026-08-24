"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase/client";
import { courses } from "@/lib/courses";

type Enrollment = { course_slug: string };

export default function AdminPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user || auth.user.email?.toLowerCase() !== process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()) {
        router.replace("/login");
        return;
      }
      const { data, error: queryError } = await supabase.from("enrollments").select("course_slug");
      if (queryError) setError(queryError.message);
      const nextCounts: Record<string, number> = {};
      ((data as Enrollment[] | null) ?? []).forEach((row) => { nextCounts[row.course_slug] = (nextCounts[row.course_slug] ?? 0) + 1; });
      setCounts(nextCounts);
      setIsLoading(false);
    }
    void load();
  }, [router]);

  return <><Navbar /><main className="mx-auto max-w-6xl px-6 py-16"><span className="data-cell-header">Administración</span><h1 className="mt-2 font-display text-3xl font-bold text-ink">Estudiantes por curso</h1><p className="mt-2 text-sm text-muted">Cantidad de matrículas reales registradas en DataM.</p>{isLoading ? <p className="mt-8 text-sm text-muted">Cargando matrículas...</p> : error ? <p role="alert" className="mt-8 text-sm text-red-700">{error}</p> : <div className="mt-8 grid gap-4 md:grid-cols-3">{courses.map((course) => <article key={course.slug} className="data-cell p-5"><p className="data-cell-header">{course.code}</p><h2 className="mt-2 font-display font-bold text-ink">{course.title}</h2><p className="mt-4 font-display text-3xl font-bold text-blue-700">{counts[course.slug] ?? 0}</p><p className="text-sm text-muted">estudiantes inscritos</p></article>)}</div>}</main></>;
}
