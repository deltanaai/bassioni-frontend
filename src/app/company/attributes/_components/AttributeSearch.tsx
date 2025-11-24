"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

interface AttributeSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export default function AttributeSearch({
  searchTerm,
  onSearchChange,
  placeholder = "ابحث...",
}: AttributeSearchProps) {
  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border-gray-300 bg-white pr-10 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
