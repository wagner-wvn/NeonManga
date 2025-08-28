"use client";

import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import MangaGrid from "./components/MangaGrid";

export default function Home() {
  const [recent, setRecent] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMangaLists = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/manga");
      const data = await res.json();

      setRecent(data.recent?.data || []);
      setPopular(data.popular?.data || []);
    } catch (err) {
      console.error("Erro ao carregar mangás:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMangaLists();
  }, []);

  return (
    <main className="bg-black text-white min-h-screen">
      <Hero onSearch={() => {}} />

      {loading ? (
        <p className="text-center mt-6">Carregando...</p>
      ) : (
        <div className="max-w-6xl mx-auto px-4">
          {/* Mais Recentes */}
          <h2 className="text-xl font-bold mt-10 mb-4">📖 Mais Recentes</h2>
          <MangaGrid results={recent} />

          {/* Populares */}
          <h2 className="text-xl font-bold mt-10 mb-4">🔥 Populares</h2>
          <MangaGrid results={popular} />
        </div>
      )}
    </main>
  );
}
