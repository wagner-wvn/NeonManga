import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Pega o id direto da URL
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // último segmento da rota

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.mangadex.org/at-home/server/${id}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Falha ao buscar páginas do capítulo" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao buscar páginas do capítulo" },
      { status: 500 }
    );
  }
}
