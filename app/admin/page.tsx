"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase/client";
import { courses } from "@/lib/courses";

type Enrollment = { course_slug: string };
type ProjectSubmission = { id: number; course_slug: string; project_url: string; notes: string | null; status: "pending" | "approved" | "changes_requested"; reviewer_note: string | null; created_at: string };

export default function AdminPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user || auth.user.email?.toLowerCase() !== process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()) {
        router.replace("/login");
        return;
      }
      const [{ data, error: queryError }, { data: projectData, error: projectError }] = await Promise.all([
        supabase.from("enrollments").select("course_slug"),
        supabase.from("project_submissions").select("id, course_slug, project_url, notes, status, reviewer_note, created_at").order("created_at", { ascending: false }),
      ]);
      if (queryError) setError(queryError.message);
      if (projectError) setError(projectError.message);
      const nextCounts: Record<string, number> = {};
      ((data as Enrollment[] | null) ?? []).forEach((row) => { nextCounts[row.course_slug] = (nextCounts[row.course_slug] ?? 0) + 1; });
      setCounts(nextCounts);
      setProjects((projectData as ProjectSubmission[] | null) ?? []);
      setIsLoading(false);
    }
    void load();
  }, [router]);

  async function reviewProject(projectId: number, status: "approved" | "changes_requested") {
    const reviewerNote = reviewNotes[projectId]?.trim() || null;
    const { error: updateError } = await supabase.from("project_submissions").update({ status, reviewer_note: reviewerNote, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", projectId);
    if (updateError) { setError(updateError.message); return; }
    setProjects((current) => current.map((project) => project.id === projectId ? { ...project, status, reviewer_note: reviewerNote } : project));
  }

  return <><Navbar /><main className="mx-auto max-w-6xl px-6 py-16"><span className="data-cell-header">Administración</span><h1 className="mt-2 font-display text-3xl font-bold text-ink">Estudiantes y proyectos</h1><p className="mt-2 text-sm text-muted">Matrículas reales y revisión de entregas finales.</p>{isLoading ? <p className="mt-8 text-sm text-muted">Cargando información...</p> : error ? <p role="alert" className="mt-8 text-sm text-red-700">{error}</p> : <><div className="mt-8 grid gap-4 md:grid-cols-3">{courses.map((course) => <article key={course.slug} className="data-cell p-5"><p className="data-cell-header">{course.code}</p><h2 className="mt-2 font-display font-bold text-ink">{course.title}</h2><p className="mt-4 font-display text-3xl font-bold text-blue-700">{counts[course.slug] ?? 0}</p><p className="text-sm text-muted">estudiantes inscritos</p></article>)}</div><section className="mt-12"><span className="data-cell-header">Revisión académica</span><h2 className="mt-2 font-display text-2xl font-bold text-ink">Proyectos finales</h2>{projects.length === 0 ? <p className="mt-4 text-sm text-muted">Aún no hay proyectos enviados.</p> : <div className="mt-5 grid gap-4">{projects.map((project) => <article key={project.id} className="data-cell p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="data-cell-header">{project.status === "approved" ? "Aprobado" : project.status === "changes_requested" ? "Requiere cambios" : "Pendiente de revisión"}</p><h3 className="mt-1 font-display font-bold text-ink">{courses.find((course) => course.slug === project.course_slug)?.title ?? project.course_slug}</h3><a href={project.project_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-blue-700 hover:text-accent">Abrir proyecto</a>{project.notes && <p className="mt-2 text-sm text-muted">{project.notes}</p>}</div></div><textarea value={reviewNotes[project.id] ?? project.reviewer_note ?? ""} onChange={(event) => setReviewNotes((current) => ({ ...current, [project.id]: event.target.value }))} placeholder="Comentario para el estudiante" className="mt-4 min-h-20 w-full rounded-cell border border-line p-3 text-sm" />{project.status === "pending" && <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => reviewProject(project.id, "approved")} className="rounded-cell bg-green-700 px-4 py-2 text-sm font-bold text-white">Aprobar proyecto</button><button onClick={() => reviewProject(project.id, "changes_requested")} className="rounded-cell border border-line px-4 py-2 text-sm font-bold text-ink">Solicitar cambios</button></div>}</article>)}</div>}</section></>}</main></>;
}
