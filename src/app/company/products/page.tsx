"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiPackage,
  FiDollarSign,
  FiChevronRight,
  FiShoppingCart,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { toast } from "sonner";

import { addToCart } from "@/lib/actions/pharma/cart.action";

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  dosage: string;
  concentration: string;
  quantity: number;
  price: number;
  warehouse: string;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "باراسيتامول 500 مجم",
    category: "مسكنات الألم",
    brand: "فارماسيا",
    dosage: "أقراص",
    concentration: "500 مجم",
    quantity: 150,
    price: 25.5,
    warehouse: "مخزن القاهرة الرئيسي",
  },
  {
    id: 2,
    name: "فيتامين سي 1000 مجم",
    category: "المكملات الغذائية",
    brand: "ناتشرال",
    dosage: "أقراص فوارة",
    concentration: "1000 مجم",
    quantity: 5,
    price: 45.0,
    warehouse: "مخزن الإسكندرية",
  },
  {
    id: 3,
    name: "أوميغا 3 كبسولات",
    category: "المكملات الغذائية",
    brand: "فيتاليف",
    dosage: "كبسولات",
    concentration: "1000 مجم",
    quantity: 120,
    price: 60.0,
    warehouse: "مخزن الجيزة",
  },
  {
    id: 4,
    name: "كريم هيدروكورتيزون 1%",
    category: "مستحضرات جلدية",
    brand: "درماسيف",
    dosage: "كريم",
    concentration: "1%",
    quantity: 60,
    price: 35.75,
    warehouse: "مخزن القاهرة الرئيسي",
  },
];

const categories = [
  "مسكنات الألم",
  "المكملات الغذائية",
  "مضادات حيوية",
  "أدوية السكري",
  "مستحضرات جلدية",
];
const brands = ["فارماسيا", "ناتشرال", "فيتاليف", "درماسيف", "ميديكال"];

