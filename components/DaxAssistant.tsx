"use client";

import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { GripHorizontal, Mic, MicOff, Send, Volume2, VolumeX, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
type Language = "es-PE" | "qu-PE";
type SpeechRecognitionInstance = { lang: string; continuous: boolean; interimResults: boolean; start: () => void; stop: () => void; onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onerror: () => void; onend: () => void };
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

export default function DaxAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("es-PE");
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ right: 24, bottom: 24 });
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hola, soy Dax. Puedo explicarte tus cursos paso a paso." }]);
  const dragStart = useRef<{ x: number; y: number; right: number; bottom: number } | null>(null);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  useEffect(() => {
    function handleOpenRequest() {
      setIsOpen(true);
    }

    window.addEventListener("datam:open-dax", handleOpenRequest);
    return () => window.removeEventListener("datam:open-dax", handleOpenRequest);
  }, []);

  function speak(text: string) {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("es") && /male|hombre|diego|jorge|carlos|juan|miguel/i.test(voice.name)) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("es"));
    if (spanishVoice) utterance.voice = spanishVoice;
    utterance.pitch = 0.9;
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    try {
      const courseSlug = pathname.match(/^\/cursos\/([^/]+)/)?.[1];
      const response = await fetch("/api/dax", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nextMessages, language, courseSlug }) });
      const data = (await response.json()) as { reply?: string; error?: string };
      const reply = data.reply ?? data.error ?? "No pude responder. Intenta nuevamente.";
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
      speak(reply);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "No pude conectarme con Dax. Revisa tu conexión e intenta nuevamente." }]);
    } finally {
      setIsLoading(false);
    }
  }

  function startListening() {
    const speechWindow = window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((current) => [...current, { role: "assistant", content: "Tu navegador no permite dictado por voz. Puedes escribir tu consulta." }]);
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
    setPosition({ right: Math.max(12, Math.min(window.innerWidth - 70, dragStart.current.right - (event.clientX - dragStart.current.x))), bottom: Math.max(12, Math.min(window.innerHeight - 70, dragStart.current.bottom - (event.clientY - dragStart.current.y))) });
  }

  return (
    <div className="fixed z-[60]" style={{ right: position.right, bottom: position.bottom }}>
      {isOpen && <section aria-label="Asistente Dax" className="absolute bottom-20 right-0 flex h-[min(560px,78vh)] w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden rounded-cell border border-line bg-white shadow-2xl">
        <header className="flex items-center gap-3 bg-ink px-4 py-3 text-white">
          <button type="button" aria-label="Mover Dax" onPointerDown={beginDrag} onPointerMove={drag} onPointerUp={() => { dragStart.current = null; }} className="cursor-grab touch-none text-blue-100 active:cursor-grabbing"><GripHorizontal className="h-5 w-5" /></button>
          <img src="/images/tools/agente_IA.png" alt="Dax" className="h-10 w-10 rounded-full border border-white/30 object-cover object-top" />
          <div className="min-w-0 flex-1"><p className="font-display font-bold">Dax</p><p className="truncate text-xs text-blue-100">Tutor virtual de DataM</p></div>
          <button type="button" onClick={() => setVoiceEnabled((enabled) => !enabled)} aria-label={voiceEnabled ? "Desactivar voz" : "Activar voz masculina"} className="p-1 text-white hover:text-blue-200">{voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}</button>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar Dax" className="p-1 text-white hover:text-blue-200"><X className="h-5 w-5" /></button>
        </header>
        <div className="flex items-center justify-between border-b border-line px-4 py-2"><label htmlFor="dax-language" className="text-xs font-medium text-muted">Idioma de Dax</label><select id="dax-language" value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="rounded-cell border border-line px-2 py-1 text-xs text-ink"><option value="es-PE">Español (Perú)</option><option value="qu-PE">Quechua</option></select></div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[90%] rounded-cell px-3 py-2 text-sm leading-6 ${message.role === "user" ? "ml-auto bg-ink text-white" : "bg-blue-50 text-ink"}`}><p>{message.content}</p>{message.role === "assistant" && <button type="button" onClick={() => speak(message.content)} className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-700"><Volume2 className="h-3.5 w-3.5" /> Escuchar</button>}</div>)}{isLoading && <div className="rounded-cell bg-blue-50 px-3 py-2 text-sm text-muted">Dax está pensando...</div>}{isSpeaking && <p className="text-xs text-blue-700">Dax está hablando...</p>}</div>
        <form onSubmit={sendMessage} className="border-t border-line p-3"><div className="flex items-center gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder={isListening ? "Escuchando..." : "Escribe tu consulta..."} aria-label="Consulta para Dax" className="min-w-0 flex-1 rounded-cell border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none" /><button type="button" onClick={startListening} aria-label={isListening ? "Escuchando" : "Hablar con Dax"} className={`rounded-cell p-2 text-white ${isListening ? "bg-red-600" : "bg-blue-700 hover:bg-accent"}`}>{isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}</button><button type="submit" aria-label="Enviar consulta" className="rounded-cell bg-ink p-2 text-white hover:bg-accent"><Send className="h-5 w-5" /></button></div></form>
      </section>}
      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Cerrar asistente Dax" : "Abrir asistente Dax"} className={`h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-ink shadow-lg transition-transform hover:scale-105 ${isSpeaking || isListening ? "ring-4 ring-accent2" : ""}`}><img src="/images/tools/agente_IA.png" alt="" className="h-full w-full object-cover object-top" /><span className="sr-only">Dax</span></button>
    </div>
  );
}
