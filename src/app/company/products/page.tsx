"use client";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { useMemo, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getMasterProducts } from "@/lib/actions/company/masterProducts";

import ProductDetailsModal from "./_Components/ProductDetailModal";
import ProductFilters from "./_Components/ProductFilters";
import ProductSearch from "./_Components/ProductSearch";
import ProductsTable from "./_Components/ProductsTable";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<MasterProduct | null>(
    null
  );
  const [expandedWarehouses, setExpandedWarehouses] = useState<number[]>([]);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["masterProducts"],
    queryFn: () => getMasterProducts({}),
  });

  const products: MasterProduct[] = useMemo(() => {
    return Array.isArray(productsData?.data)
      ? (productsData?.data as MasterProduct[])
      : (productsData?.data as unknown as PaginatedResponse<MasterProduct>)
          ?.data || [];
  }, [productsData]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryName =
        typeof product.category === "string"
          ? product.category
          : product.category?.name;
      const matchesCategory =
        filterCategory === "all" || categoryName === filterCategory;

      const matchesBrand =
        filterBrand === "all" || product.brand === filterBrand;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && product.active) ||
        (filterStatus === "inactive" && !product.active);

      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });
  }, [products, searchTerm, filterCategory, filterBrand, filterStatus]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterBrand("all");
    setFilterStatus("all");
  };

  const handleOpenDetails = (product: MasterProduct) => {
    setSelectedProduct(product);
    setExpandedWarehouses([]);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
    setExpandedWarehouses([]);
  };

  const toggleWarehouse = (index: number) => {
    setExpandedWarehouses((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Skeleton className="mb-2 h-10 w-64 rounded-xl bg-gray-200" />
            <Skeleton className="h-5 w-80 rounded-lg bg-gray-200" />
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200" />
            <Skeleton className="h-12 w-full rounded-xl bg-gray-200 md:w-96" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <Skeleton className="h-96 w-full bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <Package className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
              إدارة المنتجات
            </h1>
            <p className="mt-1 text-xs text-gray-600 md:text-sm">
              عرض وإدارة جميع المنتجات المتاحة
            </p>
          </div>
        </div>

        {/* Search & Filters Container */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search Bar */}
            <div className="flex-1">
              <ProductSearch value={searchTerm} onChange={setSearchTerm} />
            </div>

            {/* Filters */}
            <div className="flex-shrink-0">
              <ProductFilters
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
        <ProductsTable
          products={filteredProducts}
          onViewDetails={handleOpenDetails}
        />

        {/* Product Details Modal */}
        <ProductDetailsModal
          isOpen={!!selectedProduct}
          onClose={handleCloseDetails}
          productId={selectedProduct?.id?.toString() || ""}
          productName={selectedProduct?.name || ""}
          expandedWarehouses={expandedWarehouses}
          onToggleWarehouse={toggleWarehouse}
        />
      </div>
    </div>
  );
}
