"use client";

import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import MangaCarousel from "./components/MangaCarousel";

export default function Home() {
  const [recent, setRecent] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMangaLists = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/manga");
      const data = await res.json();

      // Seu endpoint /api/manga retorna { recent, popular }
      setRecent(data.recent?.data || []);
      setPopular(data.popular?.data || []);
    } catch (err) {
      console.error("Erro ao carregar mangás:", err);
      setRecent([]);
      setPopular([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMangaLists();
  }, []);

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Se o seu Hero precisa de onSearch, mantemos a prop vazia */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Mais Recentes */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">📖 Mais Recentes</h2>
          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : recent.length ? (
            <MangaCarousel results={recent} />
          ) : (
            <p className="text-sm text-gray-400">Nada por aqui ainda.</p>
          )}
        </section>

        {/* Populares */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">🔥 Populares</h2>
          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : popular.length ? (
            <MangaCarousel results={popular} />
          ) : (
            <p className="text-sm text-gray-400">Nada por aqui ainda.</p>
          )}
        </section>
      </div>
    </main>
  );
}
