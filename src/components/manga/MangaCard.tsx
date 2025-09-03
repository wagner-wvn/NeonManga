// src/components/manga/MangaCard.tsx
"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: string;
  title: string;
  coverUrl: string;   // já calculada (via proxy ou direta)
  className?: string; // permitir ajustes finos quando necessário
};

export default function MangaCard({ id, title, coverUrl, className = "" }: Props) {
  const router = useRouter();

  return (
    <div
      className={`bg-[#241530] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform ${className}`}
      onClick={() => router.push(`/manga/${id}`)}
      aria-label={`Abrir mangá: ${title}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? router.push(`/manga/${id}`) : null)}
    >
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="w-full h-60 object-cover" />
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
}
