"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useRouter } from "next/navigation";

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

          // cover_art vem em relationships quando você usa includes[]=cover_art
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
                className="cursor-pointer rounded-xl overflow-hidden bg-[#241530] shadow hover:shadow-lg hover:scale-[1.02] transition"
              >
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold line-clamp-2">{title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* setas */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-purple-700 hover:bg-purple-900 text-white rounded-full w-9 h-9 grid place-items-center"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-purple-700 hover:bg-purple-900 text-white rounded-full w-9 h-9 grid place-items-center"
        aria-label="Próximo"
      >
        ›
      </button>
    </div>
  );
}
