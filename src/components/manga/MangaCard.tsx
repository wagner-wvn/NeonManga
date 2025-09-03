"use client";

import { useRouter } from "next/navigation";
import React from "react";
import clsx from "clsx";

type Props = {
  id: string;
  title: string;
  coverUrl: string;
  className?: string;
  imageHeight?: string; // ex: "h-60", "h-72"
};

const FALLBACK = "/no-cover.jpg";

export default function MangaCard({
  id,
  title,
  coverUrl,
  className,
  imageHeight = "h-60",
}: Props) {
  const router = useRouter();

  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (el.dataset.fallbackApplied) return;
    el.dataset.fallbackApplied = "1";
    el.src = FALLBACK;
  };

  return (
    <div
      className={clsx(
        "bg-[#241530] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform flex flex-col",
        className
      )}
      onClick={() => router.push(`/manga/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/manga/${id}`);
      }}
      aria-label={`Abrir mangá ${title}`}
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className={clsx("w-full object-cover", imageHeight)}
          loading="lazy"
          decoding="async"
          onError={onError}
        />
      ) : (
        <div className={clsx("w-full flex items-center justify-center text-sm text-gray-400 bg-purple-900", imageHeight)}>
          Sem capa
        </div>
      )}
      <div className="p-3 text-center">
        <h2 className="text-sm font-semibold line-clamp-2 text-white">{title}</h2>
      </div>
    </div>
  );
}
