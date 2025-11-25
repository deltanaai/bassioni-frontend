"use client";
import { ROUTES_OWNER } from "@/constants/routes";
import { useGetSession } from "@/hooks/useGetSession";
import useGetAdmins from "@/hooks/owner/useGetAdmins";
import useGetBrands from "@/hooks/owner/useGetBrands";
import useGetCategories from "@/hooks/owner/useGetCategories";
import { useGetCompanies } from "@/hooks/owner/useGetCompanies";
import { useGetPharmacies } from "@/hooks/owner/useGetPharmacies";
import useGetProducts from "@/hooks/owner/useGetProducts";
import { useGetRoles } from "@/hooks/owner/useGetRoles";
import {
  Building,
  Users,
  Store,
  Package,
  BarChart3,
  Tag,
  Shield,
  Layers,
} from "lucide-react";
import Link from "next/link";

export default function OwnerDashboard() {
  const { isLoadingSession, session } = useGetSession();

  // Fetch data from all hooks
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetCompanies();
  const { pharmaciesData, isLoadingPharmacies } = useGetPharmacies();
  const { adminsData, isLoadingAdmins } = useGetAdmins();
  const { brandsData, isLoadingBrands } = useGetBrands();
  const { categoriesData, isLoadingCategories } = useGetCategories();
  const { productsData, isLoadingProducts } = useGetProducts();
  const { roles, isLoading: isLoadingRoles } = useGetRoles();

  // Extract counts from the data
  const companiesCount = companiesData?.meta?.total || 0;
  const pharmaciesCount = pharmaciesData?.meta?.total || 0;
  const adminsCount = adminsData?.meta?.total || 0;
  const brandsCount = brandsData?.meta?.total || 0;
  const categoriesCount = categoriesData?.meta?.total || 0;
  const productsCount = productsData?.meta?.total || 0;
  const rolesCount = roles?.length || 0;

  // Check if any data is loading
  const isLoadingData =
    isLoadingCompanies ||
    isLoadingPharmacies ||
    isLoadingAdmins ||
    isLoadingBrands ||
    isLoadingCategories ||
    isLoadingProducts ||
    isLoadingRoles;

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
    {
      title: "الشركات",
      value: isLoadingData ? "..." : companiesCount.toString(),
      icon: Building,
      color: "text-blue-600",
      href: ROUTES_OWNER.COMPANIES,
    },
    {
      title: "الصيدليات",
      value: isLoadingData ? "..." : pharmaciesCount.toString(),
      icon: Store,
      color: "text-green-600",
      href: ROUTES_OWNER.PHARMACIES,
    },
    {
      title: "المشرفين",
      value: isLoadingData ? "..." : adminsCount.toString(),
      icon: Users,
      color: "text-purple-600",
      href: ROUTES_OWNER.ADMINS,
    },
    {
      title: "المنتجات",
      value: isLoadingData ? "..." : productsCount.toString(),
      icon: Package,
      color: "text-orange-600",
      href: ROUTES_OWNER.PRODUCTS,
    },
  ];

  const additionalStats = [
    {
      title: "العلامات التجارية",
      value: isLoadingData ? "..." : brandsCount.toString(),
      icon: Tag,
      color: "text-indigo-600",
      href: ROUTES_OWNER.BRANDS,
    },
    {
      title: "الفئات",
      value: isLoadingData ? "..." : categoriesCount.toString(),
      icon: Layers,
      color: "text-teal-600",
      href: ROUTES_OWNER.CATEGORIES,
    },
    {
      title: "الأدوار",
      value: isLoadingData ? "..." : rolesCount.toString(),
      icon: Shield,
      color: "text-red-600",
      href: ROUTES_OWNER.ROLES,
    },
  ];

  // Dummy notifications data
  const notifications = [
    {
      id: 1,
      type: "order",
      title: "طلب جديد من صيدلية النور",
      message: "تم استلام طلب جديد بقيمة 2,450 ريال",
      time: "منذ 5 دقائق",
      priority: "high",
      icon: "📦",
      unread: true,
    },
    {
      id: 2,
      type: "alert",
      title: "تنبيه انخفاض المخزون",
      message: "منتج 'أموكسيسيلين 500 مجم' أقل من الحد الأدنى",
      time: "منذ 15 دقيقة",
      priority: "medium",
      icon: "⚠️",
      unread: true,
    },
    {
      id: 3,
      type: "registration",
      title: "تسجيل صيدلية جديدة",
      message: "صيدلية 'الصحة والعافية' انضمت للمنصة",
      time: "منذ ساعة",
      priority: "low",
      icon: "🏥",
      unread: false,
    },
    {
      id: 4,
      type: "payment",
      title: "دفعة مالية جديدة",
      message: "تم استلام دفعة من شركة الأدوية بقيمة 15,000 ريال",
      time: "منذ ساعتين",
      priority: "high",
      icon: "💰",
      unread: false,
    },
    {
      id: 5,
      type: "system",
      title: "تحديث النظام",
      message: "تم تحديث النظام بنجاح - الإصدار 3.1 متاح الآن",
      time: "منذ يوم",
      priority: "low",
      icon: "🔄",
      unread: false,
    },
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        {[...quickStats, ...additionalStats].map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-all hover:scale-105 block"
          >
            <div
              className={`mx-auto mb-3 rounded-full bg-gray-50 p-3 w-12 h-12 flex items-center justify-center`}
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* صفين جانبيين */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* الإشعارات والرسائل */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {notifications.filter((n) => n.unread).length}
                  </span>
                </span>
              </div>
              <h2 className="text-lg font-semibold">الإشعارات والرسائل</h2>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              عرض الكل
            </button>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`relative p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                  notification.unread
                    ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Notification Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      notification.priority === "high"
                        ? "bg-red-100 text-red-600"
                        : notification.priority === "medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {notification.icon}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-semibold ${
                            notification.unread
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <p
                          className={`text-sm mt-1 ${
                            notification.unread
                              ? "text-gray-700"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.message}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Time and Actions */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                          عرض
                        </button>
                        {!notification.unread && (
                          <button className="text-xs text-gray-500 hover:text-gray-700">
                            حذف
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
              عرض جميع الإشعارات ({notifications.length})
            </button>
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
              href={ROUTES_OWNER.PRODUCTS}
              className="w-full text-right p-4 border-2 border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-colors block"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-orange-600" />
                <span>إدارة المنتجات</span>
              </div>
            </Link>
            <Link
              href={ROUTES_OWNER.ROLES}
              className="w-full text-right p-4 border-2 border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors block"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-red-600" />
                <span>إدارة الأدوار</span>
              </div>
            </Link>
            <Link
              href={ROUTES_OWNER.BRANDS}
              className="w-full text-right p-4 border-2 border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-colors block"
            >
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-indigo-600" />
                <span>العلامات التجارية</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
