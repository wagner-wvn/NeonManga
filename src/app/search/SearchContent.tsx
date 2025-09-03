"use client";

import { useSearchParams } from "next/navigation";
import { searchManga } from "@/lib/api";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import MangaCard from "@/components/manga/MangaCard";
import { buildCoverUrl, getTitle } from "@/lib/formatters";

export default function SearchContent() {
  const params = useSearchParams();
  const query = params.get("query") || "";

  const { results, loading, error, hasMore, loadMore } = usePaginatedSearch<any>(
    query,
    async (q, limit, offset) => {
      const res = await searchManga(q, limit, offset); // /api/search retorna { data, total }
      return { data: res.data || [], total: res.total || 0 };
    },
    { limit: 20 }
  );

  return (
    <main className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">🔍 Resultados para: {query}</h1>

      {loading && results.length === 0 && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && <p>Nenhum mangá encontrado.</p>}

      {/* Grid com card reutilizável */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {results.map((manga: any) => {
          const title = manga.title || getTitle(manga.attributes);
          // se a API de busca já formatar coverUrl, usa; senão tenta relationship + proxy
          const coverFileName =
            manga.relationships?.find((r: any) => r.type === "cover_art")?.attributes?.fileName;
          const coverUrl =
            manga.coverUrl || buildCoverUrl(manga.id, coverFileName, 256, true);

          return (
            <MangaCard
              key={manga.id}
              id={manga.id}
              title={title}
              coverUrl={coverUrl}
            />
          );
        })}
      </div>

      {loading && results.length > 0 && <p className="text-center mt-4">Carregando mais...</p>}

      {!loading && hasMore && (
        <button
          onClick={loadMore}
          className="block mx-auto mt-8 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          Carregar mais
        </button>
      )}
    </main>
  );
}
