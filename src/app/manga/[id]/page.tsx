"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MangaDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      const res = await fetch(`/api/chapters/${id}`);
      const data = await res.json();
      setChapters(data.data || []);
      setLoading(false);
    };

    fetchChapters();
  }, [id]);

  return (
    <main className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">📖 Detalhes do Mangá</h1>

      {loading && <p>Carregando capítulos...</p>}

      <ul className="space-y-2 w-full max-w-lg">
        {chapters.map((ch) => (
          <li
            key={ch.id}
            className="p-2 border rounded flex justify-between items-center"
          >
            <span>
              Capítulo {ch.attributes.chapter || "?"} -{" "}
              {ch.attributes.title || "Sem título"}
            </span>
            <button
              onClick={() => router.push(`/reader/${ch.id}`)}
              className="bg-purple-600 text-white px-3 py-1 rounded"
            >
              Ler
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
