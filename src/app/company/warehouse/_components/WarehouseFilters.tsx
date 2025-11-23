import { Filter, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WarehouseFiltersProps {
  selectedStatus: string;
  selectedLocation: string;
  onStatusChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onClearFilters: () => void;
  totalWarehouses: number;
  warehouses: Warehouse[];
}

export default function WarehouseFilters({
  selectedStatus,
  selectedLocation,
  onStatusChange,
  onLocationChange,
  onClearFilters,
  totalWarehouses,
  warehouses,
}: WarehouseFiltersProps) {
  // Extract unique locations from warehouses
  const locations = Array.from(
    new Set(
      warehouses
        .map((warehouse) => warehouse.location)
        .filter(Boolean) as string[]
    )
  );

  const hasActiveFilters =
    selectedStatus !== "all" || selectedLocation !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-gray-700">
        <Filter className="h-5 w-5 text-emerald-600" />
        <span className="text-sm font-medium">التصفية:</span>
      </div>

      {/* Status Filter */}
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="h-10 w-[140px] border-gray-300 bg-white text-gray-900 shadow-sm hover:border-emerald-500">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع الحالات</SelectItem>
          <SelectItem value="active">نشط</SelectItem>
          <SelectItem value="inactive">غير نشط</SelectItem>
        </SelectContent>
      </Select>

      {/* Location Filter */}
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="h-10 w-[160px] border-gray-300 bg-white text-gray-900 shadow-sm hover:border-emerald-500">
          <SelectValue placeholder="الموقع" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع المواقع</SelectItem>
          {locations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
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
          {totalWarehouses} مخزن
        </span>
      </div>
    </div>
  );
}
