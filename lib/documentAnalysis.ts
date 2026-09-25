export type DocumentSection = { title: string; text: string; page?: number };
export type ConceptNode = { id: string; label: string; frequency: number; evidence: string[]; children: ConceptNode[] };
export type ConceptMap = { documentTitle: string; wordCount: number; sections: DocumentSection[]; concepts: ConceptNode[]; warnings: string[] };
type PdfJsApi = { GlobalWorkerOptions: { workerSrc: string }; getDocument: (options: { data: ArrayBuffer; disableWorker: boolean }) => { promise: Promise<{ numPages: number; getPage: (page: number) => Promise<{ getTextContent: () => Promise<{ items: Array<{ str?: string; transform?: number[] }> }> }> }> } };
type MammothApi = { extractRawText: (options: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }> };
type XlsxApi = { read: (data: ArrayBuffer, options: { type: string }) => { SheetNames: string[]; Sheets: Record<string, unknown> }; utils: { sheet_to_csv: (sheet: unknown) => string } };
type ZipTextEntry = { dir: boolean; async: (type: "string") => Promise<string> };
type ZipArchive = { files: Record<string, ZipTextEntry>; file: (path: string) => ZipTextEntry | null };
type ZipApi = { loadAsync: (data: ArrayBuffer) => Promise<ZipArchive> };

const STOPWORDS = new Set("de la el en y a los las un una que por con para es del se al como su sus más pero o este esta entre sin sobre también hasta desde nos les ni lo le ya muy todo todos toda ser son fue fueron está están hay había eran sea sido tiene tienen hacer hace puede pueden debe deben solo según tras durante mediante así donde cuando porque aunque cual cuales quien quienes esto aquello algo alguien nadie nada siempre nunca tampoco además entonces luego después antes mientras".split(" "));

function countWords(text: string) { return text.match(/[\p{L}\p{N}][\p{L}\p{N}_-]*/gu)?.length ?? 0; }
function splitParagraphs(text: string) { return text.split(/\n\s*\n/).map((part) => part.replace(/\s+/g, " ").trim()).filter((part) => part.length > 30); }

