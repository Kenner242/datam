"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, ClipboardCheck, FileUp, LockKeyhole, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Course } from "@/lib/courses";
import { getCourseAssessment } from "@/lib/courseAssessments";

const POINTS_PER_QUESTION = 10;
const PASSING_SCORE = 70;

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
  const [reviewAnswers, setReviewAnswers] = useState<number[] | null>(null);
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
    if (answers.length !== assessment.questions.length || answers.some((answer) => answer === undefined)) {
      setMessage("Responde todas las preguntas antes de enviar la evaluación.");
      return;
    }

    const correct = assessment.questions.reduce((total, question, index) => total + Number(answers[index] === question.correctOption), 0);
    const nextScore = correct * POINTS_PER_QUESTION;
    const passed = nextScore >= PASSING_SCORE;
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
    setReviewAnswers([...answers]);
  }

  function retryExam() {
    setAnswers([]);
    setReviewAnswers(null);
    setScore(null);
    setMessage("");
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
      <p className="mt-3 text-muted">El examen tiene {assessment.questions.length} preguntas, cada una vale {POINTS_PER_QUESTION} puntos. Para certificarte debes aprobar el examen con al menos {PASSING_SCORE}/100 y recibir la aprobación de tu proyecto.</p>

      <section className="data-cell mt-8 p-6">
        <div className="flex items-center gap-3"><ClipboardCheck className="h-6 w-6 text-accent" /><div><p className="data-cell-header">Paso 1</p><h2 className="font-display text-xl font-bold text-ink">Examen final</h2></div></div>

        {reviewAnswers ? (
          <div className="mt-6 space-y-6">
            <div className={`flex items-center gap-2 border-l-4 p-4 text-sm font-medium ${isPassed ? "border-green-600 bg-green-50 text-green-800" : "border-red-500 bg-red-50 text-red-800"}`}>
              {isPassed ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
              <span>{isPassed ? `Has aprobado el curso ${course.title} con ${score}/100.` : `No aprobaste. Obtuviste ${score}/100 y se requieren ${PASSING_SCORE}/100.`}</span>
            </div>

            <div className="space-y-4">
              {assessment.questions.map((question, questionIndex) => {
                const userAnswer = reviewAnswers[questionIndex];
                const isCorrect = userAnswer === question.correctOption;
                return (
                  <fieldset key={question.prompt} className={`border-l-4 p-4 ${isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
                    <legend className="flex items-center gap-2 font-medium text-ink">
                      {isCorrect ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                      {questionIndex + 1}. {question.prompt} <span className="ml-auto text-xs font-normal text-muted">{isCorrect ? `+${POINTS_PER_QUESTION} pts` : "0 pts"}</span>
                    </legend>
                    <div className="mt-3 grid gap-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserChoice = userAnswer === optionIndex;
                        const isCorrectOption = question.correctOption === optionIndex;
                        return (
                          <div
                            key={option}
                            className={`flex items-center justify-between border p-3 text-sm ${isCorrectOption ? "border-green-500 bg-green-100 font-medium text-green-900" : isUserChoice ? "border-red-500 bg-red-100 text-red-900" : "border-line bg-white text-ink"}`}
                          >
                            <span>{option}</span>
                            {isCorrectOption && <span className="text-xs font-bold text-green-700">Respuesta correcta</span>}
                            {isUserChoice && !isCorrectOption && <span className="text-xs font-bold text-red-700">Tu respuesta</span>}
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>

            {!isPassed && <button type="button" onClick={retryExam} className="rounded-cell bg-accent px-5 py-2 text-sm font-bold text-white hover:bg-ink">Volver a intentar</button>}
          </div>
        ) : isPassed ? (
          <p className="mt-5 flex items-center gap-2 text-sm font-medium text-green-700"><CheckCircle2 className="h-5 w-5" /> Has aprobado el curso {course.title} con {score}/100.</p>
        ) : (
          <form onSubmit={submitExam} className="mt-6 space-y-6">
            {assessment.questions.map((question, questionIndex) => (
              <fieldset key={question.prompt}>
                <legend className="font-medium text-ink">{questionIndex + 1}. {question.prompt} <span className="text-xs font-normal text-muted">({POINTS_PER_QUESTION} pts)</span></legend>
                <div className="mt-3 grid gap-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={option} className="flex cursor-pointer items-center gap-3 border border-line bg-white p-3 text-sm text-ink hover:border-accent">
                      <input type="radio" name={`question-${questionIndex}`} checked={answers[questionIndex] === optionIndex} onChange={() => setAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next; })} />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <button type="submit" className="rounded-cell bg-accent px-5 py-2 text-sm font-bold text-white hover:bg-ink">Enviar evaluación</button>
          </form>
        )}
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
