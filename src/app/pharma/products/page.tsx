"use client";

import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { useMemo, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { pharmaMasterProducts } from "@/lib/actions/pharma/masterProducts";

import ProductDetailsModal from "./_components/ProductDetailsModal";
import ProductFilters from "./_components/ProductFilters";
import ProductSearch from "./_components/ProductSearch";
import ProductsTable from "./_components/ProductsTable";

export default function PharmaProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<MasterProduct | null>(
    null
  );

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["masterProducts"],
    queryFn: () => pharmaMasterProducts({}),
  });

  const products = useMemo(() => productsData?.data || [], [productsData]);

  // Extract unique categories and brands
  const { categories, brands } = useMemo(() => {
    const categorySet = new Set<string>();
    const brandSet = new Set<string>();

    products.forEach((product) => {
      if (product.category?.name) {
        categorySet.add(product.category.name);
      }
      if (product.brand) {
        brandSet.add(product.brand);
      }
    });

    return {
      categories: Array.from(categorySet),
      brands: Array.from(brandSet),
    };
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || product.category?.name === filterCategory;

      const matchesBrand =
        filterBrand === "all" || product.brand === filterBrand;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && product.active) ||
        (filterStatus === "inactive" && !product.active) ||
        (filterStatus === "featured" && product.show_home);

      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });
  }, [products, searchTerm, filterCategory, filterBrand, filterStatus]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterBrand("all");
    setFilterStatus("all");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Skeleton className="mb-2 h-10 w-64 rounded-xl" />
            <Skeleton className="h-5 w-80 rounded-lg" />
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl md:w-96" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-xl">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Package className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
              المنتجات الرئيسية
            </h1>
            <p className="mt-1 text-xs text-gray-400 md:text-sm">
              إدارة جميع المنتجات والدفعات بسهولة
            </p>
          </div>
        </div>

        {/* Search & Filters Container */}
        <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-4 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search Bar */}
            <div className="flex-1">
              <ProductSearch onSearch={setSearchTerm} />
            </div>

            {/* Filters */}
            <div className="flex-shrink-0">
              <ProductFilters
                categories={categories}
                brands={brands}
                selectedCategory={filterCategory}
                selectedBrand={filterBrand}
                selectedStatus={filterStatus}
                onCategoryChange={setFilterCategory}
                onBrandChange={setFilterBrand}
                onStatusChange={setFilterStatus}
                onClearFilters={handleClearFilters}
                totalProducts={filteredProducts.length}
              />
            </div>
          </div>
        </div>

        {/* Products Table Container */}
        <div className="overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-900/30 shadow-2xl backdrop-blur-xl">
          <ProductsTable
            products={filteredProducts}
            onViewDetails={setSelectedProduct}
          />
        </div>

        {/* Product Details Modal */}
        <ProductDetailsModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
}
