"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  User,
  Settings,
  ClipboardList,
  Send,
  Archive,
  PlusCircle,
  Mail,
  Bell,
  LogIn,
  Percent,
  ChevronDown,
  ChevronUp,
  Package,
  Users,
  Store,
  Tag,
  TicketPercent,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="min-h-screen  flex text-white"
      dir="rtl"
    >
      {/* القائمة الجانبية */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"
          } bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col transition-all duration-300 ease-in-out h-screen sticky top-0`}
      >
        {/* اللوجو */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen ? (
            <div className="text-center font-bold text-2xl tracking-wide">
              <span className="text-white">Pharma</span>
              <span className="text-emerald-400">bassiony</span>
            </div>
          ) : (
            <div className="mx-auto">
              <span className="text-emerald-400 font-bold">PC</span>
            </div>
          )}
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

        {/* الروابط */}
        <nav className="flex-1 p-4 space-y-2 text-sm overflow-y-auto">
          <NavLink href="/Pharma" icon={<Home className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
            الصفحة الرئيسية
          </NavLink>
          <NavLink
            href="/Pharma/today"
            icon={<ClipboardList className="w-5 h-5" />}
            sidebarOpen={sidebarOpen}
          >
            طلبات اليوم
          </NavLink>
          <NavLink
            href="/Pharma/sentorder"
            icon={<Send className="w-5 h-5" />}
            sidebarOpen={sidebarOpen}
          >
            عروض الشركات
          </NavLink>
          <NavLink
            href="/Pharma/massgeorder"
            icon={<Send className="w-5 h-5" />}
            sidebarOpen={sidebarOpen}
          >
            طلباتي
          </NavLink>
          <NavLink
            href="/Pharma/invoice"
            icon={<Archive className="w-5 h-5" />}
            sidebarOpen={sidebarOpen}
          >
            الفواتير
          </NavLink>
          <NavLink
            href="/Pharma/attributes"
            icon={<PlusCircle className="w-5 h-5" />}
            sidebarOpen={sidebarOpen}
          >
            الأصناف والبراندات
          </NavLink>
          <NavLink
            href="/Pharma/products"
            icon={<Mail className="w-5 h-5" />}
            sidebarOpen={sidebarOpen}
          >
            المنتجات
          </NavLink>

          {/* قائمة الخصومات */}
          <SidebarDropdown sidebarOpen={sidebarOpen} />

          <NavLink
            href="/Pharma/profile"
            icon={<User className="w-5 h-5" />}
            sidebarOpen={sidebarOpen}
          >
            الملف الشخصي
          </NavLink>
          <NavLink
            href="/Pharma/settings"
            icon={<Settings className="w-5 h-5" />}
            sidebarOpen={sidebarOpen}
          >
            الإعدادات
          </NavLink>
          <NavLink
            href="/auth/login"
            icon={<LogIn className="w-5 h-5" />}
            sidebarOpen={sidebarOpen}
          >
            تسجيل الدخول
          </NavLink>
        </nav>

        {/* الفوتر */}
        <div className="p-4 text-xs text-center text-gray-400 border-t border-gray-700">
          © 2026 PharmaCare
        </div>
      </aside>

      {/* المحتوى */}
      <main className="flex-1 overflow-y-auto flex flex-col bg-gray-950 min-h-screen">
        {/* الهيدر */}
        <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700 shadow-sm sticky top-0 z-10">
          {/* لوجو + زرار القائمة */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md hover:bg-gray-700 md:hidden"
            >
              {sidebarOpen ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
            <Image
              src="/images.png"
              alt="Company Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border border-gray-600"
            />
            <span className="text-lg font-semibold text-white">بسيوني</span>
          </div>

          {/* روابط إضافية في الهيدر */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/Pharma/"
              className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition"
            >
              <Package className="w-5 h-5" />
              <span>تقارير</span>
            </Link>
            <Link
              href="/Pharma/warehouse"
              className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition"
            >
              <Package className="w-5 h-5" />
              <span>المخازن</span>
            </Link>
            <Link
              href="/Pharma/add-pharmacy"
              className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition"
            >
              <Store className="w-5 h-5" />
              <span>إضافة صيدلية</span>
            </Link>
            <Link
              href="/Pharma/add-employee"
              className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition"
            >
              <Users className="w-5 h-5" />
              <span>إضافة موظفين</span>
            </Link>
            <Link
              href="/Pharma/system"
              className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition"
            >
              <Store className="w-5 h-5" />
              <span>النظام </span>
            </Link>
          </nav>

          {/* الإشعارات */}
          <div className="relative">
            <Bell className="w-6 h-6 text-white hover:text-emerald-400 cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </div>
        </header>

        <div className="p-6 flex-1 bg-gray-950 text-white">{children}</div>
      </main>
    </div>
  );
}

/* مكوّن رابط */
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
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center ${sidebarOpen ? "justify-start gap-3 px-4" : "justify-center px-2"
        } py-2 rounded-md transition-all ${isActive ? "bg-emerald-600/20 text-emerald-400" : "bg-white/5 hover:bg-emerald-600/20"
        }`}
    >
      <span>{icon}</span>
      {sidebarOpen && <span>{children}</span>}
    </Link>
  );
}

/* القائمة المنسدلة */
function SidebarDropdown({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center ${sidebarOpen ? "justify-between px-4" : "justify-center px-2"
          } py-2 rounded-xl bg-white/5 hover:bg-emerald-600/20 transition-all text-white border border-gray-700`}
      >
        <div className="flex items-center gap-2">
          <Percent className="w-5 h-5" />
          {sidebarOpen && <span>الخصومات</span>}
        </div>
        {sidebarOpen &&
          (isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
      </button>

      {sidebarOpen && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-gray-800 border border-gray-700 rounded-xl px-2 py-2 space-y-1 mt-2">
            <Link
              href="/Pharma/offers"
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-emerald-600/20 transition text-white"
            >
              <Tag className="w-4 h-4" />
              <span>العروض</span>
            </Link>
            <Link
              href="/Pharma/coupons"
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-emerald-600/20 transition text-white"
            >
              <TicketPercent className="w-4 h-4" />
              <span>الكوبونات</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
