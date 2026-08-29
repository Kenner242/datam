"use client";

import { useMemo, useState } from "react";
import {
  buildFolderSequence,
  uploadFolderProgressively,
  type VideoFolder,
} from "@/lib/videoFolderUpload";

const defaultFolders: VideoFolder[] = [
  {
    id: "excel-avanzado",
    title: "Curso de Excel Avanzado",
    theme: "Power Query, análisis y automatización",
    videos: [
      { id: "excel-01", title: "01 - Importación y limpieza", file: new File([""], "01-importacion-y-limpieza.mp4", { type: "video/mp4" }), order: 1 },
      { id: "excel-02", title: "02 - Transformación con Power Query", file: new File([""], "02-transformacion-power-query.mp4", { type: "video/mp4" }), order: 2 },
      { id: "excel-03", title: "03 - Modelado y automatización", file: new File([""], "03-modelado-y-automatizacion.mp4", { type: "video/mp4" }), order: 3 },
    ],
  },
  {
    id: "introduccion-a-la-ia",
    title: "Curso de Introducción a la IA",
    theme: "Conceptos, uso responsable y proyectos",
    videos: [
      { id: "ia-01", title: "01 - Comprender la IA", file: new File([""], "01-comprender-la-ia.mp4", { type: "video/mp4" }), order: 1 },
      { id: "ia-02", title: "02 - Herramientas y trabajo", file: new File([""], "02-herramientas-y-trabajo.mp4", { type: "video/mp4" }), order: 2 },
      { id: "ia-03", title: "03 - Proyecto aplicado", file: new File([""], "03-proyecto-aplicado.mp4", { type: "video/mp4" }), order: 3 },
    ],
  },
  {
    id: "power-bi-desde-cero",
    title: "Curso de Power BI desde cero",
    theme: "Dashboards, modelado y visualización",
    videos: [
      { id: "pbi-01", title: "01 - Primeros pasos", file: new File([""], "01-primeros-pasos.mp4", { type: "video/mp4" }), order: 1 },
      { id: "pbi-02", title: "02 - Modelo de datos", file: new File([""], "02-modelo-de-datos.mp4", { type: "video/mp4" }), order: 2 },
      { id: "pbi-03", title: "03 - Dashboard final", file: new File([""], "03-dashboard-final.mp4", { type: "video/mp4" }), order: 3 },
    ],
  },
  {
    id: "power-query",
    title: "Curso de Power Query",
    theme: "Fuentes, transformación y limpieza",
    videos: [
      { id: "pq-01", title: "01 - Fuentes de datos", file: new File([""], "01-fuentes-de-datos.mp4", { type: "video/mp4" }), order: 1 },
      { id: "pq-02", title: "02 - Transformación de datos", file: new File([""], "02-transformacion-de-datos.mp4", { type: "video/mp4" }), order: 2 },
    ],
  },
  {
    id: "presentacion-datam",
    title: "Presentación de DataM",
    theme: "Video institucional y presentación general",
    videos: [
      { id: "datam-01", title: "01 - Presentación institucional", file: new File([""], "01-presentacion-institucional.mp4", { type: "video/mp4" }), order: 1 },
    ],
  },
  {
    id: "python-para-datos",
    title: "Curso de Python para Datos",
    theme: "Lógica, pandas y automatización",
    videos: [
      { id: "py-01", title: "01 - Python lógico", file: new File([""], "01-python-logico.mp4", { type: "video/mp4" }), order: 1 },
      { id: "py-02", title: "02 - Pandas", file: new File([""], "02-pandas.mp4", { type: "video/mp4" }), order: 2 },
      { id: "py-03", title: "03 - Proyecto final", file: new File([""], "03-proyecto-final.mp4", { type: "video/mp4" }), order: 3 },
    ],
  },
  {
    id: "sql-para-analisis",
    title: "Curso de SQL para Análisis",
    theme: "Consultas, cruces y toma de decisiones",
    videos: [
      { id: "sql-01", title: "01 - Consultas básicas", file: new File([""], "01-consultas-basicas.mp4", { type: "video/mp4" }), order: 1 },
      { id: "sql-02", title: "02 - Cruce de datos", file: new File([""], "02-cruce-de-datos.mp4", { type: "video/mp4" }), order: 2 },
      { id: "sql-03", title: "03 - Decisiones con datos", file: new File([""], "03-decisiones-con-datos.mp4", { type: "video/mp4" }), order: 3 },
    ],
  },
];

const defaultProgress = (folderId: string) => ({
  progress: 0,
  current: "Pendiente",
  status: "idle" as const,
  folderId,
});

export default function VideoFolderUploader() {
  const orderedFolders = useMemo(() => buildFolderSequence(defaultFolders), []);
  const [isUploading, setIsUploading] = useState(false);
  const [folderStates, setFolderStates] = useState<Record<string, { progress: number; current: string; status: "idle" | "uploading" | "completed" }>>(() =>
    Object.fromEntries(orderedFolders.map((folder) => [folder.id, defaultProgress(folder.id)])),
  );

  async function handleUploadAll() {
    setIsUploading(true);

    for (const folder of orderedFolders) {
      setFolderStates((current) => ({
        ...current,
        [folder.id]: {
          progress: 0,
          current: "Preparando subida",
          status: "uploading",
        },
      }));

      await uploadFolderProgressively(
        folder,
        async (video) => {
          await new Promise((resolve) => {
            setTimeout(resolve, 350);
          });
          void video;
        },
        (payload) => {
          setFolderStates((current) => ({
            ...current,
            [payload.folderId]: {
              progress: payload.progress,
              current: payload.current,
              status: payload.status,
            },
          }));
        },
      );
    }

    setIsUploading(false);
  }

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="data-cell-header">Carga progresiva</p>
          <h3 className="mt-1 font-display text-xl font-bold text-ink">Subida ordenada de carpetas de videos</h3>
        </div>
        <button
          type="button"
          onClick={handleUploadAll}
          disabled={isUploading}
          className="inline-flex items-center justify-center rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isUploading ? "Subiendo..." : "Subir todas las carpetas"}
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {orderedFolders.map((folder) => {
          const folderState = folderStates[folder.id] ?? defaultProgress(folder.id);

          return (
            <article key={folder.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="data-cell-header">Carpeta</p>
                  <h4 className="mt-1 font-display text-lg font-bold text-ink">{folder.title}</h4>
                  {folder.theme ? <p className="mt-1 text-sm text-slate-600">{folder.theme}</p> : null}
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {folderState.status === "completed" ? "Completada" : folderState.status === "uploading" ? "En proceso" : "Pendiente"}
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                  style={{ width: `${folderState.progress}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-600">
                <span>{folderState.current}</span>
                <span>{folderState.progress}%</span>
              </div>

              <ol className="mt-4 space-y-2">
                {folder.videos.map((video) => (
                  <li key={video.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                    <span>{video.order}. {video.title}</span>
                    <span className="text-slate-500">{video.file.name}</span>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </div>
  );
}
