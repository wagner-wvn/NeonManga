import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "";
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";

  try {
    const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(
      title
    )}&includes[]=cover_art&limit=${limit}&offset=${offset}&availableTranslatedLanguage[]=en&hasAvailableChapters=true`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao buscar dados da API do MangaDex");

    const data = await res.json();

    const formatted = (data.data || []).map((manga: any) => {
      const title =
        manga.attributes.title.en ||
        manga.attributes.title["ja-ro"] ||
        "Sem título";

      const coverRel = manga.relationships?.find(
        (rel: any) => rel.type === "cover_art"
      );
      const coverFileName = coverRel?.attributes?.fileName || null;

      const coverUrl = coverFileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`
        : "/no-cover.jpg";

      return {
        id: manga.id,
        title,
        coverUrl,
      };
    });

    return NextResponse.json({
      data: formatted,
      total: data.total, // API retorna total de resultados
    });
  } catch (error) {
    console.error("Erro API Search:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mangás" },
      { status: 500 }
    );
  }
}
