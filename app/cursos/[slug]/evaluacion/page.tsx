import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import FinalAssessment from "@/components/FinalAssessment";
import Navbar from "@/components/Navbar";
import { getCourse } from "@/lib/courses";

export default async function CourseAssessmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return <><Navbar /><FinalAssessment course={course} /><Footer /></>;
}
