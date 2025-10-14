"use client";

import { useEffect, useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { warehouseSchema } from "@/schemas/Warehouse";
import { productSchema } from "@/schemas/warehouseProducts";
import { ProductInput, WarehouseFormData } from "@/types";
// import { useQuery } from "@tanstack/react-query";

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
  const pharmacies = ["صيدلية النور", "صيدلية الشفاء", "صيدلية الحياة"];
  //  تحميل البيانات من localStorage عند أول تحميل للصفحة حلل موقتتت
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("warehouses");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // حفظ أي تحديث يحصل على المخازن في localStorage
  useEffect(() => {
    if (warehouses.length > 0) {
      localStorage.setItem("warehouses", JSON.stringify(warehouses));
    } else {
      localStorage.removeItem("warehouses"); // علشان ميتخزنش فاضي
    }
  }, [warehouses]);

  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<ProductInput[]>([]);

  //  نموذج المخزن
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: { name: "", location: "", pharmacy: pharmacies[0] },
  });

  //  نموذج المنتج
  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    reset: resetProduct,
    formState: { errors: productErrors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      quantity: 0,
      price: 0,
      batchNo: "",
      expirationDate: "",
    },
  });

  //  Mutation لحفظ المخزن
  const saveMutation = useMutation({
    mutationFn: async (data: WarehouseFormData) => {
      await new Promise((r) => setTimeout(r, 600)); // محاكاة للسيرفر
      return data;
    },
    onSuccess: (data) => {
      const newWarehouse: Warehouse = {
        id: warehouses.length + 1,
        name: data.name,
        location: data.location,
        pharmacy: data.pharmacy,
        totalProducts: products.length,
        totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
        totalValue: products.reduce((sum, p) => sum + p.quantity * p.price, 0),
        products,
      };
      setWarehouses([...warehouses, newWarehouse]);
      setShowModal(false);
      setTimeout(() => {
        reset();
        setProducts([]);
      }, 300);
    },
  });

  //  إضافة منتج
  const onAddProduct = (productData: ProductInput) => {
    const newProduct = {
      id: products.length + 1,
      ...productData,
    };

    setProducts((prev) => [...prev, newProduct]);
    resetProduct();
  };

  //  حفظ المخزن
  const onSaveWarehouse = (data: WarehouseFormData) => {
    saveMutation.mutate({ ...data, products });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-950">
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

      {/*  عرض المخازن */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-emerald-500/30 transition duration-300"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              {warehouse.name}
            </h2>

            <div className="space-y-3 text-gray-300 text-sm">
              <p className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" /> عدد المنتجات:
                <span className="font-bold text-white">
                  {warehouse.totalProducts}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" /> إجمالي
                الكمية:
                <span className="font-bold text-white">
                  {warehouse.totalQuantity}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" /> القيمة
                الإجمالية:
                <span className="font-bold text-white">
                  {warehouse.totalValue.toLocaleString()} ر.س
                </span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" /> الصيدلية:
                <span className="font-bold text-white">
                  {warehouse.pharmacy}
                </span>
              </p>
            </div>

            <div className="mt-6 text-left">
              <Link
                href={`/Pharma/warehouse/${warehouse.id}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-sm font-semibold text-white transition duration-300"
              >
                المزيد
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/*  مودال الإضافة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-xl shadow-lg text-white">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4">
              إضافة مخزن جديد
            </h2>

            {/*  فورم المخزن  */}
            <form
              onSubmit={handleSubmit(onSaveWarehouse)}
              className="space-y-4"
            >
              <input
                {...register("name")}
                placeholder="اسم المخزن"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-400"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}

              <input
                {...register("location")}
                placeholder="الموقع"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-400"
              />
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location.message}
                </p>
              )}

              <select
                {...register("pharmacy")}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-400"
              >
                {pharmacies.map((ph, i) => (
                  <option key={i} value={ph}>
                    {ph}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50"
                >
                  {saveMutation.isPending ? "جارٍ الحفظ..." : "حفظ المخزن"}
                </button>
              </div>
            </form>

            {/*  فورم المنتجات */}
            <div className="border-t border-gray-700 pt-4 mt-6">
              <h3 className="font-semibold text-white mb-2">إضافة منتجات</h3>

              <form
                onSubmit={handleSubmitProduct(onAddProduct)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="mb-1">اسم المنتج</label>
                    <input
                      {...registerProduct("name")}
                      placeholder="اسم المنتج"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
                    />
                    {productErrors.name && (
                      <span className="text-red-600 text-sm mt-1">
                        {productErrors.name.message as string}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1">الكمية</label>
                    <input
                      type="number"
                      {...registerProduct("quantity")}
                      placeholder="الكمية"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
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
                    <label className="mb-1">السعر</label>
                    <input
                      type="number"
                      {...registerProduct("price")}
                      placeholder="السعر"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
                    />
                    {productErrors.price && (
                      <span className="text-red-600 text-sm mt-1">
                        {productErrors.price.message as string}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1">رقم الدفعة</label>
                    <input
                      {...registerProduct("batchNo")}
                      placeholder="Batch.No"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
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
                    <label className="mb-1">تاريخ الانتهاء</label>
                    <input
                      type="date"
                      {...registerProduct("expirationDate")}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
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

              {/*  قائمة المنتجات */}
              {products.length > 0 && (
                <ul className="text-gray-300 text-sm space-y-1 max-h-32 overflow-y-auto mt-3">
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
