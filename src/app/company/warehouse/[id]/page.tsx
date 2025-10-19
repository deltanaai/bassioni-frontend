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
import { AddProductSchema } from "@/schemas/warehouseProducts";
import { ProductInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWarehouseById,
  updateWarehouse,
} from "@/lib/actions/action.warehouse";
import {
  getProductsByWarehouse,
  addProductToWarehouse,
  updateProductInWarehouse,
} from "@/lib/actions/company/warehouseProducts.action";
import {
  warehouseUpdateSchema,
  type WarehouseUpdateInput,
} from "@/schemas/Warehouse";

type Product = WarehouseProduct;

export default function WarehouseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = Number(params?.id);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // جلب بيانات المخزن
  const { data: warehouse } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => getWarehouseById(id),
    enabled: !!id,
  });

  // نموذج تعديل المخزن
  const {
    register: registerWarehouse,
    handleSubmit: handleSubmitWarehouse,
    reset: resetWarehouse,
    formState: { errors: warehouseErrors },
  } = useForm<WarehouseUpdateInput>({
    resolver: zodResolver(warehouseUpdateSchema),
    values:
      (warehouse as unknown as WarehouseUpdateInput) ||
      ({} as WarehouseUpdateInput),
  });

  // نموذج المنتجات
  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    reset: resetProduct,
    formState: { errors: productErrors },
  } = useForm<ProductInput>({
    resolver: zodResolver(AddProductSchema) as Resolver<ProductInput>,
  });

  // جلب منتجات المخزن
  const { data: productsResponse } = useQuery({
    queryKey: ["warehouseProducts", id],
    queryFn: () => getProductsByWarehouse({ warehouseId: id }),
    enabled: !!id,
  });

  const products =
    productsResponse?.success && Array.isArray(productsResponse.data)
      ? (productsResponse.data as Product[])
      : [];

  const updateMutation = useMutation({
    mutationFn: (data: WarehouseUpdateInput) => updateWarehouse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse", id] });
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      setShowEditModal(false);
      alert("تم تحديث المخزن بنجاح");
    },
    onError: (error: unknown) => {
      const e = error as Error;
      alert(e?.message || "حدث خطأ أثناء التحديث");
    },
  });

  // ميوتاشن لإضافة منتجات المخزن
  const addProductMutation = useMutation({
    mutationFn: (params: ProductInput) => addProductToWarehouse(params),
    onSuccess: (result) => {
      console.log("✅ تمت إضافة المنتج بنجاح:", result);
      queryClient.invalidateQueries({ queryKey: ["warehouseProducts", id] });
      setShowProductModal(false);
      setEditingProductId(null);
      resetProduct();
      alert("تمت إضافة المنتج بنجاح");
    },
    onError: (error: unknown) => {
      const e = error as Error;
      console.error(" خطأ في إضافة المنتج:", e);
      alert(e?.message || "حدث خطأ أثناء إضافة المنتج");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (params: ProductInput) => updateProductInWarehouse(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouseProducts", id] });
      setShowProductModal(false);
      setEditingProductId(null);
      resetProduct();
      alert("تم تحديث المنتج بنجاح");
    },
    onError: (error: unknown) => {
      const e = error as Error;
      alert(e?.message || "حدث خطأ أثناء تحديث المنتج");
    },
  });

  // Modal تعديل المخزن
  const handleEditWarehouse = () => {
    if (warehouse) {
      resetWarehouse(warehouse);
      setShowEditModal(true);
    }
  };

  // حفظ تعديلات المخزن
  const onUpdateWarehouse = (data: WarehouseUpdateInput) => {
    updateMutation.mutate(data);
  };

  // حذف المخزن
  const handleDeleteWarehouse = () => {
    alert("حذف المخزن غير مفعل حالياً.");
  };

  // حذف منتج لساااا
  const handleDeleteProduct = (productId: number) => {
    alert("حذف المنتج غير مفعل حالياً.");
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setShowProductModal(true);
    resetProduct({
      warehouseId: id,
      productId: product.id,
      warehousePrice: Number(product.price),
      stock: product.stock,
      reservedStock: product.reserved_stock,
      expiryDate: new Date(product.expiry_date),
      batchNumber: product.batch_number,
    } as unknown as ProductInput);
  };

  // إضافة/تعديل المنتج
  const onSubmitProduct = async (data: ProductInput) => {
    try {
      console.log("🔄 بدء إضافة/تعديل المنتج:", data);

      const payload: ProductInput = {
        warehouseId: id,
        productId: data.productId,
        warehousePrice: data.warehousePrice,
        stock: data.stock,
        reservedStock: data.reservedStock ?? 0,
        expiryDate: data.expiryDate,
        batchNumber: data.batchNumber,
      };

      if (editingProductId !== null) {
        await updateProductMutation.mutateAsync(payload);
      } else {
        await addProductMutation.mutateAsync(payload);
      }

      console.log("✅ تمت العملية بنجاح - جاري تحديث البيانات...");
    } catch (error) {
      console.error("❌ خطأ في إضافة/تعديل المنتج:", error);
      alert("حدث خطأ أثناء حفظ المنتج");
    }
  };

  const totalValue = products.reduce((sum, p) => {
    const unitPrice = Number(p.price);
    return sum + (p.stock ?? 0) * (isNaN(unitPrice) ? 0 : unitPrice);
  }, 0);

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
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition duration-200"
          >
            <Trash2 className="w-4 h-4" />
            مسح المخزن
          </button>
        </div>
      </div>

      {/* معلومات المخزن */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h1 className="text-2xl font-bold text-emerald-600 mb-4">
          {warehouse?.name}
        </h1>
        <p className="flex items-center gap-2 text-gray-700 mb-2">
          <MapPin className="w-5 h-5 text-emerald-500" /> الموقع:
          <span className="font-semibold text-gray-900">
            {warehouse?.location_id}
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
                warehouseId: id,
                productId: 0,
                warehousePrice: 0,
                stock: 0,
                reservedStock: 0,
                expiryDate: new Date(),
                batchNumber: "",
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
                <th className="p-3 text-center">المتوفر</th>
                <th className="p-3 text-center">سعر المخزن</th>
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
                  <td className="p-3 text-center">{p.batch_number}</td>
                  <td className="p-3 text-center">{p.stock}</td>
                  <td className="p-3 text-center">
                    {Number(p.price).toLocaleString()} ج.م
                  </td>
                  <td className="p-3 text-center">
                    {((p.stock ?? 0) * Number(p.price)).toLocaleString()} ج.م
                  </td>
                  <td className="p-3 text-center">{p.expiry_date}</td>
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
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="mb-1">معرف المنتج</label>
                  <input
                    type="number"
                    {...registerProduct("productId", { valueAsNumber: true })}
                    placeholder="ID"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {productErrors.productId && (
                    <p className="text-red-500 text-sm">
                      {productErrors.productId.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">سعر المخزن</label>
                  <input
                    type="number"
                    step="0.01"
                    {...registerProduct("warehousePrice", {
                      valueAsNumber: true,
                    })}
                    placeholder="السعر"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {productErrors.warehousePrice && (
                    <p className="text-red-500 text-sm">
                      {productErrors.warehousePrice.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="mb-1">المخزون المتاح</label>
                  <input
                    type="number"
                    {...registerProduct("stock", { valueAsNumber: true })}
                    placeholder="الكمية"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {productErrors.stock && (
                    <p className="text-red-500 text-sm">
                      {productErrors.stock.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">المخزون المحجوز</label>
                  <input
                    type="number"
                    {...registerProduct("reservedStock", {
                      valueAsNumber: true,
                    })}
                    placeholder="0"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {productErrors.reservedStock && (
                    <p className="text-red-500 text-sm">
                      {productErrors.reservedStock.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="mb-1">رقم الدفعة</label>
                  <input
                    {...registerProduct("batchNumber")}
                    placeholder="Batch.No"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {productErrors.batchNumber && (
                    <p className="text-red-500 text-sm">
                      {productErrors.batchNumber.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    {...registerProduct("expiryDate")}
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {productErrors.expiryDate && (
                    <p className="text-red-500 text-sm">
                      {productErrors.expiryDate.message as string}
                    </p>
                  )}
                </div>
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
