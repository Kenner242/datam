"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, BookOpen, Check, CheckCircle2, ChevronRight, CircleHelp, Clock3, FileSpreadsheet, LockKeyhole, RotateCcw, Sparkles, Trophy, Zap } from "lucide-react";
import type { Course } from "@/lib/courses";
import { awardXp, registerModuleAchievement } from "@/lib/gamification";
import { getCurrentUserSafely } from "@/lib/supabase/session";
import { supabase } from "@/lib/supabase/client";
import { EXCEL_CURRICULUM, EXCEL_MODULE_ICONS, type ExcelCellMap, type ExcelLesson, type ExcelValueMap } from "@/lib/excelCurriculum";
import { calculateExcelSheet } from "@/lib/excelFormulaEngine";

type View = "ruta" | "laboratorio" | "logros" | "progreso";
const PASSING_QUIZ_SCORE = 3;
const COLUMNS = "ABCDEFGH".split("");
const ACHIEVEMENTS = [
  { id: "inicio", title: "Primera fórmula", detail: "Completa tu primera actividad", icon: "🌱", unlock: (completed: string[]) => completed.length > 0 },
  { id: "laboratorio", title: "Manos a la hoja", detail: "Supera cuatro laboratorios", icon: "🧪", unlock: (completed: string[]) => sheetLessons.filter((lesson) => completed.includes(lesson.id)).length >= 4 },
  { id: "mitad", title: "Media ruta", detail: "Completa la mitad del curso", icon: "📈", unlock: (completed: string[]) => completed.length >= Math.ceil(totalLessons / 2) },
  { id: "dominio", title: "Excel profesional", detail: "Completa las quince unidades", icon: "🏆", unlock: (completed: string[]) => completed.length === totalLessons },
];
const allLessons = EXCEL_CURRICULUM.flatMap((module, moduleIndex) => module.lessons.map((lesson, lessonIndex) => ({ module, moduleIndex, lesson, lessonIndex })));
const totalLessons = allLessons.length;
const sheetLessons = allLessons.map((entry) => entry.lesson).filter((lesson) => lesson.type === "sheet");

