"use client";

import { useState } from "react";
import {
  MapPin,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseSchema } from "@/schemas/Warehouse";
import { AddProductSchema } from "@/schemas/warehouseProducts";
import { ProductInput, WarehouseFormData } from "@/types";
import {
  createWarehouse,
  getWarehouses,
} from "@/lib/actions/action.warehouse";

interface Warehouse {
  id: number;
  name: string;
  location: string;
  totalProducts: number;
  totalQuantity: number;
  totalValue: number;
  pharmacy: string;
  products: ProductInput[];
}

export default function WarehousesPage() {
  const queryClient = useQueryClient();
  const pharmacies = ["صيدلية النور", "صيدلية الشفاء", "صيدلية الحياة"];

  // جلب المخازن من الـ API
  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses"],
    queryFn: getWarehouses,
  });

  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<ProductInput[]>([]);

  // نموذج المخزن
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: { name: "", location: "", pharmacy: pharmacies[0] },
  });

  // نموذج المنتج
  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    reset: resetProduct,
    formState: { errors: productErrors },
  } = useForm<ProductInput>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      name: "",
      quantity: 0,
      price: 0,
      batchNo: "",
      expirationDate: "",
    },
  });

  // Mutation لإنشاء مخزن جديد
  const saveWarehouseMutation = useMutation({
    mutationFn: async (
      data: WarehouseFormData & { products: ProductInput[] }
    ) => {
      // تحضير البيانات للإرسال للـ API
      const warehouseData = {
        name: data.name,
        location: data.location,
        pharmacy: data.pharmacy,
        products: data.products,
        // دول مترفعوش
        totalProducts: products.length,
        totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
        totalValue: products.reduce((sum, p) => sum + p.quantity * p.price, 0),
      };

      return await createWarehouse(warehouseData);
    },
    onSuccess: () => {
      // إعادة جلب البيانات بعد الإضافة
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      setShowModal(false);
      reset();
      setProducts([]);
    },
    onError: (error: any) => {
      alert(error.message || "حدث خطأ أثناء إنشاء المخزن");
    },
  });

  // إضافة منتج
  const onAddProduct = (productData: ProductInput) => {
    const newProduct = {
      id: products.length + 1,
      ...productData,
    };

    setProducts((prev) => [...prev, newProduct]);
    resetProduct();
  };

  // حفظ المخزن
  const onSaveWarehouse = (data: WarehouseFormData) => {
    saveMutation.mutate({ ...data, products });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-400">المخازن</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white font-semibold transition"
        >
          <Plus className="w-5 h-5" />
          إضافة مخزن
        </button>
      </div>

      {/* عرض المخازن */}
      {warehouses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {warehouses.map((warehouse: any) => (
            <div
              key={warehouse.id}
              className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-lg p-6 transition-all duration-300"
            >
              {/* العنوان */}
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {warehouse.name}
              </h2>

              {/* بيانات المخزن */}
              <div className="space-y-3 text-gray-600 text-sm">
                <p className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-500" /> عدد المنتجات:
                  <span className="font-semibold text-gray-900">
                    {warehouse.totalProducts}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-500" /> إجمالي
                  الكمية:
                  <span className="font-semibold text-gray-900">
                    {warehouse.totalQuantity}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" /> القيمة
                  الإجمالية:
                  <span className="font-semibold text-gray-900">
                    {warehouse.totalValue?.toLocaleString()} ر.س
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-500" /> الصيدلية:
                  <span className="font-semibold text-gray-900">
                    {warehouse.pharmacy}
                  </span>
                </p>
              </div>

              <div className="mt-6 text-left">
                <Link
                  href={`/company/warehouse/${warehouse.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-sm font-semibold text-white transition duration-300"
                >
                  المزيد
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // الرسالة لما مفيش مخازن
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">
            لا توجد مخازن
          </h2>
          <p className="text-gray-500 mb-6">ابدأ بإضافة مخزنك الأول</p>
        </div>
      )}

      {/* مودال الإضافة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white max-h-[90vh] overflow-y-auto p-6 rounded-2xl w-full max-w-xl shadow-lg text-gray-900">
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">
              إضافة مخزن جديد
            </h2>

            {/* فورم المخزن */}
            <form
              onSubmit={handleSubmit(onSaveWarehouse)}
              className="space-y-4"
            >
              <input
                {...register("name")}
                placeholder="اسم المخزن"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}

              <input
                {...register("code")}
                placeholder="كود المخزن "
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}

              {/* الموقع */}
              <input
                {...register("location")}
                placeholder="الموقع"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
              />
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location.message}
                </p>
              )}

              <input
                type="number"
                {...register("location_id", { valueAsNumber: true })}
                placeholder="رقم الموقع (Location ID)"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
              />
              {errors.location_id && (
                <p className="text-red-500 text-sm">
                  {errors.location_id.message}
                </p>
              )}

              {/* الصيدلية */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  {...register("pharmacy")}
                  className="w-60 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
                >
                  {pharmacies.map((ph, i) => (
                    <option key={i} value={ph}>
                      {ph}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("active")}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                    defaultChecked
                  />
                  <label className="text-sm text-gray-700">المخزن نشط</label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saveWarehouseMutation.isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white disabled:opacity-50"
                >
                  {saveWarehouseMutation.isPending
                    ? "جارٍ الحفظ..."
                    : "حفظ المخزن"}
                </button>
              </div>
            </form>

            {/* فورم المنتجات */}
            <div className="border-t border-gray-300 pt-4 mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">إضافة منتجات</h3>

              <form
                onSubmit={handleSubmitProduct(onAddProduct)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="mb-1 text-gray-700">اسم المنتج</label>
                    <input
                      {...registerProduct("name")}
                      placeholder="اسم المنتج"
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                    />
                    {productErrors.name && (
                      <span className="text-red-600 text-sm mt-1">
                        {productErrors.name.message as string}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-gray-700">الكمية</label>
                    <input
                      type="number"
                      {...registerProduct("quantity")}
                      placeholder="الكمية"
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                    />
                    {productErrors.quantity && (
                      <span className="text-red-600 text-sm mt-1">
                        {productErrors.quantity.message as string}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="mb-1 text-gray-700">السعر</label>
                    <input
                      type="number"
                      {...registerProduct("price")}
                      placeholder="السعر"
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                    />
                    {productErrors.price && (
                      <span className="text-red-600 text-sm mt-1">
                        {productErrors.price.message as string}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-gray-700">رقم الدفعة</label>
                    <input
                      {...registerProduct("batchNo")}
                      placeholder="Batch.No"
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                    />
                    {productErrors.batchNo && (
                      <span className="text-red-600 text-sm mt-1">
                        {productErrors.batchNo.message as string}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="mb-1 text-gray-700">تاريخ الانتهاء</label>
                    <input
                      type="date"
                      {...registerProduct("expirationDate")}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                    />
                    {productErrors.expirationDate && (
                      <span className="text-red-600 text-sm mt-1">
                        {productErrors.expirationDate.message as string}
                      </span>
                    )}
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-40 mr-25 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold"
                    >
                      إضافة المنتج
                    </button>
                  </div>
                </div>
              </form>

              {/* قائمة المنتجات */}
              {products.length > 0 && (
                <ul className="text-gray-700 text-sm space-y-1 max-h-32 overflow-y-auto mt-3">
                  {products.map((p, i) => (
                    <li key={i}>
                      {p.name} - {p.quantity} قطعة - {p.price} ر.س
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
