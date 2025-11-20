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
    <div className="relative">
      <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-10 w-full rounded-lg border border-gray-700 bg-gray-800 pr-10 text-sm text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );
}
