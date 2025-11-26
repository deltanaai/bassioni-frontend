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
    <div className="relative flex-1">
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border-gray-700 bg-gray-800 pr-10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-700 hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
