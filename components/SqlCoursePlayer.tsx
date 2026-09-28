"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CourseMenuDisclosure from "@/components/CourseMenuDisclosure";
import { BarChart3, BookOpen, Check, CheckCircle2, ChevronRight, CircleHelp, Clock3, Code2, Database, LockKeyhole, RotateCcw, Sparkles, Trophy, Zap } from "lucide-react";
import type { Course } from "@/lib/courses";
import { awardXp, registerModuleAchievement } from "@/lib/gamification";
import { getCurrentUserSafely } from "@/lib/supabase/session";
import { supabase } from "@/lib/supabase/client";
import { SQL_CURRICULUM, SQL_MODULE_ICONS, type SqlLesson } from "@/lib/sqlCurriculum";
import { runSql, SQL_SAMPLE_DATABASE, type SqlResult, type SqlRunResult } from "@/lib/sqlEngine";

type View = "ruta" | "laboratorio" | "logros" | "progreso";
type CheckState = { desc: string; passed: boolean }[] | null;
const PASSING_QUIZ_SCORE = 3;
const STARTER = "-- Escribe tu consulta aquí";
const allLessons = SQL_CURRICULUM.flatMap((module, moduleIndex) => module.lessons.map((lesson, lessonIndex) => ({ module, moduleIndex, lesson, lessonIndex })));
const totalLessons = allLessons.length;
const sqlLessons = allLessons.filter((entry) => entry.lesson.type === "sql");
const legacyProgressIds = new Map([
  ["Consultas básicas:Leer información", "m1l1"],
  ["Cruce y resumen de datos:Relaciones", "m6l1"],
  ["Consultas para decisiones:Análisis práctico", "m10l1"],
]);
const achievements = [
  { title: "Primera consulta", desc: "Supera tu primer laboratorio", icon: "🌱", test: (done: string[]) => sqlLessons.some(({ lesson }) => done.includes(lesson.id)) },
  { title: "Relaciones claras", desc: "Completa un laboratorio con JOIN", icon: "🔗", test: (done: string[]) => ["m6l3", "m6l4", "m7l3", "m7l4"].some((id) => done.includes(id)) },
  { title: "Media ruta", desc: "Completa la mitad del curso", icon: "📈", test: (done: string[]) => done.length >= Math.ceil(totalLessons / 2) },
  { title: "Analista SQL", desc: "Completa los quince módulos", icon: "🏆", test: (done: string[]) => done.length === totalLessons },
];

