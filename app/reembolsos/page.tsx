import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ReembolsosPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-display text-3xl font-bold text-ink">Política de Reembolsos</h1>
        <p className="mt-4 text-sm text-muted">Última actualización: octubre 2026</p>

        <section className="mt-8 space-y-6 text-sm leading-7 text-muted">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">1. Suscripciones</h2>
            <p className="mt-2">Puedes cancelar tu suscripción Premium en cualquier momento desde tu perfil. El acceso continúa hasta el fin del periodo pagado. No se reembolsan periodos parciales ya usados.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">2. Certificados</h2>
            <p className="mt-2">Los certificados emitidos no son reembolsables, ya que representan un logro académico verificado.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">3. Errores de pago</h2>
            <p className="mt-2">Si se te cobró por error o duplicado, contáctanos en kenersalhuana@gmail.com dentro de los 7 días y procesaremos el reembolso completo.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">4. Cómo solicitar</h2>
            <p className="mt-2">Escribe a kenersalhuana@gmail.com con tu correo de cuenta, el comprobante de pago y el motivo. Respondemos en 48 horas.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
