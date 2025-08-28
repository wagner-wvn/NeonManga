"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MangaGrid from "../components/MangaGrid";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/manga?title=${encodeURIComponent(query)}&limit=100`
        );
        const data = await res.json();
        setResults(data.data || []);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <main className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Resultados para: {query}</h1>
      {loading && <p>Carregando...</p>}
      {!loading && results.length === 0 && <p>Nenhum mangá encontrado.</p>}
      {!loading && results.length > 0 && <MangaGrid results={results} />}
    </main>
  );
}