export default function ExcelCoursePlayer({ course }: { course: Course }) {
  const [view, setView] = useState<View>("ruta");
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState(EXCEL_CURRICULUM[0].lessons[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [cells, setCells] = useState<ExcelCellMap>({});
  const [selectedCell, setSelectedCell] = useState("A1");
  const [checked, setChecked] = useState<Array<{ desc: string; passed: boolean }> | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [studentName, setStudentName] = useState("");
  const storageKey = `datam-excel-curriculum-v1:${course.slug}`;
  const enrollmentKey = `datam-enrollment:guest:${course.slug}`;
  const activeModule = EXCEL_CURRICULUM[activeModuleIndex];
  const activeLesson = activeModule.lessons.find((lesson) => lesson.id === activeLessonId) ?? activeModule.lessons[0];
  const computed = useMemo(() => calculateExcelSheet(cells), [cells]);
  const progress = totalLessons ? Math.round(completed.length / totalLessons * 100) : 0;
  const quizScore = activeLesson.questions?.reduce((score, question, index) => score + Number(quizAnswers[index] === question.correct), 0) ?? 0;
  const quizPassed = quizSubmitted && quizScore >= PASSING_QUIZ_SCORE;
  const moduleProgress = useMemo(() => EXCEL_CURRICULUM.map((module) => {
    const done = module.lessons.filter((lesson) => completed.includes(lesson.id)).length;
    return { done, total: module.lessons.length, percent: Math.round(done / module.lessons.length * 100) };
  }), [completed]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let saved: string[] = [];
      try {
        const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
        const valid = new Set(allLessons.map(({ lesson }) => lesson.id));
        saved = Array.isArray(parsed) ? Array.from(new Set(parsed.filter((id): id is string => typeof id === "string" && valid.has(id)))) : [];
      } catch { window.localStorage.removeItem(storageKey); }
      const storedName = window.localStorage.getItem(`${storageKey}:student`) ?? "";
      const { user } = await getCurrentUserSafely();
      if (cancelled) return;
      setUserId(user?.id ?? null);
      setStudentName(storedName);
      let enrolled = window.localStorage.getItem(enrollmentKey) === "true";
      if (user) {
        const [{ data: enrollment }, { data: rows }] = await Promise.all([
          supabase.from("enrollments").select("id").eq("user_id", user.id).eq("course_slug", course.slug).maybeSingle(),
          supabase.from("progress").select("lesson_id").eq("user_id", user.id).eq("course_slug", course.slug),
        ]);
        enrolled = Boolean(enrollment) || enrolled;
        const idForDatabase = new Map(allLessons.map(({ module, lesson }) => [`${module.title}:${lesson.title}`, lesson.id] as const));
        const databaseIds = new Set((rows ?? []).map((row) => row.lesson_id));
        saved = Array.from(new Set([...saved, ...(rows ?? []).map((row) => idForDatabase.get(row.lesson_id)).filter((id): id is string => Boolean(id))]));
        const missing = saved.flatMap((id) => {
          const entry = allLessons.find((item) => item.lesson.id === id);
          if (!entry) return [];
          const databaseId = `${entry.module.title}:${entry.lesson.title}`;
          return databaseIds.has(databaseId) ? [] : [{ user_id: user.id, course_slug: course.slug, lesson_id: databaseId, sincronizado_offline: true }];
        });
        if (missing.length) await supabase.from("progress").upsert(missing, { onConflict: "user_id,course_slug,lesson_id" });
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
      if ((event as CustomEvent<{ courseSlug: string }>).detail?.courseSlug !== course.slug) return;
      const { user } = await getCurrentUserSafely();
      if (!user) {
        window.localStorage.setItem(enrollmentKey, "true");
        setIsEnrolled(true);
        setMessage("Inscripción guardada localmente. Inicia sesión para sincronizarla y certificarte.");
        return;
      }
      const { error } = await supabase.from("enrollments").upsert({ user_id: user.id, course_slug: course.slug }, { onConflict: "user_id,course_slug" });
      if (error) { setMessage(error.message); return; }
      setUserId(user.id);
      setIsEnrolled(true);
      setMessage("Inscripción confirmada. Ya puedes comenzar la ruta.");
    }
    window.addEventListener("datam:enroll-course", handleEnrollment);
    return () => window.removeEventListener("datam:enroll-course", handleEnrollment);
  }, [course.slug, enrollmentKey]);

  useEffect(() => {
    setCells({});
    setChecked(null);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setMessage("");
    setSelectedCell("A1");
  }, [activeLesson.id]);

  function moduleUnlocked(index: number) {
    return index === 0 || EXCEL_CURRICULUM[index - 1].lessons.every((lesson) => completed.includes(lesson.id));
  }

  function lessonUnlocked(moduleIndex: number, lessonIndex: number) {
    return moduleUnlocked(moduleIndex) && EXCEL_CURRICULUM[moduleIndex].lessons.slice(0, lessonIndex).every((lesson) => completed.includes(lesson.id));
  }

  function selectModule(index: number) {
    if (!moduleUnlocked(index)) return;
    setActiveModuleIndex(index);
    const module = EXCEL_CURRICULUM[index];
    const next = module.lessons.find((lesson) => !completed.includes(lesson.id)) ?? module.lessons[module.lessons.length - 1];
    setActiveLessonId(next.id);
    setView("ruta");
  }

  function selectLesson(moduleIndex: number, lessonIndex: number, lesson: ExcelLesson) {
    if (!lessonUnlocked(moduleIndex, lessonIndex)) return;
    setActiveModuleIndex(moduleIndex);
    setActiveLessonId(lesson.id);
    setView("ruta");
  }

  function updateCell(reference: string, value: string) {
    setCells((current) => {
      const next = { ...current };
      if (value === "") delete next[reference];
      else next[reference] = value;
      return next;
    });
    setChecked(null);
  }

  function checkSheet() {
    if (!activeLesson.checks) return;
    const values = calculateExcelSheet(cells);
    const outcomes = activeLesson.checks.map((check) => {
      try { return { desc: check.desc, passed: check.test(cells, values) }; }
      catch { return { desc: check.desc, passed: false }; }
    });
    setChecked(outcomes);
    const passed = outcomes.every((check) => check.passed);
    setMessage(passed ? "Todas las comprobaciones pasaron. Ya puedes completar el laboratorio." : `Pasaron ${outcomes.filter((check) => check.passed).length} de ${outcomes.length} comprobaciones. Revisa los criterios pendientes.`);
  }

  async function completeLesson() {
    if (!isEnrolled) { setMessage("Inscríbete gratis para registrar tu avance."); return; }
    if (completed.includes(activeLesson.id)) return;
    if (activeLesson.type === "sheet" && !checked?.every((item) => item.passed)) { setMessage("Completa todas las comprobaciones antes de avanzar."); return; }
    if (activeLesson.type === "quiz" && !quizPassed) { setMessage("Aprueba el desafío antes de avanzar."); return; }
    const next = Array.from(new Set([...completed, activeLesson.id]));
    setCompleted(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setMessage("No se pudo guardar el avance localmente; revisa el espacio del navegador."); return; }
    let syncMessage = "";
    if (userId) {
      const lessonId = `${activeModule.title}:${activeLesson.title}`;
      const { error } = await supabase.from("progress").upsert({ user_id: userId, course_slug: course.slug, lesson_id: lessonId, sincronizado_offline: true }, { onConflict: "user_id,course_slug,lesson_id" });
      if (error) syncMessage = `Avance local guardado; no se pudo sincronizar: ${error.message}`;
      else void awardXp(userId, course.slug, lessonId, activeModule.level === "principiante" ? "recordar" : activeModule.level === "intermedio" ? "aplicar" : "crear", activeLesson.xp);
      if (activeModule.lessons.every((lesson) => next.includes(lesson.id))) void registerModuleAchievement(userId, course.slug, activeModuleIndex);
    }
    setMessage(syncMessage || `Actividad completada: ${activeLesson.title}.`);
  }

  function reviewQuiz() {
    const questions = activeLesson.questions ?? [];
    if (quizAnswers.length !== questions.length || quizAnswers.some((answer) => answer === undefined)) { setMessage("Responde todas las preguntas antes de revisar el quiz."); return; }
    setQuizSubmitted(true);
    const score = questions.reduce((total, question, index) => total + Number(quizAnswers[index] === question.correct), 0);
    setMessage(score >= PASSING_QUIZ_SCORE ? `Aprobado: ${score}/${questions.length}.` : `Resultado: ${score}/${questions.length}. Revisa las explicaciones y vuelve a intentarlo.`);
  }

  function resetSheet() { setCells({}); setChecked(null); setMessage("Hoja reiniciada."); }
  function loadSolution() { setCells({ ...(activeLesson.solution ?? {}) }); setChecked(null); setMessage("Solución cargada. Revisa las fórmulas en cada celda."); }
  function setStudent(value: string) { setStudentName(value); try { window.localStorage.setItem(`${storageKey}:student`, value); } catch {} }

  if (!isReady) return <section className="excel-player"><p className="p-6 text-sm text-emerald-100">Preparando tu ruta y sincronizando el avance...</p></section>;

  const unlockedModules = EXCEL_CURRICULUM.filter((_module, index) => moduleUnlocked(index)).length;
  const activeLessonIndex = activeModule.lessons.findIndex((lesson) => lesson.id === activeLesson.id);
  const doneLabs = sheetLessons.filter((lesson) => completed.includes(lesson.id)).length;
  const unlockedAchievements = ACHIEVEMENTS.filter((achievement) => achievement.unlock(completed));
  const quizCorrect = activeLesson.questions?.reduce((score, question, index) => score + Number(quizAnswers[index] === question.correct), 0) ?? 0;
  const activeQuizPassed = quizSubmitted && quizCorrect >= PASSING_QUIZ_SCORE;

  return (
    <section id="curso-aprendizaje" className="excel-player" aria-label="Excel de cero a avanzado">
      <aside className="excel-sidebar">
        <div className="excel-brand">DataM <span>AI</span></div>
        <div className="excel-course-mini"><small>RUTA ACTUAL</small><b>📊 Excel Profesional</b><span>{progress}% · {completed.length}/{totalLessons} actividades</span><i><em style={{ width: `${progress}%` }} /></i></div>
        <p className="excel-menu-heading">Aprendizaje</p>
        {([ ["ruta", "🗺️", "Mi ruta"], ["laboratorio", "💻", "Laboratorio"], ["logros", "🏆", "Logros"], ["progreso", "📈", "Mi progreso"] ] as const).map(([id, icon, label]) => <button key={id} type="button" onClick={() => setView(id)} className={`excel-menu-item ${view === id ? "active" : ""}`}>{icon}<span>{label}</span>{id === "laboratorio" && <small>{doneLabs}/{sheetLessons.length}</small>}</button>)}
        <p className="excel-menu-heading">Evaluación</p>
        <Link className={`excel-menu-item ${completed.length < totalLessons ? "locked" : ""}`} href={completed.length === totalLessons ? `/cursos/${course.slug}/evaluacion` : "#curso-aprendizaje"} onClick={(event) => { if (completed.length < totalLessons) { event.preventDefault(); setMessage("Completa las quince unidades para habilitar la evaluación final."); } }}>📝<span>Evaluación final</span>{completed.length < totalLessons && <LockKeyhole className="ml-auto h-3.5 w-3.5" />}</Link>
      </aside>
      <main className="excel-player-main">
        <header className="excel-topbar"><div><span>DataM</span><ChevronRight className="h-3.5 w-3.5" /><span>Análisis de datos</span><ChevronRight className="h-3.5 w-3.5" /><b>Excel profesional</b></div><label>Tu ruta <input maxLength={30} value={studentName} onChange={(event) => setStudent(event.target.value)} placeholder="Tu nombre" aria-label="Nombre para personalizar la ruta" /></label></header>
        {message && <p role="status" className="excel-player-message">{message}</p>}
        {view === "ruta" && <>
          <section className="excel-route-hero"><div className="excel-route-copy"><p className="excel-eyebrow">FORMACIÓN PROFESIONAL · 15 MÓDULOS</p><h2>Excel: de Cero a Avanzado</h2><p>De tus primeras fórmulas a reportes que orientan decisiones reales.</p><div className="excel-route-person">👤 <b>{studentName.trim() || "Tu ruta profesional"}</b></div></div><div className="excel-route-progress"><span>PROGRESO</span><b>{progress}%</b><div><i style={{ width: `${progress}%` }} /></div><small>{completed.length} / {totalLessons} actividades · {unlockedModules} módulos disponibles</small></div></section>
          <section className="excel-route-board" aria-label="Ruta de módulos de Excel"><div className="excel-route-grid">{EXCEL_CURRICULUM.map((module, index) => {
            const unlocked = moduleUnlocked(index);
            const selected = activeModuleIndex === index;
            const stats = moduleProgress[index];
            return <button type="button" key={module.id} disabled={!unlocked} onClick={() => selectModule(index)} className={`excel-route-node ${selected ? "selected" : ""} ${stats.percent === 100 ? "complete" : ""} ${!unlocked ? "locked" : ""}`} aria-current={selected ? "step" : undefined}>
              <span className="excel-node-icon">{stats.percent === 100 ? <Check className="h-6 w-6" /> : !unlocked ? <LockKeyhole className="h-5 w-5" /> : EXCEL_MODULE_ICONS[index]}</span><small>M{String(index + 1).padStart(2, "0")} · {module.level}</small><b>{module.title}</b><em>{stats.done}/{stats.total} actividades</em>
            </button>;
          })}</div><div className="excel-route-legend"><span><i className="complete" />Completado</span><span><i className="current" />En curso</span><span><i className="available" />Disponible</span><span><i className="locked" />Bloqueado</span></div></section>
          <section className="excel-module-detail"><div className="excel-detail-head"><span>{EXCEL_MODULE_ICONS[activeModuleIndex]}</span><div><p>MÓDULO {activeModuleIndex + 1} DE 15 · {activeModule.level}</p><h3>{activeModule.title}</h3><small>{activeModule.goal}</small></div><b><Clock3 className="h-4 w-4" />{activeModule.minutes} min</b></div><div className="excel-activity-list">{activeModule.lessons.map((lesson, lessonIndex) => {
            const locked = !lessonUnlocked(activeModuleIndex, lessonIndex);
            const done = completed.includes(lesson.id);
            return <button key={lesson.id} disabled={locked} type="button" onClick={() => selectLesson(activeModuleIndex, lessonIndex, lesson)} className={`excel-activity-row ${done ? "done" : ""} ${activeLesson.id === lesson.id ? "active" : ""}`}><span className="excel-activity-icon">{done ? <CheckCircle2 className="h-4 w-4" /> : lesson.type === "reading" ? <BookOpen className="h-4 w-4" /> : lesson.type === "sheet" ? <FileSpreadsheet className="h-4 w-4" /> : <CircleHelp className="h-4 w-4" />}</span><span><b>{lesson.title}</b><small>{lesson.desc} · {lesson.minutes} min</small></span><em>+{lesson.xp} XP</em><ChevronRight className="h-4 w-4" /></button>;
          })}</div><button type="button" className="excel-primary-button" onClick={() => selectLesson(activeModuleIndex, activeLessonIndex, activeLesson)}>{completed.includes(activeLesson.id) ? "Repasar actividad" : "Continuar actividad"}<ChevronRight className="h-4 w-4" /></button></section>
          <section className="excel-stats-row"><div><BarChart3 /><b>{progress}%</b><small>Avance total</small></div><div><CheckCircle2 /><b>{completed.length}</b><small>Actividades completas</small></div><div><FileSpreadsheet /><b>{doneLabs}</b><small>Laboratorios superados</small></div><div><Trophy /><b>{unlockedAchievements.length}</b><small>Logros desbloqueados</small></div></section>
        </>}

        {view === "laboratorio" && <section className="excel-secondary-view"><p className="excel-eyebrow">PRÁCTICA APLICADA</p><h2>Laboratorio de Excel</h2><p>Prácticas ejecutables con fórmulas, revisadas contra sus resultados y estructura.</p><div className="excel-lab-cards">{allLessons.filter(({ lesson }) => lesson.type === "sheet").map(({ module, moduleIndex, lesson, lessonIndex }) => { const locked = !moduleUnlocked(moduleIndex); return <button key={lesson.id} type="button" disabled={locked} onClick={() => { selectLesson(moduleIndex, lessonIndex, lesson); setView("ruta"); }}><FileSpreadsheet /><span><b>{lesson.title}</b><small>{module.title} · +{lesson.xp} XP</small></span>{completed.includes(lesson.id) ? <CheckCircle2 className="text-green-600" /> : locked ? <LockKeyhole /> : <ChevronRight />}</button>; })}</div></section>}
        {view === "logros" && <section className="excel-secondary-view"><p className="excel-eyebrow">HITOS DE APRENDIZAJE</p><h2>Tus logros</h2><p>Los hitos se desbloquean al practicar y avanzar por la ruta.</p><div className="excel-achievements">{ACHIEVEMENTS.map((achievement) => { const unlocked = achievement.unlock(completed); return <article key={achievement.id} className={unlocked ? "unlocked" : ""}><span>{unlocked ? achievement.icon : "🔒"}</span><b>{achievement.title}</b><small>{achievement.detail}</small><em>{unlocked ? "Desbloqueado" : "Por desbloquear"}</em></article>; })}</div></section>}
        {view === "progreso" && <section className="excel-secondary-view"><p className="excel-eyebrow">TU AVANCE</p><h2>Mi progreso</h2><div className="excel-progress-summary"><article><Zap /><b>{completed.reduce((sum, id) => sum + (allLessons.find((item) => item.lesson.id === id)?.lesson.xp ?? 0), 0)} XP</b><small>Experiencia acumulada</small></article><article><CheckCircle2 /><b>{completed.length}/{totalLessons}</b><small>Actividades completadas</small></article><article><BarChart3 /><b>{progress}%</b><small>Avance del curso</small></article></div><div className="excel-progress-modules">{EXCEL_CURRICULUM.map((module, index) => <article key={module.id}><div><b>{EXCEL_MODULE_ICONS[index]} {index + 1}. {module.title}</b><small>{moduleProgress[index].done}/{moduleProgress[index].total} · {moduleProgress[index].percent}%</small></div><span><i style={{ width: `${moduleProgress[index].percent}%` }} /></span></article>)}</div></section>}

        {view === "ruta" && <section className="excel-lesson-panel" aria-label={`Actividad ${activeLesson.title}`}>
          <div className="excel-lesson-header"><div><p className="excel-eyebrow">MÓDULO {activeModuleIndex + 1} · ACTIVIDAD {activeLessonIndex + 1} DE {activeModule.lessons.length}</p><h2>{activeLesson.title}</h2><p>{activeLesson.desc}</p></div><div><span><Clock3 className="h-4 w-4" />{activeLesson.minutes} min</span><span><Zap className="h-4 w-4" />+{activeLesson.xp} XP</span></div></div>
          <div className="excel-objectives"><b>Al finalizar podrás</b><ul>{activeLesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div>
          {activeLesson.type === "reading" && <><article className="excel-reading-content" dangerouslySetInnerHTML={{ __html: activeLesson.content ?? "" }} /><div className="excel-key-points"><b>Ideas clave</b><ul>{activeLesson.keyPoints?.map((point) => <li key={point}>{point}</li>)}</ul></div></>}
          {activeLesson.type === "sheet" && <section className="excel-sheet-lab"><div className="excel-sheet-prompt" dangerouslySetInnerHTML={{ __html: activeLesson.prompt ?? "" }} /><div className="excel-formula-bar"><b>{selectedCell}</b><span>ƒx</span><input aria-label={`Contenido de la celda ${selectedCell}`} value={cells[selectedCell] ?? ""} onChange={(event) => updateCell(selectedCell, event.target.value)} placeholder="Escribe un valor o fórmula como =SUMA(A1:A5)" /></div><div className="excel-sheet-scroll"><table className="excel-sheet"><thead><tr><th aria-label="Fila" />{COLUMNS.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{Array.from({ length: 12 }, (_, rowIndex) => <tr key={rowIndex}><th>{rowIndex + 1}</th>{COLUMNS.map((column) => { const reference = `${column}${rowIndex + 1}`; const value = computed[reference]; const display = value === undefined || value === 0 && !cells[reference] ? "" : String(value); return <td key={reference} className={`${selectedCell === reference ? "selected" : ""} ${String(value).startsWith("#ERROR") ? "error" : typeof value === "number" ? "number" : ""}`}><button type="button" aria-label={`${reference}: ${display || "vacía"}`} onClick={() => setSelectedCell(reference)}>{display}</button></td>; })}</tr>)}</tbody></table></div><div className="excel-sheet-actions"><button type="button" className="excel-primary-button" onClick={checkSheet}><CheckCircle2 className="h-4 w-4" /> Comprobar fórmulas</button><button type="button" onClick={resetSheet}><RotateCcw className="h-4 w-4" /> Reiniciar hoja</button><button type="button" onClick={loadSolution}>Ver solución</button></div>{checked && <ul className="excel-check-list">{checked.map((check) => <li key={check.desc} className={check.passed ? "passed" : "failed"}>{check.passed ? <CheckCircle2 className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}{check.desc}</li>)}</ul>}<details className="excel-dax"><summary><Sparkles className="h-4 w-4" /> Pista de DataM</summary><p>{activeLesson.dax.hint}</p></details></section>}
          {activeLesson.type === "quiz" && <section className="excel-quiz">{activeLesson.questions?.map((question, questionIndex) => { const correct = quizAnswers[questionIndex] === question.correct; return <fieldset key={question.q} className={quizSubmitted ? correct ? "correct" : "incorrect" : ""}><legend>{questionIndex + 1}. {question.q}</legend>{question.options.map((option, optionIndex) => <label key={`${questionIndex}-${optionIndex}`}><input type="radio" name={`${activeLesson.id}-${questionIndex}`} disabled={quizSubmitted} checked={quizAnswers[questionIndex] === optionIndex} onChange={() => setQuizAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next; })} /><span>{option}</span></label>)}{quizSubmitted && <p>{correct ? "Correcto. " : `Respuesta: ${question.options[question.correct]}. `}{question.explain}</p>}</fieldset>})}{!quizSubmitted ? <button type="button" className="excel-primary-button" onClick={reviewQuiz}>Revisar respuestas</button> : !activeQuizPassed ? <button type="button" onClick={() => { setQuizSubmitted(false); setQuizAnswers([]); }}>Intentar de nuevo</button> : <p className="excel-quiz-passed">Aprobado: {quizCorrect}/{activeLesson.questions?.length}</p>}</section>}
          <footer className="excel-lesson-footer">{completed.includes(activeLesson.id) ? <span className="excel-complete-label"><CheckCircle2 className="h-4 w-4" />Actividad completada</span> : <button type="button" className="excel-primary-button" disabled={!isEnrolled || activeLesson.type === "sheet" && !checked?.every((item) => item.passed) || activeLesson.type === "quiz" && !activeQuizPassed} onClick={() => void completeLesson()}>{!isEnrolled ? "Inscríbete para guardar" : activeLesson.type === "sheet" && !checked?.every((item) => item.passed) ? "Supera todas las pruebas" : activeLesson.type === "quiz" && !activeQuizPassed ? "Aprueba el desafío" : "Completar actividad"}<ChevronRight className="h-4 w-4" /></button>}<small>El avance habilita progresivamente los siguientes módulos.</small></footer>
          {!isEnrolled && <button type="button" className="excel-enroll" onClick={() => window.dispatchEvent(new CustomEvent("datam:enroll-course", { detail: { courseSlug: course.slug } }))}>Inscribirme gratis y guardar mi progreso</button>}
        </section>}
        {completed.length === totalLessons && isEnrolled && <section className="excel-finish"><Trophy /><div><b>Ruta completada</b><p>Ya puedes rendir la evaluación final de Excel.</p></div><Link href={`/cursos/${course.slug}/evaluacion`}>Ir a evaluación <ChevronRight className="h-4 w-4" /></Link></section>}
      </main>
    </section>
  );
}