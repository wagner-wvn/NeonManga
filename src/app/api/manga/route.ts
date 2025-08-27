import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json({ error: "Parâmetro 'title' é obrigatório" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.mangadex.org/manga?title=${title}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar mangás" }, { status: 500 });
  }
}
