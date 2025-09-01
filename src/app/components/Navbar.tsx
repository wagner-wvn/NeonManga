"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Home, Search } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function Navbar() {
  const router = useRouter();

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
      inputAttributes: {
        autocapitalize: "off",
      },
    });

    if (query && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav
      className="w-full px-6 py-4 flex items-center justify-between 
  bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20"
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-extrabold text-white tracking-widest hover:text-pink-300 transition-colors"
      >
        NeonMangá
      </Link>

      {/* Ícones */}
      <div className="flex items-center gap-6 text-white">
        <Link href="/" className="hover:text-pink-300 transition-colors">
          <Home className="w-6 h-6" />
        </Link>
        <button
          onClick={handleSearch}
          className="hover:text-pink-300 transition-colors"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
