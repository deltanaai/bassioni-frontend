"use client";
// import { productFormSchema } from '@/schemas/AddProduts'
import { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiImage,
  FiFilter,
} from "react-icons/fi";

import { ProductFormData } from "@/types";

interface Product {
  id: number;
  name: string;
  customerName: string;
  category: string;
  brand: string;
  dosage: string;
  concentration: string;
  quantity: number;
  price: number;
  images: string[];
  warehouse: string;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "بانادول اكسترا",
    customerName: "أحمد محمد",
    category: "مسكنات",
    brand: "جلاكسو سميث كلاين",
    dosage: "أقراص",
    concentration: "500 مجم",
    quantity: 120,
    price: 15,
    images: ["panadol1.jpg", "panadol2.jpg"],
    warehouse: "مخزن القاهرة",
  },
  {
    id: 2,
    name: "فيتامين سي 1000 مجم",
    customerName: "سارة علي",
    category: "فيتامينات",
    brand: "ناتورال",
    dosage: "أقراص فوارة",
    concentration: "1000 مجم",
    quantity: 85,
    price: 30,
    images: ["vitamin-c.jpg"],
    warehouse: "مخزن الإسكندرية",
  },
];

const categories = [
  "مسكنات",
  "فيتامينات",
  "مضادات حيوية",
  "أدوية سكري",
  "مستحضرات جلدية",
];
const brands = ["جلاكسو سميث كلاين", "نوفارتس", "فايزر", "سانوفي", "ناتورال"];
const dosages = ["أقراص", "شراب", "حقن", "كريم", "مرهم", "أقراص فوارة"];
const warehouses = ["مخزن القاهرة", "مخزن الإسكندرية", "مخزن أسيوط"];

export default function StagnantGoods() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    customerName: "",
    category: "",
    brand: "",
    dosage: "",
    concentration: "",
    quantity: 0,
    price: 0,
    images: [] as string[],
    warehouse: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = productFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProductFormData, string>> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof ProductFormData;
        if (path) fieldErrors[path] = issue.message;
      }
      setFormErrors(fieldErrors);
      return;
    }
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...result.data, id: editingProduct.id }
            : p
        )
      );
    } else {
      // Add new product
      const newProduct = {
        ...result.data,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
      };
      setProducts([...products, newProduct]);
    }
    setShowAddModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      customerName: "",
      category: "",
      brand: "",
      dosage: "",
      concentration: "",
      quantity: 0,
      price: 0,
      images: [],
      warehouse: "",
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      customerName: product.customerName,
      category: product.category,
      brand: product.brand,
      dosage: product.dosage,
      concentration: product.concentration,
      quantity: product.quantity,
      price: product.price,
      images: product.images,
      warehouse: product.warehouse,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.includes(searchTerm) ||
      product.customerName.includes(searchTerm);
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    const matchesBrand = filterBrand === "all" || product.brand === filterBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-gray-100">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold text-white">إدارة الرواكد</h1>
        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <div className="relative min-w-[250px] flex-1">
            <FiSearch className="absolute top-3 right-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج أو العميل..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pr-10 pl-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FiPlus /> إضافة منتج
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400" />
          <span className="text-gray-300">تصفية:</span>
        </div>
        <select
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  #
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  اسم المنتج
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  اسم العميل
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  الفئة
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  البراند
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  الجرعة
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  التركيز
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  الكمية
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  السعر
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  المخزن
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  الصور
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    لا توجد منتجات متطابقة مع بحثك
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-white">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {product.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {product.brand}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {product.dosage}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {product.concentration}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {product.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {product.price} ر.س
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {product.warehouse}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      <div className="flex gap-1">
                        {product.images.slice(0, 3).map((img, i) => (
                          <div
                            key={i}
                            className="flex h-8 w-8 items-center justify-center rounded bg-gray-700"
                          >
                            <FiImage className="text-gray-400" />
                          </div>
                        ))}
                        {product.images.length > 3 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-700 text-xs text-gray-300">
                            +{product.images.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1 text-blue-400 hover:text-blue-300"
                          title="تعديل"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="حذف"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 shadow-lg">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold text-white">
                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    name="name"
                    placeholder="اسم المنتج"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  />
                  {formErrors.name && (
                    <span className="text-sm text-red-400">
                      {formErrors.name}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    name="customerName"
                    placeholder="اسم العميل"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  />
                  {formErrors.customerName && (
                    <span className="text-sm text-red-400">
                      {formErrors.customerName}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <span className="text-sm text-red-400">
                      {formErrors.category}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  >
                    <option value="">اختر البراند</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  {formErrors.brand && (
                    <span className="text-sm text-red-400">
                      {formErrors.brand}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <select
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    className="rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  >
                    <option value="">اختر الجرعة</option>
                    {dosages.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {formErrors.dosage && (
                    <span className="text-sm text-red-400">
                      {formErrors.dosage}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    name="concentration"
                    placeholder="التركيز"
                    value={formData.concentration}
                    onChange={handleInputChange}
                    className="rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  />
                  {formErrors.concentration && (
                    <span className="text-sm text-red-400">
                      {formErrors.concentration}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    name="quantity"
                    placeholder="الكمية"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  />
                  {formErrors.quantity && (
                    <span className="text-sm text-red-400">
                      {formErrors.quantity}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    name="price"
                    placeholder="السعر"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  />
                  {formErrors.price && (
                    <span className="text-sm text-red-400">
                      {formErrors.price}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <select
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleInputChange}
                    className="rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  >
                    <option value="">اختر المخزن</option>
                    {warehouses.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  {formErrors.warehouse && (
                    <span className="text-sm text-red-400">
                      {formErrors.warehouse}
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block">رفع صور</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative h-16 w-16 overflow-hidden rounded bg-gray-600"
                      >
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-xs text-white"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    {editingProduct ? "حفظ التعديلات" : "إضافة المنتج"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
