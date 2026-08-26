import { Facebook, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const socialLinks = [
  { label: "Correo", href: "mailto:kenersalhuana@gmail.com", icon: Mail, className: "text-accent" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kenner-estibens-villvicencio-salhuana-8a9b822a3/?skipRedirect=true", icon: Linkedin, className: "text-[#0A66C2]" },
  { label: "Instagram", href: "https://www.instagram.com/kener_stiven24?igsi=c2ZiaDM4d2N0MDRz", icon: Instagram, className: "text-pink-600" },
  { label: "Facebook", href: "https://www.facebook.com/stiven.pachas.3", icon: Facebook, className: "text-[#1877F2]" },
  { label: "WhatsApp", href: "https://chat.whatsapp.com/EFX2VJi9CoXGVU8SVVu6ZL", icon: MessageCircle, className: "text-[#25D366]" },
];

export default function FundadorPage() {
  return (
    <>
      <Navbar />
      <main className="bg-blue-50/50">
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <header className="mx-auto max-w-3xl text-center">
            <p className="data-cell-header">Fundador</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-ink md:text-5xl">La persona detrás de DataM</h1>
          </header>

          <div className="mt-12 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center">
            <figure className="data-cell mx-auto w-full max-w-sm overflow-hidden bg-base">
              <img src="/images/foto - kenner.jpg" alt="Kenner Estibens Villavicencio Salhuana, fundador de DataM" className="h-auto w-full object-contain mix-blend-multiply" />
            </figure>
            <article>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue-700">Fundador de DataM · Tecnología e innovación</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink">Kenner Estibens Villavicencio Salhuana</h2>
              <div className="mt-6 max-w-2xl space-y-4 text-base leading-8 text-muted">
                <p>Soy un estudiante de 21 años apasionado por la tecnología y la innovación.</p>
                <p>Creé <strong className="font-display text-ink">DataM</strong> porque creo que el conocimiento no debe quedarse en las aulas: debe convertirse en una herramienta para transformar realidades.</p>
                <p>Mi propósito es conectar educación, tecnología e innovación para formar personas capaces de crear, resolver problemas y transformar su entorno.</p>
              </div>
              <blockquote className="mt-7 max-w-2xl border-l-4 border-accent bg-white px-5 py-5 font-display text-xl font-bold leading-8 text-ink shadow-sm">“Una oportunidad puede cambiar un momento, pero el conocimiento puede cambiar un futuro.”</blockquote>
              <div className="mt-7 flex flex-wrap gap-3">
                {socialLinks.map(({ label, href, icon: Icon, className }) => (
                  <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent">
                    <Icon aria-hidden="true" className={`h-5 w-5 ${className}`} /> {label}
                  </a>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
