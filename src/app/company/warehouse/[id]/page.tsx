"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Package,
  DollarSign,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/schemas/AddproductWarehouse";
import { ProductInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteWarehouse,
  getWarehouseById,
  updateWarehouse,
} from "@/app/lib/actions/action.warehouse";
import { warehouseUpdateSchema } from "@/schemas/Warehouse";

interface Product {
  id: number;
  name: string;
  batchNo: string;
  quantity: number;
  price: number;
  expirationDate: string;
}

interface Warehouse {
  id: number;
  name: string;
  location: string;
  products: Product[];
}

export default function WarehouseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = Number(params?.id);

  const [products, setProducts] = useState<Product[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // جلب بيانات المخزن
  const { data: warehouse, isLoading } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => getWarehouseById(id),
    enabled: !!id, // يتشغل فقط إذا id موجود
  });

  // نموذج تعديل المخزن
  const {
    register: registerWarehouse,
    handleSubmit: handleSubmitWarehouse,
    reset: resetWarehouse,
    formState: { errors: warehouseErrors },
  } = useForm({
    resolver: zodResolver(warehouseUpdateSchema),
    values: warehouse || {},
  });

  // نموذج المنتجات
  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    reset: resetProduct,
    formState: { errors: productErrors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as Resolver<ProductInput>,
  });

  // Mutation لتعديل المخزن
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateWarehouse(id, data),
    onSuccess: () => {
      // تحديث البيانات
      queryClient.invalidateQueries({ queryKey: ["warehouse", id] });
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      setShowEditModal(false);
      alert("تم تحديث المخزن بنجاح");
    },
    onError: (error: any) => {
      alert(error.message || "حدث خطأ أثناء التحديث");
    },
  });

  // Mutation لحذف المخزن
  const deleteWarehouseMutation = useMutation({
    mutationFn: () => deleteWarehouse(id),
    onSuccess: (data) => {
      if (data.success) {
        alert("تم حذف المخزن بنجاح");
        queryClient.invalidateQueries({ queryKey: ["warehouses"] });
        router.push("/company/warehouses");
      } else {
        alert(data.message || "حدث خطأ أثناء الحذف");
      }
    },
    onError: (error: any) => {
      alert(error.message || "حدث خطأ غير متوقع");
    },
  });

  //  Modal تعديل المخزن
  const handleEditWarehouse = () => {
    if (warehouse) {
      resetWarehouse(warehouse);
      setShowEditModal(true);
    }
  };

  // حفظ تعديلات المخزن
  const onUpdateWarehouse = (data: any) => {
    updateMutation.mutate(data);
  };

  // حذف المخزن
  const handleDeleteWarehouse = () => {
    if (
      confirm(
        "هل أنت متأكد من حذف هذا المخزن؟ هذا الإجراء لا يمكن التراجع عنه."
      )
    ) {
      deleteWarehouseMutation.mutate();
    }
  };
  // لساا محتاجين يتظبطو مع api
  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setShowProductModal(true);
    resetProduct({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      batchNo: product.batchNo,
      expirationDate: product.expirationDate,
    });
  };

  // إضافة/تعديل المنتج
  const onSubmitProduct = (data: ProductInput) => {
    if (editingProductId !== null) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProductId ? { ...p, ...data } : p))
      );
    } else {
      const nextId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      const newProduct: Product = { id: nextId, ...data } as Product;
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowProductModal(false);
    setEditingProductId(null);
    resetProduct({
      name: "",
      quantity: 0,
      price: 0,
      batchNo: "",
      expirationDate: "",
    });
  };

  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
      {/* الأزرار العلوية */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition duration-200 order-2 sm:order-1"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-600" /> العودة
        </button>

        <div className="flex gap-2 order-1 sm:order-2">
          <button
            onClick={handleEditWarehouse}
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition duration-200 disabled:opacity-50"
          >
            <Edit className="w-4 h-4" />
            {updateMutation.isPending ? "جاري التحديث..." : "تعديل المخزن"}
          </button>

          <button
            onClick={handleDeleteWarehouse}
            disabled={deleteWarehouseMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition duration-200 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleteWarehouseMutation.isPending ? "جاري الحذف..." : "مسح المخزن"}
          </button>
        </div>
      </div>

      {/* معلومات المخزن */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h1 className="text-2xl font-bold text-emerald-600 mb-4">
          {warehouse.name}
        </h1>
        <p className="flex items-center gap-2 text-gray-700 mb-2">
          <MapPin className="w-5 h-5 text-emerald-500" /> الموقع:
          <span className="font-semibold text-gray-900">
            {warehouse.location}
          </span>
        </p>
        <p className="flex items-center gap-2 text-gray-700 mb-2">
          <Package className="w-5 h-5 text-emerald-500" /> عدد المنتجات:
          <span className="font-semibold text-gray-900">{products.length}</span>
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <DollarSign className="w-5 h-5 text-emerald-500" /> القيمة الإجمالية:
          <span className="font-semibold text-gray-900">
            {totalValue.toLocaleString()} ج.م
          </span>
        </p>
      </div>

      {/* قسم المنتجات */}
      <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-emerald-600">🛒 المنتجات</h2>
          <button
            onClick={() => {
              setEditingProductId(null);
              setShowProductModal(true);
              resetProduct({
                name: "",
                quantity: 0,
                price: 0,
                batchNo: "",
                expirationDate: "",
              });
            }}
            className="w-40 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold"
          >
            إضافة منتج +
          </button>
        </div>

        {/* جدول المنتجات */}
        {products.length > 0 ? (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-center">ID</th>
                <th className="p-3 text-center">المنتج</th>
                <th className="p-3 text-center">رقم الدفعة</th>
                <th className="p-3 text-center">الكمية</th>
                <th className="p-3 text-center">السعر</th>
                <th className="p-3 text-center">القيمة</th>
                <th className="p-3 text-center">تاريخ الانتهاء</th>
                <th className="p-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-300 hover:bg-gray-100 transition duration-200"
                >
                  <td className="p-3 text-center">{p.id}</td>
                  <td className="p-3 text-center">{p.name}</td>
                  <td className="p-3 text-center">{p.batchNo}</td>
                  <td className="p-3 text-center">{p.quantity}</td>
                  <td className="p-3 text-center">
                    {p.price.toLocaleString()} ج.م
                  </td>
                  <td className="p-3 text-center">
                    {(p.quantity * p.price).toLocaleString()} ج.م
                  </td>
                  <td className="p-3 text-center">{p.expirationDate}</td>
                  <td className="p-3 text-center">
                    <div className="inline-flex justify-center gap-2">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="text-blue-500 hover:text-blue-600 p-1"
                        title="تعديل"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        title="حذف"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4 text-gray-500 text-center text-xl">
            لا توجد منتجات بعد.
          </p>
        )}
      </div>

      {/* مودال تعديل المخزن */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-emerald-600 mb-4">
              تعديل المخزن
            </h2>

            <form
              onSubmit={handleSubmitWarehouse(onUpdateWarehouse)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المخزن
                </label>
                <input
                  {...registerWarehouse("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
                />
                {warehouseErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {warehouseErrors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  كود المخزن
                </label>
                <input
                  {...registerWarehouse("code")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
                />
                {warehouseErrors.code && (
                  <p className="text-red-500 text-sm mt-1">
                    {warehouseErrors.code.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الموقع
                </label>
                <input
                  type="number"
                  {...registerWarehouse("location_id", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
                />
                {warehouseErrors.location_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {warehouseErrors.location_id.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...registerWarehouse("active")}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label className="text-sm text-gray-700">المخزن نشط</label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50"
                >
                  {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال إضافة/تعديل المنتج */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xl shadow-lg">
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">
              {editingProductId !== null ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h2>

            <form
              onSubmit={handleSubmitProduct(onSubmitProduct)}
              className="space-y-4"
            >
              {/* ... نفس كود مودال المنتج السابق ... */}
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="mb-1">اسم المنتج</label>
                  <input
                    {...registerProduct("name")}
                    placeholder="اسم المنتج"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {productErrors.name && (
                    <p className="text-red-500 text-sm">
                      {productErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">الكمية</label>
                  <input
                    type="number"
                    {...registerProduct("quantity")}
                    placeholder="الكمية"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {productErrors.quantity && (
                    <p className="text-red-500 text-sm">
                      {productErrors.quantity.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="mb-1">السعر</label>
                  <input
                    type="number"
                    {...registerProduct("price")}
                    placeholder="السعر"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {productErrors.price && (
                    <p className="text-red-500 text-sm">
                      {productErrors.price.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">رقم الدفعة</label>
                  <input
                    {...registerProduct("batchNo")}
                    placeholder="Batch.No"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {productErrors.batchNo && (
                    <p className="text-red-500 text-sm">
                      {productErrors.batchNo.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-1">تاريخ الانتهاء</label>
                <input
                  type="date"
                  {...registerProduct("expirationDate")}
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                />
                {productErrors.expirationDate && (
                  <p className="text-red-500 text-sm">
                    {productErrors.expirationDate.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProductId(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white"
                >
                  {editingProductId !== null ? "حفظ" : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
