"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Chapter {
  id: string;
  attributes: {
    chapter: string | null;
    title: string | null;
    translatedLanguage?: string;
  };
}

interface Manga {
  id: string;
  attributes: {
    title: { en?: string; ja?: string; ["pt-br"]?: string };
    description: { en?: string; ["pt-br"]?: string };
    tags: { attributes: { name: { en?: string; ["pt-br"]?: string } } }[];
  };
  relationships: any[];
}

export default function MangaDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderAsc, setOrderAsc] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const resManga = await fetch(`/api/manga/${id}`);
        const mangaData = await resManga.json();
        setManga(mangaData.data);

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

  // título → tenta PT-BR, depois EN, depois JA
  const title =
    manga?.attributes?.title?.["pt-br"] ||
    manga?.attributes?.title?.en ||
    manga?.attributes?.title?.ja ||
    "Sem título";

  // descrição → tenta PT-BR, depois EN
  const description =
    manga?.attributes?.description?.["pt-br"] ||
    manga?.attributes?.description?.en ||
    "Sem descrição";

  // ordenação capítulos
  const sortedChapters = [...chapters].sort((a, b) => {
    const aNum = parseFloat(a.attributes.chapter || "0");
    const bNum = parseFloat(b.attributes.chapter || "0");
    return orderAsc ? aNum - bNum : bNum - aNum;
  });

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto text-white">
      {loading ? (
        <p className="text-center text-lg">Carregando...</p>
      ) : (
        <>
          {/* Capa e info do mangá */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            {coverFileName ? (
              <img
                src={`https://uploads.mangadex.org/covers/${manga?.id}/${coverFileName}.512.jpg`}
                alt={title}
                className="w-full md:w-64 max-h-[400px] object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full md:w-64 h-72 bg-purple-900 flex items-center justify-center text-gray-400 rounded-lg">
                Sem capa
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
              <p className="mb-4 text-gray-300 line-clamp-6">{description}</p>
              <div className="flex flex-wrap gap-2">
                {manga?.attributes?.tags.map((tag: any) => {
                  const tagName =
                    tag.attributes.name["pt-br"] || tag.attributes.name.en;
                  return (
                    <span
                      key={tagName}
                      className="bg-purple-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {tagName}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lista de capítulos */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">📖 Capítulos</h2>
              {chapters.length > 0 && (
                <button
                  onClick={() => setOrderAsc(!orderAsc)}
                  className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded text-sm"
                >
                  {orderAsc ? "⬆️ Crescente" : "⬇️ Decrescente"}
                </button>
              )}
            </div>

            {chapters.length === 0 ? (
              <p className="text-gray-400">Nenhum capítulo disponível.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedChapters.map((ch) => {
                  const lang =
                    ch.attributes.translatedLanguage === "pt-br"
                      ? "PT-BR"
                      : "EN";
                  return (
                    <li
                      key={ch.id}
                      className="p-4 bg-purple-800/40 rounded-xl border border-purple-700/50 hover:bg-purple-700/50 transition flex flex-col justify-between"
                    >
                      <div className="mb-3">
                        <span className="block font-semibold text-lg">
                          [{lang}] Capítulo {ch.attributes.chapter || "?"}
                        </span>
                        <span className="text-gray-300 text-sm">
                          {ch.attributes.title || "Sem título"}
                        </span>
                      </div>
                      <button
                        onClick={() => router.push(`/reader/${ch.id}`)}
                        className="bg-purple-600 hover:bg-purple-700 transition px-3 py-2 rounded text-sm w-full text-center"
                      >
                        Ler
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </main>
  );
}
