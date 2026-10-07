"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import CourseMenuDisclosure from "@/components/CourseMenuDisclosure";
import { BarChart3, BookOpen, Check, CheckCircle2, ChevronRight, CircleHelp, Clock3, Headphones, LockKeyhole, RotateCcw, Sparkles, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
import type { Course } from "@/lib/courses";
import { awardXp, registerModuleAchievement } from "@/lib/gamification";
import { getCurrentUserSafely } from "@/lib/supabase/session";
import { supabase } from "@/lib/supabase/client";
import { ENGLISH_CURRICULUM, ENGLISH_MODULE_ICONS, type EnglishContext, type EnglishLesson, type EnglishLevel } from "@/lib/englishCurriculum";

type View = "ruta" | "voz" | "laboratorio" | "logros" | "progreso";
type ActivityChecks = Array<{ desc: string; passed: boolean }> | null;
const PASSING_QUIZ_SCORE = 3;
const allLessons = ENGLISH_CURRICULUM.flatMap((module, moduleIndex) => module.lessons.map((lesson, lessonIndex) => ({ module, moduleIndex, lesson, lessonIndex })));
const totalLessons = allLessons.length;
const audioLessons = allLessons.filter(({ lesson }) => ["vocab", "listen", "pron"].includes(lesson.type));
const legacyProgressIds = new Map([
  ["Bases do idioma:Presentaciones y saludos", "m1l1"],
  ["Bases del idioma:Presentaciones y saludos", "m1l1"],
  ["Bases del idioma:Presente simple", "m4l1"],
  ["Comunicación cotidiana:Vocabulario funcional", "m3l1"],
  ["Comunicación cotidiana:Conversaciones simples", "m6l1"],
]);
const achievements = [
  { title: "First words", desc: "Escucha tus primeras tarjetas", icon: "👋", test: (done: string[]) => audioLessons.some(({ lesson }) => lesson.type === "vocab" && done.includes(lesson.id)) },
  { title: "Clear voice", desc: "Practica frases completas", icon: "🗣️", test: (done: string[]) => audioLessons.some(({ lesson }) => lesson.type === "pron" && done.includes(lesson.id)) },
  { title: "Active listener", desc: "Completa la mitad del recorrido", icon: "🎧", test: (done: string[]) => done.length >= Math.ceil(totalLessons / 2) },
  { title: "English in action", desc: "Completa los quince módulos", icon: "🏆", test: (done: string[]) => done.length === totalLessons },
];

function createContext(type: EnglishLesson["type"]): EnglishContext { return { type, listened: new Set<string>(), completed: 0, answered: new Set<number>(), practiced: 0, marked: new Set<number>() }; }

export default function EnglishVoiceCoursePlayer({ course }: { course: Course }) {
  const [view, setView] = useState<View>("ruta");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonId, setLessonId] = useState(ENGLISH_CURRICULUM[0].lessons[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("");
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [rate, setRate] = useState(0.92);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [context, setContext] = useState<EnglishContext>(() => createContext("vocab"));
  const [checks, setChecks] = useState<ActivityChecks>(null);
  const [spokenPhrases, setSpokenPhrases] = useState<number[]>([]);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, number>>({});
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const currentLessonRef = useRef(ENGLISH_CURRICULUM[0].lessons[0].id);
  const activeSpeechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const storageKey = `datam-english-voice-v1:${course.slug}`;
  const enrollmentKey = `datam-enrollment:guest:${course.slug}`;
  const module = ENGLISH_CURRICULUM[moduleIndex];
  const lesson = module.lessons.find((item) => item.id === lessonId) ?? module.lessons[0];
  currentLessonRef.current = lesson.id;
  const progress = totalLessons ? Math.round(completed.length / totalLessons * 100) : 0;
  const quizCorrect = lesson.questions?.reduce((sum, question, index) => sum + Number(quizAnswers[index] === question.correct), 0) ?? 0;
  const quizPassed = quizSubmitted && quizCorrect >= PASSING_QUIZ_SCORE;
  const moduleProgress = useMemo(() => ENGLISH_CURRICULUM.map((item) => {
    const done = item.lessons.filter((entry) => completed.includes(entry.id)).length;
    return { done, total: item.lessons.length, percent: Math.round(done / item.lessons.length * 100) };
  }), [completed]);
  const selectedLessonIndex = module.lessons.findIndex((item) => item.id === lesson.id);
  const completedAudio = audioLessons.filter(({ lesson: item }) => completed.includes(item.id)).length;
  const unlockedAchievements = achievements.filter((item) => item.test(completed));
  const allDone = completed.length === totalLessons;
  const englishVoices = useMemo(() => voiceList.filter((voice) => /^en(-|_|$)/i.test(voice.lang)), [voiceList]);

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
      setVoiceName(window.localStorage.getItem(`${storageKey}:voice`) ?? "");
      setRate(Number(window.localStorage.getItem(`${storageKey}:rate`) ?? 0.92));
      setPitch(Number(window.localStorage.getItem(`${storageKey}:pitch`) ?? 1));
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
        const idByKey = new Map([...allLessons.map(({ module: itemModule, lesson: itemLesson }) => [`${itemModule.title}:${itemLesson.title}`, itemLesson.id] as const), ...legacyProgressIds]);
        const rowsList = rows ?? [];
        const dbKeys = new Set(rowsList.map((row) => row.lesson_id));
        saved = Array.from(new Set([...saved, ...rowsList.map((row) => idByKey.get(row.lesson_id)).filter((id): id is string => Boolean(id))]));
        const missing = saved.flatMap((id) => {
          const entry = allLessons.find((item) => item.lesson.id === id);
          if (!entry) return [];
          const key = `${entry.module.title}:${entry.lesson.title}`;
          return dbKeys.has(key) ? [] : [{ user_id: user.id, course_slug: course.slug, lesson_id: key, sincronizado_offline: true }];
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
    if (!("speechSynthesis" in window)) { setMessage("Este navegador no ofrece síntesis de voz. Prueba la ruta con un navegador compatible con Web Speech."); return; }
    const loadVoices = () => {
      const next = window.speechSynthesis.getVoices();
      setVoiceList(next);
      if (!voiceName) {
        const preferred = next.find((voice) => /^en-US/i.test(voice.lang)) ?? next.find((voice) => /^en(-|_)/i.test(voice.lang));
        if (preferred) setVoiceName(preferred.name);
      }
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, [voiceName]);

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
    setContext(createContext(lesson.type));
    setChecks(null);
    setSpokenPhrases([]);
    setExerciseAnswers({});
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setMessage("");
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, [lesson.id, lesson.type]);

  function speak(text: string, speed = rate, onEnd?: () => void) {
    if (!("speechSynthesis" in window) || !englishVoices.length) {
      setMessage("No hay una voz inglesa instalada en este navegador. Revisa Configurar voz.");
      return false;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = englishVoices.find((voice) => voice.name === voiceName)?.lang ?? "en-US";
    utterance.voice = englishVoices.find((voice) => voice.name === voiceName) ?? englishVoices[0];
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); if (currentLessonRef.current === lesson.id) onEnd?.(); };
    utterance.onerror = () => setIsSpeaking(false);
    activeSpeechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setMessage("");
    return true;
  }

  function markVocabListened(card: string) {
    setContext((current) => ({ ...current, listened: new Set([...current.listened, card]) }));
  }
  function playVocab(card: EnglishLesson["vocab"] extends (infer T)[] | undefined ? T : never) {
    if (!card) return;
    speak(card.en, rate, () => markVocabListened(card.en));
  }
  function playListenExercise(index: number) {
    const exercise = lesson.exercises?.[index];
    if (!exercise) return;
    speak(exercise.audio, rate, () => setContext((current) => ({ ...current, listened: new Set([...current.listened, `listen-${index}`]) })));
  }
  function answerListen(index: number, optionIndex: number) {
    if (context.type !== "listen" || context.answered.has(index)) return;
    if (!context.listened.has(`listen-${index}`)) { setMessage("Escucha el audio antes de seleccionar tu respuesta."); return; }
    const isCorrect = lesson.exercises?.[index]?.correct === optionIndex;
    setExerciseAnswers((current) => ({ ...current, [index]: optionIndex }));
    if (isCorrect) {
      setContext((current) => ({ ...current, completed: current.completed + 1, answered: new Set([...current.answered, index]) }));
      setMessage("Correcto. Muy bien escuchado.");
    } else setMessage("No coincide. Vuelve a escuchar e inténtalo otra vez.");
  }
  function playPronPhrase(index: number, speed = rate) {
    const phrase = lesson.phrases?.[index];
    if (!phrase) return;
    speak(phrase.en, speed, () => setSpokenPhrases((current) => current.includes(index) ? current : [...current, index]));
  }
  function markPronPracticed(index: number) {
    if (!spokenPhrases.includes(index) || context.marked.has(index)) return;
    setContext((current) => ({ ...current, practiced: current.practiced + 1, marked: new Set([...current.marked, index]) }));
  }
  function stopSpeaking() { window.speechSynthesis?.cancel(); setIsSpeaking(false); }
  function updateVoice(name: string) { setVoiceName(name); try { window.localStorage.setItem(`${storageKey}:voice`, name); } catch {} }
  function updateRate(value: number) { setRate(value); try { window.localStorage.setItem(`${storageKey}:rate`, String(value)); } catch {} }
  function updatePitch(value: number) { setPitch(value); try { window.localStorage.setItem(`${storageKey}:pitch`, String(value)); } catch {} }
  function updateStudent(value: string) { setStudentName(value); try { window.localStorage.setItem(`${storageKey}:student`, value); } catch {} }

  function moduleUnlocked(index: number) { return index === 0 || ENGLISH_CURRICULUM[index - 1].lessons.every((item) => completed.includes(item.id)); }
  function lessonUnlocked(targetModule: number, targetLesson: number) { return moduleUnlocked(targetModule) && ENGLISH_CURRICULUM[targetModule].lessons.slice(0, targetLesson).every((item) => completed.includes(item.id)); }
  function selectModule(index: number) {
    if (!moduleUnlocked(index)) return;
    setModuleIndex(index);
    const lessons = ENGLISH_CURRICULUM[index].lessons;
    setLessonId(lessons.find((item) => !completed.includes(item.id))?.id ?? lessons[lessons.length - 1].id);
    setView("ruta");
  }
  function selectLesson(targetModule: number, targetLesson: number, selected: EnglishLesson) {
    if (!lessonUnlocked(targetModule, targetLesson)) return;
    setModuleIndex(targetModule); setLessonId(selected.id); setView("ruta");
  }

  function canComplete() {
    if (completed.includes(lesson.id)) return false;
    if (lesson.type === "vocab" || lesson.type === "listen" || lesson.type === "pron") return Boolean(lesson.checks?.every((check) => check.test(context)));
    if (lesson.type === "quiz") return quizPassed;
    return true;
  }
  function checkActivity() {
    const outcomes = lesson.checks?.map((check) => ({ desc: check.desc, passed: check.test(context) })) ?? [];
    setChecks(outcomes);
    setMessage(outcomes.every((item) => item.passed) ? "Objetivo auditivo alcanzado. Ya puedes completar esta actividad." : outcomes.map((item) => item.passed ? null : item.desc).filter(Boolean).join(". "));
  }
  async function completeLesson() {
    if (!isEnrolled) { setMessage("Inscríbete gratis para guardar el avance."); return; }
    if (!canComplete()) { setMessage(lesson.type === "quiz" ? "Aprueba el quiz para continuar." : "Completa el objetivo auditivo para continuar."); return; }
    const next = Array.from(new Set([...completed, lesson.id]));
    setCompleted(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setMessage("No se pudo guardar el avance local. Comprueba el espacio disponible."); return; }
    let syncMessage = "";
    if (userId) {
      const dbLessonId = `${module.title}:${lesson.title}`;
      const { error } = await supabase.from("progress").upsert({ user_id: userId, course_slug: course.slug, lesson_id: dbLessonId, sincronizado_offline: true }, { onConflict: "user_id,course_slug,lesson_id" });
      if (error) syncMessage = `Avance local guardado; no se pudo sincronizar: ${error.message}`;
      else void awardXp(userId, course.slug, dbLessonId, module.level === "principiante" ? "recordar" : module.level === "intermedio" ? "aplicar" : "crear", lesson.xp);
      if (module.lessons.every((item) => next.includes(item.id))) void registerModuleAchievement(userId, course.slug, moduleIndex);
    }
    setMessage(syncMessage || `Actividad completada: ${lesson.title}.`);
    window.dispatchEvent(new CustomEvent("datam:dax-celebrate"));
  }
  function reviewQuiz() {
    const questions = lesson.questions ?? [];
    if (quizAnswers.length !== questions.length || quizAnswers.some((answer) => answer === undefined)) { setMessage("Responde todas las preguntas antes de revisar el quiz."); return; }
    setQuizSubmitted(true);
    const score = questions.reduce((sum, question, index) => sum + Number(quizAnswers[index] === question.correct), 0);
    setMessage(score >= PASSING_QUIZ_SCORE ? `Aprobado: ${score}/${questions.length}.` : `Resultado: ${score}/${questions.length}. Revisa las explicaciones e inténtalo de nuevo.`);
  }

  const pendingModules = ENGLISH_CURRICULUM.filter((_item, index) => moduleUnlocked(index)).length;
  const lessonIndex = module.lessons.findIndex((item) => item.id === lesson.id);
  const doneLabs = audioLessons.filter(({ lesson: item }) => completed.includes(item.id)).length;
  if (!isReady) return <section className="english-player"><p className="p-6 text-sm">Preparando el curso y sincronizando tu avance...</p></section>;

  return (
    <section id="curso-aprendizaje" className="english-player" aria-label="Inglés con Voz: ruta A1 a B1">
      <CourseMenuDisclosure className="english-sidebar" title="Inglés con Voz" progress={`${progress}% · ${completed.length}/${totalLessons} actividades`}>
        <div className="english-brand">DataM <span>Educación continua</span></div>
        <div className="english-mini"><small>CURSO ACTUAL</small><b>Inglés con Voz</b><span>{progress}% · {completed.length}/{totalLessons}</span><i><em style={{ width: `${progress}%` }} /></i></div>
        <p className="english-nav-heading">Ruta de aprendizaje</p>
        {([["ruta", BookOpen, "Mi ruta"], ["voz", Volume2, "Configurar voz"], ["laboratorio", Headphones, "Laboratorio"], ["logros", Trophy, "Logros"], ["progreso", BarChart3, "Mi progreso"]] as const).map(([id, Icon, label]) => <button key={id} type="button" onClick={() => setView(id)} className={`english-nav-item ${view === id ? "active" : ""}`}><span><Icon className="h-4 w-4" /></span><span>{label}</span>{id === "laboratorio" && <small>{doneLabs}/{audioLessons.length}</small>}</button>)}
        <p className="english-nav-heading">Evaluación</p>
        <Link className={`english-nav-item ${allDone ? "" : "locked"}`} href={allDone ? `/cursos/${course.slug}/evaluacion` : "#curso-aprendizaje"} onClick={(event) => { if (!allDone) { event.preventDefault(); setMessage("Completa los quince módulos para habilitar la evaluación final."); } }}><span>📝</span><span>Evaluación final</span>{!allDone && <LockKeyhole className="ml-auto h-4 w-4" />}</Link>
      </CourseMenuDisclosure>
      <main className="english-main">
        <header className="english-topbar"><div><span>DataM</span><ChevronRight className="h-3.5 w-3.5" /><span>Idiomas</span><ChevronRight className="h-3.5 w-3.5" /><b>Inglés con Voz</b></div><label>Tu ruta <input value={studentName} onChange={(event) => updateStudent(event.target.value)} maxLength={30} placeholder="Tu nombre" aria-label="Nombre para personalizar tu ruta" /></label></header>
        {message && <p role="status" className="english-message">{message}</p>}

        {view === "ruta" && <>
          <section className="english-route-hero"><img src={module.photo} alt={module.photoAlt} /><div className="english-hero-copy"><p className="english-eyebrow">ENGLISH WITH VOICE · A1 → B1</p><h2>Escucha. Repite. Habla.</h2><p>Quince módulos para llevar el inglés cotidiano a conversaciones con confianza.</p><div className="english-route-person">👤 <b>{studentName.trim() || "Tu ruta de aprendizaje"}</b></div></div><div className="english-progress-card"><span>PROGRESO</span><b>{progress}%</b><div><i style={{ width: `${progress}%` }} /></div><small>{completed.length}/{totalLessons} actividades</small></div></section>
          <section className="english-route-board" aria-label="Ruta de módulos de inglés"><div className="english-route-grid">{ENGLISH_CURRICULUM.map((item, index) => { const unlocked = moduleUnlocked(index); const selected = moduleIndex === index; const stats = moduleProgress[index]; return <button key={item.id} type="button" disabled={!unlocked} onClick={() => selectModule(index)} className={`english-route-node ${selected ? "active" : ""} ${stats.percent === 100 ? "complete" : ""} ${!unlocked ? "locked" : ""}`} aria-current={selected ? "step" : undefined}><span>{stats.percent === 100 ? <Check className="h-5 w-5" /> : !unlocked ? <LockKeyhole className="h-4 w-4" /> : ENGLISH_MODULE_ICONS[index]}</span><small>M{String(index + 1).padStart(2, "0")} · {item.level}</small><b>{item.title}</b><em>{stats.done}/{stats.total} · {stats.percent}%</em></button>; })}</div><div className="english-route-legend"><span><i className="complete" />Completado</span><span><i className="active" />En curso</span><span><i className="available" />Disponible</span><span><i className="locked" />Bloqueado</span></div></section>
          <section className="english-module-detail"><div className="english-detail-head"><span>{ENGLISH_MODULE_ICONS[moduleIndex]}</span><div><p>MÓDULO {moduleIndex + 1} DE 15 · {module.level}</p><h3>{module.title}</h3><small>{module.goal}</small></div><b><Clock3 className="h-4 w-4" />{module.minutes} min</b></div><div className="english-activity-list">{module.lessons.map((item, index) => <button key={item.id} type="button" disabled={!lessonUnlocked(moduleIndex, index)} onClick={() => selectLesson(moduleIndex, index, item)} className={`english-activity-row ${completed.includes(item.id) ? "done" : ""} ${lesson.id === item.id ? "selected" : ""}`}><span>{completed.includes(item.id) ? <CheckCircle2 className="h-4 w-4" /> : item.type === "reading" ? <BookOpen className="h-4 w-4" /> : item.type === "quiz" ? <CircleHelp className="h-4 w-4" /> : item.type === "pron" ? <Volume2 className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}</span><span><b>{item.title}</b><small>{item.desc} · {item.minutes} min</small></span><em>+{item.xp} XP</em><ChevronRight className="h-4 w-4" /></button>)}</div><button type="button" className="english-primary" onClick={() => selectLesson(moduleIndex, lessonIndex, lesson)}>{completed.includes(lesson.id) ? "Repasar actividad" : "Continuar actividad"}<ChevronRight className="h-4 w-4" /></button></section>
          <section className="english-stats"><article><BarChart3 /><b>{progress}%</b><small>Avance</small></article><article><CheckCircle2 /><b>{completed.length}</b><small>Actividades</small></article><article><Headphones /><b>{doneLabs}</b><small>Prácticas de voz</small></article><article><Trophy /><b>{unlockedAchievements.length}</b><small>Logros</small></article></section>
        </>}

        {view === "voz" && <section className="english-secondary"><p className="english-eyebrow">WEB SPEECH · ENGLISH VOICE</p><h2>Configurar voz</h2><p>Elige una voz inglesa disponible en tu navegador y ajusta el ritmo a tu práctica.</p>{englishVoices.length ? <div className="english-voice-controls"><label>Voz en inglés<select value={voiceName} onChange={(event) => updateVoice(event.target.value)}>{englishVoices.map((voice) => <option key={`${voice.name}-${voice.lang}`} value={voice.name}>{voice.lang.startsWith("en-US") ? "🇺🇸" : voice.lang.startsWith("en-GB") ? "🇬🇧" : "🌐"} {voice.name} · {voice.lang}</option>)}</select></label><label>Velocidad <output>{rate.toFixed(2)}×</output><input type="range" min="0.65" max="1.15" step="0.05" value={rate} onChange={(event) => updateRate(Number(event.target.value))} /></label><label>Tono <output>{pitch.toFixed(2)}</output><input type="range" min="0.8" max="1.2" step="0.05" value={pitch} onChange={(event) => updatePitch(Number(event.target.value))} /></label><button type="button" className="english-primary" onClick={() => speak("Hello! Welcome to English with Voice. Let's practice together.")}>{isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />} Probar voz</button></div> : <p className="english-voice-unavailable">No hay voces inglesas instaladas o disponibles. Prueba Chrome, Edge o Safari y vuelve a abrir esta opción.</p>}</section>}
        {view === "laboratorio" && <section className="english-secondary"><p className="english-eyebrow">AUDIO PRACTICE</p><h2>Laboratorio de voz</h2><p>Retoma tarjetas, escucha y pronunciación de cualquier módulo ya desbloqueado.</p><div className="english-lab-list">{audioLessons.map(({ module: itemModule, moduleIndex: itemIndex, lesson: itemLesson, lessonIndex: itemLessonIndex }) => <button key={itemLesson.id} type="button" disabled={!moduleUnlocked(itemIndex)} onClick={() => selectLesson(itemIndex, itemLessonIndex, itemLesson)}><Headphones /><span><b>{itemLesson.title}</b><small>{itemModule.title} · +{itemLesson.xp} XP</small></span>{completed.includes(itemLesson.id) ? <CheckCircle2 /> : !moduleUnlocked(itemIndex) ? <LockKeyhole /> : <ChevronRight />}</button>)}</div></section>}
        {view === "logros" && <section className="english-secondary"><p className="english-eyebrow">LEARNING MILESTONES</p><h2>Tus logros</h2><div className="english-achievements">{achievements.map((item) => { const unlocked = item.test(completed); return <article key={item.title} className={unlocked ? "unlocked" : ""}><span>{unlocked ? item.icon : "🔒"}</span><b>{item.title}</b><small>{item.desc}</small><em>{unlocked ? "Desbloqueado" : "Por desbloquear"}</em></article>; })}</div></section>}
        {view === "progreso" && <section className="english-secondary"><p className="english-eyebrow">TU AVANCE</p><h2>Mi progreso</h2><div className="english-progress-summary"><article><Zap /><b>{completed.reduce((sum, id) => sum + (allLessons.find((item) => item.lesson.id === id)?.lesson.xp ?? 0), 0)} XP</b><small>Experiencia acumulada</small></article><article><CheckCircle2 /><b>{completed.length}/{totalLessons}</b><small>Actividades completas</small></article><article><BarChart3 /><b>{progress}%</b><small>Avance del curso</small></article></div><div className="english-progress-modules">{ENGLISH_CURRICULUM.map((item, index) => <article key={item.id}><div><b>{ENGLISH_MODULE_ICONS[index]} {index + 1}. {item.title}</b><small>{moduleProgress[index].done}/{moduleProgress[index].total} · {moduleProgress[index].percent}%</small></div><span><i style={{ width: `${moduleProgress[index].percent}%` }} /></span></article>)}</div></section>}

        {view === "ruta" && <section className="english-lesson-panel" aria-label={`Actividad ${lesson.title}`}>
          <div className="english-lesson-header"><div><p className="english-eyebrow">MÓDULO {moduleIndex + 1} · ACTIVIDAD {lessonIndex + 1} DE {module.lessons.length}</p><h2>{lesson.title}</h2><p>{lesson.desc}</p></div><div><span><Clock3 className="h-4 w-4" />{lesson.minutes} min</span><span><Zap className="h-4 w-4" />+{lesson.xp} XP</span></div></div>
          <div className="english-objectives"><b>Al finalizar podrás</b><ul>{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div>
          {lesson.type === "vocab" && <section className="english-audio-section"><div className="english-intro" dangerouslySetInnerHTML={{ __html: lesson.intro ?? "" }} /><p className="english-audio-guide"><Volume2 className="h-4 w-4" /> Toca una tarjeta para escuchar y repetir</p><div className="english-vocab-grid">{lesson.vocab?.map((card) => <button key={card.en} type="button" className={`english-vocab-card ${context.listened.has(card.en) ? "heard" : ""}`} onClick={() => playVocab(card)}><span>{card.emoji}</span><b>{card.en}</b><code>{card.ipa}</code><small>{card.es}</small><em>{context.listened.has(card.en) ? "✓ Escuchada" : "▶ Escuchar"}</em></button>)}</div><AudioCheck checks={checks} onCheck={checkActivity} /></section>}
          {lesson.type === "listen" && <section className="english-listen-section"><div className="english-intro" dangerouslySetInnerHTML={{ __html: lesson.intro ?? "" }} />{lesson.exercises?.map((exercise, index) => <article className="english-listen-card" key={`${lesson.id}-${index}`}><div><small>LISTENING · {index + 1}/{lesson.exercises?.length}</small><b>Escucha y elige</b></div><button type="button" className={`english-play ${isSpeaking && context.listened.has(`listen-${index}`) ? "speaking" : ""}`} aria-label={`Reproducir ejercicio ${index + 1}`} onClick={() => playListenExercise(index)}>{context.listened.has(`listen-${index}`) ? <CheckCircle2 /> : <Volume2 />}</button><div className="english-options">{exercise.options.map((option, optionIndex) => <button key={option} type="button" disabled={context.answered.has(index)} className={exerciseAnswers[index] === optionIndex ? exercise.correct === optionIndex ? "correct" : "incorrect" : ""} onClick={() => answerListen(index, optionIndex)}>{option}</button>)}</div>{context.answered.has(index) && <p className="english-feedback">{exerciseAnswers[index] === exercise.correct ? "Correcto, escuchaste bien." : `La frase era: ${exercise.options[exercise.correct]}`}</p>}</article>)}<AudioCheck checks={checks} onCheck={checkActivity} /></section>}
          {lesson.type === "pron" && <section className="english-pron-section"><div className="english-intro" dangerouslySetInnerHTML={{ __html: lesson.intro ?? "" }} />{lesson.phrases?.map((phrase, index) => <article className="english-phrase-card" key={`${lesson.id}-${index}`}><small>PHRASE {index + 1}</small><h3>{phrase.en}</h3><p>{phrase.es}</p><div><button type="button" onClick={() => playPronPhrase(index, rate)}><Volume2 className="h-4 w-4" /> Normal</button><button type="button" onClick={() => playPronPhrase(index, Math.max(0.65, rate * 0.72))}><Volume2 className="h-4 w-4" /> Lento</button><button type="button" disabled={!spokenPhrases.includes(index) || context.marked.has(index)} onClick={() => markPronPracticed(index)}>{context.marked.has(index) ? <CheckCircle2 className="h-4 w-4" /> : <Check className="h-4 w-4" />} {context.marked.has(index) ? "Practicada" : "Practiqué"}</button></div></article>)}<AudioCheck checks={checks} onCheck={checkActivity} /></section>}
          {lesson.type === "reading" && <article className="english-reading" dangerouslySetInnerHTML={{ __html: lesson.content ?? "" }} />}
          {lesson.type === "quiz" && <section className="english-quiz">{lesson.questions?.map((question, questionIndex) => { const isCorrect = quizAnswers[questionIndex] === question.correct; return <fieldset key={question.q} className={quizSubmitted ? isCorrect ? "correct" : "incorrect" : ""}><legend>{questionIndex + 1}. {question.q}</legend>{question.options.map((option, optionIndex) => <label key={`${questionIndex}-${optionIndex}`}><input type="radio" name={`${lesson.id}-${questionIndex}`} disabled={quizSubmitted} checked={quizAnswers[questionIndex] === optionIndex} onChange={() => setQuizAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next; })} /><span>{option}</span></label>)}{quizSubmitted && <p>{isCorrect ? "Correcto. " : `Respuesta: ${question.options[question.correct]}. `}{question.explain}</p>}</fieldset>})}{!quizSubmitted ? <button type="button" className="english-primary" onClick={reviewQuiz}>Revisar respuestas</button> : !quizPassed ? <button type="button" className="english-secondary-button" onClick={() => { setQuizSubmitted(false); setQuizAnswers([]); }}>Intentar de nuevo</button> : <p className="english-quiz-passed">Aprobado: {quizCorrect}/{lesson.questions?.length}</p>}</section>}
          <footer className="english-lesson-footer">{completed.includes(lesson.id) ? <span><CheckCircle2 className="h-4 w-4" />Actividad completada</span> : <button type="button" className="english-primary" disabled={!isEnrolled || !canComplete()} onClick={() => void completeLesson()}>{!isEnrolled ? "Inscríbete para guardar" : lesson.type === "quiz" && !canComplete() ? "Aprueba el quiz" : ["vocab", "listen", "pron"].includes(lesson.type) && !canComplete() ? "Completa la práctica de voz" : "Completar actividad"}<ChevronRight className="h-4 w-4" /></button>}<small>{lesson.type === "reading" ? "Completa esta lectura para continuar." : "Escucha, practica y completa el objetivo antes de avanzar."}</small></footer>
          {!isEnrolled && <button type="button" className="english-enroll" onClick={() => window.dispatchEvent(new CustomEvent("datam:enroll-course", { detail: { courseSlug: course.slug } }))}>Inscribirme gratis y guardar mi progreso</button>}
        </section>}
        {allDone && isEnrolled && <section className="english-finish"><Trophy /><div><b>Ruta completada</b><p>Ya puedes rendir la evaluación final de Inglés con Voz.</p></div><Link href={`/cursos/${course.slug}/evaluacion`}>Ir a evaluación <ChevronRight className="h-4 w-4" /></Link></section>}
      </main>
    </section>
  );

  function AudioCheck({ checks: outcomes, onCheck }: { checks: ActivityChecks; onCheck: () => void }) {
    return <div className="english-audio-check"><div><span>Escuchadas</span><b>{context.listened.size}</b><span>· Respuestas correctas</span><b>{context.completed}</b><span>· Frases practicadas</span><b>{context.practiced}</b></div><button type="button" className="english-secondary-button" onClick={onCheck}>Comprobar avance</button>{outcomes && <ul>{outcomes.map((item) => <li key={item.desc} className={item.passed ? "passed" : "pending"}>{item.passed ? <CheckCircle2 /> : <CircleHelp />}{item.desc}</li>)}</ul>}</div>;
  }
}
