import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const mangaId = params.id;

  try {
    const res = await fetch(
      `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist&includes[]=tag`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Mangá não encontrado" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar mangá" },
      { status: 500 }
    );
  }
}
