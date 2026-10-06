"use client";

import { useEffect, useState } from "react";

export type DaxMood = "idle" | "thinking" | "celebrating" | "speaking" | "waving";

type DaxCharacterProps = {
  mood?: DaxMood;
  size?: number;
  className?: string;
};

const MOOD_EYES: Record<DaxMood, "open" | "happy" | "sad"> = {
  idle: "open",
  thinking: "sad",
  celebrating: "happy",
  speaking: "open",
  waving: "open",
};

export default function DaxCharacter({ mood = "idle", size = 96, className = "" }: DaxCharacterProps) {
  const eyes = MOOD_EYES[mood];
  const celebrating = mood === "celebrating";
  const thinking = mood === "thinking";

  return (
    <div className={`dax-character ${mood !== "idle" ? `dax-${mood}` : ""} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="dax-svg">
        <defs>
          <linearGradient id="dax-body" x1="60" y1="20" x2="60" y2="115" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E42"/>
            <stop offset="1" stopColor="#E87C1E"/>
          </linearGradient>
        </defs>

        {celebrating && (
          <g className="dax-confetti">
            <rect x="10" y="18" width="4" height="4" rx="1" fill="#5B5FEF" transform="rotate(20 10 18)"/>
            <rect x="104" y="14" width="4" height="4" rx="1" fill="#F472B6" transform="rotate(-25 104 14)"/>
            <circle cx="96" cy="8" r="2.5" fill="#FFB454"/>
            <rect x="18" y="6" width="4" height="4" rx="1" fill="#34D399" transform="rotate(30 18 6)"/>
            <circle cx="112" cy="34" r="2.5" fill="#5B5FEF"/>
          </g>
        )}

        {thinking && (
          <g className="dax-idea">
            <circle cx="92" cy="16" r="8" fill="#FFB454"/>
            <circle cx="92" cy="16" r="8" fill="#FFD977"/>
            <rect x="89" y="22" width="6" height="3" rx="1.5" fill="#9CA3AF"/>
            <line x1="92" y1="2" x2="92" y2="6" stroke="#FFD977" strokeWidth="2" strokeLinecap="round"/>
            <line x1="102" y1="10" x2="99" y2="13" stroke="#FFD977" strokeWidth="2" strokeLinecap="round"/>
            <line x1="82" y1="10" x2="85" y2="13" stroke="#FFD977" strokeWidth="2" strokeLinecap="round"/>
          </g>
        )}

        <path d="M60 18 L34 6 L42 34 Z" fill="#E87C1E"/>
        <path d="M60 18 L86 6 L78 34 Z" fill="#E87C1E"/>
        <path d="M38 12 L43 28 L36 20 Z" fill="#FDE8D7"/>
        <path d="M82 12 L77 28 L84 20 Z" fill="#FDE8D7"/>

        <g className="dax-cap">
          <path d="M34 26 L60 14 L86 26 L60 38 Z" fill="#1E2A44"/>
          <path d="M60 14 L60 6" stroke="#1E2A44" strokeWidth="2" strokeLinecap="round"/>
          <path d="M84 25 L84 34 Q84 40 80 42" stroke="#1E2A44" strokeWidth="2.5" fill="none"/>
          <circle cx="80" cy="42" r="2.5" fill="#FFB454"/>
        </g>

        <ellipse cx="60" cy="58" rx="26" ry="22" fill="url(#dax-body)"/>

        <ellipse cx="47" cy="56" rx="9" ry="8" fill="#FDE8D7"/>
        <ellipse cx="73" cy="56" rx="9" ry="8" fill="#FDE8D7"/>

        <g className="dax-glasses">
          {eyes === "happy" ? (
            <>
              <path d="M41 56 Q47 50 53 56" stroke="#1E2A44" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M67 56 Q73 50 79 56" stroke="#1E2A44" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </>
          ) : eyes === "sad" ? (
            <>
              <circle cx="47" cy="57" r="2.6" fill="#1E2A44"/>
              <circle cx="73" cy="57" r="2.6" fill="#1E2A44"/>
              <line x1="41" y1="52" x2="51" y2="49" stroke="#1E2A44" strokeWidth="2" strokeLinecap="round"/>
              <line x1="79" y1="52" x2="69" y2="49" stroke="#1E2A44" strokeWidth="2" strokeLinecap="round"/>
            </>
          ) : (
            <>
              <circle cx="47" cy="56" r="3" fill="#1E2A44"/>
              <circle cx="73" cy="56" r="3" fill="#1E2A44"/>
              <circle cx="48" cy="55" r="1" fill="#fff"/>
              <circle cx="74" cy="55" r="1" fill="#fff"/>
            </>
          )}
          <circle cx="47" cy="56" r="10" stroke="#1E2A44" strokeWidth="2.5" fill="none"/>
          <circle cx="73" cy="56" r="10" stroke="#1E2A44" strokeWidth="2.5" fill="none"/>
          <line x1="57" y1="56" x2="63" y2="56" stroke="#1E2A44" strokeWidth="2.5"/>
        </g>

        <ellipse cx="60" cy="64" rx="3.4" ry="2.6" fill="#1E2A44"/>

        {eyes === "happy" ? (
          <path d="M52 70 Q60 80 68 70 Q60 74 52 70 Z" fill="#7C2D12"/>
        ) : eyes === "sad" ? (
          <path d="M54 73 Q60 69 66 73" stroke="#1E2A44" strokeWidth="2" fill="none" strokeLinecap="round"/>
        ) : (
          <path d="M54 70 Q60 75 66 70" stroke="#1E2A44" strokeWidth="2" fill="none" strokeLinecap="round"/>
        )}

        <circle cx="38" cy="62" r="3" fill="#F9B8C4" opacity="0.8"/>
        <circle cx="82" cy="62" r="3" fill="#F9B8C4" opacity="0.8"/>

        <ellipse cx="60" cy="94" rx="20" ry="18" fill="url(#dax-body)"/>
        <ellipse cx="60" cy="98" rx="12" ry="12" fill="#FDE8D7"/>

        <rect x="46" y="80" width="28" height="6" rx="3" fill="#3B5BEF"/>
        <rect x="52" y="86" width="4" height="6" fill="#3B5BEF"/>
        <rect x="58" y="86" width="4" height="6" fill="#FFB454"/>
        <rect x="64" y="86" width="4" height="6" fill="#3B5BEF"/>

        {celebrating ? (
          <>
            <g className="dax-arm-left"><ellipse cx="38" cy="78" rx="6" ry="12" fill="#E87C1E" transform="rotate(-40 38 78)"/><circle cx="30" cy="68" r="4" fill="#FDE8D7"/></g>
            <g className="dax-arm-right"><ellipse cx="82" cy="78" rx="6" ry="12" fill="#E87C1E" transform="rotate(40 82 78)"/><circle cx="90" cy="68" r="4" fill="#FDE8D7"/></g>
          </>
        ) : (
          <>
            <ellipse cx="42" cy="92" rx="5" ry="10" fill="#E87C1E" transform="rotate(15 42 92)"/>
            <g className={mood === "waving" ? "dax-wave-arm" : ""}>
              <ellipse cx="80" cy="86" rx="5" ry="12" fill="#E87C1E" transform="rotate(mood === 'waving' ? 50 : -15 80 86)"/>
              <circle cx="86" cy="76" r="4.5" fill="#FDE8D7"/>
            </g>
          </>
        )}

        <ellipse cx="50" cy="112" rx="6" ry="4" fill="#7C3A0B"/>
        <ellipse cx="70" cy="112" rx="6" ry="4" fill="#7C3A0B"/>
      </svg>
    </div>
  );
}

const MOOD_TEXTS: Record<DaxMood, string[]> = {
  idle: ["¡Hola! Soy Dax, tu tutor con IA.", "¿En qué curso te ayudo hoy?"],
  thinking: ["Mmm… déjame pensar.", "Analizando tu pregunta..."],
  celebrating: ["¡Lo lograste! ¡Felicitaciones!", "¡Excelente trabajo!"],
  speaking: ["Escucha con atención...", "¡Te explico paso a paso!"],
  waving: ["¡Sigue así!", "¡Vas muy bien!"],
};

export function useDaxMood() {
  const [mood, setMood] = useState<DaxMood>("waving");

  useEffect(() => {
    function onCelebrate() {
      setMood("celebrating");
      window.setTimeout(() => setMood("idle"), 3500);
    }
    function onThinking() {
      setMood("thinking");
    }
    window.addEventListener("datam:dax-celebrate", onCelebrate);
    window.addEventListener("datam:dax-thinking", onThinking);
    return () => {
      window.removeEventListener("datam:dax-celebrate", onCelebrate);
      window.removeEventListener("datam:dax-thinking", onThinking);
    };
  }, []);

  return [mood, setMood] as const;
}
