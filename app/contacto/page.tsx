import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-blue-200 bg-blue-50">
          <div className="mx-auto max-w-6xl px-6 py-14 text-center">
            <p className="data-cell-header">Contacto</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">Hablemos</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
              Estamos aquí para ayudarte con tus cursos, certificados o alianzas.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="data-cell p-5 text-center">
              <Mail className="mx-auto h-6 w-6 text-accent" />
              <p className="mt-3 font-display font-bold text-ink">Correo</p>
              <p className="mt-1 text-sm text-muted">kenersalhuana@gmail.com</p>
            </div>
            <div className="data-cell p-5 text-center">
              <MessageCircle className="mx-auto h-6 w-6 text-accent" />
              <p className="mt-3 font-display font-bold text-ink">WhatsApp</p>
              <p className="mt-1 text-sm text-muted">Comunidad DataM</p>
            </div>
            <div className="data-cell p-5 text-center">
              <MapPin className="mx-auto h-6 w-6 text-accent" />
              <p className="mt-3 font-display font-bold text-ink">Ubicación</p>
              <p className="mt-1 text-sm text-muted">Perú</p>
            </div>
          </div>

          <div className="mt-10 data-cell p-6">
            <p className="data-cell-header">Información de la tienda</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="font-bold text-ink">Nombre comercial</dt><dd className="text-muted">DataM</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-ink">Responsable</dt><dd className="text-muted">Kenner Villavicencio Salhuana</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-ink">Correo</dt><dd className="text-muted">kenersalhuana@gmail.com</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-ink">País</dt><dd className="text-muted">Perú</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-ink">Moneda</dt><dd className="text-muted">Soles peruanos (PEN)</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-ink">Pasarela de pagos</dt><dd className="text-muted">Culqi (tarjetas, Yape, Plin)</dd></div>
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
