import { Filter, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  selectedStockStatus: string;
  onStockStatusChange: (value: string) => void;
  onClearFilters: () => void;
  totalProducts: number;
}

export default function ProductFilters({
  selectedStockStatus,
  onStockStatusChange,
  onClearFilters,
  totalProducts,
}: ProductFiltersProps) {
  const hasActiveFilters = selectedStockStatus !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-gray-300">
        <Filter className="h-5 w-5 text-emerald-400" />
        <span className="text-sm font-medium">التصفية:</span>
      </div>

      {/* Stock Status Filter */}
      <Select value={selectedStockStatus} onValueChange={onStockStatusChange}>
        <SelectTrigger className="h-10 w-[160px] flex-row-reverse justify-between rounded-lg border-gray-800/50 bg-gray-900/50 text-white backdrop-blur-xl hover:border-emerald-500/30">
          <SelectValue placeholder="حالة المخزون" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-gray-800/50 bg-gray-900/95 text-white backdrop-blur-xl">
          <SelectItem
            value="all"
            className="focus:bg-emerald-900/30 focus:text-emerald-300"
          >
            جميع الحالات
          </SelectItem>
          <SelectItem
            value="in_stock"
            className="focus:bg-emerald-900/30 focus:text-emerald-300"
          >
            متوفر
          </SelectItem>
          <SelectItem
            value="low_stock"
            className="focus:bg-emerald-900/30 focus:text-emerald-300"
          >
            منخفض
          </SelectItem>
          <SelectItem
            value="out_of_stock"
            className="focus:bg-emerald-900/30 focus:text-emerald-300"
          >
            نفذ من المخزن
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1.5 rounded-lg border border-red-900/50 bg-gradient-to-r from-red-950/40 to-red-900/20 px-3 py-2 text-sm font-medium text-red-400 backdrop-blur-xl transition-all hover:border-red-700/70 hover:from-red-950/60 hover:to-red-900/40"
        >
          <X className="h-4 w-4" />
          مسح الفلاتر
        </button>
      )}

      {/* Results Counter */}
      <div className="mr-auto flex items-center gap-2 rounded-full border border-emerald-900/30 bg-gradient-to-r from-emerald-950/30 to-teal-950/20 px-4 py-1.5 backdrop-blur-xl">
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        <span className="text-sm font-semibold text-emerald-300">
          {totalProducts} منتج
        </span>
      </div>
    </div>
  );
}
