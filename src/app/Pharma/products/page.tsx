"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiPackage, FiSearch, FiFilter, FiEye } from "react-icons/fi";

import { pharmaMasterProducts } from "@/lib/actions/pharma/masterProducts";

import ProductDetailsModal from "./_components/ProductDetailsModal";

export default function PharmaProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<MasterProduct | null>(
    null
  );
  const [expandedWarehouses, setExpandedWarehouses] = useState<number[]>([]);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["masterProducts"],
    queryFn: () => pharmaMasterProducts({}),
  });

  const products = productsData?.data || [];
  console.log("PRODUCTS", products);

  // فلترة المنتجات
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.category.name === filterCategory;

    const matchesBrand = filterBrand === "all" || product.brand === filterBrand;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  const categories = [
    ...new Set(
      products
        .map((p) => {
          // إذا category كان object ناخد الـ name منه، إذا كان string ناخده مباشر
          if (typeof p.category === "object" && p.category !== null) {
            return p.category.name || String(p.category);
          }
          return String(p.category);
        })
        .filter(Boolean)
    ),
  ];

  const brands = [
    ...new Set(
      products
        .map((p) => p.brand)
        .filter(Boolean)
        .map((brand) => String(brand)) // تأكد أن كل العناصر strings
    ),
  ];

  // Modal functions
  const openProductDetails = (product: MasterProduct) => {
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
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-400"></div>
            <p className="text-gray-400">جاري تحميل المنتجات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* الهيدر */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-2">
            <FiPackage className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">المنتجات المتاحة</h1>
            <p className="text-sm text-gray-400">
              استعرض جميع المنتجات من الشركات
            </p>
          </div>
        </div>
      </div>

      {/* الفلترات */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-700 bg-gray-800 p-6">
        <div className="flex items-center gap-2">
          <FiFilter className="text-emerald-400" />
          <span className="font-medium text-gray-300">تصفية النتائج:</span>
        </div>

        <div className="relative min-w-[300px] flex-1">
          <FiSearch className="absolute top-3 right-3 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث باسم المنتج أو البراند..."
            className="w-full rounded-xl border border-gray-600 bg-gray-700 py-3 pr-10 pl-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="min-w-[180px] rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">جميع الفئات</option>
          {categories.map((category, index) => (
            <option key={`category-${index}-${category}`} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="min-w-[180px] rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          <option value="all">جميع البراندات</option>
          {brands.map((brand, index) => (
            <option key={`brand-${index}-${brand}`} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <div className="rounded-full border border-emerald-700 bg-emerald-900 px-3 py-1 text-sm font-semibold text-emerald-400">
          {filteredProducts.length} منتج
        </div>
      </div>

      {/* جدول المنتجات */}
      <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">
        {products.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <FiPackage className="h-16 w-16" />
              <div>
                <p className="text-xl font-semibold">لا توجد منتجات</p>
                <p className="mt-2">لم يتم العثور على منتجات متطابقة مع بحثك</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
                    #
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
                    المنتج
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
                    الفئة
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
                    البراند
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
                    السعر
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-4 py-4 text-center text-sm text-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-center font-semibold  text-white">
                        {product.name}
                      </div>
                      <div className="mt-1 text-center text-sm text-gray-400">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex rounded-full bg-purple-900 px-3 py-1 text-xs font-medium text-purple-300">
                        {typeof product.category === "object"
                          ? product.category.name
                          : String(product.category)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-300">
                      {/* فيه هنا ايرور ف استدعاء اسم البراند لانه ليس object */}
                      {product.brand}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-bold text-emerald-400">
                          {product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400">ج.م</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => openProductDetails(product)}
                          className="flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm text-blue-300 transition-colors hover:bg-blue-800"
                        >
                          <FiEye className="h-4 w-4" />
                          التفاصيل
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* مودال التفاصيل */}
      <ProductDetailsModal
        isOpen={!!selectedProduct}
        onClose={closeProductDetails}
        selectedProduct={selectedProduct}
        expandedBranches={expandedWarehouses}
        onToggleWarehouse={toggleWarehouse}
      />
    </div>
  );
}
