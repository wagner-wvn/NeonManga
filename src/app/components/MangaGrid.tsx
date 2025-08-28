"use client";

import { useRouter } from "next/navigation";

interface MangaGridProps {
  results: any[];
}

export default function MangaGrid({ results }: MangaGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8 w-full max-w-6xl px-4">
      {results.map((manga) => {
        const title = manga.attributes?.title?.en || manga.attributes?.title?.ja || "Sem título";
        const coverRel = manga.relationships?.find((rel: any) => rel.type === "cover_art");
        const coverFileName = coverRel?.attributes?.fileName;

        return (
          <div
            key={manga.id}
            className="bg-[#241530] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
            onClick={() => router.push(`/manga/${manga.id}`)}
          >
            {coverFileName ? (
              <img
                src={`https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.512.jpg`}
                alt={title}
                className="w-full h-60 object-cover"
              />
            ) : (
              <div className="w-full h-60 bg-purple-900 flex items-center justify-center text-sm text-gray-400">
                Sem capa
              </div>
            )}
            <div className="p-3 text-center">
              <h2 className="text-sm font-semibold line-clamp-2 text-white">{title}</h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}
