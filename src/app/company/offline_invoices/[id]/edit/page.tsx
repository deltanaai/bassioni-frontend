"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Minus,
  Calendar,
  User,
  FileText,
  Package,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const invoiceType = searchParams.get("type") || "buy";
  const isBuyInvoice = invoiceType === "buy";

  const initialData = {
    buy: {
      id: parseInt(params.id as string),
      invoiceNumber: "INV-B" + (params.id as string).padStart(5, "0"),
      type: "buy",
      date: "2023-10-15",
      supplier: "مورد أحمد",
      partyId: 10,
      status: "معلقة",
      notes: "فاتورة شراء مواد أولية",
      items: [
        { id: 1, name: " بنادول", quantity: 2, price: 75, total: 150 },
        { id: 2, name: "بارستمول ", quantity: 1, price: 100, total: 100 },
      ],
    },
    sell: {
      id: parseInt(params.id as string),
      invoiceNumber: "INV-S" + (params.id as string).padStart(5, "0"),
      type: "sell",
      date: "2023-10-14",
      customer: "عميل محمد",
      partyId: 5,
      status: "مدفوعة",
      notes: "فاتورة بيع منتجات نهائية",
      items: [
        { id: 1, name: " اوجمنتين", quantity: 3, price: 120, total: 360 },
        { id: 2, name: "اورستولام ", quantity: 2, price: 60, total: 120 },
      ],
    },
  };

  const [invoice, setInvoice] = useState(
    initialData[invoiceType as keyof typeof initialData] || initialData.buy
  );
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    price: 0,
    total: 0,
  });

  const [parties] = useState({
    buy: [{ id: 10, name: "مورد أحمد" }],
    sell: [{ id: 5, name: "عميل محمد" }],
  });

  // حساب إجماليات العناصر
  useEffect(() => {
    setNewItem((prev) => ({
      ...prev,
      total: prev.quantity * prev.price,
    }));
  }, [newItem.quantity, newItem.price]);

  // حساب إجماليات الفاتورة
  const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% ضريبة
  const total = subtotal + tax;

  const handleAddItem = () => {
    if (newItem.name && newItem.price > 0) {
      const newItemWithId = {
        ...newItem,
        id: invoice.items.length + 1,
      };

      setInvoice((prev) => ({
        ...prev,
        items: [...prev.items, newItemWithId],
      }));

      setNewItem({
        name: "",
        quantity: 1,
        price: 0,
        total: 0,
      });
    }
  };

  const handleRemoveItem = (id: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleUpdateItem = (id: number, field: string, value: any) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "price") {
            updatedItem.total = updatedItem.quantity * updatedItem.price;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const handleSave = () => {
    toast.success(
      `تم حفظ تعديلات فاتورة ${isBuyInvoice ? "الشراء" : "البيع"} بنجاح!`
    );
    router.push(
      isBuyInvoice
        ? "/company/offline_invoices/buy"
        : "/company/offline_invoices/sell"
    );
  };

  const handleDelete = () => {
    if (
      confirm(
        `هل أنت متأكد من حذف فاتورة ${isBuyInvoice ? "الشراء" : "البيع"} رقم ${
          invoice.invoiceNumber
        }؟`
      )
    ) {
      toast.success("تم حذف الفاتورة بنجاح");
      router.push(
        isBuyInvoice
          ? "/company/offline_invoices/buy"
          : "/company/offline_invoices/sell"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/*  شريط العنوان */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              <Link
                href={
                  isBuyInvoice
                    ? "/company/offline_invoices/buy"
                    : "/company/offline_invoices/sell"
                }
                className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors p-2 hover:bg-emerald-50 rounded-lg"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">رجوع</span>
              </Link>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    تعديل فاتورة {isBuyInvoice ? "شراء" : "بيع"}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800`}
                  >
                    {isBuyInvoice ? "شراء" : "بيع"}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">
                  رقم الفاتورة:{" "}
                  <span className="font-bold text-emerald-700">
                    {invoice.invoiceNumber}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <Save size={18} />
                حفظ التعديلات
              </button>

              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow"
              >
                <Trash2 size={18} />
                حذف الفاتورة
              </button>
            </div>
          </div>

          {/*  شريط الحالة */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-emerald-100">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-emerald-500`}></div>
              <span className="text-sm text-gray-700">
                {isBuyInvoice ? "فاتورة شراء" : "فاتورة بيع"}
              </span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              {isBuyInvoice ? (
                <ShoppingCart size={16} className="text-emerald-500" />
              ) : (
                <Package size={16} className="text-emerald-500" />
              )}
              <span className="text-sm text-gray-700">
                {isBuyInvoice ? "من مورد" : "لعميل"}
              </span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">
                التاريخ: {invoice.date}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*  معلومات الفاتورة */}
          <div className="lg:col-span-2 space-y-8">
            {/*  معلومات الطرف */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div
                className={`px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-500 to-emerald-600`}
              >
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User size={20} />
                  {isBuyInvoice ? "معلومات المورد" : "معلومات العميل"}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isBuyInvoice ? "اسم المورد" : "اسم العميل"}
                    </label>
                    <select
                      value={invoice.partyId}
                      onChange={(e) => {
                        const selectedParty = parties[
                          invoiceType as keyof typeof parties
                        ].find((p) => p.id === parseInt(e.target.value));
                        setInvoice((prev) => ({
                          ...prev,
                          partyId: parseInt(e.target.value),
                          [isBuyInvoice ? "supplier" : "customer"]:
                            selectedParty?.name || "",
                        }));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    >
                      <option value="">
                        {isBuyInvoice ? "اختر المورد" : "اختر العميل"}
                      </option>
                      {parties[invoiceType as keyof typeof parties].map(
                        (party) => (
                          <option key={party.id} value={party.id}>
                            {party.name} (#{party.id})
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ الفاتورة
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="date"
                        value={invoice.date}
                        onChange={(e) =>
                          setInvoice((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ العناصر */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div
                className={`px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-500 to-emerald-600`}
              >
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package size={20} />
                  {isBuyInvoice ? "المواد المشتراة" : "المنتجات المباعة"}
                </h2>
              </div>
              <div className="p-6">
                {/* جدول العناصر */}
                <div className="overflow-x-auto mb-8">
                  <table className="w-full">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th className="text-right p-4 text-sm font-semibold text-gray-700">
                          #
                        </th>
                        <th className="text-right p-4 text-sm font-semibold text-gray-700">
                          الاسم
                        </th>
                        <th className="text-right p-4 text-sm font-semibold text-gray-700">
                          الكمية
                        </th>
                        <th className="text-right p-4 text-sm font-semibold text-gray-700">
                          السعر
                        </th>
                        <th className="text-right p-4 text-sm font-semibold text-gray-700">
                          الإجمالي
                        </th>
                        <th className="text-center p-4 text-sm font-semibold text-gray-700">
                          إجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invoice.items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-emerald-50/30">
                          <td className="p-4 text-gray-700">{index + 1}</td>
                          <td className="p-4">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                handleUpdateItem(
                                  item.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleUpdateItem(
                                    item.id,
                                    "quantity",
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                className="p-1.5 rounded bg-gray-100 hover:bg-gray-200"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateItem(
                                    item.id,
                                    "quantity",
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-20 p-2 text-center border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                              />
                              <button
                                onClick={() =>
                                  handleUpdateItem(
                                    item.id,
                                    "quantity",
                                    item.quantity + 1
                                  )
                                }
                                className="p-1.5 rounded bg-gray-100 hover:bg-gray-200"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) =>
                                handleUpdateItem(
                                  item.id,
                                  "price",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-32 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            />
                          </td>
                          <td className="p-4">
                            <div className={`font-bold text-emerald-700`}>
                              {item.total.toLocaleString()} ج
                            </div>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition flex items-center gap-1 mx-auto"
                            >
                              <Trash2 size={14} />
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/*  إضافة عنصر جديد */}
                <div
                  className={`rounded-xl p-6 border bg-emerald-50/50 border-emerald-200`}
                >
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-emerald-600" />
                    إضافة {isBuyInvoice ? "مادة" : "منتج"} جديد
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        الاسم
                      </label>
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder={`أدخل اسم ${
                          isBuyInvoice ? "المادة" : "المنتج"
                        }`}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        الكمية
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setNewItem((prev) => ({
                              ...prev,
                              quantity: Math.max(1, prev.quantity - 1),
                            }))
                          }
                          className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={newItem.quantity}
                          onChange={(e) =>
                            setNewItem((prev) => ({
                              ...prev,
                              quantity: parseInt(e.target.value) || 1,
                            }))
                          }
                          className="w-full p-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                        <button
                          onClick={() =>
                            setNewItem((prev) => ({
                              ...prev,
                              quantity: prev.quantity + 1,
                            }))
                          }
                          className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        السعر
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            price: parseFloat(e.target.value) || 0,
                          }))
                        }
                        placeholder="0.00"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleAddItem}
                        disabled={!newItem.name || newItem.price <= 0}
                        className={`w-full p-3 rounded-lg font-medium flex items-center justify-center gap-2 transition bg-emerald-600 text-white hover:bg-emerald-700 ${
                          !newItem.name || newItem.price <= 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200"
                            : isBuyInvoice
                        }`}
                      >
                        <Plus size={18} />
                        إضافة
                      </button>
                    </div>
                  </div>
                  {newItem.price > 0 && (
                    <div className={`mt-4 text-sm text-emerald-700 `}>
                      الإجمالي:{" "}
                      <span className="font-bold">
                        {newItem.total.toLocaleString()} ج
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/*  الملخص الجانبي */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden sticky top-8">
              <div
                className={`px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-500 to-emerald-600`}
              >
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText size={20} />
                  ملخص الفاتورة
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">عدد العناصر:</span>
                    <span className="font-bold text-gray-800">
                      {invoice.items.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">المجموع الفرعي:</span>
                    <span className="font-bold text-gray-800">
                      {subtotal.toLocaleString()} ج
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">الضريبة (10%):</span>
                    <span className="font-bold text-gray-800">
                      {tax.toLocaleString()} ج
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-t border-gray-200 bg-emerald-50/50 -mx-6 px-6">
                    <span className="text-lg font-bold text-gray-800">
                      الإجمالي النهائي:
                    </span>
                    <span className={`text-2xl font-bold text-emerald-700`}>
                      {total.toLocaleString()} ج
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={invoice.notes}
                    onChange={(e) =>
                      setInvoice((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    rows={4}
                    placeholder="أضف أي ملاحظات أو تفاصيل إضافية..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none"
                  />
                </div>

                {/*  معلومات سريعة */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2">
                    معلومات سريعة
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">رقم الفاتورة:</span>
                      <span className="font-medium">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">النوع:</span>
                      <span className={`font-medium text-emerald-700 `}>
                        {isBuyInvoice ? "شراء" : "بيع"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التاريخ:</span>
                      <span className="font-medium">{invoice.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحالة:</span>
                      <span className="font-medium">{invoice.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
