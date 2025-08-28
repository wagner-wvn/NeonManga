"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Reader() {
  const { id } = useParams();
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"scroll" | "swipe">("scroll");

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      const res = await fetch(`/api/chapter/${id}`);
      const data = await res.json();

      if (data.baseUrl && data.chapter) {
        const urls = data.chapter.data.map(
          (file: string) => `${data.baseUrl}/data/${data.chapter.hash}/${file}`
        );
        setPages(urls);
      }
      setLoading(false);
    };

    fetchPages();
  }, [id]);

  return (
    <main className="flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-4">📖 Leitor</h1>

      {/* Alternador de modo */}
      <div className="mb-4">
        <button
          onClick={() => setMode("scroll")}
          className={`px-4 py-2 mr-2 rounded ${mode === "scroll" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Scroll
        </button>
        <button
          onClick={() => setMode("swipe")}
          className={`px-4 py-2 rounded ${mode === "swipe" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Swipe
        </button>
      </div>

      {loading && <p>Carregando páginas...</p>}

      {/* Scroll mode */}
      {mode === "scroll" && (
        <div className="flex flex-col gap-4 w-full max-w-3xl">
          {pages.map((src, idx) => (
            <img key={idx} src={src} alt={`Página ${idx + 1}`} className="rounded shadow" />
          ))}
        </div>
      )}

      {/* Swipe mode */}
      {mode === "swipe" && (
        <div className="flex overflow-x-auto gap-4 w-full max-w-3xl snap-x">
          {pages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Página ${idx + 1}`}
              className="rounded shadow w-full h-auto flex-shrink-0 snap-center"
            />
          ))}
        </div>
      )}
    </main>
  );
}
