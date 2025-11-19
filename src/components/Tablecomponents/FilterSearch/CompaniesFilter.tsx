"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CompaniesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    phone: searchParams.get("phone") || "",
    address: searchParams.get("address") || "",
    email: searchParams.get("email") || "",
    deleted: searchParams.get("deleted") || "false",
  });

  const orderBy = searchParams.get("orderBy") || "id";
  const orderByDirection = (searchParams.get("orderByDirection") || "desc") as
    | "asc"
    | "desc";

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) {
        params.set(key, value.trim());
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when applying filters
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      phone: "",
      address: "",
      email: "",
      deleted: "false",
    });
    const params = new URLSearchParams(searchParams.toString());
    params.delete("name");
    params.delete("phone");
    params.delete("address");
    params.delete("email");
    params.delete("orderBy");
    params.delete("orderByDirection");
    params.set("page", "1");
    params.set("deleted", "false");
    router.push(`?${params.toString()}`);
  };

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const toggleSortDirection = () => {
    updateSearchParams(
      "orderByDirection",
      orderByDirection === "asc" ? "desc" : "asc"
    );
  };

  const hasActiveFilters =
    Object.values(filters).some((value) => value.trim()) ||
    orderBy !== "id" ||
    orderByDirection !== "desc";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">فلترة الشركات</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Name Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            اسم الشركة
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="ابحث باسم الشركة..."
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Phone Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            رقم الهاتف
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="ابحث برقم الهاتف..."
              value={filters.phone}
              onChange={(e) => handleFilterChange("phone", e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Address Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">العنوان</label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="ابحث بالعنوان..."
              value={filters.address}
              onChange={(e) => handleFilterChange("address", e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            حالة الشركة
          </label>
          <div className="relative">
            <select
              value={filters.deleted}
              onChange={(e) => handleFilterChange("deleted", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="false">الشركات المتاحة</option>
              <option value="true">الشركات المحذوفة</option>
            </select>
          </div>
        </div>

        {/* Owner Email Filter */}
        {/* <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            البريد الإلكتروني للمالك
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="ابحث بالبريد الإلكتروني..."
              value={filters.owner_email}
              onChange={(e) =>
                handleFilterChange("owner_email", e.target.value)
              }
              className="pr-10"
            />
          </div>
        </div> */}
      </div>

      {/* Sorting Section */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
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
              <option value="phone">رقم الهاتف</option>
              <option value="address">العنوان</option>
            </select>
          </div>

          <button
            onClick={toggleSortDirection}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <ArrowUpDown className="h-4 w-4" />
            {orderByDirection === "asc" ? "تصاعدي" : "تنازلي"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Button
          onClick={applyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          تطبيق الفلاتر
        </Button>

        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            variant="outline"
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            مسح الفلاتر
          </Button>
        )}
      </div>
    </div>
  );
}
