import { FiSearch, FiFilter } from "react-icons/fi";
import { ProductFiltersProps } from "../types/product.types";

const categories = [
  "مسكنات الألم",
  "المكملات الغذائية",
  "مضادات حيوية",
  "أدوية السكري",
  "مستحضرات جلدية",
];

const brands = ["فارماسيا", "ناتشرال", "فيتاليف", "درماسيف", "ميديكال"];

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  filterBrand,
  onBrandChange,
  productCount,
}: ProductFiltersProps) {
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
        {categories.map((category) => (
          <option key={category} value={category}>
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
        {brands.map((brand) => (
          <option key={brand} value={brand}>
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
