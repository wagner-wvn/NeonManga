"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import MangaCarousel from "@/components/manga/MangaCarousel";
import { getMangaLists } from "@/lib/api";

export default function Home() {
  const [recent, setRecent] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMangaLists();
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

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-700 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="bg-zinc-950 text-white min-h-screen">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Mais Recentes */}
        <section className="mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-400">
            📖 Mais Recentes
          </h2>
          {recent.length ? (
            <MangaCarousel results={recent} highlightColor="purple" />
          ) : (
            <p className="text-sm text-gray-400">Nada por aqui ainda.</p>
          )}
        </section>

        {/* Populares */}
        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-400">
            🔥 Populares
          </h2>
          {popular.length ? (
            <MangaCarousel results={popular} highlightColor="purple" />
          ) : (
            <p className="text-sm text-gray-400">Nada por aqui ainda.</p>
          )}
        </section>
      </div>
    </main>
  );
}
