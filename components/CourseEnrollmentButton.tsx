"use client";

export default function CourseEnrollmentButton({ courseSlug }: { courseSlug: string }) {
  function enroll() {
    window.dispatchEvent(new CustomEvent("datam:enroll-course", { detail: { courseSlug } }));
    document.getElementById("curso-aprendizaje")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return <button type="button" onClick={enroll} className="mt-8 inline-flex rounded-cell bg-blue-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent">Inscribirme gratis</button>;
}