"use client";

import { X } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  selectedCategory: string;
  selectedBrand: string;
  selectedStatus: string;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
  totalProducts: number;
}

export default function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedStatus,
  onCategoryChange,
  onBrandChange,
  onStatusChange,
  onClearFilters,
  totalProducts,
}: ProductFiltersProps) {
  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    selectedStatus !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      >
        <option value="all">كل الفئات</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Brand Filter */}
      <select
        value={selectedBrand}
        onChange={(e) => onBrandChange(e.target.value)}
        className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      >
        <option value="all">كل البراندات</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      >
        <option value="all">كل الحالات</option>
        <option value="active">نشط</option>
        <option value="inactive">غير نشط</option>
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex h-10 items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-gray-400 transition-colors hover:border-red-500 hover:text-red-400"
        >
          <X className="h-3.5 w-3.5" />
          <span>مسح</span>
        </button>
      )}

      {/* Results Count */}
      <div className="mr-auto text-sm text-gray-400">{totalProducts} منتج</div>
    </div>
  );
}
