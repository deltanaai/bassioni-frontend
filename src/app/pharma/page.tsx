'use client';
import React from 'react';
import { FiCalendar, FiPlusCircle, FiSearch, FiShoppingCart, FiUsers, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';
import dynamic from 'next/dynamic';


const OrderTrendChart = dynamic(() => import('./OrderTrendChart'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white rounded-2xl animate-pulse"></div>
});

const CustomerGrowthChart = dynamic(() => import('./CustomerGrowthChart'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-white rounded-2xl animate-pulse"></div>
});



export default function ModernDashboard() {
  return (
    <div className="flex flex-col text-black gap-6 p-6 bg-gray-50" dir="rtl">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">لوحة التحكم</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">الإصدار 3.0</span>
          </h1>
          <p className="text-gray-500 mt-1">مرحبًا بعودتك، دكتور محمد 👋</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث هنا..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
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
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiTrendingUp className="text-blue-500" />
                <span>اتجاهات الطلبات</span>
              </h2>
              <p className="text-sm text-gray-500">آخر 30 يومًا</p>
            </div>
            <select className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
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
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 font-medium">إجمالي الطلبات</p>
                <h3 className="text-3xl font-bold text-white mt-2">1,248</h3>
                <div className="flex items-center mt-3">
                  <span className="bg-blue-700 text-blue-100 text-xs px-2 py-1 rounded-full flex items-center">
                    <FiTrendingUp className="ml-1" />
                    12% عن الشهر الماضي
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <FiShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-500 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 font-medium">العملاء الجدد</p>
                <h3 className="text-3xl font-bold text-white mt-2">85</h3>
                <div className="flex items-center mt-3">
                  <span className="bg-green-700 text-green-100 text-xs px-2 py-1 rounded-full flex items-center">
                    <FiTrendingUp className="ml-1" />
                    8% عن الشهر الماضي
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <FiUsers className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-500 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 font-medium">إجمالي المبيعات</p>
                <h3 className="text-3xl font-bold text-white mt-2">42,850 ر.س</h3>
                <div className="flex items-center mt-3">
                  <span className="bg-purple-700 text-purple-100 text-xs px-2 py-1 rounded-full flex items-center">
                    <FiTrendingUp className="ml-1" />
                    15% عن الشهر الماضي
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <FiBarChart2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Growth */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiUsers className="text-green-500" />
                <span>نمو العملاء</span>
              </h2>
              <p className="text-sm text-gray-500">آخر 12 شهرًا</p>
            </div>
            <select className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 outline-none shadow-sm">
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
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">أحدث الطلبات</h2>
          <button className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2.5 rounded-xl transition-all shadow-md">
            <FiPlusCircle className="w-4 h-4" />
            <span>إنشاء طلب جديد</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 font-medium text-right">رقم الطلب</th>
                <th className="p-3 font-medium text-right">العميل</th>
                <th className="p-3 font-medium text-right">الأدوية</th>
                <th className="p-3 font-medium text-right">المبلغ</th>
                <th className="p-3 font-medium text-right">الحالة</th>
                <th className="p-3 font-medium text-right">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-gray-900 text-right">#{order.id}</td>
                  <td className="p-3 text-gray-700 text-right">{order.customer}</td>
                  <td className="p-3 text-gray-600 text-right">
                    <div className="line-clamp-1">{order.items.join("، ")}</div>
                  </td>
                  <td className="p-3 font-medium text-gray-900 text-right">{order.amount} ر.س</td>
                  <td className="p-3 text-right">
                   <span
  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
    statusStyles[order.status as keyof typeof statusStyles]
  }`}
>
  {order.status}
</span>

                  </td>
                  <td className="p-3 text-gray-500 text-sm text-right">{order.date}</td>
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
  "مكتمل": "bg-green-100 text-green-800",
  "قيد التحضير": "bg-blue-100 text-blue-800",
  "ملغي": "bg-red-100 text-red-800",
  "جاهز للتسليم": "bg-amber-100 text-amber-800",
};

const recentOrders = [
  {
    id: 10258,
    customer: "أحمد محمد",
    items: ["باراسيتامول", "فيتامين سي"],
    amount: 85,
    status: "مكتمل",
    date: "اليوم - 10:45 ص"
  },
  {
    id: 10257,
    customer: "سارة عبدالله",
    items: ["أوميبرازول", "كلورفينيرامين"],
    amount: 120,
    status: "قيد التحضير",
    date: "اليوم - 09:30 ص"
  },
  {
    id: 10256,
    customer: "خالد علي",
    items: ["أموكسيسيلين", "إيبوبروفين"],
    amount: 65,
    status: "ملغي",
    date: "أمس - 03:15 م"
  },
  {
    id: 10255,
    customer: "نورا سعد",
    items: ["فيتامين د3", "كالسيوم"],
    amount: 95,
    status: "مكتمل",
    date: "أمس - 11:20 ص"
  },
  {
    id: 10254,
    customer: "يوسف أحمد",
    items: ["باراسيتامول", "كيتوبروفين"],
    amount: 45,
    status: "جاهز للتسليم",
    date: "٢ يونيو - 04:30 م"
  }
];