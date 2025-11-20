"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, ArrowUpDown } from "lucide-react";
import { useState } from "react";

export default function CategoriesFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read values from URL
  const urlName = searchParams.get("name") || "";
  const urlShowHome = searchParams.get("showHome") || "";
  const urlActive = searchParams.get("active") || "";
  const orderBy = searchParams.get("orderBy") || "id";
  const urlDeleted = searchParams.get("deleted") || "false";
  const orderByDirection = (searchParams.get("orderByDirection") || "desc") as
    | "asc"
    | "desc";

  // Local state for search
  const [nameSearch, setNameSearch] = useState(urlName);
  const [showHomeFilter, setShowHomeFilter] = useState(urlShowHome);
  const [activeFilter, setActiveFilter] = useState(urlActive);
  const [deletedFilter, setDeletedFilter] = useState(urlDeleted);

  // Function to apply filters
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (nameSearch) {
      params.set("name", nameSearch);
    } else {
      params.delete("name");
    }

    if (showHomeFilter) {
      params.set("showHome", showHomeFilter);
    } else {
      params.delete("showHome");
    }

    if (activeFilter) {
      params.set("active", activeFilter);
    } else {
      params.delete("active");
    }
    params.set("deleted", deletedFilter);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Function to clear filters
  const handleClearFilters = () => {
    setNameSearch("");
    setShowHomeFilter("");
    setActiveFilter("");
    setDeletedFilter("false");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("name");
    params.delete("showHome");
    params.delete("active");
    params.set("deleted", "false");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Function to update URL search params for sorting
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleSortDirection = () => {
    updateSearchParams(
      "orderByDirection",
      orderByDirection === "asc" ? "desc" : "asc"
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex flex-col gap-4">
        {/* Search fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث باسم الفئة..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          {/* Show Home Filter */}
          <div className="relative">
            <select
              value={showHomeFilter}
              onChange={(e) => setShowHomeFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            >
              <option value="">الكل (العرض في الرئيسية)</option>
              <option value="true">معروض في الرئيسية</option>
              <option value="false">مخفي من الرئيسية</option>
            </select>
          </div>

          {/* Active Status Filter */}
          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            >
              <option value="">الكل (الحالة)</option>
              <option value="true">نشط</option>
              <option value="false">غير نشط</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={deletedFilter}
              onChange={(e) => setDeletedFilter(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            >
              <option value="false">الفئات المتاحة</option>
              <option value="true">الفئات المحذوفة</option>
            </select>
          </div>
        </div>

        {/* Filters and sorting */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Order by */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                ترتيب حسب:
              </label>
              <select
                value={orderBy}
                onChange={(e) => updateSearchParams("orderBy", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="id">الافتراضي</option>
                <option value="name">الاسم</option>
                <option value="position">الترتيب</option>
              </select>
            </div>

            {/* Sort direction */}
            <button
              onClick={toggleSortDirection}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <ArrowUpDown className="h-4 w-4" />
              {orderByDirection === "asc" ? "تصاعدي" : "تنازلي"}
            </button>
          </div>
        </div>

        {/* Search and filter buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <Search className="h-4 w-4" />
            بحث
          </button>
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
          >
            مسح الفلاتر
          </button>
        </div>
      </div>
    </div>
  );
}
