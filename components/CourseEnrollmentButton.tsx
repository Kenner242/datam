"use client";

export default function CourseEnrollmentButton({ courseSlug }: { courseSlug: string }) {
  function enroll() {
    window.dispatchEvent(new CustomEvent("datam:enroll-course", { detail: { courseSlug } }));
    document.getElementById("curso-aprendizaje")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return <button type="button" onClick={enroll} className="mt-6 flex w-full rounded-cell bg-blue-500 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-accent sm:mt-8 sm:w-auto sm:text-sm">Inscribirme gratis</button>;
}