function detectExplicitSections(text: string): DocumentSection[] {
  const sections: DocumentSection[] = [];
  let title = "Introducción";
  let content: string[] = [];
  const headingPattern = /^(?:#{1,6}\s+(.{2,100})|(?:cap[ií]tulo|chapter|unidad|secci[oó]n|tema)\s+([\dIVX.-]+)\s*[:.-]?\s*(.{2,90})?|((?:\d+\.){1,4}\d*\s+.{3,90}))$/i;
  const lines = text.split("\n");
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) { content.push(""); continue; }
    const isPageMarker = /^#{1,6}\s*(?:p[aá]gina|page)\s+\d+$/i.test(line);
    if (isPageMarker) { content.push(""); continue; }
    const heading = line.match(headingPattern);
    if (heading) {
      const sectionText = content.join(" ").replace(/\s+/g, " ").trim();
      if (countWords(sectionText) >= 8) sections.push({ title, text: sectionText });
      const headingTitle = heading[1] || (heading[2] ? [heading[2], heading[3]].filter(Boolean).join(" ") : heading[4]) || line;
      title = headingTitle.replace(/[*_`]/g, "").trim();
      content = [];
    } else content.push(line);
  }
  const finalText = content.join(" ").replace(/\s+/g, " ").trim();
  if (countWords(finalText) >= 8) sections.push({ title, text: finalText });
  return sections;
}

function chunkDocument(paragraphs: string[], text: string): DocumentSection[] {
  const source = paragraphs.length ? paragraphs : text.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter((sentence) => countWords(sentence) > 5);
  if (!source.length) return text.trim() ? [{ title: "Contenido del documento", text: text.trim() }] : [];
  const maxSections = Math.min(6, Math.max(1, Math.ceil(source.length / 3)));
  const chunkSize = Math.ceil(source.length / maxSections);
  return Array.from({ length: Math.ceil(source.length / chunkSize) }, (_, index) => ({ title: `Sección ${String(index + 1).padStart(2, "0")}`, text: source.slice(index * chunkSize, (index + 1) * chunkSize).join(" ") }));
}

function rankSectionConcepts(section: DocumentSection) {
  const tokens = section.text.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [];
  const frequencies = new Map<string, number>();
  const increment = (term: string) => frequencies.set(term, (frequencies.get(term) ?? 0) + 1);
  for (const token of tokens) if (!STOPWORDS.has(token) && token.length >= 4) increment(token);
  for (let index = 0; index < tokens.length - 1; index += 1) {
    const first = tokens[index];
    const second = tokens[index + 1];
    if (STOPWORDS.has(first) || STOPWORDS.has(second) || first.length < 4 || second.length < 4) continue;
    increment(`${first} ${second}`);
  }
  const titleTokens: string[] = section.title.toLowerCase().match(/[\p{L}]{4,}/gu) ?? [];
  return Array.from(frequencies, ([term, frequency]) => ({ term, frequency: frequency + (term.split(" ").some((word) => titleTokens.includes(word)) ? 2 : 0) }))
    .filter((item) => item.term.includes(" ") ? item.frequency >= 2 : item.frequency >= 3)
    .sort((left, right) => Number(right.term.includes(" ")) - Number(left.term.includes(" ")) || right.frequency - left.frequency)
    .slice(0, 5);
}

export function buildConceptMap(documentTitle: string, text: string): ConceptMap {
  const normalized = text.replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();
  const warnings: string[] = [];
  if (countWords(normalized) < 25) warnings.push("Se extrajo poco texto. El archivo puede estar escaneado, protegido o parcialmente compatible; el mapa no inventa contenido que no se pudo leer.");

  const paragraphs = splitParagraphs(normalized);
  const parsedSections = detectExplicitSections(normalized).filter((section) => countWords(section.text) >= 10);
  const sections = parsedSections.length >= 2 ? parsedSections : chunkDocument(paragraphs, normalized);

  const concepts: ConceptNode[] = sections.map((section, sectionIndex) => {
    const chosen = rankSectionConcepts(section);
    return {
      id: `section-${sectionIndex}`,
      label: section.title,
      frequency: chosen.reduce((sum, item) => sum + item.frequency, 0),
      evidence: section.text.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter((sentence) => countWords(sentence) >= 8).slice(0, 2),
      children: chosen.map((concept, conceptIndex) => {
        const evidence = section.text.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter((sentence) => sentence.toLowerCase().includes(concept.term) && countWords(sentence) >= 6).slice(0, 2);
        return { id: `section-${sectionIndex}-concept-${conceptIndex}`, label: concept.term, frequency: concept.frequency, evidence, children: [] };
      }),
    };
  });

  return { documentTitle, wordCount: countWords(normalized), sections, concepts, warnings };
}

function loadScript(src: string, marker: () => boolean): Promise<void> {
  if (marker()) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) { existing.addEventListener("load", () => resolve(), { once: true }); existing.addEventListener("error", () => reject(new Error("No se pudo cargar el extractor del formato.")), { once: true }); return; }
    const script = document.createElement("script"); script.src = src; script.async = true; script.onload = () => resolve(); script.onerror = () => reject(new Error("No se pudo cargar el extractor del formato.")); document.head.appendChild(script);
  });
}

function orderPdfItems(items: Array<{ str?: string; transform?: number[] }>) {
  const positioned = items.map((item, index) => ({ text: item.str ?? "", x: item.transform?.[4] ?? 0, y: item.transform?.[5] ?? -index, index })).filter((item) => item.text.trim());
  positioned.sort((a, b) => Math.abs(a.y - b.y) < 2.5 ? a.x - b.x : b.y - a.y);
  const lines: Array<{ y: number; parts: string[] }> = [];
  for (const item of positioned) {
    const line = lines.find((candidate) => Math.abs(candidate.y - item.y) < 2.5);
    if (line) line.parts.push(item.text);
    else lines.push({ y: item.y, parts: [item.text] });
  }
  return lines.map((line) => line.parts.join(" ")).join("\n");
}

export async function extractDocumentText(file: File): Promise<{ text: string; warnings: string[] }> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const warnings: string[] = [];
  if (extension === "pdf" || file.type === "application/pdf") {
    const source = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    await loadScript(source, () => Boolean((window as unknown as { pdfjsLib?: PdfJsApi }).pdfjsLib));
    const pdfjs = (window as unknown as { pdfjsLib?: PdfJsApi }).pdfjsLib;
    if (!pdfjs) throw new Error("PDF.js no está disponible después de cargarlo.");
    pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer(), disableWorker: true }).promise;
    const pages: string[] = [];
    for (let page = 1; page <= pdf.numPages; page += 1) { const content = await (await pdf.getPage(page)).getTextContent(); pages.push(`\n## Página ${page}\n${orderPdfItems(content.items)}`); }
    const text = pages.join("\n");
    if (countWords(text) < 25) warnings.push("Este PDF parece escaneado o contiene muy poco texto seleccionable. Para analizarlo correctamente se necesita OCR.");
    return { text, warnings };
  }
  if (extension === "docx" || file.type.includes("wordprocessingml")) {
    const source = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
    await loadScript(source, () => Boolean((window as unknown as { mammoth?: MammothApi }).mammoth));
    const mammoth = (window as unknown as { mammoth?: MammothApi }).mammoth;
    if (!mammoth) throw new Error("El extractor DOCX no está disponible después de cargarlo.");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return { text: result.value, warnings };
  }
  if (["xlsx", "xls"].includes(extension)) {
    const source = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    await loadScript(source, () => Boolean((window as unknown as { XLSX?: XlsxApi }).XLSX));
    const xlsx = (window as unknown as { XLSX?: XlsxApi }).XLSX;
    if (!xlsx) throw new Error("El extractor Excel no está disponible después de cargarlo.");
    const workbook = xlsx.read(await file.arrayBuffer(), { type: "array" });
    return { text: workbook.SheetNames.map((name) => `\n## ${name}\n${xlsx.utils.sheet_to_csv(workbook.Sheets[name])}`).join("\n"), warnings };
  }
  if (["epub", "pptx"].includes(extension)) {
    const source = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    await loadScript(source, () => Boolean((window as Window & { JSZip?: unknown }).JSZip));
    const zipApi = (window as unknown as { JSZip?: ZipApi }).JSZip;
    if (!zipApi) throw new Error("El extractor ZIP no se cargó correctamente.");
    const archive = await zipApi.loadAsync(await file.arrayBuffer());
    const parser = new DOMParser();
    if (extension === "pptx") {
      const slidePaths = Object.keys(archive.files).filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path)).sort((a, b) => Number(a.match(/slide(\d+)/)?.[1]) - Number(b.match(/slide(\d+)/)?.[1]));
      const slides: string[] = [];
      for (const [index, path] of slidePaths.entries()) {
        const xml = parser.parseFromString(await archive.file(path)!.async("string"), "application/xml");
        const slideText = Array.from(xml.getElementsByTagNameNS("*", "t")).map((node) => node.textContent?.trim() ?? "").filter(Boolean).join(" ");
        if (slideText) slides.push(`\n## Diapositiva ${index + 1}\n${slideText}`);
      }
      return { text: slides.join("\n"), warnings: slides.length ? warnings : ["La presentación no contiene texto extraíble. Comprueba si sus diapositivas son imágenes."] };
    }
    const containerFile = archive.file("META-INF/container.xml");
    if (!containerFile) return { text: "", warnings: ["El EPUB no tiene un archivo de navegación válido."] };
    const containerXml = parser.parseFromString(await containerFile.async("string"), "application/xml");
    const packagePath = containerXml.getElementsByTagName("rootfile").item(0)?.getAttribute("full-path");
    if (!packagePath) return { text: "", warnings: ["No se pudo localizar el índice interno del EPUB."] };
    const packageFile = archive.file(packagePath);
    if (!packageFile) return { text: "", warnings: ["No se pudo leer el índice interno del EPUB."] };
    const packageXml = parser.parseFromString(await packageFile.async("string"), "application/xml");
    const manifest = new Map(Array.from(packageXml.getElementsByTagName("item")).map((item) => [item.getAttribute("id") ?? "", item.getAttribute("href") ?? ""]));
    const basePath = packagePath.split("/").slice(0, -1).join("/");
    const spinePaths = Array.from(packageXml.getElementsByTagName("itemref")).map((item) => manifest.get(item.getAttribute("idref") ?? "")).filter((path): path is string => Boolean(path));
    const chapters: string[] = [];
    for (const [index, relativePath] of spinePaths.entries()) {
      const fullPath = `${basePath ? `${basePath}/` : ""}${relativePath.replace(/^\.\//, "")}`;
      const chapterFile = archive.file(fullPath);
      if (!chapterFile) continue;
      const chapterXml = parser.parseFromString(await chapterFile.async("string"), "application/xhtml+xml");
      const heading = chapterXml.querySelector("h1,h2,h3,title")?.textContent?.trim() || `Capítulo ${index + 1}`;
      const chapterText = chapterXml.body?.textContent?.replace(/\s+/g, " ").trim() ?? "";
      if (chapterText) chapters.push(`\n## ${heading}\n${chapterText}`);
    }
    return { text: chapters.join("\n"), warnings: chapters.length ? warnings : ["No se pudo extraer texto del EPUB. Comprueba que el libro contenga texto y no solo páginas escaneadas."] };
  }
  if (extension === "doc") warnings.push("DOC antiguo no se puede extraer de forma fiable en el navegador. Convierte el archivo a DOCX o PDF.");
  if (file.type.startsWith("text/") || ["txt", "md", "csv", "json", "sql", "py", "js", "ts", "tsx", "jsx", "html", "css", "ipynb"].includes(extension)) return { text: await file.text(), warnings };
  return { text: "", warnings };
}
