"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  ClipboardList,
  Archive,
  Mail,
  Percent,
  User,
  Settings,
  LogIn,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [discountsOpen, setDiscountsOpen] = useState(false);

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out h-screen sticky top-0`}
    >
      {/* شعار PharmaCare */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {sidebarOpen ? (
          <div className="text-center font-bold text-2xl tracking-wide">
            <span className="text-white">Pharma</span>
            <span className="text-emerald-400">Care</span>
          </div>
        ) : (
          <div className="mx-auto">
            <span className="text-emerald-400 font-bold">PC</span>
          </div>
        )}

        {/* زرار إظهار/إخفاء السايدبار */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-md hover:bg-gray-700"
        >
          {sidebarOpen ? (
            <ChevronDown className="w-5 h-5 transform rotate-90" />
          ) : (
            <ChevronUp className="w-5 h-5 transform rotate-90" />
          )}
        </button>
      </div>

      {/* روابط السايدبار */}
      <nav className="flex-1 p-4 space-y-2 text-sm overflow-y-auto">
        <NavLink href="/dashboard/home" icon={<Home className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
          الصفحة الرئيسية
        </NavLink>
        <NavLink href="/dashboard/orders" icon={<ClipboardList className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
          الطلبات
        </NavLink>
        <NavLink href="/dashboard/invoice" icon={<Archive className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
          الفواتير
        </NavLink>
        <NavLink href="/dashboard/products" icon={<Mail className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
          المنتجات
        </NavLink>

        {/* قائمة الخصومات المنسدلة */}
        <div>
          <button
            onClick={() => setDiscountsOpen(!discountsOpen)}
            className={`w-full flex items-center ${
              sidebarOpen ? "justify-between px-4" : "justify-center px-2"
            } py-2 rounded-md bg-white/5 hover:bg-emerald-600/20 transition-all`}
          >
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5" />
              {sidebarOpen && <span>الخصومات</span>}
            </div>
            {sidebarOpen &&
              (discountsOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>

          {sidebarOpen && discountsOpen && (
            <div className="ml-6 mt-2 space-y-1">
              <Link
                href="/dashboard/offers"
                className="block px-4 py-2 rounded-md hover:bg-emerald-600/20 transition text-white text-sm"
              >
                العروض
              </Link>
              <Link
                href="/dashboard/coupons"
                className="block px-4 py-2 rounded-md hover:bg-emerald-600/20 transition text-white text-sm"
              >
                الكوبونات
              </Link>
            </div>
          )}
        </div>

        <NavLink href="/dashboard/profile" icon={<User className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
          الملف الشخصي
        </NavLink>
        <NavLink href="/dashboard/settings" icon={<Settings className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
          الإعدادات
        </NavLink>
        <NavLink href="/login" icon={<LogIn className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
          تسجيل الدخول
        </NavLink>
      </nav>

      {/* الفوتر */}
      <div className="p-4 text-xs text-center text-gray-400 border-t border-gray-700">
        © 2026 PharmaCare
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  children,
  sidebarOpen,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  sidebarOpen: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center ${
        sidebarOpen ? "justify-start gap-3 px-4" : "justify-center px-2"
      } py-2 rounded-md bg-white/5 hover:bg-emerald-600/20 transition-all text-white`}
    >
      <span>{icon}</span>
      {sidebarOpen && <span>{children}</span>}
    </Link>
  );
}
