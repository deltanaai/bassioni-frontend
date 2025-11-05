"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const products: MasterProduct[] = Array.isArray(productsData?.data)
    ? productsData.data
    : productsData?.data?.data || [];

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
          if (typeof p.category === 'object' && p.category !== null) {
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
      <div className="p-6 bg-gray-900 min-h-screen">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-gray-400">جاري تحميل المنتجات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* الهيدر */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl">
            <FiPackage className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">المنتجات المتاحة</h1>
            <p className="text-gray-400 text-sm">
              استعرض جميع المنتجات من الشركات
            </p>
          </div>
        </div>
      </div>

      {/* الفلترات */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-6 bg-gray-800 rounded-2xl border border-gray-700">
        <div className="flex items-center gap-2">
          <FiFilter className="text-emerald-400" />
          <span className="text-gray-300 font-medium">تصفية النتائج:</span>
        </div>

        <div className="relative flex-1 min-w-[300px]">
          <FiSearch className="absolute right-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث باسم المنتج أو البراند..."
            className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white min-w-[180px]"
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
          className="px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white min-w-[180px]"
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

        <div className="text-sm text-emerald-400 font-semibold bg-emerald-900 px-3 py-1 rounded-full border border-emerald-700">
          {filteredProducts.length} منتج
        </div>
      </div>

      {/* جدول المنتجات */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <FiPackage className="w-16 h-16" />
              <div>
                <p className="font-semibold text-xl">لا توجد منتجات</p>
                <p className="mt-2">لم يتم العثور على منتجات متطابقة مع بحثك</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-750 border-b border-gray-700">
      <tr>
        <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
          #
        </th>
        <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
          المنتج
        </th>
        <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
          الفئة
        </th>
        <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
          البراند
        </th>
        <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
          السعر
        </th>
        <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
          الإجراءات
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-700">
      {filteredProducts.map((product, index) => (
        <tr
          key={product.id}
          className="hover:bg-gray-750 transition-colors"
        >
          <td className="px-4 py-4 text-sm text-gray-300 text-center">
            {index + 1}
          </td>
          <td className="px-4 py-4">
            <div className="font-semibold text-white  text-center">
              {product.name}
            </div>
            <div className="text-gray-400 text-sm mt-1 text-center">
              {product.description}
            </div>
          </td>
          <td className="px-4 py-4 text-center">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
              {typeof product.category === 'object' ? product.category.name : String(product.category)}
            </span>
          </td>
          <td className="px-4 py-4 text-sm text-gray-300 text-center">
            {/* فيه هنا ايرور ف استدعاء اسم البراند لانه ليس object */}
            {product.brand && typeof product.brand === 'object' && 'name' in product.brand
              ? (product.brand as { name?: string }).name ?? ''
              : String(product.brand)}
          </td>
          <td className="px-4 py-4 text-center">
            <div className="flex items-center gap-1 justify-center">
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
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-900 text-blue-300 rounded-lg hover:bg-blue-800 transition-colors"
              >
                <FiEye className="w-4 h-4" />
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
        productId={selectedProduct?.id?.toString() || ""}
        productName={selectedProduct?.name || ""}
        expandedWarehouses={expandedWarehouses}
        onToggleWarehouse={toggleWarehouse}
      />
    </div>
  );
}