const details = {
  Productname: "كونجستال",
  warehouses: [
    {
      warehouse1: [
        { batchNumber: "3389", quantity: 24, expiryDate: "25/11/2020" },
        { batchNumber: "6667", quantity: 12, expiryDate: "16/11/2020" },
        { batchNumber: "345", quantity: 68, expiryDate: "14/8/2040" },
      ],
    },
    {
      warehouse2: [
        { batchNumber: "212", quantity: 500, expiryDate: "25/11/2070" },
        { batchNumber: "666217", quantity: 15, expiryDate: "16/11/2010" },
        { batchNumber: "34115", quantity: 20, expiryDate: "14/8/2050" },
      ],
    },
  ],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // cart
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [selectedProductForCart, setSelectedProductForCart] =
    useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    const matchesBrand = filterBrand === "all" || product.brand === filterBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const queryClient = useQueryClient();

  const addCartmutation = useMutation({
    mutationFn: addToCart,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء اضافة المنتج للسلة");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["cart"] });

      setCartModalOpen(false);

      toast.success(`تم اضافة المنتج للسلة بنجاح`);
    },
  });
  const handleAddToCart = () => {
    if (selectedProductForCart) {
      addCartmutation.mutate({
        pharmacyId: 1,
        productId: selectedProductForCart.id,
        quantity,
      });
    }
    console.log("📦 Selected product:", selectedProductForCart);
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  // عشان تابات المخزن في المودال تكون مقفوله
  const [expandedWarehouses, setExpandedWarehouses] = useState<number[]>([]);

  const toggleWarehouse = (index: number) => {
    setExpandedWarehouses(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // إغلاق
          : [...prev, index] // فتح
    );
  };

  // functions cartt
  const openCartModal = (product: Product) => {
    setSelectedProductForCart(product);
    setQuantity(1);
    setCartModalOpen(true);
  };

  const closeCartModal = () => {
    setCartModalOpen(false);
    setSelectedProductForCart(null);
    setQuantity(1);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

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

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="relative min-w-[300px] flex-1">
            <FiSearch className="absolute top-3 right-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج أو البراند..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pr-10 pl-4 text-gray-800 placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <FiFilter className="text-emerald-600" />
          <span className="font-medium text-gray-700">تصفية النتائج:</span>
        </div>

        <select
          className="min-w-[180px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">جميع الفئات</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="min-w-[180px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          <option value="all">جميع البراندات</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <div className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          {filteredProducts.length} منتج
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="border-l border-gray-200 px-6 py-4 text-right text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                  #
                </th>
                <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                  المنتج
                </th>
                <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                  الفئة
                </th>
                <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                  البراند
                </th>
                <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                  <div className="flex items-center justify-center gap-1">
                    <FiDollarSign className="h-4 w-4" />
                    السعر
                  </div>
                </th>
                <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                  الإجراءات
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                  السلة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-500">
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <FiPackage className="h-16 w-16 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-gray-600">
                          لا توجد منتجات
                        </p>
                        <p className="mt-2 text-gray-500">
                          لم يتم العثور على منتجات متطابقة مع بحثك
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 transition-all duration-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-center text-sm font-semibold text-emerald-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {product.name}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {product.dosage}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center rounded-full border border-purple-200 bg-gradient-to-r from-purple-100 to-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 shadow-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-lg font-bold text-transparent">
                          {product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">ج.م</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => openProductDetails(product)}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-500 hover:to-blue-400 hover:shadow-lg"
                        >
                          <FiEye className="h-4 w-4" />
                          التفاصيل
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openCartModal(product)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-emerald-500 hover:to-emerald-400 hover:shadow-lg"
                      >
                        <FiShoppingCart className="h-4 w-4" />
                        أضف للسلة
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {details.Productname}
                  </h2>
                  <p className="mt-1 text-gray-600">تفاصيل المخزون والدفعات</p>
                </div>
                <button
                  onClick={closeProductDetails}
                  className="p-2 text-xl text-gray-400 transition-colors hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Total Summary */}
              <div className="mt-6 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
                  <div>
                    <div className="text-sm text-gray-600">عدد المخازن</div>
                    <div className="text-lg font-bold text-gray-900">
                      {details.warehouses.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">إجمالي الدفعات</div>
                    <div className="text-lg font-bold text-gray-900">
                      {details.warehouses.reduce((total, warehouse) => {
                        const batches = Object.values(warehouse)[0];
                        return total + batches.length;
                      }, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">إجمالي المخزون</div>
                    <div className="text-lg font-bold text-emerald-600">
                      {details.warehouses.reduce((total, warehouse) => {
                        const batches = Object.values(warehouse)[0];
                        return (
                          total +
                          batches.reduce(
                            (sum, batch) => sum + batch.quantity,
                            0
                          )
                        );
                      }, 0)}{" "}
                      وحدة
                    </div>
                  </div>
                </div>
              </div>

              {/* Warehouses Section */}
              <div className="mt-6 space-y-4">
                {details.warehouses.map((warehouseObj, warehouseIndex) => {
                  const [warehouseName, batches] =
                    Object.entries(warehouseObj)[0];
                  const isExpanded =
                    expandedWarehouses.includes(warehouseIndex);

                  return (
                    <div
                      key={warehouseIndex}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                      {/* Warehouse Header */}
                      <button
                        onClick={() => toggleWarehouse(warehouseIndex)}
                        className="flex w-full items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 transition-colors hover:from-gray-100 hover:to-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`transform transition-transform ${
                              isExpanded ? "rotate-90" : "rotate-0"
                            }`}
                          >
                            <FiChevronRight className="h-4 w-4 text-gray-500" />
                          </div>
                          <h3 className="text-right text-lg font-semibold text-gray-900">
                            {warehouseName.replace("warehouse", "مخزن ")}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{batches.length} دفعة</span>
                          <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                            {batches.reduce(
                              (total, batch) => total + batch.quantity,
                              0
                            )}{" "}
                            وحدة
                          </span>
                        </div>
                      </button>

                      {/* Warehouses Collapsible */}
                      {isExpanded && (
                        <div className="animate-fadeIn">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="border-l border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                    رقم الدفعة
                                  </th>
                                  <th className="border-l border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                    الكمية المتاحة
                                  </th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                    تاريخ الانتهاء
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {batches.map((batch, batchIndex) => (
                                  <tr
                                    key={batchIndex}
                                    className="transition-colors hover:bg-gray-50"
                                  >
                                    <td className="border-l border-gray-200 px-4 py-3 text-gray-900">
                                      <div className="flex items-center justify-end gap-2">
                                        <span className="mx-auto rounded border border-blue-200 bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                          #{batch.batchNumber}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="border-l border-gray-200 px-4 py-3 text-center">
                                      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                        {batch.quantity} وحدة
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                          new Date(
                                            batch.expiryDate
                                              .split("/")
                                              .reverse()
                                              .join("-")
                                          ) < new Date()
                                            ? "border border-red-200 bg-red-100 text-red-700"
                                            : "border border-orange-200 bg-orange-100 text-orange-700"
                                        }`}
                                      >
                                        {batch.expiryDate}
                                        {new Date(
                                          batch.expiryDate
                                            .split("/")
                                            .reverse()
                                            .join("-")
                                        ) < new Date() && (
                                          <span className="mr-1 text-xs">
                                            ⏰
                                          </span>
                                        )}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Modal */}
      {cartModalOpen && selectedProductForCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    إضافة إلى السلة
                  </h2>
                  <p className="mt-1 text-gray-600">
                    {selectedProductForCart.name}
                  </p>
                </div>
                <button
                  onClick={closeCartModal}
                  className="p-2 text-xl text-gray-400 transition-colors hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Product Info */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-gray-600">السعر:</span>
                  <span className="font-bold text-emerald-600">
                    {selectedProductForCart.price.toFixed(2)} ج.م
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المخزون المتاح:</span>
                  <span className="font-medium text-gray-900">
                    {selectedProductForCart.quantity} وحدة
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="mb-3 block text-sm text-gray-600">
                  الكمية:
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200 disabled:bg-gray-50"
                  >
                    <FiMinus className="h-4 w-4 text-gray-600" />
                  </button>

                  <span className="w-12 text-center text-2xl font-bold text-gray-900">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= selectedProductForCart.quantity}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200 disabled:bg-gray-50"
                  >
                    <FiPlus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الإجمالي:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {(selectedProductForCart.price * quantity).toFixed(2)} ج.م
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeCartModal}
                  className="flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-300"
                >
                  إلغاء
                </button>
                <button className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 font-semibold text-white shadow-md transition-colors hover:from-emerald-500 hover:to-emerald-400" onClick={handleAddToCart}>
                  إضافة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
