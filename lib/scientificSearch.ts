export type CrossrefRecord = {
  DOI?: string;
  title?: string[];
  author?: Array<{ given?: string; family?: string; name?: string }>;
  published?: { "date-parts"?: number[][] };
  issued?: { "date-parts"?: number[][] };
  "container-title"?: string[];
  "short-container-title"?: string[];
  type?: string;
  URL?: string;
  abstract?: string;
  link?: Array<{ URL?: string; contentType?: string; intendedApplication?: string }>;
  license?: Array<{ URL?: string; contentVersion?: string }>;
  "is-referenced-by-count"?: number;
};

export type OpenAlexRecord = {
  id?: string;
  doi?: string | null;
  title?: string;
  publication_year?: number;
  type?: string;
  authorships?: Array<{ author?: { display_name?: string } }>;
  primary_location?: { source?: { display_name?: string }; landing_page_url?: string };
  open_access?: { is_oa?: boolean; oa_url?: string | null };
  abstract_inverted_index?: Record<string, number[]>;
};

export type ScientificRecord = {
  id: string;
  title: string;
  authors: string;
  year: number | null;
  journal: string;
  publicationType: string;
  source: "Crossref" | "OpenAlex";
  doi: string;
  url: string;
  abstract: string;
  openAccess: boolean;
};

function cleanText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16))).replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code))).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

export function restoreAbstract(index?: Record<string, number[]>) {
  if (!index) return "";
  return Object.entries(index).flatMap(([word, positions]) => positions.map((position) => [position, word] as const)).sort((a, b) => a[0] - b[0]).map(([, word]) => word).join(" ");
}

export function normalizeCrossref(record: CrossrefRecord): ScientificRecord | null {
  const title = cleanText(record.title?.[0] ?? "");
  if (!title) return null;
  const doi = record.DOI?.trim() ?? "";
  const dateParts = record.published?.["date-parts"]?.[0] ?? record.issued?.["date-parts"]?.[0];
  const yearValue = dateParts?.[0];
  const journal = cleanText(record["container-title"]?.find(Boolean) ?? record["short-container-title"]?.find(Boolean) ?? "");
  const links = record.link ?? [];
  const fullTextLink = links.find((link) => link.URL && /text\/html|application\/pdf/i.test(link.contentType ?? ""))?.URL;
  const openAccess = Boolean(record.license?.length || links.some((link) => link.intendedApplication === "text-mining") || fullTextLink);
  return {
    id: `crossref:${doi || title.toLowerCase()}`,
    title,
    authors: record.author?.map((author) => author.name || [author.given, author.family].filter(Boolean).join(" ")).filter(Boolean).slice(0, 8).join(", ") || "Autoría no disponible",
    year: typeof yearValue === "number" ? yearValue : null,
    journal: journal || "Revista no disponible",
    publicationType: cleanText(record.type ?? "") || "Tipo no disponible",
    source: "Crossref",
    doi,
    url: fullTextLink || record.URL || (doi ? `https://doi.org/${doi}` : ""),
    abstract: cleanText(record.abstract ?? "").slice(0, 5000),
    openAccess,
  };
}

export function normalizeOpenAlex(record: OpenAlexRecord): ScientificRecord | null {
  const title = cleanText(record.title ?? "");
  if (!title) return null;
  const doi = record.doi?.replace(/^https?:\/\/doi\.org\//i, "") ?? "";
  const journal = cleanText(record.primary_location?.source?.display_name ?? "");
  return {
    id: `openalex:${record.id ?? doi ?? title.toLowerCase()}`,
    title,
    authors: record.authorships?.map((entry) => entry.author?.display_name).filter((value): value is string => Boolean(value)).slice(0, 8).join(", ") || "Autoría no disponible",
    year: record.publication_year ?? null,
    journal: journal || "Revista no disponible",
    publicationType: cleanText(record.type ?? "") || "Tipo no disponible",
    source: "OpenAlex",
    doi,
    url: record.open_access?.oa_url || record.primary_location?.landing_page_url || (doi ? `https://doi.org/${doi}` : ""),
    abstract: cleanText(restoreAbstract(record.abstract_inverted_index)).slice(0, 5000),
    openAccess: record.open_access?.is_oa === true,
  };
}
