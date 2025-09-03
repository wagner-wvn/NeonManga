"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import MangaCard from "@/components/manga/MangaCard";
import { buildCoverUrl, getTitle } from "@/lib/formatters";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MangaCarouselProps {
  results: any[];
  highlightColor?: "purple" | "pink" | "blue";
}

export default function MangaCarousel({ results, highlightColor = "purple" }: MangaCarouselProps) {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 3, spacing: 15 },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 3, spacing: 12 } },
      "(max-width: 768px)": { slides: { perView: 2, spacing: 10 } },
      "(max-width: 480px)": { slides: { perView: 1.5, spacing: 8 } },
    },
    rubberband: true,
  });

  const btnColor =
    highlightColor === "pink"
      ? "bg-pink-600 hover:bg-pink-700"
      : highlightColor === "blue"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-purple-700 hover:bg-purple-900";

  return (
    <div className="relative">
      {/* Botão seta esquerda */}
      <button
        onClick={() => slider.current?.prev()}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 ${btnColor} p-2 rounded-full text-white shadow-md`}
        aria-label="Anterior"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Botão seta direita */}
      <button
        onClick={() => slider.current?.next()}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 ${btnColor} p-2 rounded-full text-white shadow-md`}
        aria-label="Próximo"
      >
        <ChevronRight size={18} />
      </button>

      <div ref={sliderRef} className="keen-slider">
        {results.map((manga) => {
          // título (usa já o field "title" se vier formatado do backend; senão, usa attributes)
          const title = manga.title || getTitle(manga.attributes);

          // capa: usa coverUrl vindo da sua /api/search formatada; se não tiver, monta pelo relationship
          const coverFileName =
            manga.relationships?.find((rel: any) => rel.type === "cover_art")?.attributes?.fileName;
          const coverUrl =
            manga.coverUrl || buildCoverUrl(manga.id, coverFileName, 512, true);

          return (
            <div
              key={manga.id}
              className="keen-slider__slide"
              style={{ paddingBottom: 2 }} // pequeno ajuste para não cortar sombra
            >
              {/* Reaproveita o mesmo card da página de busca */}
              <MangaCard
                id={manga.id}
                title={title}
                coverUrl={coverUrl}
                className="h-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
