import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const recentUrl = `https://api.mangadex.org/manga?includes[]=cover_art&limit=20&availableTranslatedLanguage[]=en&hasAvailableChapters=true&order[latestUploadedChapter]=desc&contentRating[]=safe`;
    const popularUrl = `https://api.mangadex.org/manga?includes[]=cover_art&limit=20&availableTranslatedLanguage[]=en&hasAvailableChapters=true&order[followedCount]=desc&contentRating[]=safe`;

    const [recentRes, popularRes] = await Promise.all([
      fetch(recentUrl),
      fetch(popularUrl),
    ]);

    if (!recentRes.ok || !popularRes.ok) {
      throw new Error("Falha ao buscar dados da API do MangaDex");
    }

    const [recent, popular] = await Promise.all([
      recentRes.json(),
      popularRes.json(),
    ]);

    const popularFormatted = (popular.data || [])
      .slice(0, 5)
      .map((manga: any) => {
        const title =
          manga.attributes.title.en ||
          manga.attributes.title["ja-ro"] ||
          "Sem título";

        const coverRel = manga.relationships?.find(
          (rel: any) => rel.type === "cover_art"
        );
        const coverFileName = coverRel?.attributes?.fileName || null;
        const coverUrl = coverFileName
          ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}`
          : "/hero-bg.jpg";

        const tags = manga.attributes.tags
          .slice(0, 4)
          .map((t: any) => t.attributes.name.en);

        return {
          id: manga.id,
          title,
          description: manga.attributes.description?.en?.slice(0, 200) || "",
          coverUrl,
          tags,
        };
      });

    return NextResponse.json({
      recent,
      popular,
      popularFormatted,
    });
  } catch (error) {
    console.error("Erro API Manga:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mangás" },
      { status: 500 }
    );
  }
}
