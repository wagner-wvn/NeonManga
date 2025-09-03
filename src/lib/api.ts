
// Busca lista de mangas (recentes e populares)
export async function getMangaLists() {
  const res = await fetch("/api/manga");
  if (!res.ok) throw new Error("Erro ao buscar mangas");
  return res.json();
}

// Busca detalhes de um mangá por ID
export async function getMangaById(id: string) {
  const res = await fetch(`/api/manga/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar mangá");
  return res.json();
}

// Busca capítulos de um mangá por ID
export async function getChaptersByMangaId(id: string) {
  const res = await fetch(`/api/chapters/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar capítulos");
  return res.json();
}

// Busca um capítulo específico (para o reader)
export async function getChapter(id: string) {
  const res = await fetch(`/api/chapter/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar capítulo");
  return res.json();
}

// Busca por título
export async function searchManga(query: string, limit = 20, offset = 0) {
  const res = await fetch(`/api/search?title=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error("Erro ao buscar mangas");
  return res.json();
}
