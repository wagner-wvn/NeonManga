"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  // MOSTRA BOTÃO SÓ QUANDO ROLAR A PÁGINA
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // ROLAR SUAVEMENTE PRO TOPO
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-purple-700/80 backdrop-blur-md text-white shadow-lg hover:bg-pink-600 transition-colors"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    )
  );
}
