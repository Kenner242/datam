import { redirect } from "next/navigation";

// El contenido del fundador ahora vive dentro de la sección Metodología de la portada.
export default function FundadorPage() {
	redirect("/#metodologia");
}
