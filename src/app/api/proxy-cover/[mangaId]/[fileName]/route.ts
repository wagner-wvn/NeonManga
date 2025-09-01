import { NextRequest, NextResponse } from "next/server";

// Cache em memória usando ArrayBuffer
const coverCache: { [key: string]: ArrayBuffer } = {};

export async function GET(req: NextRequest) {
  try {
    const urlParts = req.url.split("/");
    const mangaId = urlParts[urlParts.length - 2];
    const fileName = urlParts[urlParts.length - 1];

    if (!mangaId || !fileName) {
      return NextResponse.json({ error: "ID ou filename não fornecido" }, { status: 400 });
    }

    const cacheKey = `${mangaId}_${fileName}`;

    // Retorna do cache se existir
    if (coverCache[cacheKey]) {
      return new NextResponse(coverCache[cacheKey], {
        headers: { "Content-Type": "image/jpeg" },
      });
    }

    // Busca a capa no MangaDex
    const coverRes = await fetch(
      `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`
    );

    if (!coverRes.ok) {
      return NextResponse.json({ error: "Falha ao buscar a capa" }, { status: coverRes.status });
    }

    // Pega ArrayBuffer direto
    const arrayBuffer = await coverRes.arrayBuffer();

    // Salva no cache
    coverCache[cacheKey] = arrayBuffer;

    return new NextResponse(arrayBuffer, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno ao buscar a capa" }, { status: 500 });
  }
}
