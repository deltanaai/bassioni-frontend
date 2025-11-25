"use client";

import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductFiltersProps {
  onSearchChange: (search: string) => void;
  onCategoryFilter: (category: string) => void;
  onPriceSort: (sort: "asc" | "desc" | null) => void;
  onActiveFilter: (active: boolean | null) => void;
  categories: string[];
}

export default function ProductFilters({
  onSearchChange,
  onCategoryFilter,
  onPriceSort,
  onActiveFilter,
  categories,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryFilter(category);
  };

  const handlePriceSort = (sort: "asc" | "desc" | null) => {
    setPriceSort(sort);
    onPriceSort(sort);
  };

  const handleActiveFilter = (active: boolean | null) => {
    setActiveFilter(active);
    onActiveFilter(active);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceSort(null);
    setActiveFilter(null);
    onSearchChange("");
    onCategoryFilter("");
    onPriceSort(null);
    onActiveFilter(null);
  };

  const hasActiveFilters =
    searchTerm || selectedCategory || priceSort || activeFilter !== null;

  return (
    <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">تصفية المنتجات</h3>
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="ابحث عن منتج..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border-gray-700 bg-gray-900 pr-10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:bg-gray-850 focus:ring-emerald-500/20"
        />
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Category Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              الفئة
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2.5 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
            >
              <option value="">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Sort */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              ترتيب السعر
            </label>
            <select
              value={priceSort || ""}
              onChange={(e) =>
                handlePriceSort(
                  e.target.value ? (e.target.value as "asc" | "desc") : null
                )
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2.5 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
            >
              <option value="">بدون ترتيب</option>
              <option value="asc">من الأقل للأعلى</option>
              <option value="desc">من الأعلى للأقل</option>
            </select>
          </div>

          {/* Active Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              الحالة
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
                handleActiveFilter(
                  e.target.value === "" ? null : e.target.value === "active"
                )
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2.5 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
            >
              <option value="">الكل</option>
              <option value="active">متاح</option>
              <option value="inactive">غير متاح</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
