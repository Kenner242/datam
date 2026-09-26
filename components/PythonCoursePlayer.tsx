"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Check, CheckCircle2, ChevronRight, CircleHelp, Clock3, Code2, LockKeyhole, Play, RotateCcw, Trophy, Zap } from "lucide-react";
import type { Course } from "@/lib/courses";
import { awardXp, registerModuleAchievement } from "@/lib/gamification";
import { getCurrentUserSafely } from "@/lib/supabase/session";
import { supabase } from "@/lib/supabase/client";
import { MODULE_ICONS, PYTHON_CURRICULUM, toPythonRunContext, type PythonLesson, type PythonRunContext } from "@/lib/pythonCurriculum";
import { runPython } from "@/lib/pythonRunner";

type LabResult = { context: PythonRunContext; checks: Array<{ desc: string; passed: boolean }> };
const PASSING_QUIZ_SCORE = 3;

export default function PythonCoursePlayer({ course }: { course: Course }) {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState(PYTHON_CURRICULUM[0].lessons[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<PythonRunResultView | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const storageKey = `datam-python-curriculum-v1:${course.slug}`;
  const enrollmentKey = `datam-enrollment:guest:${course.slug}`;

  const activeModule = PYTHON_CURRICULUM[activeModuleIndex];
  const activeLesson = activeModule.lessons.find((lesson) => lesson.id === activeLessonId) ?? activeModule.lessons[0];
  const totalLessons = PYTHON_CURRICULUM.reduce((total, module) => total + module.lessons.length, 0);
  const completedCount = completed.length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
  const quizScore = activeLesson.type === "quiz" ? activeLesson.questions?.reduce((score, question, index) => score + Number(quizAnswers[index] === question.correct), 0) ?? 0 : 0;
  const quizPassed = quizSubmitted && quizScore >= PASSING_QUIZ_SCORE;
  const allLessonsComplete = completedCount === totalLessons;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let saved: string[] = [];
      try {
        const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
        const validIds = new Set(PYTHON_CURRICULUM.flatMap((module) => module.lessons.map((lesson) => lesson.id)));
        saved = Array.isArray(parsed) ? Array.from(new Set(parsed.filter((id): id is string => typeof id === "string" && validIds.has(id)))) : [];
      } catch {
        window.localStorage.removeItem(storageKey);
      }

      const { user } = await getCurrentUserSafely();
      if (cancelled) return;
      setUserId(user?.id ?? null);
      let enrolled = window.localStorage.getItem(enrollmentKey) === "true";
      if (user) {
        const [{ data: enrollment }, { data: rows }] = await Promise.all([
          supabase.from("enrollments").select("id").eq("user_id", user.id).eq("course_slug", course.slug).maybeSingle(),
          supabase.from("progress").select("lesson_id").eq("user_id", user.id).eq("course_slug", course.slug),
        ]);
        enrolled = Boolean(enrollment) || enrolled;
        const idByDatabaseKey = new Map(PYTHON_CURRICULUM.flatMap((module) => module.lessons.map((lesson) => [`${module.title}:${lesson.title}`, lesson.id] as const)));
        const databaseKeys = new Set((rows ?? []).map((row) => row.lesson_id));
        const fromDatabase = (rows ?? []).map((row) => idByDatabaseKey.get(row.lesson_id)).filter((id): id is string => Boolean(id));
        saved = Array.from(new Set([...saved, ...fromDatabase]));
        const lessonsToSync = saved.flatMap((id) => {
          const module = PYTHON_CURRICULUM.find((item) => item.lessons.some((lesson) => lesson.id === id));
          const lesson = module?.lessons.find((item) => item.id === id);
          if (!module || !lesson) return [];
          const lessonId = `${module.title}:${lesson.title}`;
          return databaseKeys.has(lessonId) ? [] : [{ user_id: user.id, course_slug: course.slug, lesson_id: lessonId, sincronizado_offline: true }];
        });
        if (lessonsToSync.length) await supabase.from("progress").upsert(lessonsToSync, { onConflict: "user_id,course_slug,lesson_id" });
        if (!enrollment && window.localStorage.getItem(enrollmentKey) === "true") await supabase.from("enrollments").upsert({ user_id: user.id, course_slug: course.slug }, { onConflict: "user_id,course_slug" });
      }
      if (cancelled) return;
      setCompleted(saved);
      setIsEnrolled(enrolled);
      setIsReady(true);
    }

    void load();
    return () => { cancelled = true; };
  }, [course.slug, enrollmentKey, storageKey]);

  useEffect(() => {
    async function handleEnrollment(event: Event) {
      const requestedCourse = (event as CustomEvent<{ courseSlug: string }>).detail?.courseSlug;
      if (requestedCourse !== course.slug) return;
      const { user } = await getCurrentUserSafely();
      if (!user) {
        window.localStorage.setItem(enrollmentKey, "true");
        setIsEnrolled(true);
        setMessage("Inscripción guardada en este dispositivo. Inicia sesión para sincronizarla y certificarte.");
        return;
      }
      const { error } = await supabase.from("enrollments").upsert({ user_id: user.id, course_slug: course.slug }, { onConflict: "user_id,course_slug" });
      if (error) {
        setMessage(error.message);
        return;
      }
      setUserId(user.id);
      setIsEnrolled(true);
      setMessage("Ya estás inscrito. Comienza por el primer módulo.");
    }

    window.addEventListener("datam:enroll-course", handleEnrollment);
    return () => window.removeEventListener("datam:enroll-course", handleEnrollment);
  }, [course.slug, enrollmentKey]);

  useEffect(() => {
    setCode(activeLesson.starter ?? activeLesson.playground?.starter ?? "");
    setRunResult(null);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setMessage("");
  }, [activeLesson.id, activeLesson.starter, activeLesson.playground?.starter]);

  const moduleProgress = useMemo(() => PYTHON_CURRICULUM.map((module) => {
    const done = module.lessons.filter((lesson) => completed.includes(lesson.id)).length;
    return { done, total: module.lessons.length, percent: Math.round((done / module.lessons.length) * 100) };
  }), [completed]);

  function isModuleUnlocked(moduleIndex: number) {
    return moduleIndex === 0 || PYTHON_CURRICULUM[moduleIndex - 1].lessons.every((lesson) => completed.includes(lesson.id));
  }

  function isLessonUnlocked(moduleIndex: number, lessonIndex: number) {
    if (!isModuleUnlocked(moduleIndex)) return false;
    return lessonIndex === 0 || PYTHON_CURRICULUM[moduleIndex].lessons.slice(0, lessonIndex).every((lesson) => completed.includes(lesson.id));
  }

  function selectModule(moduleIndex: number) {
    if (!isModuleUnlocked(moduleIndex)) return;
    setActiveModuleIndex(moduleIndex);
    const module = PYTHON_CURRICULUM[moduleIndex];
    const firstPendingIndex = module.lessons.findIndex((lesson) => !completed.includes(lesson.id));
    const lesson = module.lessons[firstPendingIndex < 0 ? module.lessons.length - 1 : firstPendingIndex];
    setActiveLessonId(lesson.id);
  }

  function selectLesson(moduleIndex: number, lessonIndex: number, lesson: PythonLesson) {
    if (!isLessonUnlocked(moduleIndex, lessonIndex)) return;
    setActiveModuleIndex(moduleIndex);
    setActiveLessonId(lesson.id);
  }

  async function enroll() {
    window.dispatchEvent(new CustomEvent("datam:enroll-course", { detail: { courseSlug: course.slug } }));
  }

  async function execute(source: string) {
    setIsRunning(true);
    setRunResult(null);
    setMessage("Iniciando el intérprete Python WebAssembly. La primera carga puede tardar unos segundos.");
    try {
      const raw = await runPython(source);
      const context = toPythonRunContext(raw);
      if (activeLesson.type !== "lab" || !activeLesson.checks) {
        setRunResult({ context, checks: [] });
        setMessage(context.error ? "Python encontró un error; revisa el mensaje de salida." : "Ejecución completada.");
        return;
      }
      const helpers = { run: async (candidate: string) => toPythonRunContext(await runPython(candidate)) };
      const checks = await Promise.all(activeLesson.checks.map(async (check) => ({ desc: check.desc, passed: await check.test(source, context, helpers) })));
      const passed = checks.every((check) => check.passed);
      setRunResult({ context, checks });
      setMessage(passed ? "Todos los criterios pasan. Ya puedes completar esta práctica." : "Todavía faltan criterios. Revisa la salida, las pruebas y los casos alternativos.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "No se pudo iniciar el intérprete.";
      setRunResult({ context: { output: [], vars: {}, error: detail }, checks: [] });
      setMessage(detail);
    } finally {
      setIsRunning(false);
    }
  }

  function canCompleteLesson() {
    if (completed.includes(activeLesson.id)) return false;
    if (activeLesson.type === "lab") return Boolean(runResult?.checks.length && runResult.checks.every((check) => check.passed));
    if (activeLesson.type === "quiz") return quizPassed;
    return Boolean(runResult && !runResult.context.error);
  }

  async function completeLesson() {
    if (!isEnrolled) {
      setMessage("Inscríbete gratis para guardar tu avance.");
      return;
    }
    if (!canCompleteLesson()) return;
    const next = [...completed, activeLesson.id];
    setCompleted(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setMessage("El navegador no permitió guardar el avance local. Comprueba el espacio disponible.");
      return;
    }

    let syncMessage = "";
    if (userId) {
      const lessonId = `${activeModule.title}:${activeLesson.title}`;
      const { error } = await supabase.from("progress").upsert({ user_id: userId, course_slug: course.slug, lesson_id: lessonId, sincronizado_offline: true }, { onConflict: "user_id,course_slug,lesson_id" });
      if (error) syncMessage = `Avance guardado en este dispositivo; no se pudo sincronizar: ${error.message}`;
      else void awardXp(userId, course.slug, lessonId, activeModule.level === "principiante" ? "recordar" : activeModule.level === "intermedio" ? "aplicar" : "crear", activeLesson.xp);
      const moduleIndex = PYTHON_CURRICULUM.indexOf(activeModule);
      if (activeModule.lessons.every((lesson) => next.includes(lesson.id))) void registerModuleAchievement(userId, course.slug, moduleIndex);
    }
    setMessage(syncMessage || `Progreso guardado: ${activeLesson.title}.`);
  }

  function submitQuiz() {
    if (quizAnswers.length !== activeLesson.questions?.length || quizAnswers.some((answer) => answer === undefined)) {
      setMessage("Responde todas las preguntas antes de revisar el quiz.");
      return;
    }
    setQuizSubmitted(true);
    const score = activeLesson.questions?.reduce((total, question, index) => total + Number(quizAnswers[index] === question.correct), 0) ?? 0;
    setMessage(score >= PASSING_QUIZ_SCORE ? `Aprobado: ${score}/${activeLesson.questions?.length}.` : `Resultado: ${score}/${activeLesson.questions?.length}. Revisa las explicaciones y vuelve a intentarlo.`);
  }

  function retryQuiz() {
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setMessage("");
  }

  if (!isReady) return <section className="python-course-player" aria-label="Curso Python"><p className="p-6 text-sm text-blue-100">Preparando tu ruta y sincronizando el avance...</p></section>;

  const currentLessonIndex = activeModule.lessons.findIndex((lesson) => lesson.id === activeLesson.id);
  const activeLabPassed = Boolean(runResult?.checks.length && runResult.checks.every((check) => check.passed));

  return (
    <section id="curso-aprendizaje" className="python-course-player" aria-label="Curso Python de cero a avanzado">
      <header className="python-player-header">
        <div className="min-w-0">
          <p className="python-kicker">DataM AI · Ruta de aprendizaje</p>
          <h2>Python: de Cero a Avanzado</h2>
          <p>Veinte módulos para aprender fundamentos, construir soluciones y probarlas con criterio profesional.</p>
        </div>
        <div className="python-player-summary" aria-label={`${progress}% del curso completado`}>
          <b>{progress}%</b><span>completado</span><small>{completedCount} / {totalLessons} actividades</small>
        </div>
      </header>
      <div className="python-player-progress"><span style={{ width: `${progress}%` }} /></div>
      {message && <p role="status" className="python-player-message">{message}</p>}

      <div className="python-player-layout">
        <aside className="python-module-sidebar" aria-label="Temario del curso">
          <div className="python-sidebar-heading"><span>Temario</span><small>20 módulos</small></div>
          <ol>
            {PYTHON_CURRICULUM.map((module, moduleIndex) => {
              const unlocked = isModuleUnlocked(moduleIndex);
              const selected = moduleIndex === activeModuleIndex;
              const stats = moduleProgress[moduleIndex];
              return <li key={module.id}>
                <button type="button" disabled={!unlocked} aria-current={selected ? "step" : undefined} onClick={() => selectModule(moduleIndex)} className={`python-module-button ${selected ? "active" : ""} ${!unlocked ? "locked" : ""}`}>
                  <span className={`python-module-number ${stats.percent === 100 ? "complete" : ""}`}>{stats.percent === 100 ? <Check className="h-4 w-4" /> : !unlocked ? <LockKeyhole className="h-3.5 w-3.5" /> : MODULE_ICONS[moduleIndex]}</span>
                  <span className="python-module-copy"><b>{module.title}</b><small>{module.level} · {stats.done}/{stats.total}</small></span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </button>
              </li>;
            })}
          </ol>
        </aside>

        <main className="python-learning-panel">
          <header className="python-module-heading">
            <div><p className="python-kicker">Módulo {activeModuleIndex + 1} · {activeModule.level}</p><h3>{activeModule.title}</h3><p>{activeModule.goal}</p></div>
            <div className="python-module-time"><Clock3 className="h-4 w-4" /><span>{activeModule.minutes} min</span></div>
          </header>
          <nav className="python-lesson-tabs" aria-label="Actividades del módulo">
            {activeModule.lessons.map((lesson, lessonIndex) => {
              const unlocked = isLessonUnlocked(activeModuleIndex, lessonIndex);
              const done = completed.includes(lesson.id);
              return <button key={lesson.id} type="button" disabled={!unlocked} aria-current={activeLesson.id === lesson.id ? "step" : undefined} onClick={() => selectLesson(activeModuleIndex, lessonIndex, lesson)} className={`python-lesson-tab ${activeLesson.id === lesson.id ? "active" : ""} ${done ? "done" : ""}`}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : lesson.type === "reading" ? <BookOpen className="h-4 w-4" /> : lesson.type === "lab" ? <Code2 className="h-4 w-4" /> : <CircleHelp className="h-4 w-4" />}
                <span>{lesson.title}</span>{!unlocked && <LockKeyhole className="h-3.5 w-3.5" />}
              </button>;
            })}
          </nav>

          <article className="python-activity-content" key={activeLesson.id}>
            <div className="python-activity-meta"><span>{activeLesson.type === "reading" ? "LECTURA GUIADA" : activeLesson.type === "lab" ? "LABORATORIO" : "AUTOEVALUACIÓN"}</span><span><Clock3 className="h-3.5 w-3.5" /> {activeLesson.minutes} min</span><span><Zap className="h-3.5 w-3.5" /> {activeLesson.xp} XP</span></div>
            <h4>{activeLesson.title}</h4>
            <p className="python-activity-description">{activeLesson.desc}</p>
            <div className="python-objectives"><b>Al finalizar podrás</b><ul>{activeLesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div>

            {activeLesson.type === "reading" && <>
              <div className="python-reading-html" dangerouslySetInnerHTML={{ __html: activeLesson.content ?? "" }} />
              {activeLesson.keyPoints && <div className="python-key-points"><b>Ideas clave</b><ul>{activeLesson.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul></div>}
              {activeLesson.playground && <section className="python-playground"><div className="python-subheading"><div><BookOpen className="h-4 w-4" /><b>Modifica el ejemplo</b></div><span>Entorno Python aislado</span></div><p>{activeLesson.playground.hint}</p><textarea value={code} onChange={(event) => { setCode(event.target.value); setRunResult(null); }} className="python-code-editor" spellCheck={false} aria-label={`Editor de ${activeLesson.title}`} /><div className="python-code-actions"><button type="button" onClick={() => void execute(code)} disabled={isRunning} className="python-run-button"><Play className="h-4 w-4" /> {isRunning ? "Ejecutando..." : "Ejecutar Python"}</button><button type="button" onClick={() => { setCode(activeLesson.playground?.starter ?? ""); setRunResult(null); }} className="python-reset-button" aria-label="Restaurar ejemplo"><RotateCcw className="h-4 w-4" /> Restaurar</button></div>{runResult && <RunOutput result={runResult} />}</section>}
            </>}

            {activeLesson.type === "lab" && <section className="python-lab-workspace">
              <div className="python-lab-instructions" dangerouslySetInnerHTML={{ __html: activeLesson.prompt ?? "" }} />
              <textarea value={code} onChange={(event) => { setCode(event.target.value); setRunResult(null); }} className="python-code-editor" spellCheck={false} aria-label={`Editor de laboratorio: ${activeLesson.title}`} />
              <div className="python-code-actions"><button type="button" onClick={() => void execute(code)} disabled={isRunning} className="python-run-button"><Play className="h-4 w-4" /> {isRunning ? "Ejecutando pruebas..." : "Ejecutar y comprobar"}</button><button type="button" onClick={() => { setCode(activeLesson.starter ?? ""); setRunResult(null); }} className="python-reset-button" aria-label="Restaurar código inicial"><RotateCcw className="h-4 w-4" /> Reiniciar</button><details className="python-solution"><summary>Consultar solución</summary><pre>{activeLesson.solution}</pre></details></div>
              {runResult && <RunOutput result={runResult} />}
            </section>}

            {activeLesson.type === "quiz" && <section className="python-quiz-workspace">
              {activeLesson.questions?.map((question, questionIndex) => {
                const isCorrect = quizAnswers[questionIndex] === question.correct;
                const isWrong = quizSubmitted && !isCorrect;
                return <fieldset key={question.q} className={`python-question ${quizSubmitted ? isCorrect ? "correct" : "incorrect" : ""}`}>
                  <legend>{questionIndex + 1}. {question.q}</legend>
                  <div className="python-answer-options">{question.options.map((option, optionIndex) => <label key={`${questionIndex}-${optionIndex}`}><input type="radio" name={`${activeLesson.id}-question-${questionIndex}`} disabled={quizSubmitted} checked={quizAnswers[questionIndex] === optionIndex} onChange={() => setQuizAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next; })} /><span>{option}</span></label>)}</div>
                  {quizSubmitted && <p className={isWrong ? "answer-explanation wrong" : "answer-explanation"}>{isCorrect ? "Correcto. " : `La respuesta correcta es: ${question.options[question.correct]}. `}{question.explain}</p>}
                </fieldset>;
              })}
              {!quizSubmitted && <button type="button" onClick={submitQuiz} className="python-run-button">Revisar respuestas</button>}
              {quizSubmitted && !quizPassed && <button type="button" onClick={retryQuiz} className="python-reset-button">Intentar de nuevo</button>}
              {quizSubmitted && <p className={`python-quiz-score ${quizPassed ? "passed" : "failed"}`}>Resultado: {quizScore}/{activeLesson.questions?.length}. {quizPassed ? "Puedes completar esta actividad." : `Necesitas al menos ${PASSING_QUIZ_SCORE} respuestas correctas.`}</p>}
            </section>}

            <section className="python-dax-tip"><span>DAX</span><div><b>Una pista para pensar</b><p>{activeLesson.dax.hint}</p><small>{activeLesson.dax.explain}</small><pre>{activeLesson.dax.example}</pre></div></section>
            <footer className="python-activity-footer">
              {completed.includes(activeLesson.id) ? <span className="python-done-label"><CheckCircle2 className="h-4 w-4" /> Actividad completada</span> : <button type="button" onClick={() => void completeLesson()} disabled={!canCompleteLesson() || !isEnrolled} className="python-complete-button"><CheckCircle2 className="h-4 w-4" /> {isEnrolled ? activeLesson.type === "lab" && !activeLabPassed ? "Aprueba todas las pruebas" : activeLesson.type === "quiz" && !quizPassed ? "Aprueba el quiz" : activeLesson.type === "reading" && !runResult ? "Ejecuta el ejemplo" : "Completar actividad" : "Inscríbete para guardar"}</button>}
              <span className="python-next-indicator">Actividad {currentLessonIndex + 1} de {activeModule.lessons.length}</span>
            </footer>
            {!isEnrolled && <button type="button" onClick={() => void enroll()} className="python-enroll-inline">Inscribirme gratis y guardar mi progreso</button>}
          </article>
          {allLessonsComplete && isEnrolled && <section className="python-finish-banner"><Trophy className="h-5 w-5" /><div><b>Ruta completada</b><p>Ya puedes rendir la evaluación final del curso.</p></div><Link href={`/cursos/${course.slug}/evaluacion`}>Ir a evaluación <ChevronRight className="h-4 w-4" /></Link></section>}
        </main>
      </div>
    </section>
  );
}

type PythonRunResultView = { context: PythonRunContext; checks: Array<{ desc: string; passed: boolean }> };

function RunOutput({ result }: { result: PythonRunResultView }) {
  const output = [...result.context.output, ...(result.context.error ? [result.context.error] : [])];
  return <div className="python-run-result">
    <div className="python-run-terminal"><b>Salida de Python</b><pre>{output.length ? output.join("\n") : "(sin salida)"}</pre></div>
    {Object.keys(result.context.vars).length > 0 && <details className="python-run-variables"><summary>Variables observadas</summary><pre>{JSON.stringify(result.context.vars, null, 2)}</pre></details>}
    {result.checks.length > 0 && <ul className="python-check-list">{result.checks.map((check) => <li key={check.desc} className={check.passed ? "passed" : "failed"}>{check.passed ? <CheckCircle2 className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}{check.desc}</li>)}</ul>}
  </div>;
}