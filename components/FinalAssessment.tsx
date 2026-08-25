"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, ClipboardCheck, FileUp, LockKeyhole } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Course } from "@/lib/courses";
import { getCourseAssessment } from "@/lib/courseAssessments";

type Submission = {
  project_url: string;
  notes: string | null;
  status: "pending" | "approved" | "changes_requested";
  reviewer_note: string | null;
};

export default function FinalAssessment({ course }: { course: Course }) {
  const assessment = getCourseAssessment(course.slug);
  const [isLoading, setIsLoading] = useState(true);
  const [isEligible, setIsEligible] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [projectUrl, setProjectUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const lessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => `${module.title}:${lesson.title}`));
      const [{ data: progress }, { data: attempts }, { data: project }] = await Promise.all([
        supabase.from("progress").select("lesson_id").eq("user_id", auth.user.id).eq("course_slug", course.slug),
        supabase.from("exam_attempts").select("score, passed").eq("user_id", auth.user.id).eq("course_slug", course.slug).order("submitted_at", { ascending: false }).limit(1),
        supabase.from("project_submissions").select("project_url, notes, status, reviewer_note").eq("user_id", auth.user.id).eq("course_slug", course.slug).maybeSingle(),
      ]);

      const completed = new Set((progress ?? []).map((entry) => entry.lesson_id));
      setIsEligible(lessonIds.every((lessonId) => completed.has(lessonId)));
      if (attempts?.[0]) {
        setScore(attempts[0].score);
        setIsPassed(attempts[0].passed);
      }
      if (project) {
        const current = project as Submission;
        setSubmission(current);
        setProjectUrl(current.project_url);
        setNotes(current.notes ?? "");
      }
      setIsLoading(false);
    }

    void load();
  }, [course]);

  if (!assessment) return null;

  async function submitExam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answers.length !== assessment.questions.length) {
      setMessage("Responde todas las preguntas antes de enviar la evaluación.");
      return;
    }

    const correct = assessment.questions.reduce((total, question, index) => total + Number(answers[index] === question.correctOption), 0);
    const nextScore = Math.round((correct / assessment.questions.length) * 100);
    const passed = nextScore >= 70;
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const { error } = await supabase.from("exam_attempts").insert({
      user_id: auth.user.id,
      course_slug: course.slug,
      score: nextScore,
      passed,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setScore(nextScore);
    setIsPassed(passed);
    setMessage(passed ? "Evaluación aprobada. Ahora entrega tu proyecto final." : "Aún no alcanzaste 70/100. Revisa los contenidos y vuelve a intentarlo.");
  }

  async function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectUrl.trim()) {
      setMessage("Comparte un enlace válido a tu proyecto.");
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { data, error } = await supabase.from("project_submissions").upsert({
      user_id: auth.user.id,
      course_slug: course.slug,
      project_url: projectUrl.trim(),
      notes: notes.trim() || null,
      status: "pending",
      reviewer_note: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,course_slug" }).select("project_url, notes, status, reviewer_note").single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setSubmission(data as Submission);
    setMessage("Proyecto enviado para revisión. Recibirás el certificado cuando sea aprobado.");
  }

  if (isLoading) return <p className="mt-8 text-sm text-muted">Comprobando requisitos de evaluación...</p>;

  if (!isEligible) {
    return <section className="data-cell mt-8 p-6"><LockKeyhole className="h-6 w-6 text-accent" /><h1 className="mt-3 font-display text-2xl font-bold text-ink">Evaluación final bloqueada</h1><p className="mt-2 text-sm text-muted">Completa todas las clases en orden para desbloquear el examen y el proyecto final.</p><Link href={`/cursos/${course.slug}`} className="mt-5 inline-flex rounded-cell bg-ink px-4 py-2 text-sm font-bold text-white">Volver al curso</Link></section>;
  }

  const canReceiveCertificate = isPassed && submission?.status === "approved";

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <span className="data-cell-header">Cierre del curso</span>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">Evaluación y proyecto final</h1>
      <p className="mt-3 text-muted">Para certificarte debes aprobar el examen con al menos 70/100 y recibir la aprobación de tu proyecto.</p>

      <section className="data-cell mt-8 p-6">
        <div className="flex items-center gap-3"><ClipboardCheck className="h-6 w-6 text-accent" /><div><p className="data-cell-header">Paso 1</p><h2 className="font-display text-xl font-bold text-ink">Examen final</h2></div></div>
        {isPassed ? <p className="mt-5 flex items-center gap-2 text-sm font-medium text-green-700"><CheckCircle2 className="h-5 w-5" /> Aprobaste con {score}/100.</p> : <form onSubmit={submitExam} className="mt-6 space-y-6">{assessment.questions.map((question, questionIndex) => <fieldset key={question.prompt}><legend className="font-medium text-ink">{questionIndex + 1}. {question.prompt}</legend><div className="mt-3 grid gap-2">{question.options.map((option, optionIndex) => <label key={option} className="flex cursor-pointer items-center gap-3 border border-line bg-white p-3 text-sm text-ink hover:border-accent"><input type="radio" name={`question-${questionIndex}`} checked={answers[questionIndex] === optionIndex} onChange={() => setAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next; })} />{option}</label>)}</div></fieldset>)}<button type="submit" className="rounded-cell bg-accent px-5 py-2 text-sm font-bold text-white hover:bg-ink">Enviar evaluación</button>{score !== null && <p className="text-sm text-muted">Última nota: {score}/100.</p>}</form>}
      </section>

      <section className="data-cell mt-5 p-6">
        <div className="flex items-center gap-3"><FileUp className="h-6 w-6 text-accent" /><div><p className="data-cell-header">Paso 2</p><h2 className="font-display text-xl font-bold text-ink">{assessment.projectTitle}</h2></div></div>
        <p className="mt-4 text-sm text-muted">{assessment.projectInstructions}</p><p className="mt-2 text-sm font-medium text-ink">{assessment.acceptedFormats}</p>
        {!isPassed ? <p className="mt-5 text-sm text-muted">Aprueba primero la evaluación final para enviar tu proyecto.</p> : <form onSubmit={submitProject} className="mt-5 space-y-4"><label className="block text-sm font-medium text-ink">Enlace del proyecto<input type="url" value={projectUrl} onChange={(event) => setProjectUrl(event.target.value)} placeholder="https://..." className="mt-2 block w-full rounded-cell border border-line bg-white p-3 text-sm focus:border-accent focus:outline-none" /></label><label className="block text-sm font-medium text-ink">Comentario para el revisor (opcional)<textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 min-h-24 w-full rounded-cell border border-line bg-white p-3 text-sm focus:border-accent focus:outline-none" /></label><button type="submit" className="rounded-cell bg-ink px-5 py-2 text-sm font-bold text-white hover:bg-accent">Enviar proyecto</button></form>}
        {submission && <div className="mt-5 border-l-4 border-blue-500 bg-blue-50 p-4"><p className="font-medium text-ink">Estado del proyecto: {submission.status === "approved" ? "Aprobado" : submission.status === "changes_requested" ? "Requiere cambios" : "En revisión"}</p>{submission.reviewer_note && <p className="mt-2 text-sm text-muted">Comentario del revisor: {submission.reviewer_note}</p>}</div>}
      </section>

      {canReceiveCertificate && <section className="mt-5 border-l-4 border-green-600 bg-green-50 p-5"><p className="font-display font-bold text-green-900">Requisitos cumplidos</p><p className="mt-1 text-sm text-green-800">Tu evaluación y proyecto fueron aprobados. Ya puedes solicitar tu certificado.</p><Link href={`/certificado/${course.slug}`} className="mt-4 inline-flex rounded-cell bg-green-700 px-4 py-2 text-sm font-bold text-white">Ver certificado</Link></section>}
      {message && <p role="status" className="mt-5 text-sm text-blue-800">{message}</p>}
    </main>
  );
}
