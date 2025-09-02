"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Home, Search, Menu } from "lucide-react";
import { useState } from "react";

const MySwal = withReactContent(Swal);

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = async () => {
    const { value: query } = await MySwal.fire({
      title: "Pesquisar Mangá",
      input: "text",
      inputPlaceholder: "Digite o nome do mangá...",
      showCancelButton: true,
      confirmButtonText: "Buscar",
      cancelButtonText: "Cancelar",
      background: "#1f1f2e",
      color: "#fff",
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#6b7280",
      inputAttributes: { autocapitalize: "off" },
    });

    if (query && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="sticky top-0 w-full z-50 px-6 py-3 flex items-center justify-between bg-purple-900/20 backdrop-blur-md shadow-lg border-b border-purple-700/40">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 hover:text-purple-300 transition-colors"
      >
        <img src="/favicon.ico" alt="Neon Mangá" className="w-8 h-8 rounded-full" />
        <span className="text-2xl font-extrabold text-white tracking-widest">
          NeonMangá
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 text-white">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-purple-300 transition-colors"
        >
          <Home className="w-6 h-6" />
        </Link>
        <button
          onClick={handleSearch}
          className="flex items-center gap-1 hover:text-purple-300 transition-colors"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white hover:text-purple-300 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-purple-900/90 backdrop-blur-md shadow-lg rounded-lg py-2 flex flex-col gap-2">
            <Link
              href="/"
              className="px-4 py-2 hover:bg-purple-700/70 rounded transition-colors text-white flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <Home className="w-5 h-5" /> Home
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleSearch();
              }}
              className="px-4 py-2 hover:bg-purple-700/70 rounded transition-colors text-white flex items-center gap-2"
            >
              <Search className="w-5 h-5" /> Buscar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
