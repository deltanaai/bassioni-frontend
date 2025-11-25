"use client";

import { Search, X } from "lucide-react";

interface EmployeeSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function EmployeeSearch({
  value,
  onChange,
  placeholder = "ابحث عن موظف...",
}: EmployeeSearchProps) {
  return (
    <div className="group relative w-full">
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-emerald-400 md:right-4 md:h-5 md:w-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-gray-800/50 bg-gray-900/50 pr-10 text-sm text-white placeholder:text-gray-500 backdrop-blur-xl transition-all duration-200 hover:border-gray-700 focus:border-emerald-500/50 focus:bg-gray-900/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 md:h-12 md:pr-12"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-red-400 md:left-4"
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      )}
    </div>
  );
}
