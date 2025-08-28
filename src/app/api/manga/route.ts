import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "";

  if (!title) {
    return NextResponse.json({ data: [] });
  }

  try {
    const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&includes[]=cover_art&limit=20&availableTranslatedLanguage[]=pt-br&hasAvailableChapters=true&status[]=ongoing&status[]=completed&order[latestUploadedChapter]=desc`;


    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar mangás" },
      { status: 500 }
    );
  }
}
