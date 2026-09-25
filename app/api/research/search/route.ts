import { NextRequest, NextResponse } from "next/server";

type CrossrefWork = { DOI?: string; title?: string[]; author?: Array<{ given?: string; family?: string }>; published?: { "date-parts"?: number[][] }; "container-title"?: string[]; URL?: string; abstract?: string; link?: Array<{ URL?: string; contentType?: string }> };
type OpenAlexWork = { id?: string; doi?: string | null; title?: string; publication_year?: number; authorships?: Array<{ author?: { display_name?: string } }>; primary_location?: { source?: { display_name?: string }; landing_page_url?: string }; open_access?: { is_oa?: boolean; oa_url?: string | null }; abstract_inverted_index?: Record<string, number[]> };

function abstractFromIndex(index?: Record<string, number[]>) {
  if (!index) return "";
  const words = Object.entries(index).flatMap(([word, positions]) => positions.map((position) => [position, word] as const)).sort((a, b) => a[0] - b[0]);
  return words.map(([, word]) => word).join(" ");
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const yearFrom = Number(request.nextUrl.searchParams.get("from") ?? "");
  const yearTo = Number(request.nextUrl.searchParams.get("to") ?? "");
  if (!query || query.length < 2) return NextResponse.json({ error: "Escribe al menos dos caracteres para buscar." }, { status: 400 });
  if (query.length > 180) return NextResponse.json({ error: "La búsqueda es demasiado larga." }, { status: 400 });

  try {
    const crossrefUrl = new URL("https://api.crossref.org/works");
    crossrefUrl.searchParams.set("query", query);
    crossrefUrl.searchParams.set("rows", "12");
    crossrefUrl.searchParams.set("select", "DOI,title,author,published,container-title,URL,abstract,link");
    const openAlexUrl = new URL("https://api.openalex.org/works");
    openAlexUrl.searchParams.set("search", query);
    openAlexUrl.searchParams.set("per-page", "12");
    openAlexUrl.searchParams.set("select", "id,doi,title,publication_year,authorships,primary_location,open_access,abstract_inverted_index");
    const [crossrefResponse, openAlexResponse] = await Promise.all([
      fetch(crossrefUrl, { signal: AbortSignal.timeout(12_000), headers: { "User-Agent": "DataM educational research discovery" } }),
      fetch(openAlexUrl, { signal: AbortSignal.timeout(12_000) }),
    ]);
    const works: Array<{ id: string; title: string; authors: string; year: number | null; source: string; doi: string; url: string; abstract: string; openAccess: boolean }> = [];
    if (crossrefResponse.ok) {
      const data = await crossrefResponse.json() as { message?: { items?: CrossrefWork[] } };
      for (const item of data.message?.items ?? []) {
        const title = item.title?.[0]?.trim();
        if (!title) continue;
        const published = item.published?.["date-parts"]?.[0]?.[0];
        const year = typeof published === "number" ? published : null;
        if (yearFrom && year && year < yearFrom || yearTo && year && year > yearTo) continue;
        const doi = item.DOI ?? "";
        const fullTextLink = item.link?.find((link) => link.contentType?.includes("pdf"))?.URL;
        works.push({ id: `crossref:${doi || title}`, title, authors: item.author?.slice(0, 4).map((author) => [author.given, author.family].filter(Boolean).join(" ")).join(", ") ?? "Autoría no indicada", year, source: item["container-title"]?.[0] ?? "Crossref", doi, url: fullTextLink ?? item.URL ?? (doi ? `https://doi.org/${doi}` : ""), abstract: (item.abstract ?? "").replace(/<[^>]*>/g, "").slice(0, 700), openAccess: Boolean(fullTextLink) });
      }
    }
    if (openAlexResponse.ok) {
      const data = await openAlexResponse.json() as { results?: OpenAlexWork[] };
      for (const item of data.results ?? []) {
        const title = item.title?.trim();
        if (!title) continue;
        const year = item.publication_year ?? null;
        if (yearFrom && year && year < yearFrom || yearTo && year && year > yearTo) continue;
        const doi = item.doi?.replace(/^https?:\/\/doi.org\//, "") ?? "";
        works.push({ id: `openalex:${item.id ?? doi ?? title}`, title, authors: item.authorships?.slice(0, 4).map((authorship) => authorship.author?.display_name).filter(Boolean).join(", ") ?? "Autoría no indicada", year, source: item.primary_location?.source?.display_name ?? "OpenAlex", doi, url: item.open_access?.oa_url ?? item.primary_location?.landing_page_url ?? (doi ? `https://doi.org/${doi}` : ""), abstract: abstractFromIndex(item.abstract_inverted_index).slice(0, 700), openAccess: Boolean(item.open_access?.is_oa) });
      }
    }
    const deduplicated = Array.from(new Map(works.map((work) => [work.doi ? work.doi.toLowerCase() : work.title.toLowerCase(), work])).values()).slice(0, 20);
    return NextResponse.json({ results: deduplicated, sources: ["Crossref", "OpenAlex"] });
  } catch {
    return NextResponse.json({ error: "No se pudo contactar a Crossref/OpenAlex. Revisa tu conexión e inténtalo de nuevo." }, { status: 502 });
  }
}
