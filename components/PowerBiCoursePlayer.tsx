"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, BookOpen, Check, CheckCircle2, ChevronRight, CircleHelp, Clock3, Database, LockKeyhole, RotateCcw, Sparkles, Trophy, Zap } from "lucide-react";
import type { Course } from "@/lib/courses";
import { awardXp, registerModuleAchievement } from "@/lib/gamification";
import { getCurrentUserSafely } from "@/lib/supabase/session";
import { supabase } from "@/lib/supabase/client";
import { POWER_BI_CURRICULUM, POWER_BI_MODULE_ICONS, type PowerBiLesson } from "@/lib/powerBiCurriculum";
import { evaluateDax, POWER_BI_SAMPLE_MODEL, type DaxScalar } from "@/lib/powerBiDaxEngine";

type View = "ruta" | "laboratorio" | "logros" | "progreso";
const PASSING_QUIZ_SCORE = 3;
const allLessons = POWER_BI_CURRICULUM.flatMap((module, moduleIndex) => module.lessons.map((lesson, lessonIndex) => ({ module, moduleIndex, lesson, lessonIndex })));
const totalLessons = allLessons.length;
const daxLessons = allLessons.map((item) => item.lesson).filter((lesson) => lesson.type === "dax");
const achievements = [
  { name: "Primera medida", description: "Completa tu primera práctica DAX", icon: "🌱", test: (completed: string[]) => daxLessons.some((lesson) => completed.includes(lesson.id)) },
  { name: "Modelo en estrella", description: "Completa los fundamentos de modelado", icon: "🔗", test: (completed: string[]) => POWER_BI_CURRICULUM[2].lessons.every((lesson) => completed.includes(lesson.id)) },
  { name: "BI en marcha", description: "Completa la mitad de la ruta", icon: "📈", test: (completed: string[]) => completed.length >= Math.ceil(totalLessons / 2) },
  { name: "Analista BI", description: "Completa los quince módulos", icon: "🏆", test: (completed: string[]) => completed.length === totalLessons },
];

