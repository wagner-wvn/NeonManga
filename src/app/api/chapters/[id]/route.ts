import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mangaId = params.id;

  try {
    const response = await fetch(
      `https://api.mangadex.org/manga/${mangaId}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=50`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Falha ao buscar capítulos" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Filtrar apenas capítulos que realmente têm páginas
    const chapters = data.data;
    const validChapters: any[] = [];

    // ⚠️ Importante: Promise.all pra acelerar requisições
    await Promise.all(
      chapters.map(async (ch: any) => {
        try {
          const check = await fetch(
            `https://api.mangadex.org/at-home/server/${ch.id}`
          );
          const checkData = await check.json();

          if (checkData?.chapter?.data?.length > 0) {
            validChapters.push(ch);
          }
        } catch (e) {
          console.error(`Erro ao verificar capítulo ${ch.id}`, e);
        }
      })
    );

    return NextResponse.json({ data: validChapters });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno ao buscar capítulos" },
      { status: 500 }
    );
  }
}
