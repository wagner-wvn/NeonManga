"use client";

import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchManga = async () => {
    if (!title) return;
    setLoading(true);
    setChapters([]); // limpa capítulos ao buscar novo mangá

    const res = await fetch(`/api/manga?title=${title}`);
    const data = await res.json();

    setResults(data.data || []);
    setLoading(false);
  };

  const loadChapters = async (mangaId: string) => {
    setLoading(true);

    const res = await fetch(`/api/chapters/${mangaId}`);
    const data = await res.json();

    setChapters(data.data || []);
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">📚 NeonManga</h1>

      {/* Campo de busca */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar mangá..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={searchManga}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {loading && <p className="mt-4">Carregando...</p>}

      {/* Lista de resultados */}
      <ul className="mt-6 space-y-2 w-full max-w-lg">
        {results.map((manga) => (
          <li
            key={manga.id}
            className="p-3 border rounded shadow flex justify-between items-center"
          >
            <span>
              {manga.attributes?.title?.en ||
                manga.attributes?.title?.ja ||
                "Sem título"}
            </span>
            <button
              onClick={() => loadChapters(manga.id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Ver capítulos
            </button>
          </li>
        ))}
      </ul>

      {/* Lista de capítulos */}
      {chapters.length > 0 && (
        <div className="mt-8 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Capítulos</h2>
          <ul className="space-y-2">
            {chapters.map((ch) => (
              <li key={ch.id} className="p-2 border rounded">
                Capítulo {ch.attributes.chapter || "?"} -{" "}
                {ch.attributes.title || "Sem título"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
