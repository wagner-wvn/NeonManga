"use client";

import { useState } from "react";

interface HeroProps {
  onSearch: (title: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [title, setTitle] = useState("");

  return (
    <section className="w-full flex flex-col items-center py-10 bg-gradient-to-b from-black via-purple-950 to-black text-white">
      <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-neon-glow">🔮 Encontre seu mangá</h2>

      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar mangá..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-3 rounded-md border border-purple-600 bg-[#1a0b2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={() => onSearch(title)}
          className="bg-pink-500 px-5 py-3 rounded-md hover:bg-pink-600 transition-colors"
        >
          Buscar
        </button>
      </div>
    </section>
  );
}
