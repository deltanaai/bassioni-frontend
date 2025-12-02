import Link from "next/link";
import { Printer, Edit, Plus, Package, Search } from "lucide-react";

export default function BuyInvoicesPage() {
  const buyInvoices = [
    {
      id: 1,
      total: 250,
      items: 250,
      partyId: 10,
      date: "2023-10-15",
      supplier: "مورد أحمد",
    },
    {
      id: 3,
      total: 890,
      items: 6565,
      partyId: 12,
      date: "2023-10-12",
      supplier: "شركة الأمل",
    },
  ];

  const totalAmount = buyInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              فواتير الشراء
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            إدارة وتتبع جميع فواتير المشتريات من الموردين وتنظيم سجلات المشتريات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">إجمالي الفواتير</p>
                <p className="text-3xl font-bold text-gray-800">
                  {buyInvoices.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <Package size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">المبلغ الإجمالي</p>
                <p className="text-3xl font-bold text-gray-800">
                  {totalAmount.toLocaleString()} ج
                </p>
                <p className="text-xs text-emerald-600 mt-2">قيمة المشتريات</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <span className="text-2xl text-white">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow duration-300 group">
            <Link
              href="/company/offline_invoices/buy/new"
              className="flex items-center justify-between h-full"
            >
              <div>
                <p className="text-sm text-gray-500 mb-1">فاتورة جديدة</p>
                <p className="text-3xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  + إنشاء
                </p>
                <p className="text-xs text-emerald-600 mt-2">
                  إضافة فاتورة شراء
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <Plus size={28} className="text-emerald-600" />
              </div>
            </Link>
          </div>
        </div>

        {/*  شريط التحكم والبحث */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-6 border border-emerald-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                قائمة فواتير الشراء
              </h2>
              <p className="text-gray-600 text-sm">
                إدارة وتتبع جميع فواتير المشتريات ومراجعة تفاصيل كل فاتورة
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="بحث في الفواتير..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/*  جدول فواتير الشراء */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-500 to-emerald-600">
                <tr>
                  <th className="text-right p-5 text-sm font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>رقم الفاتورة</span>
                      <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    </div>
                  </th>
                  <th className="text-right p-5 text-sm font-semibold text-white">
                    التاريخ
                  </th>
                  <th className="text-right p-5 text-sm font-semibold text-white">
                    المورد
                  </th>
                  <th className="text-right p-5 text-sm font-semibold text-white">
                    عدد الاصناف
                  </th>
                  <th className="text-right p-5 text-sm font-semibold text-white">
                    المبلغ
                  </th>

                  <th className="text-center p-5 text-sm font-semibold text-white">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {buyInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-emerald-50/30 transition-all duration-200 group"
                  >
                    <td className="p-5">
                      <div className="flex flex-col">
                        <div className="font-bold text-gray-800 text-lg group-hover:text-emerald-700 transition-colors">
                          #{inv.id.toString().padStart(5, "0")}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                          فاتورة شراء
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="text-gray-700">{inv.date}</div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-gray-800">
                            {inv.supplier}
                          </div>
                          <div className="text-xs text-gray-500">
                            المورد #{inv.partyId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-emerald-700 text-lg">
                        {inv.items}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-emerald-700 text-lg">
                        {inv.total.toLocaleString()} ج
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex gap-2 justify-center">
                        <Link
                          href={`/company/offline_invoices/${inv.id}/edit?type=buy`}
                          className="px-4 py-2.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow"
                          title="تعديل الفاتورة"
                        >
                          <Edit size={16} />
                          تعديل
                        </Link>
                        <Link
                          href={`/company/offline_invoices/print?type=buy`}
                          className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow"
                          title="طباعة الفاتورة"
                        >
                          <Printer size={16} />
                          طباعة
                        </Link>
                        {/* <button className="px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow">
                          <span>عرض</span>
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
