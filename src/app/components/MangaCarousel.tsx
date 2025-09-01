"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MangaCarouselProps = { results?: any[] };

export default function MangaCarousel({ results = [] }: MangaCarouselProps) {
  const router = useRouter();

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    rubberband: true,
    slides: { perView: 2.1, spacing: 12 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 3.1, spacing: 14 } },
      "(min-width: 768px)": { slides: { perView: 4.1, spacing: 16 } },
      "(min-width: 1024px)": { slides: { perView: 5.1, spacing: 18 } },
    },
  });

  if (!results.length) return null;

  return (
    <div className="relative overflow-hidden">
      <div ref={sliderRef} className="keen-slider">
        {results.map((manga) => {
          const attrs = manga.attributes ?? {};
          const title =
            attrs.title?.["pt-br"] ||
            attrs.title?.en ||
            attrs.title?.ja ||
            Object.values(attrs.title ?? {})[0] ||
            "Sem título";

          const coverRel = manga.relationships?.find(
            (r: any) => r.type === "cover_art"
          );
          const fileName = coverRel?.attributes?.fileName;
          const coverUrl = fileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`
            : "/placeholder.jpg";

          return (
            <div key={manga.id} className="keen-slider__slide">
              <div
                onClick={() => router.push(`/manga/${manga.id}`)}
                className="cursor-pointer rounded-xl overflow-hidden bg-[#241530] shadow hover:shadow-lg hover:scale-[1.02] transition h-full flex flex-col"
              >
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-64 object-cover flex-shrink-0"
                />
                <div className="p-3 flex-1 flex flex-col justify-between">
                  {/* Container com altura mínima para títulos de 2 linhas */}
                  <p className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]">
                    {title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão anterior */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-20 transition"
        aria-label="Anterior"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Botão próximo */}
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-20 transition"
        aria-label="Próximo"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
