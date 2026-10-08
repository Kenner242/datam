"use client";

import Link from "next/link";

export default function UpgradeButton({ plan = "premium" }: { plan?: string }) {
  return (
    <div>
      <Link href={`/checkout?plan=${plan}`} className="block w-full rounded-cell bg-ink px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-accent">
        Actualizar a Premium
      </Link>
      <p className="mt-2 text-center text-xs text-muted">Paga con tarjeta, Yape o Plin de forma segura con Culqi.</p>
    </div>
  );
}
