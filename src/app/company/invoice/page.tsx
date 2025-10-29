// pages/dashboard/invoice.tsx
"use client";

import { useState } from "react";
import { FiSearch, FiEye } from "react-icons/fi";

import Invoice from "@/components/Invoice";

interface Medicine {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  pharmacy: {
    name: string;
    type: string;
    address: string;
    discount: number;
  };
  medicines: Medicine[];
  paymentMethod: string;
  subtotal: number;
  totalDiscount: number;
  tax: number;
  total: number;
  notes?: string;
}

const sampleInvoices: Invoice[] = [
  {
    id: "2325",
    invoiceNumber: "NC966",
    date: "25/02/2025",
    customer: {
      name: "عمر حمدان",
      phone: "0123456789",
      address: "123 شارع النخيل، الرياض",
    },
    pharmacy: {
      name: "صيدلية النور",
      type: "صيدلية",
      address: "456 شارع الملك فهد، الرياض",
      discount: 10,
    },
    medicines: [
      {
        id: 1,
        name: "بانادول اكسترا",
        quantity: 5,
        unitPrice: 15,
        discount: 0,
        total: 75,
      },
      {
        id: 2,
        name: "فيتامين سي",
        quantity: 3,
        unitPrice: 30,
        discount: 5,
        total: 85.5,
      },
      {
        id: 3,
        name: "كريم هايدروكورتيزون",
        quantity: 2,
        unitPrice: 25,
        discount: 2,
        total: 49,
      },
    ],
    paymentMethod: "نقدي",
    subtotal: 209.5,
    totalDiscount: 7.5,
    tax: 20.95,
    total:10609.13,
    notes: "يجب استلام الدواء خلال أسبوع",
  },
];

export default function InvoicePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = sampleInvoices.filter(
    (invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-8">
      {/* 🔹 العنوان وشريط البحث */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold text-emerald-700">🧾 الفواتير</h1>
        <div className="relative w-full md:w-1/3">
          <FiSearch className="absolute top-3 right-3 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث برقم الفاتورة أو اسم العميل..."
            className="w-full rounded-xl border border-gray-200 py-2 pr-10 pl-4 outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 🔹 جدول الفواتير */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition">
        <table className="min-w-full text-right text-gray-700">
          <thead className="bg-emerald-50 text-sm text-emerald-700 uppercase">
            <tr>
              <th className="px-6 py-3">رقم الفاتورة</th>
              <th className="px-6 py-3">التاريخ</th>
              <th className="px-6 py-3">العميل</th>
              <th className="px-6 py-3">الصيدلية</th>
              <th className="px-6 py-3">الإجمالي</th>
              <th className="px-6 py-3">عرض التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                  لا توجد فواتير مطابقة
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className={`cursor-pointer transition hover:bg-emerald-50 ${
                    selectedInvoice?.id === invoice.id
                      ? "bg-emerald-50"
                      : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 font-semibold">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">{invoice.date}</td>
                  <td className="px-6 py-4">{invoice.customer.name}</td>
                  <td className="px-6 py-4">{invoice.pharmacy.name}</td>
                  <td className="px-6 py-4 font-bold text-emerald-700">
                    {invoice.total.toFixed(2)} ر.س
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white shadow-sm transition-all hover:bg-emerald-700"
                    >
                      <FiEye />
                      عرض
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 تفاصيل الفاتورة */}
      {selectedInvoice && <Invoice />}
    </div>
  );
}
