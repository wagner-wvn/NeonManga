import { Github, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950 border-t border-purple-800 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
        {/* Texto */}
        <p className="text-gray-300 text-sm sm:text-base text-center">
          &copy; 2025{" "}
          <span className="text-purple-400 font-semibold">NeonMangá</span> - Criado com ❤️ por <a href="https://caminhourbano.com.br/" target="_blank">WVN</a>
        </p>

        {/* Links de redes sociais */}
        <div className="flex gap-6 mt-2">
          <a
            href="https://github.com/wagner-wvn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors transform hover:-translate-y-1 hover:scale-110"
            aria-label="GitHub"
          >
            <Github size={24} />
          </a>
          <a
            href="https://www.instagram.com/caminho.urbano/#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors transform hover:-translate-y-1 hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
