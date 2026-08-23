import Link from "next/link";
import { Facebook, Linkedin, Instagram, Mail, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const socialLinks = [
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
          <div className="mb-10 text-center"><span className="data-cell-header">FUNDADOR</span><h1 className="mt-3 font-display text-4xl font-bold text-ink md:text-5xl">La persona detrás de DataM</h1></div>
          <div className="grid items-center gap-10 md:grid-cols-[280px_1fr]">
            <div className="mx-auto w-full max-w-[280px] overflow-hidden border border-line bg-base shadow-sm"><img src="/images/foto - kenner.jpg" alt="Villavicencio Salhuana Kenner Estibens" className="h-auto w-full object-contain mix-blend-multiply" /></div>
            <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-blue-700">Fundador de DataM · Administración y Finanzas · Tecnología e Innovación</p><h2 className="mt-3 font-display text-2xl font-bold text-ink md:text-3xl">Villavicencio Salhuana Kenner Estibens</h2><div className="mt-6 space-y-4 text-base leading-8 text-muted"><p>Soy <strong className="font-display text-ink">Villavicencio Salhuana Kenner Estibens</strong>, estudiante de 21 años, apasionado por la tecnología, los datos y la innovación. Mi camino nace de una convicción: <strong className="font-display text-ink">el conocimiento no debería quedarse en las aulas ni estar reservado para unos pocos; debe convertirse en una herramienta capaz de abrir oportunidades y transformar realidades.</strong></p><p>He encontrado en la tecnología una forma de aprender, crear y encontrar soluciones a problemas reales. Esa experiencia me llevó a crear <strong className="font-display text-ink">DataM</strong>, con el propósito de construir algo que vaya más allá de una plataforma educativa: un espacio donde las personas puedan descubrir su potencial, adquirir nuevas capacidades y encontrar en el conocimiento una posibilidad para avanzar.</p><p>Creo en quienes tienen ganas de aprender aunque todavía no sepan por dónde empezar. En quienes tienen una idea, pero necesitan las herramientas para hacerla realidad. Y en quienes buscan una oportunidad para demostrar todo lo que pueden lograr.</p><p><strong className="font-display text-ink">DataM representa esa visión: convertir el acceso al conocimiento en posibilidades reales.</strong></p><p>Mi propósito es seguir aprendiendo, compartir lo aprendido y construir soluciones que conecten <strong className="font-display text-ink">educación, tecnología e innovación</strong>, contribuyendo a formar personas capaces de crear, resolver problemas y transformar su entorno.</p><p><strong className="font-display text-ink">Porque una oportunidad puede cambiar un momento, pero el conocimiento puede cambiar un futuro.</strong></p></div><div className="mt-7 flex flex-wrap gap-3"><a href="mailto:kenersalhuana@gmail.com" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-accent"><Mail className="h-5 w-5 text-accent" /> Correo</a>{socialLinks.map(({ label, href, icon: Icon, className }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="data-cell flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:border-blue-400"><Icon className={`h-5 w-5 ${className}`} /> {label}</a>)}</div></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
