import { Github, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950 border-t border-purple-800 py-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Texto */}
        <p className="text-gray-300 text-sm sm:text-base text-center sm:text-left">
          &copy; 2025{" "}
          <span className="text-purple-400 font-semibold">NeonMangá</span> -
          Criado com ❤️ por WVN
        </p>

        {/* Links de redes sociais */}
        <div className="flex gap-4">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
