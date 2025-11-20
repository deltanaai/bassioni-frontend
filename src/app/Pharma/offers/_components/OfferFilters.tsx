"use client";

import { Filter, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OfferFiltersProps {
  onActiveFilterChange: (active: boolean | null) => void;
  onDiscountRangeChange: (min: number | null, max: number | null) => void;
  onMinQuantityChange: (quantity: number | null) => void;
  activeFilter: boolean | null;
  discountRange: { min: number | null; max: number | null };
  minQuantity: number | null;
}

export default function OfferFilters({
  onActiveFilterChange,
  onDiscountRangeChange,
  onMinQuantityChange,
  activeFilter,
  discountRange,
  minQuantity,
}: OfferFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    onActiveFilterChange(null);
    onDiscountRangeChange(null, null);
    onMinQuantityChange(null);
  };

  const hasActiveFilters =
    activeFilter !== null ||
    discountRange.min !== null ||
    discountRange.max !== null ||
    minQuantity !== null;

  return (
    <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">تصفية العروض</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <X className="ml-1 h-4 w-4" />
              مسح الكل
            </Button>
          )}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
          >
            <SlidersHorizontal className="ml-1 h-4 w-4" />
            {showFilters ? "إخفاء" : "إظهار"} الفلاتر
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Active Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              حالة العرض
            </label>
            <select
              value={
                activeFilter === null
                  ? ""
                  : activeFilter
                  ? "active"
                  : "inactive"
              }
              onChange={(e) =>
                onActiveFilterChange(
                  e.target.value === "" ? null : e.target.value === "active"
                )
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2.5 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
            >
              <option value="">الكل</option>
              <option value="active">نشط</option>
              <option value="inactive">منتهي</option>
            </select>
          </div>

          {/* Discount Range */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              نسبة الخصم (%)
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="من"
                value={discountRange.min ?? ""}
                onChange={(e) =>
                  onDiscountRangeChange(
                    e.target.value ? parseInt(e.target.value) : null,
                    discountRange.max
                  )
                }
                className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-emerald-500"
                min="0"
                max="100"
              />
              <Input
                type="number"
                placeholder="إلى"
                value={discountRange.max ?? ""}
                onChange={(e) =>
                  onDiscountRangeChange(
                    discountRange.min,
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-emerald-500"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Min Quantity Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              الحد الأدنى للكمية
            </label>
            <Input
              type="number"
              placeholder="أدخل الكمية..."
              value={minQuantity ?? ""}
              onChange={(e) =>
                onMinQuantityChange(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-emerald-500"
              min="0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
