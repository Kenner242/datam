"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import NavbarSearch from "./NavbarSearch";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (mounted) setIsAuthenticated(Boolean(data.session));
    }

    void loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

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
    <header className="sticky top-0 z-50 border-b border-line bg-base/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" aria-label="DataM, inicio" className="flex items-center">
          <Image
            src="/images/datam-logo.svg"
            alt="DataM"
            width={90}
            height={60}
            className="datam-logo-nav h-12 w-[72px] object-contain"
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
          <Link href="/" className="transition-colors hover:text-accent">
            Metodología
          </Link>
          <Link href="/nosotros" className="transition-colors hover:text-accent">
            Nosotros
          </Link>
          <Link href="/fundador" className="transition-colors hover:text-accent">
            Fundador
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-ink/80 transition-colors hover:text-accent">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard
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
        <div className="border-t border-line bg-base px-6 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm">
            <Link href="/cursos" onClick={closeMenu}>Cursos</Link>
            <Link href="/comunidad" onClick={closeMenu}>Comunidad</Link>
            <Link href="/" onClick={closeMenu}>Metodología</Link>
            <Link href="/nosotros" onClick={closeMenu}>Nosotros</Link>
            <Link href="/fundador" onClick={closeMenu}>Fundador</Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={closeMenu}>Dashboard del estudiante</Link>
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
  );
}
