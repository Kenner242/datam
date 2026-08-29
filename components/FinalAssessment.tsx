"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, ClipboardCheck, LockKeyhole, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Course } from "@/lib/courses";
import { getCourseAssessment } from "@/lib/courseAssessments";

const POINTS_PER_QUESTION = 10;
const PASSING_SCORE = 70;

export default function FinalAssessment({ course }: { course: Course }) {
  const assessment = getCourseAssessment(course.slug);
  const [isLoading, setIsLoading] = useState(true);
  const [isEligible, setIsEligible] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [reviewAnswers, setReviewAnswers] = useState<number[] | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const lessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => `${module.title}:${lesson.title}`));
      const [{ data: progress }, { data: attempts }] = await Promise.all([
        supabase.from("progress").select("lesson_id").eq("user_id", auth.user.id).eq("course_slug", course.slug),
        supabase.from("exam_attempts").select("score, passed").eq("user_id", auth.user.id).eq("course_slug", course.slug).order("submitted_at", { ascending: false }).limit(1),
      ]);

      const completed = new Set((progress ?? []).map((entry) => entry.lesson_id));
      setIsEligible(lessonIds.every((lessonId) => completed.has(lessonId)));
      if (attempts?.[0]) {
        setScore(attempts[0].score);
        setIsPassed(attempts[0].passed);
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

    setMessage("");
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

  if (isLoading) return <p className="mt-8 text-sm text-muted">Comprobando requisitos de evaluación...</p>;

  if (!isEligible) {
    return <section className="data-cell mt-8 p-6"><LockKeyhole className="h-6 w-6 text-accent" /><h1 className="mt-3 font-display text-2xl font-bold text-ink">Evaluación final bloqueada</h1><p className="mt-2 text-sm text-muted">Completa todas las clases en orden para desbloquear el examen final.</p><Link href={`/cursos/${course.slug}`} className="mt-5 inline-flex rounded-cell bg-ink px-4 py-2 text-sm font-bold text-white">Volver al curso</Link></section>;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <span className="data-cell-header">Cierre del curso</span>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">Evaluación final</h1>
      <p className="mt-3 text-muted">El examen tiene {assessment.questions.length} preguntas, cada una vale {POINTS_PER_QUESTION} puntos. Para aprobar y certificarte debes obtener al menos {PASSING_SCORE}/100.</p>

      <section className="data-cell mt-8 p-6">
        <div className="flex items-center gap-3"><ClipboardCheck className="h-6 w-6 text-accent" /><div><p className="data-cell-header">Examen</p><h2 className="font-display text-xl font-bold text-ink">Preguntas del curso</h2></div></div>

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

      {isPassed && <section className="mt-5 border-l-4 border-green-600 bg-green-50 p-5"><p className="font-display font-bold text-green-900">Curso aprobado</p><p className="mt-1 text-sm text-green-800">Aprobaste la evaluación final de {course.title}. Ya puedes solicitar tu certificado.</p><Link href={`/certificado/${course.slug}`} className="mt-4 inline-flex rounded-cell bg-green-700 px-4 py-2 text-sm font-bold text-white">Ver certificado</Link></section>}
      {message && <p role="status" className="mt-5 text-sm text-blue-800">{message}</p>}
    </main>
  );
}
