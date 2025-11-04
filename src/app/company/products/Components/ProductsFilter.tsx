import { FiSearch, FiFilter } from "react-icons/fi";
import { ProductFiltersProps } from "../types/product.types";
import { useQuery } from "@tanstack/react-query";
import { getMasterProducts } from "@/lib/actions/company/masterProducts";

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  filterBrand,
  onBrandChange,
  productCount,
}: ProductFiltersProps) {

  const { data: productsData } = useQuery({
    queryKey: ["masterProducts"],
    queryFn: () => getMasterProducts({}),
  });
  // دعم شكلين للاستجابة: مصفوفة مباشرة أو paginate عشان لو عملته بردوو
  const products: MasterProduct[] = Array.isArray(productsData?.data)
    ? (productsData?.data as MasterProduct[])
    : ((productsData?.data as unknown as PaginatedResponse<MasterProduct>)?.data || []);

  // استخراج الفئات الفريدة   
  const categories: string[] = Array.from(
    new Set<string>(
      products
        .map((product: MasterProduct) =>
          typeof product.category === "string"
            ? (product.category as string)
            : product.category?.name
        )
        .filter((v): v is string => Boolean(v))
    )
  );

  // استخراج البراندات    
  const brands: string[] = Array.from(
    new Set<string>(
      products
        .map((product: MasterProduct) => product.brand)
        .filter((v): v is string => Boolean(v))
    )
  );

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2">
        <FiFilter className="text-emerald-600" />
        <span className="text-gray-700 font-medium">تصفية النتائج:</span>
      </div>

      <div className="relative flex-1 min-w-[300px]">
        <FiSearch className="absolute right-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث باسم المنتج أو البراند..."
          className="w-full pr-10 pl-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 placeholder-gray-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 min-w-[180px] shadow-sm"
        value={filterCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">جميع الفئات</option>
        {categories.map((category: string) => (
          <option key={category as string} value={category as string}>
            {category}
          </option>
        ))}
      </select>

      <select
        className="px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 min-w-[180px] shadow-sm"
        value={filterBrand}
        onChange={(e) => onBrandChange(e.target.value)}
      >
        <option value="all">جميع البراندات</option>
        {brands.map((brand: string) => (
          <option key={brand as string} value={brand as string}>
            {brand}
          </option>
        ))}
      </select>

      <div className="text-sm text-emerald-700 font-semibold bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
        {productCount} منتج
      </div>
    </div>
  );
}
