import { NextResponse } from "next/server";

// Cache simples em memória por processo
const coverCache = new Map<string, ArrayBuffer>();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const { searchParams, pathname } = url;

    // Esperado: /api/proxy-cover/<mangaId>/<fileName>
    const segments = pathname.split("/"); // ["", "api", "proxy-cover", "<mangaId>", "<fileName>"]
    const fileName = decodeURIComponent(segments.pop() || "");
    const mangaId = decodeURIComponent(segments.pop() || "");

    if (!mangaId || !fileName) {
      return NextResponse.json(
        { error: "ID ou filename não fornecido" },
        { status: 400 }
      );
    }

    // tamanho: 256 | 512 | original
    const sizeParam = (searchParams.get("size") || "512").toLowerCase();
    const size = sizeParam === "256" ? "256" : sizeParam === "original" ? "" : "512";

    const cacheKey = `${mangaId}:${fileName}:${size || "orig"}`;
    const cached = coverCache.get(cacheKey);
    if (cached) {
      return new NextResponse(cached, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400, immutable",
        },
      });
    }

    // Monta URL para MangaDex
    const upstreamUrl =
      size === ""
        ? `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
        : `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.${size}.jpg`;

    const upstreamRes = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": "NeonManga/0.1 (+https://example.com)",
        "Accept": "image/*",
      },
    });

    if (!upstreamRes.ok) {
      // Fallback elegante
      return NextResponse.redirect(new URL("/no-cover.jpg", req.url), 302);
    }

    const buf = await upstreamRes.arrayBuffer();
    coverCache.set(cacheKey, buf);

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (err) {
    console.error("proxy-cover error:", err);
    return NextResponse.redirect(new URL("/no-cover.jpg", req.url), 302);
  }
}
