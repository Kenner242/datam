"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type LeaderboardRow = { user_id: string; display_name: string; region: string | null; xp_total: number };

// TODO(radar-empleabilidad): permitir a empresas consultar este ranking agregado solo con opt-in explícito.
export default function Leaderboard() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [region, setRegion] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from("leaderboard_view").select("user_id, display_name, region, xp_total").order("xp_total", { ascending: false }).limit(20);
    if (region) query = query.eq("region", region);
    void query.then(({ data }) => {
      setRows((data as LeaderboardRow[] | null) ?? []);
      setIsLoading(false);
    });
  }, [region]);

  return (
    <section className="data-cell p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="data-cell-header">Tabla de posiciones (opcional)</p>
        <select value={region} onChange={(event) => setRegion(event.target.value)} className="rounded-cell border border-line p-1.5 text-xs" aria-label="Filtrar por región">
          <option value="">Todas las regiones</option>
          <option value="Lima">Lima</option>
          <option value="Nacional">Nacional</option>
          <option value="Norte">Norte</option>
          <option value="Centro">Centro</option>
          <option value="Sur">Sur</option>
          <option value="Remoto">Remoto</option>
        </select>
      </div>
      {isLoading ? (
        <p className="mt-3 text-sm text-muted">Cargando ranking...</p>
      ) : rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Aún no hay estudiantes que participen en la tabla de posiciones.</p>
      ) : (
        <ol className="mt-3 space-y-1.5">
          {rows.map((row, index) => (
            <li key={row.user_id} className="flex items-center justify-between border-l-2 border-accent bg-base px-3 py-2 text-sm">
              <span className="text-ink">{index + 1}. {row.display_name}{row.region ? ` · ${row.region}` : ""}</span>
              <span className="font-mono text-xs font-bold text-accent">{row.xp_total} XP</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
