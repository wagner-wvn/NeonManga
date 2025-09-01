"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MangaCatalogProps {
  results?: any[];
  query?: string;
}

export default function MangaCatalog({
  results = [],
  query = "",
}: MangaCatalogProps) {
  const router = useRouter();
  const [items, setItems] = useState(results);
  const [offset, setOffset] = useState(results.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(results.length > 0); // 🔹 controle de mais itens
  const LIMIT = 20;

  const loadMore = async () => {
    if (!query || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?title=${encodeURIComponent(
          query
        )}&limit=${LIMIT}&offset=${offset}`
      );
      const data = await res.json();

      const newItems = [...items, ...(data.data || [])];

      // Remove duplicados
      const uniqueItems = Array.from(
        new Map(newItems.map((manga) => [manga.id, manga])).values()
      );

      setItems(uniqueItems);
      setOffset(uniqueItems.length);

      // 🔹 Atualiza hasMore
      const total = data.total || 0;
      setHasMore(uniqueItems.length < total);
    } catch (err) {
      console.error("Erro ao carregar mais:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mantém apenas itens únicos
  const uniqueItems = Array.from(
    new Map(items.map((manga) => [manga.id, manga])).values()
  );

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {uniqueItems.map((manga) => {
          const title =
            manga.title || manga.attributes?.title?.en || "Sem título";
          const coverUrl =
            manga.coverUrl ||
            `https://uploads.mangadex.org/covers/${manga.id}/${
              manga.relationships?.find((r: any) => r.type === "cover_art")
                ?.attributes?.fileName
            }`;

          return (
            <div
              key={manga.id}
              onClick={() => router.push(`/manga/${manga.id}`)}
              className="cursor-pointer bg-zinc-900 p-2 rounded-lg hover:scale-105 transition flex flex-col"
            >
              <img
                src={coverUrl}
                alt={title}
                className="rounded-md object-cover h-64 w-full"
              />
              <p className="mt-2 text-sm line-clamp-2">{title}</p>
            </div>
          );
        })}
      </div>

      {/* Botão de carregar mais só aparece se houver mais resultados */}
      {query && hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Carregando..." : "Carregar mais"}
          </button>
        </div>
      )}
    </div>
  );
}
