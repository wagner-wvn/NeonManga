"use client";

import { useSearchParams } from "next/navigation";
import { searchManga } from "@/lib/api";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import MangaCard from "@/components/manga/MangaCard";

export default function SearchContent() {
  const params = useSearchParams();
  const query = params.get("query") || "";

  const { results, loading, error, hasMore, loadMore } =
    usePaginatedSearch<any>(
      query,
      async (q, limit, offset) => {
        const res = await searchManga(q, limit, offset); // { data, total } vindo da sua API já com coverUrl proxied
        return { data: res.data || [], total: res.total || 0 };
      },
      { limit: 20 }
    );

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">🔍 Resultados para: {query}</h1>

        {loading && results.length === 0 && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p>Nenhum mangá encontrado.</p>
        )}

        {/* Grid com card reutilizável */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {results.map((manga: any) => (
            <MangaCard
              key={manga.id}
              id={manga.id}
              title={manga.title ?? "Sem título"}
              coverUrl={manga.coverUrl ?? "/no-cover.jpg"} // já vem do proxy da sua API
            />
          ))}
        </div>

        {loading && results.length > 0 && (
          <p className="text-center mt-4">Carregando mais...</p>
        )}

        {!loading && hasMore && (
          <button
            onClick={loadMore}
            className="block mx-auto mt-8 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
          >
            Carregar mais
          </button>
        )}
      </div>
    </main>
  );
}
