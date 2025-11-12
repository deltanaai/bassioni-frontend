"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
import {
  FiCalendar,
  FiPlusCircle,
  FiSearch,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";

const OrderTrendChart = dynamic(() => import("./OrderTrendChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-white"></div>
  ),
});

const CustomerGrowthChart = dynamic(() => import("./CustomerGrowthChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-white"></div>
  ),
});

export default function ModernDashboard() {
  return (
    <div className="flex flex-col gap-6 bg-gray-50 p-6 text-black" dir="rtl">
      {/* Header with Search */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              لوحة التحكم
            </span>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
              الإصدار 3.0
            </span>
          </h1>
          <p className="mt-1 text-gray-500">مرحبًا بعودتك، دكتور محمد 👋</p>
        </div>

        <div className="flex w-full items-center gap-4 md:w-auto">
          <div className="relative min-w-[200px] flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث هنا..."
              className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-3 pl-10 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition-colors hover:bg-gray-50">
              <FiCalendar className="h-5 w-5 text-gray-600" />
            </button>
            <div className="relative">
              <Image
                src="/images.png"
                alt="User"
                width={40}
                height={40}
                className="rounded-xl border-2 border-white shadow-md"
              />
              <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Trend Chart */}
        <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <FiTrendingUp className="text-blue-500" />
                <span>اتجاهات الطلبات</span>
              </h2>
              <p className="text-sm text-gray-500">آخر 30 يومًا</p>
            </div>
            <select className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option>عرض الجميع</option>
              <option>الطلبات الناجحة</option>
              <option>الطلبات الملغاة</option>
            </select>
          </div>
          <div className="h-80">
            <OrderTrendChart />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-blue-100">إجمالي الطلبات</p>
                <h3 className="mt-2 text-3xl font-bold text-white">1,248</h3>
                <div className="mt-3 flex items-center">
                  <span className="flex items-center rounded-full bg-blue-700 px-2 py-1 text-xs text-blue-100">
                    <FiTrendingUp className="ml-1" />
                    12% عن الشهر الماضي
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-white/20 p-3">
                <FiShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-600 to-green-500 p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-green-100">العملاء الجدد</p>
                <h3 className="mt-2 text-3xl font-bold text-white">85</h3>
                <div className="mt-3 flex items-center">
                  <span className="flex items-center rounded-full bg-green-700 px-2 py-1 text-xs text-green-100">
                    <FiTrendingUp className="ml-1" />
                    8% عن الشهر الماضي
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-white/20 p-3">
                <FiUsers className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-purple-100">إجمالي المبيعات</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  42,850 ر.س
                </h3>
                <div className="mt-3 flex items-center">
                  <span className="flex items-center rounded-full bg-purple-700 px-2 py-1 text-xs text-purple-100">
                    <FiTrendingUp className="ml-1" />
                    15% عن الشهر الماضي
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-white/20 p-3">
                <FiBarChart2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Customer Growth */}
        <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <FiUsers className="text-green-500" />
                <span>نمو العملاء</span>
              </h2>
              <p className="text-sm text-gray-500">آخر 12 شهرًا</p>
            </div>
            <select className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-green-500">
              <option>عرض الجميع</option>
              <option>العملاء الجدد</option>
              <option>العملاء المتكررين</option>
            </select>
          </div>
          <div className="h-80">
            <CustomerGrowthChart />
          </div>
        </div>

        {/* Revenue Breakdown */}
        {/* <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiPieChart className="text-purple-500" />
                <span>توزيع الإيرادات</span>
              </h2>
              <p className="text-sm text-gray-500">هذا الشهر</p>
            </div>
            <select className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm">
              <option>يونيو 2023</option>
              <option>مايو 2023</option>
            </select>
          </div>
          <div className="h-80">
            <RevenueChart />
          </div>
        </div> */}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">أحدث الطلبات</h2>
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-600">
            <FiPlusCircle className="h-4 w-4" />
            <span>إنشاء طلب جديد</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-right font-medium">رقم الطلب</th>
                <th className="p-3 text-right font-medium">العميل</th>
                <th className="p-3 text-right font-medium">الأدوية</th>
                <th className="p-3 text-right font-medium">المبلغ</th>
                <th className="p-3 text-right font-medium">الحالة</th>
                <th className="p-3 text-right font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order, index) => (
                <tr key={index} className="transition-colors hover:bg-gray-50">
                  <td className="p-3 text-right font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="p-3 text-right text-gray-700">
                    {order.customer}
                  </td>
                  <td className="p-3 text-right text-gray-600">
                    <div className="line-clamp-1">{order.items.join("، ")}</div>
                  </td>
                  <td className="p-3 text-right font-medium text-gray-900">
                    {order.amount} ر.س
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[order.status as keyof typeof statusStyles]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-sm text-gray-500">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const statusStyles = {
  مكتمل: "bg-green-100 text-green-800",
  "قيد التحضير": "bg-blue-100 text-blue-800",
  ملغي: "bg-red-100 text-red-800",
  "جاهز للتسليم": "bg-amber-100 text-amber-800",
};

const recentOrders = [
  {
    id: 10258,
    customer: "أحمد محمد",
    items: ["باراسيتامول", "فيتامين سي"],
    amount: 85,
    status: "مكتمل",
    date: "اليوم - 10:45 ص",
  },
  {
    id: 10257,
    customer: "سارة عبدالله",
    items: ["أوميبرازول", "كلورفينيرامين"],
    amount: 120,
    status: "قيد التحضير",
    date: "اليوم - 09:30 ص",
  },
  {
    id: 10256,
    customer: "خالد علي",
    items: ["أموكسيسيلين", "إيبوبروفين"],
    amount: 65,
    status: "ملغي",
    date: "أمس - 03:15 م",
  },
  {
    id: 10255,
    customer: "نورا سعد",
    items: ["فيتامين د3", "كالسيوم"],
    amount: 95,
    status: "مكتمل",
    date: "أمس - 11:20 ص",
  },
  {
    id: 10254,
    customer: "يوسف أحمد",
    items: ["باراسيتامول", "كيتوبروفين"],
    amount: 45,
    status: "جاهز للتسليم",
    date: "٢ يونيو - 04:30 م",
  },
];
