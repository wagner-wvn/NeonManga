"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import MangaGrid from "./components/MangaGrid";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchManga = async (title: string) => {
    if (!title) return;
    setLoading(true);

    const res = await fetch(`/api/manga?title=${title}&includes[]=cover_art`);
    const data = await res.json();

    setResults(data.data || []);
    setLoading(false);
  };

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero onSearch={searchManga} />
      {loading ? <p className="text-center mt-6">Carregando...</p> : <MangaGrid results={results} />}
      <Footer />
    </main>
  );
}
