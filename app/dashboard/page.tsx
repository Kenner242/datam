import Navbar from "@/components/Navbar";
import StudentDashboard from "@/components/StudentDashboard";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <span className="data-cell-header">Panel del estudiante</span>
        <StudentDashboard />
      </section>
    </>
  );
}
