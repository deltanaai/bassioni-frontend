'use client';

import { useState, useEffect, useMemo , useTransition} from "react";
import { MapPin, Package, ShoppingCart, DollarSign, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { createWarehouseAction } from './actions'
import { companyWarehouseCreateSchema } from '@/schemas/Warehouse'
import { productSchema } from '@/schemas/AddproductWarehouse'
import { useForm, SubmitHandler } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface ProductInput {
  name: string;
  quantity: number;
  price: number;
}

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
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    { id: 1, name: "مخزن القاهرة", location: "القاهرة - مدينة نصر", totalProducts: 120, totalQuantity: 4500, totalValue: 250000, pharmacy: "صيدلية النور", products: [] },
    { id: 2, name: "مخزن الإسكندرية", location: "الإسكندرية - سموحة", totalProducts: 80, totalQuantity: 2100, totalValue: 180000, pharmacy: "صيدلية الشفاء", products: [] },
    { id: 3, name: "مخزن أسيوط", location: "أسيوط - شارع الجمهورية", totalProducts: 60, totalQuantity: 1200, totalValue: 90000, pharmacy: "صيدلية الحياة", products: [] },
  ]);

  const [showModal, setShowModal] = useState(false);
  const pharmacies = useMemo(() => ["صيدلية النور", "صيدلية الشفاء", "صيدلية الحياة"], []);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pharmacy, setPharmacy] = useState<string>("");
  // New API payload fields
  const [code, setCode] = useState("");
  const [locationId, setLocationId] = useState<number>(1);
  const [active, setActive] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductInput[]>([]);
  type ProductForm = z.infer<typeof productSchema>

  const { register: registerProduct, handleSubmit: handleSubmitProduct, reset: resetProduct, formState: { errors: productErrors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema) as Resolver<ProductForm>,
    defaultValues: { name: '', quantity: 0, price: 0, batchNo: '', expirationDate: '' }
  });
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string | undefined }>({});

  useEffect(() => {
    if (pharmacies.length > 0) setPharmacy(pharmacies[0]);
  }, [showModal, pharmacies]);

  const onAddProduct: SubmitHandler<ProductForm> = (data) => {
    setProducts([...products, { name: data.name, quantity: data.quantity, price: data.price }]);
    resetProduct();
  };

  const saveWarehouse = () => {
    setErrorMsg(null)
    // client-side zod validation for better UX
    const parsed = companyWarehouseCreateSchema.safeParse({ name, code, location_id: locationId, active })
    if (!parsed.success) {
      const errs: { [k: string]: string } = {}
      for (const i of parsed.error.issues) {
        const key = String(i.path[0])
        errs[key] = i.message
      }
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})
    startTransition(async () => {
      try {
        const created = await createWarehouseAction({ name, code, location_id: locationId, active })
        const newWarehouse: Warehouse = {
          id: created.id ?? warehouses.length + 1,
          name: created.name,
          location: location, // keep displaying human location field
          pharmacy: pharmacy,
          totalProducts: products.length,
          totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
          totalValue: products.reduce((sum, p) => sum + p.quantity * p.price, 0),
          products,
        };
        setWarehouses([...warehouses, newWarehouse]);
        setShowModal(false);
        setName("");
        setCode("");
        setLocation("");
        setLocationId(1);
        setActive(true);
        setPharmacy(pharmacies[0]);
        setProducts([]);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'حدث خطأ أثناء الحفظ'
        setErrorMsg(message)
      }
    })
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-900 space-y-8">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-emerald-600 tracking-tight">
          المخازن
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white font-semibold transition-all shadow-md hover:shadow-emerald-300/50"
        >
          <Plus className="w-5 h-5" />
          إضافة مخزن
        </button>
      </div>

      {/* بطاقات المخازن */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-lg p-6 transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{warehouse.name}</h2>

            <div className="space-y-3 text-gray-700 text-sm">
              <InfoItem icon={<Package className="text-emerald-500" />} label="عدد المنتجات" value={warehouse.totalProducts} />
              <InfoItem icon={<ShoppingCart className="text-emerald-500" />} label="إجمالي الكمية" value={warehouse.totalQuantity} />
              <InfoItem icon={<DollarSign className="text-emerald-500" />} label="القيمة الإجمالية" value={`${warehouse.totalValue.toLocaleString()} ر.س`} />
              <InfoItem icon={<MapPin className="text-emerald-500" />} label="الصيدلية" value={warehouse.pharmacy} />
            </div>

            <div className="mt-6 text-left">
              <Link
                href={`/Pharma/warehouse/${warehouse.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-sm font-semibold text-white transition-all"
              >
                عرض التفاصيل
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* مودال الإضافة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl space-y-6 border border-gray-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-emerald-600 text-center border-b border-gray-200 pb-3">
              إضافة مخزن جديد
            </h2>

            <div className="space-y-4">
              {errorMsg && (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm">
                  {errorMsg}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-gray-700">كود المخزن</label>
                <input
                  type="text"
                  placeholder="كود المخزن"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                {fieldErrors.code && <span className="text-red-600 text-sm">{fieldErrors.code}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-gray-700">اسم المخزن</label>
                <input
                  type="text"
                  placeholder="اسم المخزن"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                {fieldErrors.name && <span className="text-red-600 text-sm">{fieldErrors.name}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-gray-700">الموقع</label>
                <input
                  type="text"
                  placeholder="الموقع"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-3">
                <div className="w-1/2 flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700">Location ID</label>
                  <input
                    type="number"
                    placeholder="Location ID"
                    value={locationId}
                    onChange={(e) => setLocationId(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  {fieldErrors.location_id && <span className="text-red-600 text-sm">{fieldErrors.location_id}</span>}
                </div>
                <div className="w-1/2 flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700">حالة التفعيل</label>
                  <label className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-300">
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                    نشط
                  </label>
                  {fieldErrors.active && <span className="text-red-600 text-sm">{fieldErrors.active}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-gray-700">الصيدلية</label>
                <select
                  value={pharmacy}
                  onChange={(e) => setPharmacy(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                >
                  {pharmacies.map((ph, idx) => (
                    <option key={idx} value={ph}>{ph}</option>
                  ))}
                </select>
              </div>

              {/* ✅ إضافة منتجات */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">إضافة منتجات</h3>

                <div className="grid gap-5 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-gray-700">اسم المنتج</label>
                      <input {...registerProduct("name")} placeholder="اسم المنتج" className="w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-900" />
                      {productErrors.name && <span className="text-red-600 text-sm mt-1">{productErrors.name.message as string}</span>}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-gray-700">الكمية</label>
                      <input type="number" {...registerProduct("quantity")} placeholder="الكمية" className="w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-900" />
                      {productErrors.quantity && <span className="text-red-600 text-sm mt-1">{productErrors.quantity.message as string}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-gray-700">السعر</label>
                      <input type="number" {...registerProduct("price")} placeholder="السعر" className="w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-900" />
                      {productErrors.price && <span className="text-red-600 text-sm mt-1">{productErrors.price.message as string}</span>}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-gray-700">رقم الدفعة</label>
                      <input {...registerProduct("batchNo")} placeholder="Batch.No" className="w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-900" />
                      {productErrors.batchNo && <span className="text-red-600 text-sm mt-1">{productErrors.batchNo.message as string}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-gray-700">تاريخ الانتهاء</label>
                      <input type="date" {...registerProduct("expirationDate")} className="w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-900" />
                      {productErrors.expirationDate && <span className="text-red-600 text-sm mt-1">{productErrors.expirationDate.message as string}</span>}
                    </div>

                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        onClick={handleSubmitProduct(onAddProduct)}
                        className="w-40 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold"
                      >
                        إضافة المنتج
                      </button>
                    </div>
                  </div>
                </div>

                {products.length > 0 && (
                  <ul className="text-gray-700 text-sm space-y-1 max-h-32 overflow-y-auto bg-gray-50 p-3 rounded-xl border border-gray-200">
                    {products.map((p, i) => (
                      <li key={i}>
                        <span className="font-medium">{p.name}</span> — {p.quantity} قطعة — {p.price.toLocaleString()} ر.س
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-800"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveWarehouse}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold text-white disabled:opacity-60"
                  disabled={isPending}
                >
                  {isPending ? '...جارٍ الحفظ' : 'حفظ المخزن'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2">
      {icon}
      {label}: <span className="font-semibold text-gray-900">{value}</span>
    </p>
  );
}
