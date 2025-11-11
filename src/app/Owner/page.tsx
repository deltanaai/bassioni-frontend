"use client";
import { ROUTES_OWNER } from "@/constants/routes";
import { useGetSession } from "@/hooks/useGetSession";
import {
  Building,
  Users,
  Store,
  Package,
  TrendingUp,
  BarChart3,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function OwnerDashboard() {
  const { isLoadingSession, session } = useGetSession();

  if (isLoadingSession) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg relative overflow-hidden animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full opacity-90"></div>
        </div>
      </div>
    );
  }

  const quickStats = [
    { title: "الشركات", value: "24", icon: Building, color: "text-blue-600" },
    { title: "الصيدليات", value: "156", icon: Store, color: "text-green-600" },
    {
      title: "المواقع",
      value: "1,234",
      icon: MapPin,
      color: "text-purple-600",
    },
    {
      title: "المنتجات",
      value: "8,742",
      icon: Package,
      color: "text-orange-600",
    },
  ];

  const recentItems = [
    {
      name: "صيدلية النور",
      type: "صيدلية",
      time: "منذ 5 دقائق",
      status: "مفعل",
    },
    {
      name: "شركة الأدوية",
      type: "شركة",
      time: "منذ 15 دقيقة",
      status: "مفعل",
    },
    { name: "محمد أحمد", type: "مشرف", time: "منذ ساعة", status: "مفعل" },
  ];

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
            لوحة التحكم
          </span>
          <span className="hidden text-xs px-2 py-1 bg-blue-100 text-blue-900 rounded-full">
            الإصدار 3.0
          </span>
        </h1>
        <p className="text-gray-500 mt-1">
          مرحبًا بعودتك، دكتور {session?.user?.name} 👋
        </p>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
          >
            <div
              className={`mx-auto mb-3 rounded-full bg-gray-50 p-3 w-12 h-12 flex items-center justify-center`}
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* صفين جانبيين */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* الإضافات الأخيرة */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">الإضافات الأخيرة</h2>
          </div>
          <div className="space-y-3">
            {recentItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{item.time}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الإجراءات السريعة */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">إجراءات سريعة</h2>
          </div>
          <div className="space-y-4">
            <Link
              href={ROUTES_OWNER.ADMINS}
              className="w-full text-right p-4 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors block"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span>إدارة المشرفين</span>
              </div>
            </Link>
            <Link
              href={ROUTES_OWNER.PHARMACIES}
              className="w-full text-right p-4 border-2 border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-colors block"
            >
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-green-600" />
                <span>عرض الصيدليات</span>
              </div>
            </Link>
            <Link
              href={ROUTES_OWNER.COMPANIES}
              className="w-full text-right p-4 border-2 border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-colors block"
            >
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-purple-600" />
                <span>الشركات المتعاقدة</span>
              </div>
            </Link>
            <Link
              href={ROUTES_OWNER.LOCATIONS}
              className="w-full text-right p-4 border-2 border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-colors block"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-orange-600" />
                <span>التوزيع الجغرافي</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
