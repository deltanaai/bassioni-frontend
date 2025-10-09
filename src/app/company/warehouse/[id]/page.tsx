'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Package, DollarSign, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {productSchema} from "@/schemas/AddproductWarehouse"
import {ProductInput} from "@/types"

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

// removed unused type

export default function WarehouseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  //  useForm 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as Resolver<ProductInput>,
  });


  const handleDelete = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setShowModal(true);
    reset({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      batchNo: product.batchNo,
      expirationDate: product.expirationDate,
    });
  };


  useEffect(() => {
    const stored = localStorage.getItem("warehouses");
    if (stored) {
      const all = JSON.parse(stored);
      const found = all.find((w: Warehouse) => w.id === id);
      setWarehouse(found || null);
      if (found) setProducts(found.products || []);
    }
  }, [id]);

  //  اضافه/تعديل المنتج
  const onSubmitProduct = (data: ProductInput) => {
    if (editingProductId !== null) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProductId ? { ...p, ...data } : p))
      );
    } else {
      const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      const newProduct: Product = { id: nextId, ...data } as Product;
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowModal(false);
    setEditingProductId(null);
    reset({ name: "", quantity: 0, price: 0, batchNo: "", expirationDate: "" });
  };

  if (!warehouse)
    return <p className="text-center text-red-400 mt-10">لم يتم العثور على هذا المخزن 😢</p>;

  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
  <button
    onClick={() => router.back()}
    className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gray-200 hover:bg-gray-300 rounded-xl transition duration-200"
  >
    <ArrowLeft className="w-5 h-5 text-emerald-600" /> العودة
  </button>

  <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
    <h1 className="text-2xl font-bold text-emerald-600 mb-4">{warehouse.name}</h1>
    <p className="flex items-center gap-2 text-gray-700 mb-2">
      <MapPin className="w-5 h-5 text-emerald-500" /> الموقع:
      <span className="font-semibold text-gray-900">{warehouse.location}</span>
    </p>
    <p className="flex items-center gap-2 text-gray-700 mb-2">
      <Package className="w-5 h-5 text-emerald-500" /> عدد المنتجات:
      <span className="font-semibold text-gray-900">{products.length}</span>
    </p>
    <p className="flex items-center gap-2 text-gray-700">
      <DollarSign className="w-5 h-5 text-emerald-500" /> القيمة الإجمالية:
      <span className="font-semibold text-gray-900">{totalValue.toLocaleString()} ج.م</span>
    </p>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-xl font-bold text-emerald-600 mb-4">🛒 المنتجات</h2>
      <button
        onClick={() => {
          setEditingProductId(null);
          setShowModal(true);
          reset({ name: "", quantity: 0, price: 0, batchNo: "", expirationDate: "" });
        }}
        className="w-40 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold"
      >
        إضافة منتج +
      </button>
    </div>

    {/* مودال إضافة المنتجات */}
    {showModal && (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-2xl w-full max-w-xl shadow-lg text-gray-900">
          <h2 className="text-2xl font-bold text-emerald-600 mb-4">
            {editingProductId !== null ? "تعديل المنتج" : "إضافة منتج جديد"}
          </h2>

          <form onSubmit={handleSubmit(onSubmitProduct)} className="space-y-4">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="mb-1">اسم المنتج</label>
                <input
                  {...register("name")}
                  placeholder="اسم المنتج"
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col">
                <label className="mb-1">الكمية</label>
                <input
                  type="number"
                  {...register("quantity")}
                  placeholder="الكمية"
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="mb-1">السعر</label>
                <input
                  type="number"
                  {...register("price")}
                  placeholder="السعر"
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>

              <div className="flex flex-col">
                <label className="mb-1">رقم الدفعة</label>
                <input
                  {...register("batchNo")}
                  placeholder="Batch.No"
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                />
                {errors.batchNo && <p className="text-red-500 text-sm">{errors.batchNo.message}</p>}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1">تاريخ الانتهاء</label>
              <input
                type="date"
                {...register("expirationDate")}
                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
              />
              {errors.expirationDate && <p className="text-red-500 text-sm">{errors.expirationDate.message}</p>}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => { setShowModal(false); setEditingProductId(null); }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl"
              >
                إلغاء
              </button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white">
                {editingProductId !== null ? "حفظ" : "إضافة"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* جدول المنتجات */}
    {products.length > 0 ? (
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center">ID</th>
            <th className="p-3 text-center">المنتج</th>
            <th className="p-3 text-center">رقم الدفعه</th>
            <th className="p-3 text-center">الكمية</th>
            <th className="p-3 text-center">السعر</th>
            <th className="p-3 text-center">القيمة</th>
            <th className="p-3 text-center">تاريخ الانتهاء</th>
            <th className="p-3 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-300 hover:bg-gray-100 transition duration-200">
              <td className="p-3 text-center">{p.id}</td>
              <td className="p-3 text-center">{p.name}</td>
              <td className="p-3 text-center">{p.batchNo}</td>
              <td className="p-3 text-center">{p.quantity}</td>
              <td className="p-3 text-center">{p.price.toLocaleString()} ج.م</td>
              <td className="p-3 text-center">{(p.quantity * p.price).toLocaleString()} ج.م</td>
              <td className="p-3 text-center">{p.expirationDate}</td>
              <td className="p-3 text-center">
                <div className="inline-flex justify-center gap-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-600 p-1" title="تعديل"><Edit /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600 p-1" title="حذف"><Trash2 /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="mt-4 text-gray-500 text-center text-xl">لا توجد منتجات بعد.</p>
    )}
  </div>
</div>

  );
}
