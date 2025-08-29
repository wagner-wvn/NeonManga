"use client";

import { useRouter } from "next/navigation";

interface MangaCatalogProps {
  results: any[];
}

export default function MangaCatalog({ results }: MangaCatalogProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {results.map((manga) => {
        const title =
          manga.attributes?.title?.en ||
          manga.attributes?.title?.ja ||
          "Sem título";

        const coverRel = manga.relationships?.find(
          (rel: any) => rel.type === "cover_art"
        );

        // 🚨 A API de search pode trazer "relationships" sem coverFileName ainda
        const coverFileName = coverRel?.attributes?.fileName;

        return (
          <div
            key={manga.id}
            className="bg-[#241530] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition"
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
            <div className="p-2 text-center">
              <h2 className="text-sm font-semibold line-clamp-2 text-white">
                {title}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}
