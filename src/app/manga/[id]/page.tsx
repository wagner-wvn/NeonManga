"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Chapter {
  id: string;
  attributes: {
    chapter: string | null;
    title: string | null;
  };
}

interface Manga {
  id: string;
  attributes: {
    title: { en?: string; ja?: string };
    description: { en?: string };
    tags: { attributes: { name: { en?: string } } }[];
  };
  relationships: any[];
}

export default function MangaDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        // Buscar dados do mangá
        const resManga = await fetch(`/api/manga/${id}`);
        const mangaData = await resManga.json();
        setManga(mangaData.data);

        // Buscar capítulos
        const resChapters = await fetch(`/api/chapters/${id}`);
        const chaptersData = await resChapters.json();
        setChapters(chaptersData.data || []);
      } catch (err) {
        console.error("Erro ao buscar mangá ou capítulos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const coverRel = manga?.relationships?.find(
    (rel: any) => rel.type === "cover_art"
  );
  const coverFileName = coverRel?.attributes?.fileName;
  const title =
    manga?.attributes?.title?.en ||
    manga?.attributes?.title?.ja ||
    "Sem título";
  const description = manga?.attributes?.description?.en || "Sem descrição";

  return (
    <main className="p-6 max-w-6xl mx-auto text-white">
      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <>
          {/* Capa e info do mangá */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {coverFileName ? (
              <img
                src={`https://uploads.mangadex.org/covers/${manga?.id}/${coverFileName}.512.jpg`}
                alt={title}
                className="w-48 md:w-64 h-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-48 md:w-64 h-64 bg-purple-900 flex items-center justify-center text-gray-400 rounded-lg">
                Sem capa
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{title}</h1>
              <p className="mb-4 text-gray-300 line-clamp-6">{description}</p>
              <div className="flex flex-wrap gap-2">
                {manga?.attributes?.tags.map((tag: any) => (
                  <span
                    key={tag.attributes.name.en}
                    className="bg-purple-700 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {tag.attributes.name.en}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de capítulos */}
          <div>
            <h2 className="text-2xl font-bold mb-4">📖 Capítulos</h2>
            {chapters.length === 0 && (
              <p className="text-gray-400">Nenhum capítulo disponível.</p>
            )}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chapters.map((ch) => (
                <li
                  key={ch.id}
                  className="p-3 border rounded flex justify-between items-center hover:bg-purple-800 transition"
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
          </div>
        </>
      )}
    </main>
  );
}
