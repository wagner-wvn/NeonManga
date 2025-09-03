"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Manga {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tags: string[];
}

export default function Hero() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchManga() {
      try {
        const res = await fetch("/api/manga");
        const data = await res.json();
        setMangas(data.popularFormatted || []);
      } catch (error) {
        console.error("Erro ao buscar mangás:", error);
      }
    }
    fetchManga();
  }, []);

  // Auto troca a cada 10s
  useEffect(() => {
    if (mangas.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % mangas.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [mangas]);

  if (mangas.length === 0) {
    return (
      <section className="relative h-[60vh] flex items-center justify-center bg-black pt-16">
        <p className="text-white text-lg">Carregando recomendações...</p>
      </section>
    );
  }

  const manga = mangas[current];

  return (
    <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={manga.coverUrl}
          alt={manga.title}
          fill
          className="object-cover brightness-50"
          priority
        />
        {/* Gradiente roxo por cima da imagem */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-3xl px-4 text-white flex flex-col items-center h-full justify-center text-center">
        {/* Título */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 break-words">
          {manga.title}
        </h1>

        {/* Descrição */}
        <p className="text-sm sm:text-base md:text-lg mb-4 line-clamp-3">
          {manga.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {manga.tags.map((tag) => (
            <span
              key={tag}
              className="bg-purple-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Botão Ler Agora */}
        <button
          onClick={() => router.push(`/manga/${manga.id}`)}
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition mb-4"
        >
          Ler Agora
        </button>

        {/* Pontinhos */}
        <div className="flex justify-center gap-2 mt-2">
          {mangas.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 rounded-full transition ${
                index === current ? "bg-purple-600 scale-110" : "bg-gray-400/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Botões de navegação */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev === 0 ? mangas.length - 1 : prev - 1))
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-20 transition"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % mangas.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-20 transition"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
}
