"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type PaginatedFetcher<T> = (q: string, limit: number, offset: number) => Promise<{
  data: T[];
  total: number;
}>;

type Options = {
  limit?: number;
  dedupeKey?: (item: any) => string; // como deduplicar (por padrão: id)
};

export function usePaginatedSearch<T = any>(
  query: string,
  fetcher: PaginatedFetcher<T>,
  opts: Options = {}
) {
  const limit = opts.limit ?? 20;
  const keyFn = opts.dedupeKey ?? ((item: any) => item.id);

  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal]   = useState(0);

  // evita race-condition quando troca de query
  const abortRef = useRef<AbortController | null>(null);

  const hasMore = useMemo(() => results.length < total, [results.length, total]);

  const fetchPage = useCallback(async (reset = false) => {
    if (!query) return;
    setLoading(true);
    setError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await fetcher(query, limit, reset ? 0 : offset);
      const merged = reset ? data.data : [...results, ...data.data];

      // dedup por id (ou key customizada)
      const map = new Map<string, T>();
      for (const item of merged) map.set(keyFn(item), item);

      const unique = Array.from(map.values());
      setResults(unique);
      setOffset(unique.length);
      setTotal(data.total ?? unique.length);
    } catch (e) {
      if ((e as any)?.name !== "AbortError") {
        console.error(e);
        setError("Erro ao buscar dados.");
      }
    } finally {
      setLoading(false);
    }
  }, [query, fetcher, limit, offset, results, keyFn]);

  // reseta quando a query muda
  useEffect(() => {
    if (!query) {
      setResults([]);
      setOffset(0);
      setTotal(0);
      setError(null);
      return;
    }
    fetchPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return {
    results, loading, error, hasMore,
    loadMore: () => fetchPage(false),
    reload: () => fetchPage(true),
  };
}
