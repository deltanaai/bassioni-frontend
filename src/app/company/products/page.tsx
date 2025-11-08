"use client";
import { useState } from "react";
import { FiPackage } from "react-icons/fi";

import ProductDetailsModal from "./_Components/ProductDetailModal";
import ProductFilters from "./_Components/ProductsFilter";
import ProductTable from "./_Components/ProductsTable";
import { useFilteredProducts } from "./_hooks/useFilteredProducts";
import { useProducts } from "./_hooks/useProducts";

export default function ProductsPage() {
  // Local filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");

  // Products fetching & mapping
  const { products, isLoading } = useProducts();

  // Filtered products
  const filteredProducts = useFilteredProducts(products, {
    searchTerm,
    filterCategory,
    filterBrand,
  });

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<MasterProduct | null>(null);
  const [expandedWarehouses, setExpandedWarehouses] = useState<number[]>([]);

  const handleOpenDetails = (product: MasterProduct) => setSelectedProduct(product);
  const handleCloseDetails = () => {
    setSelectedProduct(null);
    setExpandedWarehouses([]);
  };
  const toggleWarehouse = (index: number) =>
    setExpandedWarehouses((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 text-gray-800">
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
            <p>جاري تحميل المنتجات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 text-gray-800">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 shadow-lg">
            <FiPackage className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-2xl font-bold text-transparent">
              إدارة المنتجات
            </h1>
            <p className="text-sm text-gray-600">
              عرض وإدارة جميع المنتجات المتاحة
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        filterBrand={filterBrand}
        onBrandChange={setFilterBrand}
        productCount={filteredProducts.length}
      />

      {/* Table */}
      <ProductTable
        products={filteredProducts}
        onViewDetails={handleOpenDetails}
      />

      {/* Details Modal */}
      <ProductDetailsModal
        isOpen={!!selectedProduct}
        onClose={handleCloseDetails}
        productId={selectedProduct?.id?.toString() || ""}
        productName={selectedProduct?.name || ""}
        expandedWarehouses={expandedWarehouses}
        onToggleWarehouse={toggleWarehouse}
      />
    </div>
  );
}