export default function PowerBiCoursePlayer({ course }: { course: Course }) {
  const [view, setView] = useState<View>("ruta");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonId, setLessonId] = useState(POWER_BI_CURRICULUM[0].lessons[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<DaxScalar | undefined>(undefined);
  const [runtimeError, setRuntimeError] = useState("");
  const [checks, setChecks] = useState<Array<{ desc: string; passed: boolean }> | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [studentName, setStudentName] = useState("");
  const storageKey = `datam-powerbi-curriculum-v1:${course.slug}`;
  const enrollmentKey = `datam-enrollment:guest:${course.slug}`;
  const module = POWER_BI_CURRICULUM[moduleIndex];
  const lesson = module.lessons.find((item) => item.id === lessonId) ?? module.lessons[0];
  const progress = totalLessons ? Math.round(completed.length / totalLessons * 100) : 0;
  const quizScore = lesson.questions?.reduce((total, question, index) => total + Number(quizAnswers[index] === question.correct), 0) ?? 0;
  const quizPassed = quizSubmitted && quizScore >= PASSING_QUIZ_SCORE;
  const moduleProgress = useMemo(() => POWER_BI_CURRICULUM.map((item) => {
    const done = item.lessons.filter((entry) => completed.includes(entry.id)).length;
    return { done, total: item.lessons.length, percent: Math.round(done / item.lessons.length * 100) };
  }), [completed]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let saved: string[] = [];
      try {
        const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
        const valid = new Set(allLessons.map((item) => item.lesson.id));
        saved = Array.isArray(parsed) ? Array.from(new Set(parsed.filter((id): id is string => typeof id === "string" && valid.has(id)))) : [];
      } catch { window.localStorage.removeItem(storageKey); }
      let enrolled = window.localStorage.getItem(enrollmentKey) === "true";
      setStudentName(window.localStorage.getItem(`${storageKey}:student`) ?? "");
      const { user } = await getCurrentUserSafely();
      if (cancelled) return;
      setUserId(user?.id ?? null);
      if (user) {
        const [{ data: enrollment }, { data: rows }] = await Promise.all([
          supabase.from("enrollments").select("id").eq("user_id", user.id).eq("course_slug", course.slug).maybeSingle(),
          supabase.from("progress").select("lesson_id").eq("user_id", user.id).eq("course_slug", course.slug),
        ]);
        enrolled = Boolean(enrollment) || enrolled;
        const lessonByKey = new Map(allLessons.map(({ module: item, lesson: itemLesson }) => [`${item.title}:${itemLesson.title}`, itemLesson.id] as const));
        const existingKeys = new Set((rows ?? []).map((row) => row.lesson_id));
        saved = Array.from(new Set([...saved, ...(rows ?? []).map((row) => lessonByKey.get(row.lesson_id)).filter((id): id is string => Boolean(id))]));
        const pending = saved.flatMap((id) => {
          const entry = allLessons.find((item) => item.lesson.id === id);
          if (!entry) return [];
          const key = `${entry.module.title}:${entry.lesson.title}`;
          return existingKeys.has(key) ? [] : [{ user_id: user.id, course_slug: course.slug, lesson_id: key, sincronizado_offline: true }];
        });
        if (pending.length) await supabase.from("progress").upsert(pending, { onConflict: "user_id,course_slug,lesson_id" });
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
      setMessage("Inscripción confirmada. Comienza por el primer módulo.");
    }
    window.addEventListener("datam:enroll-course", onEnroll);
    return () => window.removeEventListener("datam:enroll-course", onEnroll);
  }, [course.slug, enrollmentKey]);

  useEffect(() => {
    setCode(lesson.starter ?? "");
    setResult(undefined);
    setRuntimeError("");
    setChecks(null);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setMessage("");
  }, [lesson.id, lesson.starter]);

  function moduleUnlocked(index: number) { return index === 0 || POWER_BI_CURRICULUM[index - 1].lessons.every((item) => completed.includes(item.id)); }
  function lessonUnlocked(currentModule: number, currentLesson: number) { return moduleUnlocked(currentModule) && POWER_BI_CURRICULUM[currentModule].lessons.slice(0, currentLesson).every((item) => completed.includes(item.id)); }
  function selectModule(index: number) {
    if (!moduleUnlocked(index)) return;
    setModuleIndex(index);
    const lessons = POWER_BI_CURRICULUM[index].lessons;
    setLessonId(lessons.find((item) => !completed.includes(item.id))?.id ?? lessons[lessons.length - 1].id);
    setView("ruta");
  }
  function selectLesson(currentModule: number, currentLesson: number, item: PowerBiLesson) {
    if (!lessonUnlocked(currentModule, currentLesson)) return;
    setModuleIndex(currentModule);
    setLessonId(item.id);
    setView("ruta");
  }
  function runDax() {
    try {
      const value = evaluateDax(code);
      setResult(value);
      setRuntimeError("");
      if (lesson.type === "dax") {
        const nextChecks = lesson.checks?.map((check) => ({ desc: check.desc, passed: check.test(code, value) })) ?? [];
        setChecks(nextChecks);
        setMessage(nextChecks.every((check) => check.passed) ? "Todas las comprobaciones pasaron. Ya puedes completar esta práctica." : `Pasaron ${nextChecks.filter((check) => check.passed).length} de ${nextChecks.length} comprobaciones. Revisa los criterios pendientes.`);
      } else setMessage("Medida ejecutada sobre la tabla de práctica.");
    } catch (error) {
      setResult(undefined);
      setChecks(lesson.type === "dax" ? lesson.checks?.map((check) => ({ desc: check.desc, passed: false })) ?? [] : null);
      const detail = error instanceof Error ? error.message : "No se pudo evaluar la expresión DAX.";
      setRuntimeError(detail);
      setMessage(detail);
    }
  }
  function resetDax() { setCode(lesson.starter ?? ""); setResult(undefined); setRuntimeError(""); setChecks(null); setMessage(""); }
  function showSolution() { setCode(lesson.solution ?? ""); setResult(undefined); setChecks(null); setMessage("Solución cargada. Ejecuta la medida para revisar el resultado."); }

  async function completeLesson() {
    if (!isEnrolled) { setMessage("Inscríbete gratis para guardar el avance."); return; }
    if (completed.includes(lesson.id)) return;
    if (lesson.type === "dax" && !checks?.every((check) => check.passed)) { setMessage("Supera todas las comprobaciones antes de avanzar."); return; }
    if (lesson.type === "quiz" && !quizPassed) { setMessage("Aprueba el desafío antes de avanzar."); return; }
    const next = Array.from(new Set([...completed, lesson.id]));
    setCompleted(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setMessage("No se pudo guardar el avance en este dispositivo."); return; }
    let syncError = "";
    if (userId) {
      const databaseLessonId = `${module.title}:${lesson.title}`;
      const { error } = await supabase.from("progress").upsert({ user_id: userId, course_slug: course.slug, lesson_id: databaseLessonId, sincronizado_offline: true }, { onConflict: "user_id,course_slug,lesson_id" });
      if (error) syncError = `Progreso local guardado; fallo la sincronización: ${error.message}`;
      else void awardXp(userId, course.slug, databaseLessonId, module.level === "principiante" ? "recordar" : module.level === "intermedio" ? "aplicar" : "crear", lesson.xp);
      if (module.lessons.every((item) => next.includes(item.id))) void registerModuleAchievement(userId, course.slug, moduleIndex);
    }
    setMessage(syncError || `Actividad completada: ${lesson.title}.`);
  }
  function reviewQuiz() {
    const questions = lesson.questions ?? [];
    if (quizAnswers.length !== questions.length || quizAnswers.some((answer) => answer === undefined)) { setMessage("Responde todas las preguntas para revisar el desafío."); return; }
    setQuizSubmitted(true);
    const score = questions.reduce((total, question, index) => total + Number(quizAnswers[index] === question.correct), 0);
    setMessage(score >= PASSING_QUIZ_SCORE ? `Aprobado: ${score}/${questions.length}.` : `Resultado ${score}/${questions.length}. Revisa las explicaciones y vuelve a intentarlo.`);
  }
  function updateStudent(name: string) { setStudentName(name); try { window.localStorage.setItem(`${storageKey}:student`, name); } catch {} }

  if (!isReady) return <section className="powerbi-player"><p className="p-6 text-sm text-blue-100">Preparando tu ruta y sincronizando el avance...</p></section>;

  const labCount = daxLessons.filter((item) => completed.includes(item.id)).length;
  const unlockedAchievements = achievements.filter((item) => item.test(completed));
  const currentLessonIndex = module.lessons.findIndex((item) => item.id === lesson.id);
  const lastDone = completed.length === totalLessons;

  return (
    <section id="curso-aprendizaje" className="powerbi-player" aria-label="Power BI de cero a avanzado">
      <aside className="powerbi-sidebar">
        <div className="powerbi-brand">DataM <span>AI</span></div>
        <div className="powerbi-mini"><small>RUTA ACTUAL</small><b>📊 Power BI Profesional</b><span>{progress}% · {completed.length}/{totalLessons}</span><i><em style={{ width: `${progress}%` }} /></i></div>
        <p className="powerbi-nav-heading">Aprendizaje</p>
        {([["ruta", "🗺️", "Mi ruta"], ["laboratorio", "📐", "Laboratorio DAX"], ["logros", "🏆", "Logros"], ["progreso", "📈", "Mi progreso"]] as const).map(([id, icon, label]) => <button key={id} type="button" onClick={() => setView(id)} className={`powerbi-nav-item ${view === id ? "active" : ""}`}>{icon}<span>{label}</span>{id === "laboratorio" && <small>{labCount}/{daxLessons.length}</small>}</button>)}
        <p className="powerbi-nav-heading">Evaluación</p>
        <Link className={`powerbi-nav-item ${!lastDone ? "locked" : ""}`} href={lastDone ? `/cursos/${course.slug}/evaluacion` : "#curso-aprendizaje"} onClick={(event) => { if (!lastDone) { event.preventDefault(); setMessage("Completa los quince módulos para habilitar la evaluación final."); } }}>📝<span>Evaluación final</span>{!lastDone && <LockKeyhole className="ml-auto h-3.5 w-3.5" />}</Link>
      </aside>
      <main className="powerbi-player-main">
        <header className="powerbi-topbar"><div><span>DataM</span><ChevronRight className="h-3.5 w-3.5" /><span>Business Intelligence</span><ChevronRight className="h-3.5 w-3.5" /><b>Power BI</b></div><label>Tu ruta <input value={studentName} onChange={(event) => updateStudent(event.target.value)} maxLength={30} placeholder="Tu nombre" aria-label="Nombre para personalizar tu ruta" /></label></header>
        {message && <p role="status" className="powerbi-message">{message}</p>}
        {view === "ruta" && <>
          <section className="powerbi-route-hero"><div><p className="powerbi-eyebrow">BUSINESS INTELLIGENCE · 15 MÓDULOS</p><h2>Power BI: de Cero a Avanzado</h2><p>Conecta, modela, analiza y comunica datos con criterio profesional.</p><div className="powerbi-route-person">👤 <b>{studentName.trim() || "Tu ruta profesional"}</b></div></div><div className="powerbi-progress-card"><span>PROGRESO</span><b>{progress}%</b><div><i style={{ width: `${progress}%` }} /></div><small>{completed.length}/{totalLessons} actividades completadas</small></div></section>
          <section className="powerbi-route-board" aria-label="Ruta de módulos de Power BI"><div className="powerbi-route-grid">{POWER_BI_CURRICULUM.map((item, index) => {
            const unlocked = moduleUnlocked(index);
            const active = moduleIndex === index;
            const stats = moduleProgress[index];
            return <button key={item.id} type="button" disabled={!unlocked} onClick={() => selectModule(index)} className={`powerbi-route-node ${active ? "active" : ""} ${stats.percent === 100 ? "complete" : ""} ${!unlocked ? "locked" : ""}`} aria-current={active ? "step" : undefined}><span>{stats.percent === 100 ? <Check className="h-6 w-6" /> : !unlocked ? <LockKeyhole className="h-5 w-5" /> : POWER_BI_MODULE_ICONS[index]}</span><small>M{String(index + 1).padStart(2, "0")} · {item.level}</small><b>{item.title}</b><em>{stats.done}/{stats.total} actividades</em></button>;
          })}</div><div className="powerbi-route-legend"><span><i className="complete" />Completado</span><span><i className="active" />En curso</span><span><i className="available" />Disponible</span><span><i className="locked" />Bloqueado</span></div></section>
          <section className="powerbi-module-detail"><div className="powerbi-detail-head"><span>{POWER_BI_MODULE_ICONS[moduleIndex]}</span><div><p>MÓDULO {moduleIndex + 1} DE 15 · {module.level}</p><h3>{module.title}</h3><small>{module.goal}</small></div><b><Clock3 className="h-4 w-4" />{module.minutes} min</b></div><div className="powerbi-activities">{module.lessons.map((item, index) => <button key={item.id} type="button" disabled={!lessonUnlocked(moduleIndex, index)} onClick={() => selectLesson(moduleIndex, index, item)} className={`powerbi-activity ${completed.includes(item.id) ? "done" : ""} ${lesson.id === item.id ? "selected" : ""}`}><span>{completed.includes(item.id) ? <CheckCircle2 className="h-4 w-4" /> : item.type === "reading" ? <BookOpen className="h-4 w-4" /> : item.type === "dax" ? <Database className="h-4 w-4" /> : <CircleHelp className="h-4 w-4" />}</span><span><b>{item.title}</b><small>{item.desc} · {item.minutes} min</small></span><em>+{item.xp} XP</em><ChevronRight className="h-4 w-4" /></button>)}</div><button type="button" className="powerbi-primary" onClick={() => selectLesson(moduleIndex, currentLessonIndex, lesson)}>Continuar actividad <ChevronRight className="h-4 w-4" /></button></section>
          <section className="powerbi-stats"><article><BarChart3 /><b>{progress}%</b><small>Avance</small></article><article><CheckCircle2 /><b>{completed.length}</b><small>Actividades</small></article><article><Database /><b>{labCount}</b><small>Prácticas DAX</small></article><article><Trophy /><b>{unlockedAchievements.length}</b><small>Logros</small></article></section>
        </>}
        {view === "laboratorio" && <section className="powerbi-secondary"><p className="powerbi-eyebrow">PRÁCTICA DE MEDIDAS</p><h2>Laboratorio DAX</h2><p>Escribe medidas sobre un modelo de ventas de práctica. El motor verifica la expresión y el resultado.</p><div className="powerbi-lab-grid">{allLessons.filter(({ lesson: item }) => item.type === "dax").map(({ module: itemModule, moduleIndex: itemIndex, lesson: itemLesson, lessonIndex: itemLessonIndex }) => <button key={itemLesson.id} type="button" disabled={!moduleUnlocked(itemIndex)} onClick={() => selectLesson(itemIndex, itemLessonIndex, itemLesson)}><Database /><span><b>{itemLesson.title}</b><small>{itemModule.title} · +{itemLesson.xp} XP</small></span>{completed.includes(itemLesson.id) ? <CheckCircle2 /> : <ChevronRight />}</button>)}</div></section>}
        {view === "logros" && <section className="powerbi-secondary"><p className="powerbi-eyebrow">HITOS DE APRENDIZAJE</p><h2>Tus logros</h2><div className="powerbi-achievements">{achievements.map((item) => { const unlocked = item.test(completed); return <article key={item.name} className={unlocked ? "unlocked" : ""}><span>{unlocked ? item.icon : "🔒"}</span><b>{item.name}</b><small>{item.description}</small><em>{unlocked ? "Desbloqueado" : "Por desbloquear"}</em></article>; })}</div></section>}
        {view === "progreso" && <section className="powerbi-secondary"><p className="powerbi-eyebrow">TU AVANCE</p><h2>Mi progreso</h2><div className="powerbi-progress-stats"><article><Zap /><b>{completed.reduce((sum, id) => sum + (allLessons.find((item) => item.lesson.id === id)?.lesson.xp ?? 0), 0)} XP</b><small>Experiencia</small></article><article><CheckCircle2 /><b>{completed.length}/{totalLessons}</b><small>Actividades</small></article><article><BarChart3 /><b>{progress}%</b><small>Completado</small></article></div><div className="powerbi-progress-modules">{POWER_BI_CURRICULUM.map((item, index) => <article key={item.id}><div><b>{POWER_BI_MODULE_ICONS[index]} {index + 1}. {item.title}</b><small>{moduleProgress[index].done}/{moduleProgress[index].total} · {moduleProgress[index].percent}%</small></div><span><i style={{ width: `${moduleProgress[index].percent}%` }} /></span></article>)}</div></section>}

        {view === "ruta" && <section className="powerbi-lesson-panel">
          <header className="powerbi-lesson-heading"><div><p className="powerbi-eyebrow">MÓDULO {moduleIndex + 1} · ACTIVIDAD {currentLessonIndex + 1} DE {module.lessons.length}</p><h2>{lesson.title}</h2><p>{lesson.desc}</p></div><div><span><Clock3 className="h-4 w-4" />{lesson.minutes} min</span><span><Zap className="h-4 w-4" />+{lesson.xp} XP</span></div></header>
          <div className="powerbi-objectives"><b>Al finalizar podrás</b><ul>{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div>
          {lesson.type === "reading" && <><article className="powerbi-reading" dangerouslySetInnerHTML={{ __html: lesson.content ?? "" }} /><div className="powerbi-key-points"><b>Ideas clave</b><ul>{lesson.keyPoints?.map((point) => <li key={point}>{point}</li>)}</ul></div></>}
          {lesson.type === "dax" && <section className="powerbi-dax-lab"><div className="powerbi-lab-prompt" dangerouslySetInnerHTML={{ __html: lesson.prompt ?? "" }} /><div className="powerbi-data-preview"><div><b>Modelo de práctica · Ventas</b><small>6 registros · modelo aislado</small></div><div className="powerbi-table-scroll"><table><thead><tr><th>Producto</th><th>Ciudad</th><th>Vendedor</th><th>Ventas</th><th>Cantidad</th></tr></thead><tbody>{POWER_BI_SAMPLE_MODEL.Ventas.map((row, index) => <tr key={`${row.Producto}-${index}`}><td>{row.Producto}</td><td>{row.Ciudad}</td><td>{row.Vendedor}</td><td>{row.Ventas}</td><td>{row.Cantidad}</td></tr>)}</tbody></table></div></div><label className="powerbi-editor-label" htmlFor="powerbi-dax-editor">Expresión de medida DAX</label><textarea id="powerbi-dax-editor" value={code} onChange={(event) => { setCode(event.target.value); setResult(undefined); setRuntimeError(""); setChecks(null); }} placeholder="SUM(Ventas[Ventas])" spellCheck={false} /><div className="powerbi-lab-actions"><button type="button" className="powerbi-primary" onClick={runDax}><Sparkles className="h-4 w-4" /> Ejecutar y comprobar</button><button type="button" onClick={resetDax}><RotateCcw className="h-4 w-4" /> Reiniciar</button><button type="button" onClick={showSolution}>Ver solución</button></div><div className={`powerbi-result ${runtimeError ? "error" : ""}`}><span>RESULTADO</span><b>{runtimeError || (result === undefined ? "—" : result === null ? "BLANK()" : typeof result === "number" ? Number.isInteger(result) ? result : result.toFixed(2) : String(result))}</b></div>{checks && <ul className="powerbi-checks">{checks.map((check) => <li key={check.desc} className={check.passed ? "passed" : "failed"}>{check.passed ? <CheckCircle2 className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}{check.desc}</li>)}</ul>}<details className="powerbi-hint"><summary><Sparkles className="h-4 w-4" /> Pista de Dax</summary><p>{lesson.dax.hint}</p></details></section>}
          {lesson.type === "quiz" && <section className="powerbi-quiz">{lesson.questions?.map((question, questionIndex) => { const correct = quizAnswers[questionIndex] === question.correct; return <fieldset key={question.q} className={quizSubmitted ? correct ? "correct" : "incorrect" : ""}><legend>{questionIndex + 1}. {question.q}</legend>{question.options.map((option, optionIndex) => <label key={optionIndex}><input type="radio" name={`${lesson.id}-${questionIndex}`} disabled={quizSubmitted} checked={quizAnswers[questionIndex] === optionIndex} onChange={() => setQuizAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next; })} /><span>{option}</span></label>)}{quizSubmitted && <p>{correct ? "Correcto. " : `Respuesta: ${question.options[question.correct]}. `}{question.explain}</p>}</fieldset>; })}{!quizSubmitted ? <button type="button" className="powerbi-primary" onClick={reviewQuiz}>Revisar respuestas</button> : !quizPassed ? <button type="button" onClick={() => { setQuizSubmitted(false); setQuizAnswers([]); }}>Intentar de nuevo</button> : <p className="powerbi-quiz-passed">Aprobado: {quizScore}/{lesson.questions?.length}</p>}</section>}
          <section className="powerbi-dax-tip"><span>DAX</span><div><b>Una pista para pensar</b><p>{lesson.dax.hint}</p><small>{lesson.dax.explain}</small><pre>{lesson.dax.example}</pre></div></section>
          <footer className="powerbi-lesson-footer">{completed.includes(lesson.id) ? <span className="powerbi-done"><CheckCircle2 className="h-4 w-4" />Actividad completada</span> : <button type="button" className="powerbi-primary" disabled={!isEnrolled || lesson.type === "dax" && !checks?.every((check) => check.passed) || lesson.type === "quiz" && !quizPassed} onClick={() => void completeLesson()}>{!isEnrolled ? "Inscríbete para guardar" : lesson.type === "dax" && !checks?.every((check) => check.passed) ? "Supera todas las comprobaciones" : lesson.type === "quiz" && !quizPassed ? "Aprueba el desafío" : "Completar actividad"}<ChevronRight className="h-4 w-4" /></button>}<small>El progreso desbloquea módulos y evaluación final.</small></footer>
          {!isEnrolled && <button type="button" className="powerbi-enroll" onClick={() => window.dispatchEvent(new CustomEvent("datam:enroll-course", { detail: { courseSlug: course.slug } }))}>Inscribirme gratis y guardar mi progreso</button>}
        </section>}
        {lastDone && isEnrolled && <section className="powerbi-finish"><Trophy /><div><b>Ruta completada</b><p>Ya puedes rendir la evaluación final de Power BI.</p></div><Link href={`/cursos/${course.slug}/evaluacion`}>Ir a evaluación <ChevronRight className="h-4 w-4" /></Link></section>}
      </main>
    </section>
  );
}