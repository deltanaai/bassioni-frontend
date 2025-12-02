import Link from "next/link";
import { Printer, Edit, Plus, Package, Search } from "lucide-react";

export default function BuyInvoicesPage() {
  const buyInvoices = [
    {
      id: 1,
      total: 250,
      items: 250,
      date: "2023-10-15",
      customer: "مجددي أحمد",
      customerID: 1,
    },
    {
      id: 3,
      total: 890,
      items: 6565,
      date: "2023-10-12",
      customer: "محمد اسامة ",
      customerID: 6,
    },
  ];

  const totalAmount = buyInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              فواتير الشراء
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl">
            إدارة وتتبع جميع فواتير المشتريات من العملاء وتنظيم سجلات المشتريات
          </p>
        </div>

        {/* كروت الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">إجمالي الفواتير</p>
                <p className="text-3xl font-bold text-white">
                  {buyInvoices.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <Package size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">المبلغ الإجمالي</p>
                <p className="text-3xl font-bold text-white">
                  {totalAmount.toLocaleString()} ج
                </p>
                <p className="text-xs text-emerald-400 mt-2">قيمة المبيعات</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <span className="text-2xl text-white">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300 group">
            <Link
              href="/pharma/offline_invoices/buy/new"
              className="flex items-center justify-between h-full"
            >
              <div>
                <p className="text-sm text-gray-400 mb-1">فاتورة جديدة</p>
                <p className="text-3xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  + إنشاء
                </p>
                <p className="text-xs text-emerald-400 mt-2">
                  إضافة فاتورة شراء
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
                <Plus size={28} className="text-emerald-400" />
              </div>
            </Link>
          </div>
        </div>

        {/* شريط التحكم والبحث */}
        <div className="bg-gray-800 rounded-2xl shadow-lg mb-8 p-6 border border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">
                قائمة فواتير الشراء
              </h2>
              <p className="text-gray-400 text-sm">
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
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-700 bg-gray-900 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* جدول الفواتير */}
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-500 to-emerald-600">
                <tr>
                  {[
                    "رقم الفاتورة",
                    "التاريخ",
                    "المورد",
                    "عدد الاصناف",
                    "المبلغ",
                    "الإجراءات",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-center p-5 text-sm font-semibold text-white"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {buyInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-white/5 transition-all text-center duration-200 group"
                  >
                    <td className="p-5">
                      <div className="flex flex-col">
                        <div className="font-bold text-right text-white text-lg group-hover:text-emerald-400 transition-colors">
                          #{inv.id.toString().padStart(5, "0")}
                        </div>
                        <div className="text-xs  text-gray-400 mt-1 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                          فاتورة شراء
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="text-gray-300">{inv.date}</div>
                    </td>

                    <td className="p-5">
                      <div className="font-medium text-white">
                        {inv.customer}
                      </div>
                      <div className="text-xs text-gray-400">
                        المورد #{inv.customerID}
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="font-bold text-emerald-400 text-lg">
                        {inv.items}
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="font-bold text-emerald-400 text-lg">
                        {inv.total.toLocaleString()} ج
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex gap-2 justify-center">
                        <Link
                          href={`/company/offline_invoices/${inv.id}/edit?type=buy`}
                          className="px-4 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow"
                        >
                          <Edit size={16} />
                          تعديل
                        </Link>

                        <Link
                          href={`/company/offline_invoices/print?type=buy`}
                          className="px-4 py-2.5 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow"
                        >
                          <Printer size={16} />
                          طباعة
                        </Link>
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
