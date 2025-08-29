"use client";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative h-[500px] bg-[url('/hero-bg.jpg')] bg-cover bg-center flex items-center">
      <div className="bg-black/60 absolute inset-0"></div>

      <div className="relative z-10 px-12 max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">Naruto</h1>
        <p className="mb-6 text-lg">
          Um jovem ninja determinado a conquistar reconhecimento e sonha em se
          tornar Hokage, o líder de sua vila.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/manga/naruto-id")}
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg font-semibold"
          >
            Ler
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
