import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  try {
    // 1 - Busca capítulos
    const feedUrl = `https://api.mangadex.org/manga/${id}/feed?translatedLanguage[]=pt-br&translatedLanguage[]=en&order[chapter]=asc&limit=100&includeEmptyPages=0`;
    const response = await fetch(feedUrl);
    if (!response.ok)
      return NextResponse.json({ error: "Falha ao buscar capítulos" }, { status: response.status });

    const data = await response.json();
    const chapters = data.data;

    // Filtra duplicados e prioriza PT-BR
    const chapterMap = new Map<string, any>();
    chapters.forEach((ch: any) => {
      const chapterNum = ch.attributes.chapter || "0";
      const existing = chapterMap.get(chapterNum);
      if (!existing) chapterMap.set(chapterNum, ch);
      else if (
        existing.attributes.translatedLanguage !== "pt-br" &&
        ch.attributes.translatedLanguage === "pt-br"
      ) {
        chapterMap.set(chapterNum, ch);
      }
    });

    const validChapters = Array.from(chapterMap.values()).sort((a, b) => {
      const aNum = parseFloat(a.attributes.chapter || "0");
      const bNum = parseFloat(b.attributes.chapter || "0");
      return aNum - bNum;
    });

    // 2 - Busca capa do mangá
    const mangaRes = await fetch(`https://api.mangadex.org/manga/${id}?includes[]=cover_art`);
    const mangaData = await mangaRes.json();
    const coverRel = mangaData.data.relationships?.find((rel: any) => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName || null;
    const coverUrl = coverFileName
      ? `https://uploads.mangadex.org/covers/${id}/${coverFileName}.256.jpg`
      : "/no-cover.jpg";

    // 3 - Retorna capítulos + capa
    return NextResponse.json({ coverUrl, data: validChapters });
  } catch (error) {
    console.error("Erro ao buscar capítulos:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar capítulos" },
      { status: 500 }
    );
  }
}