export default function SqlCoursePlayer({ course }: { course: Course }) {
  const [view, setView] = useState<View>("ruta");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonId, setLessonId] = useState(SQL_CURRICULUM[0].lessons[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [code, setCode] = useState(STARTER);
  const [result, setResult] = useState<SqlRunResult | null>(null);
  const [checks, setChecks] = useState<CheckState>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("");
  const storageKey = `datam-sql-curriculum-v1:${course.slug}`;
  const enrollmentKey = `datam-enrollment:guest:${course.slug}`;
  const module = SQL_CURRICULUM[moduleIndex];
  const lesson = module.lessons.find((item) => item.id === lessonId) ?? module.lessons[0];
  const progress = totalLessons ? Math.round(completed.length / totalLessons * 100) : 0;
  const quizCorrect = lesson.questions?.reduce((sum, question, index) => sum + Number(quizAnswers[index] === question.correct), 0) ?? 0;
  const quizPassed = quizSubmitted && quizCorrect >= PASSING_QUIZ_SCORE;
  const moduleProgress = useMemo(() => SQL_CURRICULUM.map((item) => {
    const done = item.lessons.filter((entry) => completed.includes(entry.id)).length;
    return { done, total: item.lessons.length, percent: Math.round(done / item.lessons.length * 100) };
  }), [completed]);
  const selectedLessonIndex = module.lessons.findIndex((item) => item.id === lesson.id);
  const completedLabs = sqlLessons.filter(({ lesson: item }) => completed.includes(item.id)).length;
  const unlockedAchievements = achievements.filter((item) => item.test(completed));
  const allDone = completed.length === totalLessons;

  useEffect(() => {
    let cancelled = false;
    async function loadProgress() {
      let saved: string[] = [];
      try {
        const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
        const valid = new Set(allLessons.map(({ lesson: item }) => item.id));
        saved = Array.isArray(parsed) ? Array.from(new Set(parsed.filter((id): id is string => typeof id === "string" && valid.has(id)))) : [];
      } catch { window.localStorage.removeItem(storageKey); }
      setStudentName(window.localStorage.getItem(`${storageKey}:student`) ?? "");
      let enrolled = window.localStorage.getItem(enrollmentKey) === "true";
      const { user } = await getCurrentUserSafely();
      if (cancelled) return;
      setUserId(user?.id ?? null);
      if (user) {
        const [{ data: enrollment }, { data: rows }] = await Promise.all([
          supabase.from("enrollments").select("id").eq("user_id", user.id).eq("course_slug", course.slug).maybeSingle(),
          supabase.from("progress").select("lesson_id").eq("user_id", user.id).eq("course_slug", course.slug),
        ]);
        enrolled = Boolean(enrollment) || enrolled;
        const idByDatabaseKey = new Map([...allLessons.map(({ module: itemModule, lesson: itemLesson }) => [`${itemModule.title}:${itemLesson.title}`, itemLesson.id] as const), ...legacyProgressIds]);
        const existingKeys = new Set((rows ?? []).map((row) => row.lesson_id));
        saved = Array.from(new Set([...saved, ...(rows ?? []).map((row) => idByDatabaseKey.get(row.lesson_id)).filter((id): id is string => Boolean(id))]));
        const missing = saved.flatMap((id) => {
          const entry = allLessons.find((item) => item.lesson.id === id);
          if (!entry) return [];
          const key = `${entry.module.title}:${entry.lesson.title}`;
          return existingKeys.has(key) ? [] : [{ user_id: user.id, course_slug: course.slug, lesson_id: key, sincronizado_offline: true }];
        });
        if (missing.length) await supabase.from("progress").upsert(missing, { onConflict: "user_id,course_slug,lesson_id" });
        if (!enrollment && window.localStorage.getItem(enrollmentKey) === "true") await supabase.from("enrollments").upsert({ user_id: user.id, course_slug: course.slug }, { onConflict: "user_id,course_slug" });
      }
      if (cancelled) return;
      setCompleted(saved);
      setIsEnrolled(enrolled);
      setIsReady(true);
    }
    void loadProgress();
    return () => { cancelled = true; };
  }, [course.slug, enrollmentKey, storageKey]);

  useEffect(() => {
    async function onEnroll(event: Event) {
      if ((event as CustomEvent<{ courseSlug: string }>).detail?.courseSlug !== course.slug) return;
      const { user } = await getCurrentUserSafely();
      if (!user) {
        window.localStorage.setItem(enrollmentKey, "true");
        setIsEnrolled(true);
        setMessage("Inscripción guardada en este dispositivo. Inicia sesión para sincronizarla y certificarte.");
        return;
      }
      const { error } = await supabase.from("enrollments").upsert({ user_id: user.id, course_slug: course.slug }, { onConflict: "user_id,course_slug" });
      if (error) { setMessage(error.message); return; }
      setUserId(user.id);
      setIsEnrolled(true);
      setMessage("Inscripción confirmada. Ya puedes comenzar la ruta.");
    }
    window.addEventListener("datam:enroll-course", onEnroll);
    return () => window.removeEventListener("datam:enroll-course", onEnroll);
  }, [course.slug, enrollmentKey]);

  useEffect(() => {
    setCode(lesson.starter ?? STARTER);
    setResult(null);
    setChecks(null);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setMessage("");
  }, [lesson.id]);

  function moduleUnlocked(index: number) { return index === 0 || SQL_CURRICULUM[index - 1].lessons.every((item) => completed.includes(item.id)); }
  function lessonUnlocked(currentModule: number, currentLesson: number) { return moduleUnlocked(currentModule) && SQL_CURRICULUM[currentModule].lessons.slice(0, currentLesson).every((item) => completed.includes(item.id)); }
  function selectModule(index: number) {
    if (!moduleUnlocked(index)) return;
    setModuleIndex(index);
    const lessons = SQL_CURRICULUM[index].lessons;
    setLessonId(lessons.find((item) => !completed.includes(item.id))?.id ?? lessons[lessons.length - 1].id);
    setView("ruta");
  }
  function selectLesson(currentModule: number, currentLesson: number, item: SqlLesson) {
    if (!lessonUnlocked(currentModule, currentLesson)) return;
    setModuleIndex(currentModule);
    setLessonId(item.id);
    setView("ruta");
  }

  function runQuery() {
    if (!code.trim() || code.trim() === STARTER) { setMessage("Escribe una consulta SELECT antes de ejecutarla."); return; }
    const nextResult = runSql(code);
    setResult(nextResult);
    if ("error" in nextResult) {
      setChecks(lesson.type === "sql" ? lesson.checks?.map((check) => ({ desc: check.desc, passed: check.test(code, nextResult) })) ?? [] : null);
      setMessage("No se pudo ejecutar la consulta. Revisa el error y corrige la sintaxis.");
      return;
    }
    const outcomes = lesson.type === "sql" ? lesson.checks?.map((check) => ({ desc: check.desc, passed: check.test(code, nextResult) })) ?? [] : [];
    setChecks(lesson.type === "sql" ? outcomes : null);
    setMessage(lesson.type === "sql"
      ? outcomes.every((check) => check.passed) ? "Todas las comprobaciones pasaron. Ya puedes completar el laboratorio." : `Pasaron ${outcomes.filter((check) => check.passed).length} de ${outcomes.length} comprobaciones.`
      : `Consulta ejecutada: ${nextResult.rowCount} fila${nextResult.rowCount === 1 ? "" : "s"}.`);
  }

  function resetQuery() { setCode(lesson.starter ?? STARTER); setResult(null); setChecks(null); setMessage("Editor reiniciado."); }
  function showSolution() { setCode(lesson.solution ?? ""); setResult(null); setChecks(null); setMessage("Solución cargada. Ejecútala para revisar el resultado y las comprobaciones."); }

  function canComplete() {
    if (completed.includes(lesson.id)) return false;
    if (lesson.type === "sql") return Boolean(checks?.length && checks.every((check) => check.passed));
    if (lesson.type === "quiz") return quizPassed;
    return true;
  }

  async function completeLesson() {
    if (!isEnrolled) { setMessage("Inscríbete gratis para guardar el avance."); return; }
    if (!canComplete()) { setMessage(lesson.type === "sql" ? "Ejecuta la consulta y supera todas las comprobaciones antes de avanzar." : "Aprueba el desafío antes de avanzar."); return; }
    const next = Array.from(new Set([...completed, lesson.id]));
    setCompleted(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setMessage("No se pudo guardar el avance local. Comprueba el espacio disponible."); return; }
    let syncMessage = "";
    if (userId) {
      const databaseLessonId = `${module.title}:${lesson.title}`;
      const { error } = await supabase.from("progress").upsert({ user_id: userId, course_slug: course.slug, lesson_id: databaseLessonId, sincronizado_offline: true }, { onConflict: "user_id,course_slug,lesson_id" });
      if (error) syncMessage = `Avance guardado localmente; no se pudo sincronizar: ${error.message}`;
      else void awardXp(userId, course.slug, databaseLessonId, module.level === "principiante" ? "recordar" : module.level === "intermedio" ? "aplicar" : "crear", lesson.xp);
      if (module.lessons.every((item) => next.includes(item.id))) void registerModuleAchievement(userId, course.slug, moduleIndex);
    }
    setMessage(syncMessage || `Actividad completada: ${lesson.title}.`);
  }

  function reviewQuiz() {
    const questions = lesson.questions ?? [];
    if (quizAnswers.length !== questions.length || quizAnswers.some((answer) => answer === undefined)) { setMessage("Responde todas las preguntas antes de revisar el desafío."); return; }
    setQuizSubmitted(true);
    setMessage(quizCorrect >= PASSING_QUIZ_SCORE ? `Aprobado: ${quizCorrect}/${questions.length}.` : `Resultado: ${quizCorrect}/${questions.length}. Revisa la explicación e inténtalo de nuevo.`);
  }
  function updateStudent(value: string) { setStudentName(value); try { window.localStorage.setItem(`${storageKey}:student`, value); } catch {} }

  if (!isReady) return <section className="sql-player"><p className="p-6 text-sm">Preparando la ruta y sincronizando el avance...</p></section>;
  return (
    <section id="curso-aprendizaje" className="sql-player" aria-label="Ruta profesional de SQL">
      <CourseMenuDisclosure className="sql-sidebar" title="SQL profesional" progress={`${progress}% · ${completed.length}/${totalLessons} actividades`}>
        <div className="sql-brand">DataM <span>Educación continua</span></div>
        <div className="sql-mini"><small>CURSO ACTUAL</small><b>SQL profesional</b><span>{progress}% · {completed.length}/{totalLessons} actividades</span><i><em style={{ width: `${progress}%` }} /></i></div>
        <p className="sql-nav-heading">Ruta del curso</p>
        {([["ruta", BookOpen, "Mi ruta"], ["laboratorio", Database, "Laboratorio SQL"], ["logros", Trophy, "Logros"], ["progreso", BarChart3, "Mi progreso"]] as const).map(([id, Icon, label]) => <button key={id} type="button" onClick={() => setView(id)} className={`sql-nav-item ${view === id ? "active" : ""}`}><span><Icon className="h-4 w-4" /></span><span>{label}</span>{id === "laboratorio" && <small>{completedLabs}/{sqlLessons.length}</small>}</button>)}
        <p className="sql-nav-heading">Evaluación</p>
        <Link className={`sql-nav-item ${allDone ? "" : "locked"}`} href={allDone ? `/cursos/${course.slug}/evaluacion` : "#curso-aprendizaje"} onClick={(event) => { if (!allDone) { event.preventDefault(); setMessage("Completa todos los módulos para habilitar la evaluación final."); } }}><span>📝</span><span>Evaluación final</span>{!allDone && <LockKeyhole className="ml-auto h-4 w-4" />}</Link>
      </CourseMenuDisclosure>
      <main className="sql-main">
        <header className="sql-topbar"><div><span>DataM</span><ChevronRight className="h-3.5 w-3.5" /><span>Bases de datos</span><ChevronRight className="h-3.5 w-3.5" /><b>SQL profesional</b></div><label>Tu ruta <input value={studentName} onChange={(event) => updateStudent(event.target.value)} maxLength={30} placeholder="Tu nombre" aria-label="Nombre para personalizar la ruta" /></label></header>
        {message && <p role="status" className="sql-message">{message}</p>}
        {view === "ruta" && <>
          <section className="sql-route-hero"><div><p className="sql-eyebrow">MI RUTA PROFESIONAL EN SQL · 15 MÓDULOS</p><h2>Consulta. Analiza. Decide.</h2><p>Avanza desde las primeras consultas hasta análisis y decisiones profesionales.</p><label className="sql-person">👤 <input value={studentName} onChange={(event) => updateStudent(event.target.value)} maxLength={30} placeholder="TU NOMBRE" aria-label="Nombre de estudiante" /></label></div><div className="sql-progress-card"><span>PROGRESO</span><b>{progress}%</b><div><i style={{ width: `${progress}%` }} /></div><small>{completed.length}/{totalLessons} actividades completadas</small></div></section>
          <section className="sql-route-board" aria-label="Ruta de módulos SQL"><div className="sql-route-grid">{SQL_CURRICULUM.map((item, index) => {
            const unlocked = moduleUnlocked(index); const active = moduleIndex === index; const stats = moduleProgress[index];
            return <button key={item.id} type="button" disabled={!unlocked} onClick={() => selectModule(index)} className={`sql-route-node ${active ? "active" : ""} ${stats.percent === 100 ? "complete" : ""} ${!unlocked ? "locked" : ""}`} aria-current={active ? "step" : undefined}><span>{stats.percent === 100 ? <Check className="h-6 w-6" /> : !unlocked ? <LockKeyhole className="h-5 w-5" /> : SQL_MODULE_ICONS[index]}</span><small>M{String(index + 1).padStart(2, "0")} · {item.level}</small><b>{item.title}</b><em>{stats.done}/{stats.total} · {stats.percent}%</em></button>;
          })}</div><div className="sql-route-legend"><span><i className="complete" />Completado</span><span><i className="active" />En curso</span><span><i className="available" />Disponible</span><span><i className="locked" />Bloqueado</span></div></section>
          <section className="sql-module-detail"><div className="sql-detail-head"><span>{SQL_MODULE_ICONS[moduleIndex]}</span><div><p>MÓDULO {moduleIndex + 1} DE 15 · {module.level}</p><h3>{module.title}</h3><small>{module.goal}</small></div><b><Clock3 className="h-4 w-4" />{module.minutes} min</b></div><div className="sql-activity-list">{module.lessons.map((item, index) => <button key={item.id} type="button" disabled={!lessonUnlocked(moduleIndex, index)} onClick={() => selectLesson(moduleIndex, index, item)} className={`sql-activity-row ${completed.includes(item.id) ? "done" : ""} ${lesson.id === item.id ? "selected" : ""}`}><span>{completed.includes(item.id) ? <CheckCircle2 className="h-4 w-4" /> : item.type === "reading" ? <BookOpen className="h-4 w-4" /> : item.type === "sql" ? <Database className="h-4 w-4" /> : <CircleHelp className="h-4 w-4" />}</span><span><b>{item.title}</b><small>{item.desc} · {item.minutes} min</small></span><em>+{item.xp} XP</em><ChevronRight className="h-4 w-4" /></button>)}</div><button type="button" className="sql-primary" onClick={() => selectLesson(moduleIndex, selectedLessonIndex, lesson)}>{completed.includes(lesson.id) ? "Repasar actividad" : "Continuar actividad"}<ChevronRight className="h-4 w-4" /></button></section>
          <section className="sql-stats"><article><BarChart3 /><b>{progress}%</b><small>Avance</small></article><article><CheckCircle2 /><b>{completed.length}</b><small>Actividades</small></article><article><Database /><b>{completedLabs}</b><small>Consultas superadas</small></article><article><Trophy /><b>{unlockedAchievements.length}</b><small>Logros</small></article></section>
        </>}
        {view === "laboratorio" && <section className="sql-secondary"><p className="sql-eyebrow">CONSULTAS EJECUTABLES</p><h2>Laboratorio SQL</h2><p>Ejecuta SELECT sobre tienda_db. Las prácticas avanzadas de arquitectura se estudian sin ejecutar comandos no compatibles.</p><div className="sql-lab-list">{sqlLessons.map(({ module: itemModule, moduleIndex: itemIndex, lesson: itemLesson, lessonIndex: itemLessonIndex }) => <button key={itemLesson.id} type="button" disabled={!moduleUnlocked(itemIndex)} onClick={() => selectLesson(itemIndex, itemLessonIndex, itemLesson)}><Database /><span><b>{itemLesson.title}</b><small>{itemModule.title} · +{itemLesson.xp} XP</small></span>{completed.includes(itemLesson.id) ? <CheckCircle2 /> : !moduleUnlocked(itemIndex) ? <LockKeyhole /> : <ChevronRight />}</button>)}</div><SchemaReference /></section>}
        {view === "logros" && <section className="sql-secondary"><p className="sql-eyebrow">HITOS DEL RECORRIDO</p><h2>Tus logros</h2><div className="sql-achievements">{achievements.map((item) => { const unlocked = item.test(completed); return <article key={item.title} className={unlocked ? "unlocked" : ""}><span>{unlocked ? item.icon : "🔒"}</span><b>{item.title}</b><small>{item.desc}</small><em>{unlocked ? "Desbloqueado" : "Por desbloquear"}</em></article>; })}</div></section>}
        {view === "progreso" && <section className="sql-secondary"><p className="sql-eyebrow">TU AVANCE</p><h2>Mi progreso</h2><div className="sql-progress-summary"><article><Zap /><b>{completed.reduce((sum, id) => sum + (allLessons.find((item) => item.lesson.id === id)?.lesson.xp ?? 0), 0)} XP</b><small>Experiencia acumulada</small></article><article><CheckCircle2 /><b>{completed.length}/{totalLessons}</b><small>Actividades completas</small></article><article><BarChart3 /><b>{progress}%</b><small>Avance del curso</small></article></div><div className="sql-progress-modules">{SQL_CURRICULUM.map((item, index) => <article key={item.id}><div><b>{SQL_MODULE_ICONS[index]} {index + 1}. {item.title}</b><small>{moduleProgress[index].done}/{moduleProgress[index].total} · {moduleProgress[index].percent}%</small></div><span><i style={{ width: `${moduleProgress[index].percent}%` }} /></span></article>)}</div></section>}
        {view === "ruta" && <section className="sql-lesson-panel" aria-label={`Actividad ${lesson.title}`}>
          <div className="sql-lesson-header"><div><p className="sql-eyebrow">MÓDULO {moduleIndex + 1} · ACTIVIDAD {selectedLessonIndex + 1} DE {module.lessons.length}</p><h2>{lesson.title}</h2><p>{lesson.desc}</p></div><div><span><Clock3 className="h-4 w-4" />{lesson.minutes} min</span><span><Zap className="h-4 w-4" />+{lesson.xp} XP</span></div></div>
          <div className="sql-objectives"><b>Al finalizar podrás</b><ul>{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div>
          {lesson.type === "reading" && <><article className="sql-reading" dangerouslySetInnerHTML={{ __html: lesson.content ?? "" }} /><div className="sql-key-points"><b>Ideas clave</b><ul>{lesson.keyPoints?.map((point) => <li key={point}>{point}</li>)}</ul></div></>}
          {lesson.type === "sql" && <section className="sql-workbench"><div className="sql-prompt" dangerouslySetInnerHTML={{ __html: lesson.prompt ?? "" }} /><div className="sql-editor-heading"><span><Code2 className="h-4 w-4" /> consulta.sql</span><small>SELECT · tienda_db</small></div><textarea aria-label="Editor de consulta SQL" spellCheck={false} value={code} onChange={(event) => { setCode(event.target.value); setResult(null); setChecks(null); }} placeholder="SELECT columna FROM tabla;" /><div className="sql-actions"><button type="button" className="sql-primary" onClick={runQuery}><Code2 className="h-4 w-4" />Ejecutar consulta</button><button type="button" onClick={resetQuery}><RotateCcw className="h-4 w-4" />Reiniciar</button><button type="button" onClick={showSolution}><Sparkles className="h-4 w-4" />Ver solución</button></div>
            {result && "error" in result && <pre className="sql-error">{result.error}</pre>}
            {result && isSqlResult(result) && <ResultsTable result={result} />}
            {checks && <ul className="sql-checks">{checks.map((check) => <li key={check.desc} className={check.passed ? "passed" : "failed"}>{check.passed ? <CheckCircle2 className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}{check.desc}</li>)}</ul>}
            <details className="sql-hint"><summary><Sparkles className="h-4 w-4" /> Pista y esquema</summary><p>{lesson.dax.hint}</p><p>{lesson.dax.explain}</p><pre>{lesson.dax.example}</pre><SchemaReference /></details>
          </section>}
          {lesson.type === "quiz" && <section className="sql-quiz">{lesson.questions?.map((question, questionIndex) => { const isCorrect = quizAnswers[questionIndex] === question.correct; return <fieldset key={question.q} className={quizSubmitted ? isCorrect ? "correct" : "incorrect" : ""}><legend>{questionIndex + 1}. {question.q}</legend>{question.options.map((option, optionIndex) => <label key={`${questionIndex}-${optionIndex}`}><input type="radio" name={`${lesson.id}-${questionIndex}`} disabled={quizSubmitted} checked={quizAnswers[questionIndex] === optionIndex} onChange={() => setQuizAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next; })} /><span>{option}</span></label>)}{quizSubmitted && <p>{isCorrect ? "Correcto. " : `Respuesta: ${question.options[question.correct]}. `}{question.explain}</p>}</fieldset>})}{!quizSubmitted ? <button type="button" className="sql-primary" onClick={reviewQuiz}>Revisar respuestas</button> : !quizPassed ? <button type="button" onClick={() => { setQuizSubmitted(false); setQuizAnswers([]); }}>Intentar de nuevo</button> : <p className="sql-quiz-passed">Aprobado: {quizCorrect}/{lesson.questions?.length}</p>}</section>}
          <footer className="sql-lesson-footer">{completed.includes(lesson.id) ? <span><CheckCircle2 className="h-4 w-4" />Actividad completada</span> : <button type="button" className="sql-primary" disabled={!isEnrolled || !canComplete()} onClick={() => void completeLesson()}>{!isEnrolled ? "Inscríbete para guardar" : lesson.type === "sql" && !canComplete() ? "Supera las comprobaciones" : lesson.type === "quiz" && !canComplete() ? "Aprueba el desafío" : "Completar actividad"}<ChevronRight className="h-4 w-4" /></button>}<small>Las actividades se desbloquean en orden.</small></footer>
          {!isEnrolled && <button type="button" className="sql-enroll" onClick={() => window.dispatchEvent(new CustomEvent("datam:enroll-course", { detail: { courseSlug: course.slug } }))}>Inscribirme gratis y guardar mi progreso</button>}
        </section>}
        {allDone && isEnrolled && <section className="sql-finish"><Trophy /><div><b>Ruta completada</b><p>Ya puedes rendir la evaluación final de SQL.</p></div><Link href={`/cursos/${course.slug}/evaluacion`}>Ir a evaluación <ChevronRight className="h-4 w-4" /></Link></section>}
      </main>
    </section>
  );
}

function isSqlResult(result: SqlRunResult): result is SqlResult {
  return !("error" in result);
}

function ResultsTable({ result }: { result: SqlResult }) {
  return <div className="sql-result"><div><b>Resultado</b><small>{result.rowCount} filas</small></div><div className="sql-result-scroll"><table><thead><tr>{result.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{result.rows.map((row, index) => <tr key={index}>{result.columns.map((column) => <td key={column}>{row[column] === null ? <i>NULL</i> : String(row[column] ?? "")}</td>)}</tr>)}</tbody></table>{result.rows.length === 0 && <p>La consulta no devolvió filas.</p>}</div></div>;
}

function SchemaReference() {
  return <div className="sql-table-reference">{Object.entries(SQL_SAMPLE_DATABASE).map(([name, rows]) => <article key={name}><b>{name}</b><span>{Object.keys(rows[0] ?? {}).join(" · ")}</span></article>)}</div>;
}
