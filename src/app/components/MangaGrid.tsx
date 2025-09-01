"use client";

import { useRouter } from "next/navigation";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface MangaGridProps {
  results: any[];
}

export default function MangaGrid({ results }: MangaGridProps) {
  const router = useRouter();

  // armazenar o slider instance no estado
  const [sliderRef, sliderInstance] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 3, spacing: 15 },
    breakpoints: {
      "(max-width: 768px)": { slides: { perView: 2, spacing: 10 } },
      "(max-width: 480px)": { slides: { perView: 1.5, spacing: 8 } },
    },
  });

  return (
    <div className="relative">
      {/* Botão seta esquerda */}
      <button
        onClick={() => sliderInstance?.current?.prev()}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-purple-700 p-2 rounded-full text-white hover:bg-purple-900"
      >
        {"<"}
      </button>

      {/* Botão seta direita */}
      <button
        onClick={() => sliderInstance?.current?.next()}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-purple-700 p-2 rounded-full text-white hover:bg-purple-900"
      >
        {">"}
      </button>

      <div ref={sliderRef} className="keen-slider">
        {results.map((manga) => {
          const title =
            manga.attributes?.title?.en ||
            manga.attributes?.title?.ja ||
            "Sem título";
          const coverRel = manga.relationships?.find(
            (rel: any) => rel.type === "cover_art"
          );
          const coverFileName = coverRel?.attributes?.fileName;

          return (
            <div
              key={manga.id}
              className="keen-slider__slide bg-[#241530] rounded-xl overflow-hidden shadow-lg cursor-pointer"
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
                <h2 className="text-sm font-semibold line-clamp-2 text-white">
                  {title}
                </h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
