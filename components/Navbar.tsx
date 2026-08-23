import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="DataM, inicio" className="flex items-center">
          <Image
            src="/images/datam-logo.svg"
            alt="DataM"
            width={90}
            height={60}
            className="h-12 w-[72px] object-contain"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 text-sm text-ink/80 md:flex">
          <Link href="/cursos" className="hover:text-accent transition-colors">
            Cursos
          </Link>
          <Link href="/" className="hover:text-accent transition-colors">
            Metodología
          </Link>
          <Link href="/nosotros" className="hover:text-accent transition-colors">
            Nosotros
          </Link>
          <Link href="/fundador" className="hover:text-accent transition-colors">
            Fundador
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-ink/80 hover:text-accent transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="rounded-cell bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-accent transition-colors"
          >
            Registrarme
          </Link>
        </div>
      </nav>
    </header>
  );
}
