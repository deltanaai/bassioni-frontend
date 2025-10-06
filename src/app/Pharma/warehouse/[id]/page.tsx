'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Package, DollarSign, ArrowLeft } from "lucide-react";

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
  const id = Number(params?.id);

  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("warehouses");
    if (stored) {
      const all = JSON.parse(stored);
      const found = all.find((w: Warehouse) => w.id === id);
      setWarehouse(found || null);
    }
  }, [id]);

  if (!warehouse)
    return (
      <p className="text-center text-red-400 mt-10">
        لم يتم العثور على هذا المخزن 😢
      </p>
    );

  const totalValue = warehouse.products.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  return (
    <div className="min-h-screen p-6 bg-gray-950 text-white">
      {/* زر الرجوع */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gray-800 hover:bg-gray-700 rounded-xl transition duration-200"
      >
        <ArrowLeft className="w-5 h-5" /> العودة
      </button>

      {/* معلومات المخزن */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-emerald-400 mb-4">
          {warehouse.name}
        </h1>
        <p className="flex items-center gap-2 text-gray-300 mb-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          الموقع:{" "}
          <span className="font-semibold text-white">
            {warehouse.location}
          </span>
        </p>
        <p className="flex items-center gap-2 text-gray-300 mb-2">
          <Package className="w-5 h-5 text-emerald-400" />
          عدد المنتجات:{" "}
          <span className="font-semibold text-white">
            {warehouse.products.length}
          </span>
        </p>
        <p className="flex items-center gap-2 text-gray-300">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          القيمة الإجمالية:{" "}
          <span className="font-semibold text-white">
            {totalValue.toLocaleString()} ج.م
          </span>
        </p>
      </div>

      {/* جدول المنتجات */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg overflow-x-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">🛒 المنتجات</h2>
          <div className="">
            <button
              type="button"
              // onClick={handleSubmitProduct(onAddProduct)}
              className="w-40 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold"
            >
              إضافة منتج
            </button>

          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 text-center">المنتج</th>
              <th className="p-3 text-center">رقم الدفعه</th>
              <th className="p-3 text-center">الكمية</th>
              <th className="p-3 text-center">السعر</th>
              <th className="p-3 text-center">القيمة</th>
              <th className="p-3 text-center">تاريخ الانتهاء</th>
            </tr>
          </thead>
          <tbody>
            {warehouse.products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
              >
                <td className="p-3 text-center">{p.name}</td>
                <td className="p-3 text-center ">{p.batchNo}</td>
                <td className="p-3 text-center">{p.quantity}</td>
                <td className="p-3 text-center">{p.price.toLocaleString()} ج.م</td>
                <td className="p-3 text-center">
                  {(p.quantity * p.price).toLocaleString()} ج.م
                </td>
                <td className="p-3 text-center">{p.expirationDate}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
