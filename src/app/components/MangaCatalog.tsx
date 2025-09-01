"use client";

import { useRouter } from "next/navigation";

interface MangaCatalogProps {
  results?: any[];
  query?: string;
}

export default function MangaCatalog({
  results = [],
  query = "",
}: MangaCatalogProps) {
  const router = useRouter();

  // Mantém apenas itens únicos
  const uniqueItems = Array.from(
    new Map(results.map((manga) => [manga.id, manga])).values()
  );

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {uniqueItems.map((manga) => {
          const title =
            manga.title || manga.attributes?.title?.en || "Sem título";

          // Pega o fileName da capa
          const coverFileName = manga.relationships?.find(
            (r: any) => r.type === "cover_art"
          )?.attributes?.fileName;

          // Monta a URL da capa com o sufixo .256.jpg
          const coverUrl = coverFileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`
            : "/fallback-cover.jpg"; // opcional: imagem padrão se não tiver capa

          return (
            <div
              key={manga.id}
              onClick={() => router.push(`/manga/${manga.id}`)}
              className="cursor-pointer bg-zinc-900 p-2 rounded-lg hover:scale-105 transition flex flex-col"
            >
              <img
                src={coverUrl}
                alt={title}
                className="rounded-md object-cover h-64 w-full"
              />
              <p className="mt-2 text-sm line-clamp-2">{title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
