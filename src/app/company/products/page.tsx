"use client";
import { useState } from "react";
import { FiPackage } from "react-icons/fi";
import ProductFilters from "./Components/ProductsFilter";
import ProductTable from "./Components/ProductsTable";
import ProductDetailsModal from "./Components/ProductDetailModal";
import { Product } from "./types/product.types";
import { useQuery } from "@tanstack/react-query";
import { getMasterProducts } from "@/lib/actions/company/masterProducts";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["masterProducts"],
    queryFn: () => getMasterProducts({}),
  });

  const apiData = Array.isArray(productsData?.data)
    ? (productsData?.data as MasterProduct[])
    : (productsData?.data as unknown as PaginatedResponse<MasterProduct>)
        ?.data || [];

  const products: Product[] = apiData.map((p: MasterProduct) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    brand: p.brand,
    description: p.description,
    price: p.price,
    imageUrl: p.imageUrl,
    active: p.active,
    rating: p.rating,
    rating_count: p.rating_count,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [expandedWarehouses, setExpandedWarehouses] = useState<number[]>([]);

  // 3. فلترة حسب البحث والفئة والبراند
  const filteredProducts = products.filter((product: Product) => {
    const searchLower = searchTerm.trim().toLowerCase();

    const nameMatch = product.name?.toLowerCase().includes(searchLower);
    const brandMatch = product.brand?.toLowerCase().includes(searchLower);
    const descMatch = product.description?.toLowerCase().includes(searchLower);
    const matchesSearch =
      searchLower === "" ? true : Boolean(nameMatch || brandMatch || descMatch);

    const categoryName =
      typeof product.category === "string"
        ? product.category
        : product.category?.name;
    const matchesCategory =
      filterCategory === "all" ||
      categoryName?.toLowerCase() === filterCategory.toLowerCase();

    const matchesBrand =
      filterBrand === "all" ||
      product.brand?.toLowerCase() === filterBrand.toLowerCase();

    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Modal functions
  const openProductDetails = (product: Product) => {
    console.log("فتح تفاصيل المنتج:", product);
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
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
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen text-gray-800">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p>جاري تحميل المنتجات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
            <FiPackage className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              إدارة المنتجات
            </h1>
            <p className="text-gray-600 text-sm">
              عرض وإدارة جميع المنتجات المتاحة
            </p>
          </div>
        </div>
      </div>

      {/* 4. الفلترات - مؤقتاً بدون فلترة بالفئات والبراندات */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        filterBrand={filterBrand}
        onBrandChange={setFilterBrand}
        productCount={filteredProducts.length}
      />

      {/* 5. الجدول - هيشتغل مع البيانات الحقيقية */}
      <ProductTable
        products={filteredProducts}
        onViewDetails={openProductDetails}
      />

      {/* 6. المودالات - هتشتغل لما نفتحها */}
      <ProductDetailsModal
        isOpen={!!selectedProduct}
        onClose={closeProductDetails}
        productId={selectedProduct?.id?.toString() || ""}
        productName={selectedProduct?.name || ""}
        expandedWarehouses={expandedWarehouses}
        onToggleWarehouse={toggleWarehouse}
      />
    </div>
  );
}
