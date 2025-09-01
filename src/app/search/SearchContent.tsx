"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MangaCatalog from "../components/MangaCatalog";

// Tipagem dos mangás
interface Manga {
  id: string;
  title: string;
  coverFileName: string | null;
}

// Tipagem da resposta da API
interface SearchApiResponse {
  data: Manga[];
  total: number;
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  // Função para buscar resultados
  const fetchResults = async (reset = false) => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/search?title=${encodeURIComponent(query)}&limit=${LIMIT}&offset=${reset ? 0 : offset}`
      );

      if (!res.ok) throw new Error("Erro ao buscar mangás");

      const data: SearchApiResponse = await res.json();

      // Junta resultados novos com os antigos
      const newItems = reset ? data.data : [...results, ...(data.data || [])];

      // Remove duplicados
      const uniqueItems: Manga[] = Array.from(new Map(newItems.map((m) => [m.id, m])).values());

      setResults(uniqueItems);
      setOffset(uniqueItems.length);

      // Verifica se há mais
      setHasMore(uniqueItems.length < (data.total || 0));
    } catch {
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

  return (
    <main className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Resultados para: {query}</h1>

      {loading && results.length === 0 && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && <p>Nenhum mangá encontrado.</p>}

      {results.length > 0 && <MangaCatalog results={results} query={query} />}

      {loading && results.length > 0 && <p className="text-center mt-4">Carregando mais...</p>}

      {!loading && hasMore && (
        <button
          onClick={() => fetchResults(false)}
          className="block mx-auto mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          Carregar mais
        </button>
      )}
    </main>
  );
}
