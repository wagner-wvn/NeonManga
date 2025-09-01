"use client";

import { useRouter } from "next/navigation";

interface Manga {
  id: string;
  title: string;
  coverFileName: string | null;
}

interface MangaCatalogProps {
  results?: Manga[];
  query?: string;
}

export default function MangaCatalog({ results = [], query = "" }: MangaCatalogProps) {
  const router = useRouter();

  // Mantém apenas itens únicos
  const uniqueItems = Array.from(new Map(results.map((manga) => [manga.id, manga])).values());

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {uniqueItems.map((manga) => {
        const coverUrl = manga.coverFileName
          ? `/api/proxy-cover/${manga.id}/${manga.coverFileName}`
          : "/no-cover.jpg"; // fallback da pasta public

          return (
            <div
              key={manga.id}
              onClick={() => router.push(`/manga/${manga.id}`)}
              className="cursor-pointer bg-zinc-900 p-2 rounded-lg hover:scale-105 transition flex flex-col"
            >
              <img
                src={coverUrl}
                alt={manga.title}
                className="rounded-md object-cover h-64 w-full"
              />
              <p className="mt-2 text-sm line-clamp-2">{manga.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
