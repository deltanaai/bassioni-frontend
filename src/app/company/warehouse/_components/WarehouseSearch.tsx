import { Search, X } from "lucide-react";

interface WarehouseSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function WarehouseSearch({
  value,
  onChange,
  placeholder = "ابحث باسم المخزن أو الموقع...",
}: WarehouseSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-gray-300 bg-white pr-11 pl-11 text-gray-900 placeholder-gray-500 shadow-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
