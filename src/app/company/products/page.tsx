"use client";
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

  // const queryClient = useQueryClient();

  // const addCartmutation = useMutation({
  //   mutationFn: addToCart,
  //   onSuccess: async (res) => {
  //     if (!res.success) {
  //       toast.error(res.error?.message ?? "حدث خطأ أثناء اضافة المنتج للسلة");
  //       return;
  //     }
  //     await queryClient.invalidateQueries({ queryKey: ["cart"] });

  //     setCartModalOpen(false);

  //     toast.success(`تم اضافة المنتج للسلة بنجاح`);
  //   },
  // });
  // const handleAddToCart = () => {
  //   if (selectedProductForCart) {
  //     addCartmutation.mutate({
  //       pharmacyId,
  //       productId: selectedProductForCart.id,
  //       quantity: quantity,
  //     });
  //   }
  //   console.log("📦 Selected product:", selectedProductForCart);
  // };

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

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[300px]">
            <FiSearch className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج أو البراند..."
              className="w-full pr-10 pl-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 placeholder-gray-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <FiFilter className="text-emerald-600" />
          <span className="text-gray-700 font-medium">تصفية النتائج:</span>
        </div>

        <select
          className="px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 min-w-[180px] shadow-sm"
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
          className="px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 min-w-[180px] shadow-sm"
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

        <div className="text-sm text-emerald-700 font-semibold bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
          {filteredProducts.length} منتج
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                  #
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                  المنتج
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                  الفئة
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                  البراند
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                  <div className="flex items-center gap-1 justify-center">
                    <FiDollarSign className="w-4 h-4" />
                    السعر
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                  الإجراءات
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                  السلة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-500">
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <FiPackage className="w-16 h-16 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-xl text-gray-600">
                          لا توجد منتجات
                        </p>
                        <p className="text-gray-500 mt-2">
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
                    className="hover:bg-gray-50 transition-all duration-200 border-b border-gray-100"
                  >
                    <td className="px-6 py-4 text-sm text-emerald-600 font-semibold text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">
                          {product.name}
                        </div>
                        <div className="text-gray-600 text-sm mt-1">
                          {product.dosage}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200 shadow-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-center font-medium">
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                          {product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">ج.م</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => openProductDetails(product)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                        >
                          <FiEye className="w-4 h-4" />
                          التفاصيل
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openCartModal(product)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
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
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {details.Productname}
                  </h2>
                  <p className="text-gray-600 mt-1">تفاصيل المخزون والدفعات</p>
                </div>
                <button
                  onClick={closeProductDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-xl p-2"
                >
                  ✕
                </button>
              </div>

              {/* Total Summary */}
              <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-gray-600 text-sm">عدد المخازن</div>
                    <div className="text-gray-900 font-bold text-lg">
                      {details.warehouses.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">إجمالي الدفعات</div>
                    <div className="text-gray-900 font-bold text-lg">
                      {details.warehouses.reduce((total, warehouse) => {
                        const batches = Object.values(warehouse)[0];
                        return total + batches.length;
                      }, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">إجمالي المخزون</div>
                    <div className="text-emerald-600 font-bold text-lg">
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
              <div className="space-y-4 mt-6">
                {details.warehouses.map((warehouseObj, warehouseIndex) => {
                  const [warehouseName, batches] =
                    Object.entries(warehouseObj)[0];
                  const isExpanded =
                    expandedWarehouses.includes(warehouseIndex);

                  return (
                    <div
                      key={warehouseIndex}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                    >
                      {/* Warehouse Header */}
                      <button
                        onClick={() => toggleWarehouse(warehouseIndex)}
                        className="w-full bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 border-b border-gray-200 hover:from-gray-100 hover:to-gray-50 transition-colors flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`transform transition-transform ${
                              isExpanded ? "rotate-90" : "rotate-0"
                            }`}
                          >
                            <FiChevronRight className="w-4 h-4 text-gray-500" />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-lg text-right">
                            {warehouseName.replace("warehouse", "مخزن ")}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{batches.length} دفعة</span>
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs border border-emerald-200">
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
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-l border-gray-200">
                                    رقم الدفعة
                                  </th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-l border-gray-200">
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
                                    className="hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="px-4 py-3 text-gray-900 border-l border-gray-200">
                                      <div className="flex items-center gap-2 justify-end">
                                        <span className="bg-blue-100 mx-auto text-blue-700 px-2 py-1 rounded text-xs border border-blue-200">
                                          #{batch.batchNumber}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center border-l border-gray-200">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
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
                                            ? "bg-red-100 text-red-700 border border-red-200"
                                            : "bg-orange-100 text-orange-700 border border-orange-200"
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
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    إضافة إلى السلة
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedProductForCart.name}
                  </p>
                </div>
                <button
                  onClick={closeCartModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-xl p-2"
                >
                  ✕
                </button>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">السعر:</span>
                  <span className="text-emerald-600 font-bold">
                    {selectedProductForCart.price.toFixed(2)} ج.م
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">المخزون المتاح:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedProductForCart.quantity} وحدة
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-3">
                  الكمية:
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-full flex items-center justify-center transition-colors border border-gray-300"
                  >
                    <FiMinus className="w-4 h-4 text-gray-600" />
                  </button>

                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= selectedProductForCart.quantity}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-full flex items-center justify-center transition-colors border border-gray-300"
                  >
                    <FiPlus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                <div className="flex justify-between items-center">
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
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  إلغاء
                </button>
                <button className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-semibold transition-colors shadow-md">
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
