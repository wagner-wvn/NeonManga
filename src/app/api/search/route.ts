import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "";
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";

  try {
    const url =
      `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}` +
      `&includes[]=cover_art` +
      `&limit=${limit}` +
      `&offset=${offset}` +
      `&availableTranslatedLanguage[]=en` + // adicione &availableTranslatedLanguage[]=pt-br se quiser
      `&hasAvailableChapters=true` +
      `&contentRating[]=safe`;

    const res = await fetch(url, {
      headers: { "User-Agent": "NeonManga/0.1 (+https://example.com)" },
      // cache: "no-store" // opcional em dev
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar dados da API do MangaDex" },
        { status: res.status }
      );
    }

    const data = await res.json();

    const formatted = (data.data || []).map((manga: any) => {
      const title =
        manga.attributes?.title?.["pt-br"] ||
        manga.attributes?.title?.en ||
        manga.attributes?.title?.["ja-ro"] ||
        "Sem título";

      const coverRel = manga.relationships?.find(
        (rel: any) => rel.type === "cover_art"
      );
      const coverFileName = coverRel?.attributes?.fileName || null;

      const coverUrl = coverFileName
        ? `/api/proxy-cover/${manga.id}/${coverFileName}?size=256` // PROXY para evitar CORS/hotlink
        : "/no-cover.jpg";

      return { id: manga.id, title, coverUrl };
    });

    return NextResponse.json({
      data: formatted,
      total: data.total ?? formatted.length,
    });
  } catch (error) {
    console.error("Erro API Search:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mangás" },
      { status: 500 }
    );
  }
}
