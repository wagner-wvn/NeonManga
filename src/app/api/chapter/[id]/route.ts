import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const chapterId = id;

  try {
    const response = await fetch(
      `https://api.mangadex.org/at-home/server/${chapterId}`
    );

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
