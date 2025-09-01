import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Pega o id diretamente da URL
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // último segmento da rota

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.mangadex.org/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist&includes[]=tag`
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
