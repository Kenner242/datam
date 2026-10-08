import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-display text-3xl font-bold text-ink">Política de Privacidad</h1>
        <p className="mt-4 text-sm text-muted">Última actualización: octubre 2026</p>

        <section className="mt-8 space-y-6 text-sm leading-7 text-muted">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">1. Datos que recopilamos</h2>
            <p className="mt-2">Nombre, correo electrónico, progreso en cursos, actividad de aprendizaje y foto de perfil (si la subes).</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">2. Uso de los datos</h2>
            <p className="mt-2">Usamos tus datos para ofrecer los cursos, guardar tu progreso, emitir certificados y mejorar la plataforma.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">3. Compartir datos</h2>
            <p className="mt-2">No vendemos ni compartimos tus datos personales con terceros, excepto para procesar pagos (Culqi) y servicios de autenticación (Supabase).</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">4. Seguridad</h2>
            <p className="mt-2">Tus datos se almacenan de forma segura en Supabase con encriptación y políticas de acceso restringido.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">5. Tus derechos</h2>
            <p className="mt-2">Puedes solicitar acceso, corrección o eliminación de tus datos escribiendo a kenersalhuana@gmail.com.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">6. Cookies</h2>
            <p className="mt-2">Usamos cookies técnicas para mantener tu sesión. No usamos cookies de seguimiento publicitario.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
