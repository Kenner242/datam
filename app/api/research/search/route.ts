import { NextRequest, NextResponse } from "next/server";
import { normalizeCrossref, normalizeOpenAlex, type CrossrefRecord, type OpenAlexRecord, type ScientificRecord } from "@/lib/scientificSearch";

const PAGE_SIZE = 10;

function inYearRange(record: ScientificRecord, from: number | null, to: number | null) {
  if (!from && !to) return true;
  if (record.year === null) return false;
  return (!from || record.year >= from) && (!to || record.year <= to);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("q")?.trim();
  const page = Math.max(1, Math.min(1000, Number.parseInt(params.get("page") ?? "1", 10) || 1));
  const yearFromValue = Number.parseInt(params.get("from") ?? "", 10);
  const yearToValue = Number.parseInt(params.get("to") ?? "", 10);
  const yearFrom = Number.isFinite(yearFromValue) ? yearFromValue : null;
  const yearTo = Number.isFinite(yearToValue) ? yearToValue : null;
  const openAccessOnly = params.get("openAccess") === "true";
  if (!query || query.length < 2) return NextResponse.json({ error: "Escribe al menos dos caracteres para buscar." }, { status: 400 });
  if (query.length > 180) return NextResponse.json({ error: "La búsqueda es demasiado larga." }, { status: 400 });
  if ((yearFrom && (yearFrom < 1800 || yearFrom > 2100)) || (yearTo && (yearTo < 1800 || yearTo > 2100)) || (yearFrom && yearTo && yearFrom > yearTo)) {
    return NextResponse.json({ error: "Revisa el rango de años." }, { status: 400 });
  }

  const offset = (page - 1) * PAGE_SIZE;
  const crossrefUrl = new URL("https://api.crossref.org/works");
  crossrefUrl.searchParams.set("query", query);
  crossrefUrl.searchParams.set("rows", String(PAGE_SIZE));
  crossrefUrl.searchParams.set("offset", String(offset));
  crossrefUrl.searchParams.set("select", "DOI,title,author,published,issued,container-title,short-container-title,type,URL,abstract,link,license");
  if (yearFrom) crossrefUrl.searchParams.set("filter", `from-pub-date:${yearFrom}${yearTo ? `,until-pub-date:${yearTo}` : ""}`);
  else if (yearTo) crossrefUrl.searchParams.set("filter", `until-pub-date:${yearTo}`);
  const headers = { "User-Agent": `DataMAcademicSearch/1.0 (${process.env.CROSSREF_MAILTO ?? "educational-use"})` };

  const openAlexUrl = new URL("https://api.openalex.org/works");
  openAlexUrl.searchParams.set("search", query);
  openAlexUrl.searchParams.set("per-page", String(PAGE_SIZE));
  openAlexUrl.searchParams.set("page", String(page));
  openAlexUrl.searchParams.set("select", "id,doi,title,publication_year,type,authorships,primary_location,open_access,abstract_inverted_index");
  const openAlexFilters: string[] = [];
  if (yearFrom) openAlexFilters.push(`from_publication_date:${yearFrom}-01-01`);
  if (yearTo) openAlexFilters.push(`to_publication_date:${yearTo}-12-31`);
  if (openAccessOnly) openAlexFilters.push("is_oa:true");
  if (openAlexFilters.length) openAlexUrl.searchParams.set("filter", openAlexFilters.join(","));

  const cache = { revalidate: 300 as const };
  const [crossrefResponse, openAlexResponse] = await Promise.allSettled([
    fetch(crossrefUrl, { signal: AbortSignal.timeout(12_000), headers, next: cache }),
    fetch(openAlexUrl, { signal: AbortSignal.timeout(12_000), next: cache }),
  ]);
  const records: ScientificRecord[] = [];
  const sources: string[] = [];
  const failures: string[] = [];
  let crossrefHasMore = false;
  let openAlexHasMore = false;

  if (crossrefResponse.status === "fulfilled" && crossrefResponse.value.ok) {
    const data = await crossrefResponse.value.json() as { message?: { items?: CrossrefRecord[]; "total-results"?: number } };
    sources.push("Crossref");
    crossrefHasMore = (data.message?.["total-results"] ?? 0) > offset + PAGE_SIZE;
    records.push(...(data.message?.items ?? []).map(normalizeCrossref).filter((record): record is ScientificRecord => Boolean(record)));
  } else failures.push("Crossref");

  if (openAlexResponse.status === "fulfilled" && openAlexResponse.value.ok) {
    const data = await openAlexResponse.value.json() as { results?: OpenAlexRecord[]; meta?: { count?: number } };
    sources.push("OpenAlex");
    openAlexHasMore = (data.meta?.count ?? 0) > offset + PAGE_SIZE;
    records.push(...(data.results ?? []).map(normalizeOpenAlex).filter((record): record is ScientificRecord => Boolean(record)));
  } else failures.push("OpenAlex");

  if (!sources.length) return NextResponse.json({ error: "No se pudo conectar con las bases académicas. Intenta nuevamente." }, { status: 502 });
  const deduplicated = new Map<string, ScientificRecord>();
  for (const record of records.filter((item) => inYearRange(item, yearFrom, yearTo) && (!openAccessOnly || item.openAccess))) {
    const key = record.doi ? record.doi.toLowerCase() : record.title.trim().toLowerCase();
    const existing = deduplicated.get(key);
    if (!existing) deduplicated.set(key, record);
    else {
      const primary = existing.source === "Crossref" ? existing : record.source === "Crossref" ? record : existing;
      const secondary = primary === existing ? record : existing;
      deduplicated.set(key, { ...primary, authors: primary.authors === "Autoría no disponible" ? secondary.authors : primary.authors, year: primary.year ?? secondary.year, journal: primary.journal === "Revista no disponible" ? secondary.journal : primary.journal, publicationType: primary.publicationType === "Tipo no disponible" ? secondary.publicationType : primary.publicationType, doi: primary.doi || secondary.doi, url: primary.url || secondary.url, abstract: primary.abstract || secondary.abstract, openAccess: primary.openAccess || secondary.openAccess });
    }
  }
  return NextResponse.json({ results: Array.from(deduplicated.values()), page, pageSize: PAGE_SIZE * sources.length, hasMore: crossrefHasMore || openAlexHasMore, sources, warning: failures.length ? `Fuente temporalmente no disponible: ${failures.join(", ")}.` : null });
}
