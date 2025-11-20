"use client";
import { useState } from "react";
import {
  Building,
  Users,
  Store,
  Package,
  Tag,
  Shield,
  Layers,
  Bell,
  Crown,
} from "lucide-react";

import { ROUTES_OWNER } from "@/constants/routes";
import { useGetSession } from "@/hooks/useGetSession";
import useGetAdmins from "@/hooks/owner/useGetAdmins";
import useGetBrands from "@/hooks/owner/useGetBrands";
import useGetCategories from "@/hooks/owner/useGetCategories";
import { useGetCompanies } from "@/hooks/owner/useGetCompanies";
import { useGetPharmacies } from "@/hooks/owner/useGetPharmacies";
import useGetProducts from "@/hooks/owner/useGetProducts";
import { useGetRoles } from "@/hooks/owner/useGetRoles";

import StatCard from "@/components/dashboard/StatCard";
import NotificationCard from "@/components/dashboard/NotificationCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function OwnerDashboard() {
  const { isLoadingSession, session } = useGetSession();
  const [showAllNotifications, setShowAllNotifications] = useState(false);

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

  // Notifications data
  const notifications = [
    {
      id: 1,
      type: "order",
      title: "طلب جديد من صيدلية النور",
      message: "تم استلام طلب جديد بقيمة 2,450 ريال",
      time: "منذ 5 دقائق",
      priority: "high" as const,
      icon: "📦",
      unread: true,
    },
    {
      id: 2,
      type: "alert",
      title: "تنبيه انخفاض المخزون",
      message: "منتج 'أموكسيسيلين 500 مجم' أقل من الحد الأدنى",
      time: "منذ 15 دقيقة",
      priority: "medium" as const,
      icon: "⚠️",
      unread: true,
    },
    {
      id: 3,
      type: "registration",
      title: "تسجيل صيدلية جديدة",
      message: "صيدلية 'الصحة والعافية' انضمت للمنصة",
      time: "منذ ساعة",
      priority: "low" as const,
      icon: "🏥",
      unread: false,
    },
    {
      id: 4,
      type: "payment",
      title: "دفعة مالية جديدة",
      message: "تم استلام دفعة من شركة الأدوية بقيمة 15,000 ريال",
      time: "منذ ساعتين",
      priority: "high" as const,
      icon: "💰",
      unread: false,
    },
    {
      id: 5,
      type: "system",
      title: "تحديث النظام",
      message: "تم تحديث النظام بنجاح - الإصدار 3.1 متاح الآن",
      time: "منذ يوم",
      priority: "low" as const,
      icon: "🔄",
      unread: false,
    },
  ];

  const displayedNotifications = showAllNotifications
    ? notifications
    : notifications.slice(0, 4);

  const unreadCount = notifications.filter((n) => n.unread).length;

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-24 w-full bg-gray-800" />
          <div className="grid gap-6 md:grid-cols-4 xl:grid-cols-7">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-40 bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "الشركات",
      value: companiesCount,
      icon: Building,
      href: ROUTES_OWNER.COMPANIES,
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "الصيدليات",
      value: pharmaciesCount,
      icon: Store,
      href: ROUTES_OWNER.PHARMACIES,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "المشرفين",
      value: adminsCount,
      icon: Users,
      href: ROUTES_OWNER.ADMINS,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "المنتجات",
      value: productsCount,
      icon: Package,
      href: ROUTES_OWNER.PRODUCTS,
      gradient: "from-orange-500 to-red-600",
    },
    {
      title: "العلامات التجارية",
      value: brandsCount,
      icon: Tag,
      href: ROUTES_OWNER.BRANDS,
      gradient: "from-indigo-500 to-blue-600",
    },
    {
      title: "الفئات",
      value: categoriesCount,
      icon: Layers,
      href: ROUTES_OWNER.CATEGORIES,
      gradient: "from-teal-500 to-emerald-600",
    },
    {
      title: "الأدوار",
      value: rolesCount,
      icon: Shield,
      href: ROUTES_OWNER.ROLES,
      gradient: "from-rose-500 to-pink-600",
    },
  ];

  const quickActions = [
    {
      title: "إدارة المشرفين",
      href: ROUTES_OWNER.ADMINS,
      icon: Users,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "عرض الصيدليات",
      href: ROUTES_OWNER.PHARMACIES,
      icon: Store,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "الشركات المتعاقدة",
      href: ROUTES_OWNER.COMPANIES,
      icon: Building,
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "إدارة المنتجات",
      href: ROUTES_OWNER.PRODUCTS,
      icon: Package,
      gradient: "from-orange-500 to-red-600",
    },
    {
      title: "إدارة الأدوار",
      href: ROUTES_OWNER.ROLES,
      icon: Shield,
      gradient: "from-rose-500 to-pink-600",
    },
    {
      title: "العلامات التجارية",
      href: ROUTES_OWNER.BRANDS,
      icon: Tag,
      gradient: "from-indigo-500 to-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-r from-gray-900/50 to-gray-800/30 p-6 backdrop-blur-xl md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 md:h-20 md:w-20">
              <Crown className="h-8 w-8 text-white md:h-10 md:w-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                لوحة تحكم المالك
              </h1>
              <p className="mt-1 text-sm text-gray-400 md:text-base">
                مرحبًا بعودتك، {session?.user?.name || "المدير"} 👋
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              href={stat.href}
              gradient={stat.gradient}
              isLoading={isLoadingData}
            />
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Notifications Section */}
          <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-6 backdrop-blur-xl lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Bell className="h-5 w-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white">
                  الإشعارات والرسائل
                </h2>
              </div>
              <button
                onClick={() => setShowAllNotifications(!showAllNotifications)}
                className="text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
              >
                {showAllNotifications ? "عرض أقل" : "عرض الكل"}
              </button>
            </div>

            <div className="space-y-4">
              {displayedNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  {...notification}
                  onView={() => console.log("View:", notification.id)}
                  onDelete={() => console.log("Delete:", notification.id)}
                />
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="rounded-xl border border-gray-800/50 bg-gray-900/20 p-12 text-center">
                <Bell className="mx-auto mb-3 h-12 w-12 text-gray-600" />
                <p className="text-sm text-gray-400">لا توجد إشعارات جديدة</p>
              </div>
            )}
          </div>

          {/* Quick Actions Section */}
          <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                إجراءات سريعة
              </h2>
            </div>

            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action.title}
                  href={action.href}
                  icon={action.icon}
                  gradient={action.gradient}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
