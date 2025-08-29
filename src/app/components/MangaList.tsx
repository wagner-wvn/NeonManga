"use client";
import { useRouter } from "next/navigation";

export default function MangaList({ results }: { results: any[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {(results || []).map((manga) => {
        const title =
          manga.attributes?.title?.en ||
          manga.attributes?.title?.ja ||
          "Sem título";

        const coverFile = manga.relationships?.find(
          (rel: any) => rel.type === "cover_art"
        )?.attributes?.fileName;

        const coverUrl = coverFile
          ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFile}.256.jpg`
          : "/no-cover.png";

        return (
          <div
            key={manga.id}
            className="cursor-pointer"
            onClick={() => router.push(`/manga/${manga.id}`)}
          >
            <img
              src={coverUrl}
              alt={title}
              className="rounded-lg shadow-md w-full h-64 object-cover"
            />
            <p className="mt-2 text-sm font-medium">{title}</p>
          </div>
        );
      })}
    </div>
  );
}
