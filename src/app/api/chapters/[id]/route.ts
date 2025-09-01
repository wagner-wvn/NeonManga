import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Pega o id direto da URL
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // último segmento da rota

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  try {
    const feedUrl = `https://api.mangadex.org/manga/${id}/feed?translatedLanguage[]=pt-br&translatedLanguage[]=en&order[chapter]=asc&limit=100&includeEmptyPages=0`;
    const response = await fetch(feedUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "Falha ao buscar capítulos" }, { status: response.status });
    }

    const data = await response.json();
    const chapters = data.data;

    const chapterMap = new Map<string, any>();

    chapters.forEach((ch: any) => {
      const chapterNum = ch.attributes.chapter || "0";
      const existing = chapterMap.get(chapterNum);

      if (!existing) {
        chapterMap.set(chapterNum, ch);
      } else if (
        existing.attributes.translatedLanguage !== "pt-br" &&
        ch.attributes.translatedLanguage === "pt-br"
      ) {
        chapterMap.set(chapterNum, ch);
      }
    });

    const validChapters = Array.from(chapterMap.values()).sort(
      (a, b) => parseFloat(a.attributes.chapter || "0") - parseFloat(b.attributes.chapter || "0")
    );

    return NextResponse.json({ data: validChapters });
  } catch (error) {
    console.error("Erro ao buscar capítulos:", error);
    return NextResponse.json({ error: "Erro interno ao buscar capítulos" }, { status: 500 });
  }
}
