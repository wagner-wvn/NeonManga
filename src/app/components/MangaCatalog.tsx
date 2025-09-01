"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MangaCatalogProps {
  results?: any[];
}

export default function MangaCatalog({ results = [] }: MangaCatalogProps) {
  const router = useRouter();

  // Estado inicial com resultados recebidos
  const [items, setItems] = useState(results);
  const [offset, setOffset] = useState(results.length);
  const [loading, setLoading] = useState(false);

  // Função de carregar mais resultados
  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.mangadex.org/manga?limit=20&offset=${offset}&includes[]=cover_art`
      );
      const data = await res.json();

      // JUNTA OS NOVOS COM OS EXISTENTES
      const newItems = [...items, ...(data.data || [])];

      // REMOVE DUPLICADOS COM BASE NO ID
      const uniqueItems = Array.from(
        new Map(newItems.map((manga) => [manga.id, manga])).values()
      );

      setItems(uniqueItems);
      setOffset(uniqueItems.length);
    } catch (err) {
      console.error("Erro ao carregar mais:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Garante que só renderizamos itens únicos
  const uniqueItems = Array.from(
    new Map(items.map((manga) => [manga.id, manga])).values()
  );

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {uniqueItems.map((manga) => (
          <div
            key={manga.id}
            onClick={() => router.push(`/manga/${manga.id}`)}
            className="cursor-pointer bg-zinc-900 p-2 rounded-lg hover:scale-105 transition"
          >
            <img
              src={`https://uploads.mangadex.org/covers/${manga.id}/${
                manga.relationships?.find((r: any) => r.type === "cover_art")
                  ?.attributes?.fileName
              }`}
              alt={manga.attributes?.title?.en || "Sem título"}
              className="rounded-md"
            />
            <p className="mt-2 text-sm truncate">
              {manga.attributes?.title?.en || "Sem título"}
            </p>
          </div>
        ))}
      </div>

      {/* Botão de carregar mais */}
      <div className="flex justify-center mt-6">
        <button
          onClick={loadMore}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Carregando..." : "Carregar mais"}
        </button>
      </div>
    </div>
  );
}
