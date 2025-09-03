// src/lib/formatters.ts

type Dict = Record<string, any>;

/** Prioriza PT-BR → EN → JA */
export function getTitle(attrs?: Dict): string {
  if (!attrs) return "Sem título";
  return (
    attrs?.title?.["pt-br"] ||
    attrs?.title?.en ||
    attrs?.title?.ja ||
    "Sem título"
  );
}

/** Prioriza PT-BR → EN; corta texto grande */
export function getDescription(attrs?: Dict, maxLen = 600): string {
  if (!attrs) return "Sem descrição";
  const raw =
    attrs?.description?.["pt-br"] ||
    attrs?.description?.en ||
    "Sem descrição";
  return raw.length > maxLen ? raw.slice(0, maxLen - 1) + "…" : raw;
}

/** Pega nome da tag em PT-BR → EN */
export function getTagName(tag?: Dict): string {
  if (!tag?.attributes?.name) return "Tag";
  return tag.attributes.name["pt-br"] || tag.attributes.name.en || "Tag";
}

/** Constrói URL de capa — por padrão usa o proxy (recomendado p/ Vercel + MangaDex) */
export function buildCoverUrl(
  mangaId?: string,
  coverFileName?: string | null,
  size: 256 | 512 = 512,
  viaProxy = true
): string {
  if (!mangaId || !coverFileName) return "/no-cover.jpg";
  if (viaProxy) {
    // seu endpoint proxy já atende sem o sufixo .{size}.jpg
    return `/api/proxy-cover/${mangaId}/${coverFileName}`;
  }
  return `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}.${size}.jpg`;
}

/** Converte "12.5" → 12.5; vazio/NaN vira 0 */
export function toNumber(n?: string | null): number {
  const v = parseFloat(n || "0");
  return Number.isFinite(v) ? v : 0;
}

/** Idioma exibido bonito */
export function humanLang(code?: string): "PT-BR" | "EN" | "—" {
  if (code === "pt-br") return "PT-BR";
  if (code === "en") return "EN";
  return "—";
}
