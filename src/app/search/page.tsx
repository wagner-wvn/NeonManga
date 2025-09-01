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

  // 🔹 paginação
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 20; // quantidade por vez

  const fetchResults = async (reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.mangadex.org/manga?title=${query}&limit=${LIMIT}&offset=${
          reset ? 0 : offset
        }&includes[]=cover_art`
      );

      if (!res.ok) throw new Error("Erro ao buscar mangás.");
      const data = await res.json();

      if (reset) {
        setResults(data.data || []);
      } else {
        setResults((prev) => [...prev, ...(data.data || [])]);
      }

      // MangaDex retorna "total" na response → conseguimos saber se ainda tem mais
      const total = data.total || 0;
      setHasMore(offset + LIMIT < total);
    } catch (err: any) {
      if (err.name !== "AbortError") setError("Erro na busca.");
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
    setOffset(0);
    fetchResults(true); // resetando quando muda query
  }, [query]);

  // 🔹 carregar mais
  const handleLoadMore = () => {
    setOffset((prev) => prev + LIMIT);
  };

  // quando offset mudar (mas não for reset), busca mais
  useEffect(() => {
    if (offset > 0) {
      fetchResults(false);
    }
  }, [offset]);

  return (
    <main className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Resultados para: {query}</h1>

      {loading && results.length === 0 && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p>Nenhum mangá encontrado.</p>
      )}

      {results.length > 0 && <MangaCatalog results={results} />}

      {loading && results.length > 0 && (
        <p className="text-center mt-4">Carregando mais...</p>
      )}
    </main>
  );
}
