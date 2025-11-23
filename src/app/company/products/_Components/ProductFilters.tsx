import { useQuery } from "@tanstack/react-query";
import { Filter, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMasterProducts } from "@/lib/actions/company/masterProducts";

interface ProductFiltersProps {
  selectedCategory: string;
  selectedBrand: string;
  selectedStatus: string;
  onCategoryChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  totalProducts: number;
}

export default function ProductFilters({
  selectedCategory,
  selectedBrand,
  selectedStatus,
  onCategoryChange,
  onBrandChange,
  onStatusChange,
  onClearFilters,
  totalProducts,
}: ProductFiltersProps) {
  const { data: productsData } = useQuery({
    queryKey: ["masterProducts"],
    queryFn: () => getMasterProducts({}),
  });

  const products: MasterProduct[] = Array.isArray(productsData?.data)
    ? (productsData?.data as MasterProduct[])
    : (productsData?.data as unknown as PaginatedResponse<MasterProduct>)
        ?.data || [];

  // Extract unique categories
  const categories = Array.from(
    new Set(
      products
        .map((product) =>
          typeof product.category === "string"
            ? product.category
            : product.category?.name
        )
        .filter(Boolean) as string[]
    )
  );

  // Extract unique brands
  const brands = Array.from(
    new Set(
      products.map((product) => product.brand).filter(Boolean) as string[]
    )
  );

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    selectedStatus !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-gray-700">
        <Filter className="h-5 w-5 text-emerald-600" />
        <span className="text-sm font-medium">التصفية:</span>
      </div>

      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="h-10 w-[160px] border-gray-300 bg-white text-gray-900 shadow-sm hover:border-emerald-500">
          <SelectValue placeholder="الفئة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع الفئات</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Brand Filter */}
      <Select value={selectedBrand} onValueChange={onBrandChange}>
        <SelectTrigger className="h-10 w-[160px] border-gray-300 bg-white text-gray-900 shadow-sm hover:border-emerald-500">
          <SelectValue placeholder="البراند" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع البراندات</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand} value={brand}>
              {brand}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
