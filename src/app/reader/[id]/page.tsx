"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getChapter } from "@/lib/api";

const FALLBACK_SRC = "/no-page-fallback.jpg"; // opcional, senão cai no no-cover.jpg

export default function Reader() {
  const { id } = useParams();
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"scroll" | "swipe">("scroll");
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Busca páginas do capítulo
  useEffect(() => {
    const fetchPages = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getChapter(id as string); // /api/chapter/[id]
        if (data?.baseUrl && data?.chapter) {
          const base = `${data.baseUrl}/data/${data.chapter.hash}`;
          const urls = (data.chapter.data || []).map((file: string) => `${base}/${file}`);
          setPages(urls);
          setCurrentPage(0);
        } else {
          setPages([]);
          setError("Não foi possível carregar este capítulo.");
        }
      } catch (e) {
        console.error(e);
        setError("Erro ao carregar o capítulo.");
        setPages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [id]);

  // Navegação por teclado no modo swipe
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (mode !== "swipe" || pages.length === 0) return;
      if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(p + 1, pages.length - 1));
      if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(p - 1, 0));
    },
    [mode, pages.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // fallback seguro para <img> (evita loop infinito)
  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (el.dataset.fallbackApplied) return;
    el.dataset.fallbackApplied = "1";
    el.src = FALLBACK_SRC || "/no-cover.jpg";
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">📖 Leitor de Mangá</h1>

      {/* Alternador de modo */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode("scroll")}
          className={`px-4 py-2 rounded-xl shadow-md transition ${
            mode === "scroll"
              ? "bg-purple-700 hover:bg-purple-800 text-white"
              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          }`}
        >
          Scroll
        </button>
        <button
          onClick={() => setMode("swipe")}
          className={`px-4 py-2 rounded-xl shadow-md transition ${
            mode === "swipe"
              ? "bg-purple-700 hover:bg-purple-800 text-white"
              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          }`}
        >
          Swipe
        </button>
      </div>

      {/* Estados */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="w-12 h-12 border-4 border-purple-700 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-zinc-400">Carregando páginas...</p>
        </div>
      )}

      {error && !loading && <p className="text-red-400">{error}</p>}
      {!error && !loading && pages.length === 0 && (
        <p className="text-zinc-400">Nenhuma página para exibir.</p>
      )}

      {/* Modo Scroll */}
      {mode === "scroll" && !loading && pages.length > 0 && (
        <div className="flex flex-col gap-6 w-full max-w-3xl">
          {pages.map((src, idx) => (
            <div key={idx} className="bg-zinc-900 rounded-2xl shadow-lg overflow-hidden">
              <img
                src={src}
                alt={`Página ${idx + 1}`}
                className="w-full h-auto object-contain"
                loading="lazy"
                decoding="async"
                onError={onImgError}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modo Swipe */}
      {mode === "swipe" && !loading && pages.length > 0 && (
        <div className="flex flex-col items-center w-full max-w-3xl gap-4">
          <div className="w-full bg-zinc-900 rounded-2xl shadow-lg overflow-hidden">
            <img
              src={pages[currentPage]}
              alt={`Página ${currentPage + 1}`}
              className="w-full h-auto object-contain"
              onError={onImgError}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-40"
              disabled={currentPage === 0}
            >
              ◀︎ Anterior
            </button>
            <div className="text-center bg-purple-700/30 px-3 py-1 rounded text-sm w-fit">
              Página {currentPage + 1} / {pages.length}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages.length - 1))}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-40"
              disabled={currentPage >= pages.length - 1}
            >
              Próxima ▶︎
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
