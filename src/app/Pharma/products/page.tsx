"use client";
import { addToCart } from "@/lib/actions/pharma/cart.action";
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
  const pharmacyId = 1; // رقم ثابت مؤقت

  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  //cart
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [selectedProductForCart, setSelectedProductForCart] =
    useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  //filter
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
        pharmacyId,
        productId: selectedProductForCart.id,
        quantity: quantity,
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

  //عشان تابات المخزن في المودال تكون مقفوله
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
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <FiPackage className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">إدارة المنتجات</h1>
            <p className="text-gray-400 text-sm">
              عرض وإدارة جميع المنتجات المتاحة
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[300px]">
            <FiSearch className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج أو البراند..."
              className="w-full pr-10 pl-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2">
          <FiFilter className="text-emerald-400" />
          <span className="text-gray-300 font-medium">تصفية النتائج:</span>
        </div>

        <select
          className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white min-w-[180px]"
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
          className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white min-w-[180px]"
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

        <div className="text-sm text-gray-400">
          {filteredProducts.length} منتج
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 items-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  المنتج
                </th>
                <th className="px-6 py-4 items-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-4 items-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  البراند
                </th>
                <th className="px-6 py-4 items-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center gap-1 justify-end">
                    <FiDollarSign className="w-4 h-4" />
                    السعر
                  </div>
                </th>
                <th className="px-6 py-4 items-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
                <th className="px-6 py-4 items-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  السلة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    {" "}
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <FiPackage className="w-12 h-12" />
                      <div>
                        <p className="font-semibold">لا توجد منتجات</p>
                        <p className="text-sm">
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
                    className="hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-center text-white text-sm">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-300">
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-sm font-bold text-emerald-400">
                          {product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400">ج.م</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-center ms-20">
                        <button
                          onClick={() => openProductDetails(product)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                          التفاصيل
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openCartModal(product)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                      >
                        <FiShoppingCart className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {details.Productname}
                  </h2>
                  <p className="text-gray-400 mt-1">تفاصيل المخزون والدفعات</p>
                </div>
                <button
                  onClick={closeProductDetails}
                  className="text-gray-400 hover:text-white transition-colors text-xl p-2"
                >
                  ✕
                </button>
              </div>
              {/* Total Summary */}
              <div className="mt-6 p-4 bg-gray-750 rounded-lg border border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-gray-400 text-sm">عدد المخازن</div>
                    <div className="text-white font-bold text-lg">
                      {details.warehouses.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">إجمالي الدفعات</div>
                    <div className="text-white font-bold text-lg">
                      {details.warehouses.reduce((total, warehouse) => {
                        const batches = Object.values(warehouse)[0];
                        return total + batches.length;
                      }, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">إجمالي المخزون</div>
                    <div className="text-emerald-400 font-bold text-lg">
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
              <div className="space-y-4 mt-5">
                {details.warehouses.map((warehouseObj, warehouseIndex) => {
                  const [warehouseName, batches] =
                    Object.entries(warehouseObj)[0];
                  const isExpanded =
                    expandedWarehouses.includes(warehouseIndex);

                  return (
                    <div
                      key={warehouseIndex}
                      className="bg-gray-750 rounded-lg border border-gray-600 overflow-hidden"
                    >
                      {/* Warehouse Header  */}
                      <button
                        onClick={() => toggleWarehouse(warehouseIndex)}
                        className="w-full bg-gray-700 px-4 py-4 border-b border-gray-600 hover:bg-gray-600 transition-colors flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`transform transition-transform ${
                              isExpanded ? "rotate-90" : "rotate-0"
                            }`}
                          >
                            <FiChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                          <h3 className="font-semibold text-white text-lg text-right">
                            {warehouseName.replace("warehouse", "مخزن ")}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span>{batches.length} دفعة</span>
                          <span className="bg-emerald-900 text-emerald-300 px-2 py-1 rounded-full text-xs">
                            {batches.reduce(
                              (total, batch) => total + batch.quantity,
                              0
                            )}{" "}
                            وحدة
                          </span>
                        </div>
                      </button>

                      {/* warehouses Collapsible */}
                      {isExpanded && (
                        <div className="animate-fadeIn">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-700">
                                <tr>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300 border-l border-gray-600">
                                    رقم الدفعة
                                  </th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300 border-l border-gray-600">
                                    الكمية المتاحة
                                  </th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                                    تاريخ الانتهاء
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-600">
                                {batches.map((batch, batchIndex) => (
                                  <tr
                                    key={batchIndex}
                                    className="hover:bg-gray-700 transition-colors"
                                  >
                                    <td className="px-4 py-3 text-white border-l border-gray-600">
                                      <div className="flex items-center gap-2 justify-end">
                                        <span className="bg-blue-900 mx-auto text-blue-300 px-2 py-1 rounded text-xs">
                                          #{batch.batchNumber}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center border-l border-gray-600">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300">
                                        {batch.quantity} وحدة
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                          new Date(
                                            batch.expiryDate
                                              .split("/")
                                              .reverse()
                                              .join("-")
                                          ) < new Date()
                                            ? "bg-red-900 text-red-300"
                                            : "bg-orange-900 text-orange-300"
                                        }`}
                                      >
                                        {batch.expiryDate}
                                        {new Date(
                                          batch.expiryDate
                                            .split("/")
                                            .reverse()
                                            .join("-")
                                        ) < new Date() && (
                                          <span className="mr-1">EXPIRE</span>
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    إضافة إلى السلة
                  </h2>
                  <p className="text-gray-400 mt-1">
                    {selectedProductForCart.name}
                  </p>
                </div>
                <button
                  onClick={closeCartModal}
                  className="text-gray-400 hover:text-white transition-colors text-xl p-2"
                >
                  ✕
                </button>
              </div>

              {/* Product Info */}
              <div className="bg-gray-750 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">السعر:</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedProductForCart.price.toFixed(2)} ج.م
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">المخزون المتاح:</span>
                  <span className="text-white font-medium">
                    {selectedProductForCart.quantity} وحدة
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-3">
                  الكمية:
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>

                  <span className="text-2xl font-bold text-white w-12 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= selectedProductForCart.quantity}
                    className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-gray-750 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">الإجمالي:</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {(selectedProductForCart.price * quantity).toFixed(2)} ج.م
                  </span>
                </div>
              </div>

              {/* Actions */}
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeCartModal}
                  disabled={addCartmutation.isPending}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={
                    addCartmutation.isPending ||
                    quantity > selectedProductForCart.quantity
                  }
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {addCartmutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإضافة...
                    </>
                  ) : (
                    "تأكيد الإضافة"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
