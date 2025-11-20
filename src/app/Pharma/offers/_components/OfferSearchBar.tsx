"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OfferSearchBarProps {
  onSearchChange: (search: string) => void;
  searchTerm: string;
}

export default function OfferSearchBar({
  onSearchChange,
  searchTerm,
}: OfferSearchBarProps) {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-300">
        ابحث في العروض
      </label>
      <div className="relative">
        <Search className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="ابحث باسم المنتج أو الشركة..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12 border-gray-700 bg-white pr-10 pl-12 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500/20"
        />
        {searchTerm && (
          <Button
            onClick={handleClear}
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-2 h-8 w-8 -translate-y-1/2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {searchTerm && (
        <p className="text-xs text-gray-400">
          البحث عن: &quot;{searchTerm}&quot;
        </p>
      )}
    </div>
  );
}
