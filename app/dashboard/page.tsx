import Navbar from "@/components/Navbar";
import StudentDashboard from "@/components/StudentDashboard";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <span className="data-cell-header">Panel del estudiante</span>
        <StudentDashboard />
      </section>
    </>
  );
}
