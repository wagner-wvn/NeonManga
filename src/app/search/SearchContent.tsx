"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paginação
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  // Busca resultados
  const fetchResults = async (reset = false) => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/search?title=${encodeURIComponent(query)}&limit=${LIMIT}&offset=${
          reset ? 0 : offset
        }`
      );

      if (!res.ok) throw new Error("Erro ao buscar mangás");
      const data = await res.json();

      const newResults = reset ? data.data || [] : [...results, ...(data.data || [])];
      const uniqueResults = Array.from(new Map(newResults.map((m: any) => [m.id, m])).values());

      setResults(uniqueResults);
      setOffset(uniqueResults.length);

      const total = data.total || 0;
      setHasMore(uniqueResults.length < total);
    } catch (err: any) {
      setError("Erro na busca.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query) {
      setResults([]);
      setHasMore(false);
      return;
    }
    fetchResults(true);
  }, [query]);

  const handleLoadMore = () => {
    if (!hasMore) return;
    fetchResults(false);
  };

  return (
    <main className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">🔍 Resultados para: {query}</h1>

      {loading && results.length === 0 && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && <p>Nenhum mangá encontrado.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {results.map((manga) => {
          const title = manga.title || "Sem título";
          const coverUrl = manga.coverUrl || "";

          return (
            <div
              key={manga.id}
              className="bg-[#241530] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => (window.location.href = `/manga/${manga.id}`)}
            >
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-60 object-cover"
                />
              ) : (
                <div className="w-full h-60 bg-purple-900 flex items-center justify-center text-sm text-gray-400">
                  Sem capa
                </div>
              )}
              <div className="p-3 text-center">
                <h2 className="text-sm font-semibold line-clamp-2 text-white">
                  {title}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      {loading && results.length > 0 && <p className="text-center mt-4">Carregando mais...</p>}

      {!loading && hasMore && (
        <button
          onClick={handleLoadMore}
          className="block mx-auto mt-8 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          Carregar mais
        </button>
      )}
    </main>
  );
}
