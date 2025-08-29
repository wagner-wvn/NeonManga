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

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.mangadex.org/manga?title=${query}&limit=100&includes[]=cover_art`
        );
        if (!res.ok) throw new Error("Erro ao buscar mangás.");
        const data = await res.json();
        setResults(data.data || []);
      } catch (err: any) {
        if (err.name !== "AbortError") setError("Erro na busca.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    return () => controller.abort();
  }, [query]);

  return (
    <main className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Resultados para: {query}</h1>
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p>Nenhum mangá encontrado.</p>
      )}
      {!loading && results.length > 0 && <MangaCatalog results={results} />}
    </main>
  );
}
