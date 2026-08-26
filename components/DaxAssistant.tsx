"use client";

import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { GripHorizontal, MessageCircle, Mic, Send, Volume2, X } from "lucide-react";

type Message = { role: "assistant" | "student"; content: string };
type Language = "es-PE" | "qu-PE";

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onerror: () => void;
  onend: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function createAnswer(question: string, language: Language) {
  if (language === "qu-PE") {
    return "Dax está listo para acompañarte en quechua. Actualmente puedo registrar tu consulta por voz o texto; para una respuesta académica completa en quechua conectaremos el modelo de IA y una voz compatible.";
  }

  const normalized = question.toLowerCase();
  if (normalized.includes("excel")) return "Para avanzar en Excel, empieza por identificar tus columnas y el objetivo del reporte. Después practica una fórmula o tabla dinámica con el material de tu clase.";
  if (normalized.includes("power bi")) return "En Power BI, primero revisa la calidad de los datos. Luego crea relaciones claras entre tablas antes de construir visualizaciones y medidas.";
  if (normalized.includes("python") || normalized.includes("sql")) return "Divide el problema en pasos pequeños: revisa los datos de entrada, prueba una consulta o script corto y verifica el resultado antes de continuar.";
  return "Estoy aquí para ayudarte a aprender paso a paso. Indícame el curso, la clase o el tema que estás estudiando y te daré una guía clara para continuar.";
}

export default function DaxAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("es-PE");
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [position, setPosition] = useState({ right: 24, bottom: 24 });
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hola, soy Dax. Puedo ayudarte a entender tus cursos, prácticas y próximos pasos." }]);
  const dragStart = useRef<{ x: number; y: number; right: number; bottom: number } | null>(null);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    const preferredVoice = window.speechSynthesis.getVoices().find((voice) => /es[-_](PE|MX|US)|spanish/i.test(voice.lang) && /male|hombre|diego|jorge|carlos/i.test(voice.name));
    if (preferredVoice) utterance.voice = preferredVoice;
    window.speechSynthesis.speak(utterance);
  }

  function sendMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const question = input.trim();
    if (!question) return;
    const answer = createAnswer(question, language);
    setMessages((current) => [...current, { role: "student", content: question }, { role: "assistant", content: answer }]);
    setInput("");
    speak(answer);
  }

  function startListening() {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((current) => [...current, { role: "assistant", content: "Tu navegador no permite dictado por voz. Puedes escribir tu consulta aquí." }]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => setInput(event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  }

  function beginDrag(event: PointerEvent<HTMLButtonElement>) {
    dragStart.current = { x: event.clientX, y: event.clientY, right: position.right, bottom: position.bottom };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function drag(event: PointerEvent<HTMLButtonElement>) {
    if (!dragStart.current) return;
    const nextRight = Math.max(12, Math.min(window.innerWidth - 64, dragStart.current.right - (event.clientX - dragStart.current.x)));
    const nextBottom = Math.max(12, Math.min(window.innerHeight - 64, dragStart.current.bottom - (event.clientY - dragStart.current.y)));
    setPosition({ right: nextRight, bottom: nextBottom });
  }

  function endDrag() {
    dragStart.current = null;
  }

  return (
    <div className="fixed z-[60]" style={{ right: position.right, bottom: position.bottom }}>
      {isOpen && (
        <section aria-label="Asistente Dax" className="absolute bottom-16 right-0 flex h-[min(520px,72vh)] w-[min(360px,calc(100vw-24px))] flex-col overflow-hidden rounded-cell border border-line bg-white shadow-2xl">
          <header className="flex items-center gap-3 border-b border-line bg-ink px-4 py-3 text-white">
            <button type="button" aria-label="Arrastrar Dax" onPointerDown={beginDrag} onPointerMove={drag} onPointerUp={endDrag} className="cursor-grab touch-none text-blue-100 active:cursor-grabbing"><GripHorizontal className="h-5 w-5" /></button>
            <div className="min-w-0 flex-1"><p className="font-display font-bold">Dax</p><p className="text-xs text-blue-100">Asistente de aprendizaje DataM</p></div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar Dax" className="p-1 text-white hover:text-blue-200"><X className="h-5 w-5" /></button>
          </header>
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <label className="text-xs font-medium text-muted" htmlFor="dax-language">Idioma</label>
            <select id="dax-language" value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="rounded-cell border border-line bg-white px-2 py-1 text-xs text-ink focus:border-accent focus:outline-none"><option value="es-PE">Español (Perú)</option><option value="qu-PE">Quechua</option></select>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[90%] rounded-cell px-3 py-2 text-sm leading-6 ${message.role === "assistant" ? "bg-blue-50 text-ink" : "ml-auto bg-ink text-white"}`}><p>{message.content}</p>{message.role === "assistant" && <button type="button" onClick={() => speak(message.content)} className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-accent"><Volume2 className="h-3.5 w-3.5" /> Escuchar</button>}</div>)}
          </div>
          <form onSubmit={sendMessage} className="border-t border-line p-3">
            <div className="flex items-center gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Escribe tu consulta..." aria-label="Consulta para Dax" className="min-w-0 flex-1 rounded-cell border border-line px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none" /><button type="button" onClick={startListening} aria-label={isListening ? "Escuchando" : "Hablar con Dax"} className={`rounded-cell p-2 text-white ${isListening ? "bg-red-600" : "bg-blue-700 hover:bg-accent"}`}><Mic className="h-5 w-5" /></button><button type="submit" aria-label="Enviar consulta" className="rounded-cell bg-ink p-2 text-white hover:bg-accent"><Send className="h-5 w-5" /></button></div>
          </form>
        </section>
      )}
      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Cerrar asistente Dax" : "Abrir asistente Dax"} className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-accent text-white shadow-lg transition-transform hover:scale-105"><MessageCircle className="h-6 w-6" /><span className="sr-only">Dax</span></button>
    </div>
  );
}
