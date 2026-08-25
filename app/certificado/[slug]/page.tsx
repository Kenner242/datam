import { notFound } from "next/navigation";
import CertificateStatus from "@/components/CertificateStatus";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getCourse } from "@/lib/courses";

export default async function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return <><Navbar /><CertificateStatus course={course} /><Footer /></>;
}
