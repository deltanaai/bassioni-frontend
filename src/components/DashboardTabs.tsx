"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "الصفحة الرئيسية", href: "/dashboard/home" },
  { name: "الطلبات", href: "/dashboard/orders" },
  { name: "الفواتير", href: "/dashboard/invoice" },
  { name: "المنتجات", href: "/dashboard/products" },
  { name: "الخصومات", href: "/dashboard/discounts" },
  { name: "الملف الشخصي", href: "/dashboard/profile" },
  { name: "الإعدادات", href: "/dashboard/settings" },
  { name: "تسجيل الدخول", href: "/dashboard/login" },
];

export function DashboardTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 border-b border-gray-700 bg-gray-900 px-6 sticky top-0 z-20">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-3 text-sm font-medium ${
              active
                ? "bg-gray-800 text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
