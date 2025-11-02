"use client";
import { useMutation } from "@tanstack/react-query";
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
  Trash2,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ROUTES, { ROUTES_COMPANY, ROUTES_OWNER } from "@/constants/routes";
import { useGetSession } from "@/hooks/useGetSession";
import { signOut } from "@/lib/actions/company/login.action";
import logger from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";

const links = [
  { name: "الصفحة الرئيسية", href: ROUTES_COMPANY.DASHBOARD, Icon: Home },
  { name: "طلبات الصيدليات", href: ROUTES_COMPANY.DAY_ORDERS, Icon: ClipboardList },
  { name: "عروض الشركات", href: ROUTES_COMPANY.SENT_ORDERS, Icon: Send },
  {
    name: "طلبات الشركة من الصيدليات",
    href: ROUTES_COMPANY.MY_ORDERS,
    Icon: Send,
  },
  { name: "الفواتير", href: ROUTES_COMPANY.INVOICE, Icon: Archive },
  {
    name: "الفئات والبراندات",
    href: ROUTES_COMPANY.ATTRIBUTES,
    Icon: PlusCircle,
  },
  { name: "المنتجات", href: ROUTES_COMPANY.PRODUCTS, Icon: Mail },
  { name: "سلة المحذوفات", href: ROUTES_COMPANY.TRASH, Icon: Trash2 },
  { name: "الملف الشخصي", href: ROUTES_COMPANY.PROFILE, Icon: User },
  { name: "الإعدادات", href: ROUTES_COMPANY.SETTINGS, Icon: Settings },
  // { name: "تسجيل الدخول", href: "/auth/login", Icon: LogIn },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const { session, isLoadingSession } = useGetSession();

  const mutation = useMutation({
    mutationFn: signOut,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message || "حدث خطأ أثناء تسجيل الخروج");
        return;
      }
      toast.success("تم تسجيل الخروج بنجاح");

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push(ROUTES_OWNER.LOGIN);
    },
  });

  // ✅ Redirect after mount, only when session is loaded
  // useEffect(() => {
  //   if (!isLoadingSession && !isLoggedIn) {
  //     router.push(ROUTES.LOGIN);
  //   }
  // }, [isLoadingSession, isLoggedIn, router]);

  if (isLoadingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">جارٍ التحقق من الجلسة...</p>
      </div>
    );
  }

  const isLoggedIn = !!session?.token;
  // if (!isLoggedIn) {
  //   router.push(ROUTES.LOGIN);
  // }
  // logger.info(`User Token: ${isLoggedIn ? session.token : "Not logged in"}`);

  const authLinks = isLoggedIn
    ? { name: "تسجيل الخروج", href: "#", Icon: LogOut }
    : { name: "تسجيل الدخول", href: "/auth/login", Icon: LogIn };

  const sideLinks = [...links, authLinks];

  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800" dir="rtl">
      {/* القائمة الجانبية */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } sticky top-0 flex h-screen flex-col border-r border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out`}
      >
        {/* اللوجو */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          {sidebarOpen ? (
            <div className="text-center text-2xl font-bold tracking-wide">
              <span className="text-gray-800">company</span>
              <span className="text-emerald-600">bassiony</span>
            </div>
          ) : (
            <div className="mx-auto">
              <span className="font-bold text-emerald-600">PC</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <ChevronDown className="h-5 w-5 rotate-90 transform text-gray-600" />
            ) : (
              <ChevronUp className="h-5 w-5 rotate-90 transform text-gray-600" />
            )}
          </button>
        </div>
        {/* الروابط */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4 text-sm">
          {sideLinks.map((link) =>
            link.name === "تسجيل الخروج" ? (
              <Button
                key={link.name}
                onClick={handleSignOut}
                variant="ghost"
                className="flex w-full cursor-pointer items-center justify-start gap-2 px-4 py-2 text-right text-red-600 transition hover:bg-red-50 hover:text-red-700 hover:shadow-md"
              >
                <link.Icon className="h-5 w-5" />
                {link.name}
              </Button>
            ) : (
              <NavLink
                href={link.href}
                key={link.name}
                icon={<link.Icon className="h-5 w-5" />}
                sidebarOpen={sidebarOpen}
              >
                {link.name}
              </NavLink>
            )
          )}
        </nav>
        {/* الفوتر */}
        <div className="border-t border-gray-200 p-4 text-center text-xs text-gray-400">
          © 2026 PharmaCare
        </div>
      </aside>

      {/* المحتوى */}
      <main className="flex min-h-screen flex-1 flex-col overflow-y-auto bg-gray-50">
        {/* الهيدر */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          {/* لوجو + زرار القائمة */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-md p-1 hover:bg-gray-100 md:hidden"
            >
              {sidebarOpen ? (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <Image
              src="/images.png"
              alt="Company Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-gray-300"
            />
            <span className="text-lg font-semibold text-gray-800">بسيوني</span>
          </div>

          {/* روابط إضافية في الهيدر */}
          <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
            <CompanyHeaderNavLink
              href="/company/"
              icon={<Package className="h-5 w-5" />}
            >
              تقارير
            </CompanyHeaderNavLink>

            <CompanyHeaderNavLink
              href={ROUTES_COMPANY.WAREHOUSES}
              icon={<Package className="h-5 w-5" />}
            >
              المخازن
            </CompanyHeaderNavLink>

            <CompanyHeaderNavLink
              href={ROUTES_COMPANY.ADD_PHARMACY}
              icon={<Store className="h-5 w-5" />}
            >
              الصيدليات
            </CompanyHeaderNavLink>

            <CompanyHeaderNavLink
              href={ROUTES_COMPANY.ADD_EMPLOYEE}
              icon={<Users className="h-5 w-5" />}
            >
              الموظفين
            </CompanyHeaderNavLink>

            <CompanyHeaderNavLink
              href={ROUTES_COMPANY.SYSTEM}
              icon={<Store className="h-5 w-5" />}
            >
              النظام
            </CompanyHeaderNavLink>
          </nav>

          {/* الإشعارات */}
          <div className="relative">
            <Bell className="h-6 w-6 cursor-pointer text-gray-700 hover:text-emerald-600" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </div>
        </header>

        <div className="flex-1 bg-gray-50 p-6">{children}</div>
      </main>
    </div>
  );
}

// active link in nav
function CompanyHeaderNavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center justify-start gap-2 rounded-md px-3 py-2 transition-all ${
        isActive
          ? " font-semibold text-emerald-700"
          : "text-gray-700  hover:text-emerald-600"
      }`}
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  );
}

/* مكوّن الرابط */
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
      className={`flex items-center ${
        sidebarOpen ? "justify-start gap-3 px-4" : "justify-center px-2"
      } rounded-md py-2 transition-all ${
        isActive
          ? "bg-emerald-100 font-semibold text-emerald-700"
          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
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
        className={`flex w-full items-center ${
          sidebarOpen ? "justify-between px-4" : "justify-center px-2"
        } rounded-md border border-gray-200 bg-white py-2 text-gray-700 transition hover:bg-emerald-50`}
      >
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-gray-600" />
          {sidebarOpen && <span>الخصومات</span>}
        </div>
        {sidebarOpen &&
          (isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ))}
      </button>

      {sidebarOpen && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 space-y-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-2">
            <Link
              href="/company/offers"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-600"
            >
              <Tag className="h-4 w-4" />
              <span>العروض</span>
            </Link>
            <Link
              href="/company/coupons"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-600"
            >
              <TicketPercent className="h-4 w-4" />
              <span>الكوبونات</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
