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
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="mb-8">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full md:w-96" />
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">المنتجات الرئيسية</h1>
            <p className="mt-1 text-sm text-gray-400">
              إدارة جميع المنتجات والدفعات
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <ProductSearch onSearch={setSearchTerm} />
        </div>
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

      {/* Products Table */}
      <ProductsTable
        products={filteredProducts}
        onViewDetails={setSelectedProduct}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
}
