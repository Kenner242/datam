export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="font-display font-bold text-ink">
            Data<span className="text-accent">M</span>
          </p>
          <p>Educación tecnológica práctica: datos, automatización e IA.</p>
          <p>© {new Date().getFullYear()} DataM. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
