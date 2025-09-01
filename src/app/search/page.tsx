"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MangaCatalog from "../components/MangaCatalog";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paginação
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  // Busca resultados iniciais ou ao mudar a query
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

      if (reset) {
        setResults(data.data || []);
        setOffset(data.data?.length || 0);
      } else {
        const newItems = [...results, ...(data.data || [])];

        // Remove duplicados
        const uniqueItems = Array.from(
          new Map(newItems.map((m) => [m.id, m])).values()
        );

        setResults(uniqueItems);
        setOffset(uniqueItems.length);
      }

      // Verifica se há mais
      const total = data.total || 0;
      setHasMore((reset ? 0 : offset) + LIMIT < total);
    } catch (err: any) {
      setError("Erro na busca.");
    } finally {
      setLoading(false);
    }
  };

  // Quando a query muda, reseta resultados
  useEffect(() => {
    if (!query) {
      setResults([]);
      setHasMore(false);
      return;
    }
    fetchResults(true);
  }, [query]);

  // Carregar mais
  const handleLoadMore = () => {
    if (!hasMore) return;
    fetchResults(false);
  };

  return (
    <main className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Resultados para: {query}</h1>

      {loading && results.length === 0 && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p>Nenhum mangá encontrado.</p>
      )}

      {results.length > 0 && (
        <MangaCatalog
          results={results}
          query={query} // PASSA A QUERY PARA O CATALOG
        />
      )}

      {/* Botão de carregar mais integrado ao MangaCatalog */}
      {loading && results.length > 0 && (
        <p className="text-center mt-4">Carregando mais...</p>
      )}
    </main>
  );
}
