"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Package } from "lucide-react";
import { useMemo, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getCompanyProducts } from "@/lib/actions/pharma/companyProducts.action";

import EnhancedProductCard from "./EnhancedProductCard";
import ProductFilters from "./ProductFilters";

interface EnhancedProductsListProps {
  company: PharmacyCompany;
}

export default function EnhancedProductsList({
  company,
}: EnhancedProductsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);

  const {
    data: productsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", company.id],
    queryFn: () => getCompanyProducts({ companyId: company.id }),
    enabled: !!company.id,
  });

  const allProducts = useMemo(
    () => productsResponse?.data?.products || [],
    [productsResponse]
  );

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = allProducts
      .map((p) => p.category?.name)
      .filter((name): name is string => !!name);
    return Array.from(new Set(cats));
  }, [allProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.category?.name === categoryFilter
      );
    }

    // Active filter
    if (activeFilter !== null) {
      filtered = filtered.filter(
        (product) => product.active === activeFilter && !product.deleted
      );
    }

    // Price sort
    if (priceSort) {
      filtered.sort((a, b) =>
        priceSort === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    return filtered;
  }, [allProducts, searchTerm, categoryFilter, activeFilter, priceSort]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full bg-gray-700" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-96 bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">حدث خطأ في تحميل المنتجات</h3>
            <p className="text-sm">يرجى المحاولة مرة أخرى</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-gray-700 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20">
            <Package className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{company.name}</h2>
            <p className="text-sm text-gray-400">
              {allProducts.length} منتج متاح
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        onSearchChange={setSearchTerm}
        onCategoryFilter={setCategoryFilter}
        onPriceSort={setPriceSort}
        onActiveFilter={setActiveFilter}
        categories={categories}
      />

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-gray-700 bg-gray-800 py-16 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-500" />
          <h3 className="mb-2 text-lg font-semibold text-white">
            {searchTerm || categoryFilter || activeFilter !== null
              ? "لا توجد منتجات مطابقة للفلاتر"
              : "لا توجد منتجات لهذه الشركة"}
          </h3>
          <p className="text-gray-400">
            {searchTerm || categoryFilter || activeFilter !== null
              ? "جرب تعديل الفلاتر للعثور على منتجات"
              : ""}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              عرض {filteredProducts.length} من {allProducts.length} منتج
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <EnhancedProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
