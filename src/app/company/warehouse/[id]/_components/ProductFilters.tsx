import { Filter, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  selectedExpiryStatus: string;
  selectedStockStatus: string;
  onExpiryStatusChange: (value: string) => void;
  onStockStatusChange: (value: string) => void;
  onClearFilters: () => void;
  totalProducts: number;
}

export default function ProductFilters({
  selectedExpiryStatus,
  selectedStockStatus,
  onExpiryStatusChange,
  onStockStatusChange,
  onClearFilters,
  totalProducts,
}: ProductFiltersProps) {
  const hasActiveFilters =
    selectedExpiryStatus !== "all" || selectedStockStatus !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-gray-700">
        <Filter className="h-5 w-5 text-emerald-600" />
        <span className="text-sm font-medium">التصفية:</span>
      </div>

      {/* Stock Status Filter */}
      <Select value={selectedStockStatus} onValueChange={onStockStatusChange}>
        <SelectTrigger className="h-10 w-[160px] border-gray-300 bg-white text-gray-900 shadow-sm hover:border-emerald-500">
          <SelectValue placeholder="حالة المخزون" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع الحالات</SelectItem>
          <SelectItem value="in_stock">متوفر</SelectItem>
          <SelectItem value="low_stock">منخفض</SelectItem>
          <SelectItem value="out_of_stock">نفذ من المخزن</SelectItem>
        </SelectContent>
      </Select>

      {/* Expiry Status Filter */}
      <Select value={selectedExpiryStatus} onValueChange={onExpiryStatusChange}>
        <SelectTrigger className="h-10 w-[160px] border-gray-300 bg-white text-gray-900 shadow-sm hover:border-emerald-500">
          <SelectValue placeholder="حالة الصلاحية" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع الحالات</SelectItem>
          <SelectItem value="expired">منتهي الصلاحية</SelectItem>
          <SelectItem value="expiring_soon">قريب الانتهاء</SelectItem>
          <SelectItem value="good">صلاحية جيدة</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
          مسح الفلاتر
        </button>
      )}

      {/* Results Counter */}
      <div className="mr-auto flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5">
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        <span className="text-sm font-semibold text-emerald-700">
          {totalProducts} منتج
        </span>
      </div>
    </div>
  );
}
