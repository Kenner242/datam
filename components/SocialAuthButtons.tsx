"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type SocialProvider = "google" | "linkedin_oidc";
type Props = { action: "login" | "register"; onError: (message: string) => void };

function providerErrorMessage(message: string) {
  if (/unsupported provider|provider is not enabled/i.test(message)) return "Este proveedor todavía no está habilitado en Supabase. Revisa la configuración OAuth de Google o LinkedIn.";
  return `No se pudo iniciar sesión con el proveedor: ${message}`;
}

export default function SocialAuthButtons({ action, onError }: Props) {
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

  async function startOAuth(provider: SocialProvider) {
    onError("");
    setLoadingProvider(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        ...(provider === "google" ? { queryParams: { prompt: "select_account" } } : {}),
      },
    });
    if (error) {
      onError(providerErrorMessage(error.message));
      setLoadingProvider(null);
    }
  }

  const verb = action === "login" ? "Continuar" : "Registrarme";
  return <div className="social-auth-group" aria-label="Acceso con redes sociales">
    <button type="button" onClick={() => void startOAuth("google")} disabled={loadingProvider !== null} className="social-auth-button">
      <svg aria-hidden="true" viewBox="0 0 48 48" className="social-auth-icon"><path fill="#EA4335" d="M24 9.5c3.5 0 6.1 1.5 7.5 2.8l5.5-5.4C33.6 4 29.2 2 24 2 15.1 2 7.4 7.1 3.7 14.5l6.4 5C11.7 13.7 17.4 9.5 24 9.5Z"/><path fill="#4285F4" d="M46 24.5c0-1.6-.2-3.1-.5-4.5H24v9h12.3c-.5 2.9-2.1 5.3-4.5 6.9l7.1 5.5C43 37.4 46 31.5 46 24.5Z"/><path fill="#FBBC05" d="M10.1 28.5a14.5 14.5 0 0 1 0-9l-6.4-5a22 22 0 0 0 0 19l6.4-5Z"/><path fill="#34A853" d="M24 46c6 0 11-2 14.9-5.6l-7.1-5.5c-2 1.3-4.5 2.1-7.8 2.1-6.6 0-12.3-4.2-14-10l-6.4 5C7.4 39 15.1 46 24 46Z"/></svg>
      <span>{loadingProvider === "google" ? "Conectando con Google..." : `${verb} con Google`}</span>
    </button>
    <button type="button" onClick={() => void startOAuth("linkedin_oidc")} disabled={loadingProvider !== null} className="social-auth-button social-auth-linkedin">
      <svg aria-hidden="true" viewBox="0 0 32 32" className="social-auth-icon"><path fill="#0A66C2" d="M4 3h24a1 1 0 0 1 1 1v24a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path fill="#fff" d="M9.2 12.2a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2ZM7.4 14h3.7v11H7.4V14Zm5.9 0h3.5v1.5h.1c.5-.9 1.7-1.9 3.5-1.9 3.8 0 4.5 2.5 4.5 5.7V25h-3.7v-5.1c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7V25h-3.7V14Z"/></svg>
      <span>{loadingProvider === "linkedin_oidc" ? "Conectando con LinkedIn..." : `${verb} con LinkedIn`}</span>
    </button>
  </div>;
}
