"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, LayoutDashboard, Library } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import NavbarSearch from "./NavbarSearch";
import { getCurrentUserSafely } from "@/lib/supabase/session";

const WELCOME_POSTER_SESSION_KEY = "datam-welcome-poster-shown";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isWelcomePosterOpen, setIsWelcomePosterOpen] = useState(false);
  const posterCloseRef = useRef<HTMLButtonElement>(null);

  const showWelcomePosterOnce = useCallback(() => {
    try {
      if (window.sessionStorage.getItem(WELCOME_POSTER_SESSION_KEY) === "shown") return;
      window.sessionStorage.setItem(WELCOME_POSTER_SESSION_KEY, "shown");
    } catch {}
    setIsWelcomePosterOpen(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { user } = await getCurrentUserSafely();
      if (mounted) {
        setIsAuthenticated(Boolean(user));
        if (user) showWelcomePosterOnce();
      }
    }

    void loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(Boolean(session));
      if (event === "SIGNED_IN" && session?.user) showWelcomePosterOnce();
      if (event === "SIGNED_OUT") {
        try { window.sessionStorage.removeItem(WELCOME_POSTER_SESSION_KEY); } catch {}
        setIsWelcomePosterOpen(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [showWelcomePosterOnce]);

  useEffect(() => {
    if (!isWelcomePosterOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    posterCloseRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsWelcomePosterOpen(false);
      if (event.key === "Tab") {
        event.preventDefault();
        posterCloseRef.current?.focus();
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isWelcomePosterOpen]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-line bg-base/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link href="/" aria-label="DataM, inicio" className="flex items-center">
          <Image
            src="/images/datam-logo.svg"
            alt="DataM"
            width={90}
            height={60}
            className="datam-logo-nav h-auto w-[82px] object-contain sm:w-[90px]"
            priority
          />
        </Link>

        {/* Buscador */}
        <NavbarSearch />

        <div className="hidden flex-1 items-center gap-8 text-sm text-ink/80 md:flex">
          <Link href="/cursos" className="transition-colors hover:text-accent">
            Cursos
          </Link>
          <Link href="/comunidad" className="transition-colors hover:text-accent">
            Comunidad
          </Link>
          <Link href="/dax" className="transition-colors hover:text-accent">
            Dax IA
          </Link>
          <Link href="/#metodologia" className="transition-colors hover:text-accent">
            Metodología
          </Link>
          <Link href="/nosotros" className="transition-colors hover:text-accent">
            Nosotros
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-ink/80 transition-colors hover:text-accent">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard
              </Link>
              <Link href="/biblioteca" className="flex items-center gap-2 text-sm font-medium text-ink/80 transition-colors hover:text-accent">
                <Library className="h-4 w-4" aria-hidden="true" /> Biblioteca
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-2 rounded-cell bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink/80 transition-colors hover:text-accent">Iniciar sesión</Link>
              <Link href="/registro" className="rounded-cell bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent">Registrarme</Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-cell border border-line p-2 text-ink md:hidden"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {isMenuOpen && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-line bg-base px-4 py-4 md:hidden sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm">
            <Link href="/cursos" onClick={closeMenu}>Cursos</Link>
            <Link href="/comunidad" onClick={closeMenu}>Comunidad</Link>
            <Link href="/dax" onClick={closeMenu}>Dax IA</Link>
            <Link href="/#metodologia" onClick={closeMenu}>Metodología</Link>
            <Link href="/nosotros" onClick={closeMenu}>Nosotros</Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={closeMenu}>Dashboard del estudiante</Link>
                <Link href="/biblioteca" onClick={closeMenu}>Mi biblioteca</Link>
                <button onClick={handleSignOut} className="flex items-center gap-2 text-left text-red-700"><LogOut className="h-4 w-4" /> Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu}>Iniciar sesión</Link>
                <Link href="/registro" onClick={closeMenu}>Registrarme</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
    {isWelcomePosterOpen && typeof document !== "undefined" && createPortal(
      <div
        className="welcome-poster-backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsWelcomePosterOpen(false);
        }}
      >
        <section className="welcome-poster-dialog" role="dialog" aria-modal="true" aria-label="Bienvenido a DataM">
          <button
            ref={posterCloseRef}
            type="button"
            className="welcome-poster-close"
            aria-label="Cerrar anuncio de bienvenida"
            onClick={() => setIsWelcomePosterOpen(false)}
          >
            <X aria-hidden="true" />
          </button>
          <Image
            src="/images/flayer_02.jpg"
            alt="Aprende, practica y crece con los cursos profesionales de DataM"
            width={1024}
            height={1536}
            className="welcome-poster-image"
            priority
          />
        </section>
      </div>,
      document.body,
    )}
    </>
  );
}
