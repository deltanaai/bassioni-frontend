"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface ProductSearchProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function ProductSearch({
  onSearch,
  placeholder = "ابحث بالاسم أو البراند...",
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="group relative w-full">
      <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-emerald-400 md:right-4 md:h-5 md:w-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-10 w-full rounded-lg border border-gray-800/50 bg-gray-900/50 pr-10 text-sm text-white backdrop-blur-xl transition-all duration-200 placeholder:text-gray-500 hover:border-gray-700 focus:border-emerald-500/50 focus:bg-gray-900/70 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none md:h-12 md:pr-12"
      />
    </div>
  );
}
