"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchQuery(""); // limpa campo depois
  };

  return (
    <nav className="w-full px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center bg-gradient-to-r from-purple-900 via-pink-800 to-purple-900 shadow-lg">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-extrabold text-white tracking-widest hover:text-pink-300 transition-colors"
      >
        NeonMangá
      </Link>

      {/* Links + Search */}
      <div className="mt-3 md:mt-0 flex items-center gap-6">
        <Link
          href="/"
          className="text-gray-200 hover:text-white transition-colors"
        >
          Home
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 rounded-l-md outline-none text-black w-40 md:w-56"
          />
          <button
            type="submit"
            className="bg-white text-black px-3 py-1 rounded-r-md hover:bg-gray-200 transition-colors"
          >
            🔍
          </button>
        </form>
      </div>
    </nav>
  );
}
