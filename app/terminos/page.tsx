import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-display text-3xl font-bold text-ink">Términos y Condiciones de Uso</h1>
        <p className="mt-4 text-sm text-muted">Última actualización: octubre 2026</p>

        <section className="mt-8 space-y-6 text-sm leading-7 text-muted">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">1. Aceptación</h2>
            <p className="mt-2">Al usar DataM aceptas estos términos. Si no estás de acuerdo, no uses la plataforma.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">2. Servicio</h2>
            <p className="mt-2">DataM ofrece cursos en línea de tecnología con práctica interactiva, evaluaciones y certificados verificables.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">3. Cuenta del usuario</h2>
            <p className="mt-2">Eres responsable de mantener la confidencialidad de tu cuenta. No compartas tu contraseña ni datos de acceso.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">4. Contenido</h2>
            <p className="mt-2">El contenido de los cursos es propiedad de DataM. No puedes redistribuirlo ni usarlo con fines comerciales sin autorización.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">5. Pagos</h2>
            <p className="mt-2">Los pagos se procesan mediante Culqi. Los precios están en soles peruanos (PEN) e incluyen impuestos aplicables.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">6. Certificados</h2>
            <p className="mt-2">Los certificados se emiten al completar el curso y aprobar la evaluación final. Son verificables con código único.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">7. Limitación de responsabilidad</h2>
            <p className="mt-2">DataM no garantiza resultados laborales ni académicos específicos. El aprendizaje depende del esfuerzo del estudiante.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">8. Contacto</h2>
            <p className="mt-2">Para consultas: kenersalhuana@gmail.com</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
