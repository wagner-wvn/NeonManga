import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🔹 Mangás mais recentes
    const recentUrl = `https://api.mangadex.org/manga?includes[]=cover_art&limit=20&availableTranslatedLanguage[]=en&hasAvailableChapters=true&order[latestUploadedChapter]=desc`;

    // 🔹 Mangás populares
    const popularUrl = `https://api.mangadex.org/manga?includes[]=cover_art&limit=20&availableTranslatedLanguage[]=en&hasAvailableChapters=true&order[followedCount]=desc`;

    // Faz as requisições em paralelo
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

    return NextResponse.json({ recent, popular });
  } catch (error) {
    console.error("Erro API Manga:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mangás" },
      { status: 500 }
    );
  }
}
