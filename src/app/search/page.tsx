import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-gray-400 p-6">Carregando busca...</p>}>
      <SearchContent />
    </Suspense>
  );
}
