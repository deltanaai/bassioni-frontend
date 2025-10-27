"use client";
import { useMutation } from "@tanstack/react-query";
import {
  Home,
  User,
  Settings,
  Bell,
  LogIn,
  ChevronDown,
  ChevronUp,
  Package,
  Users,
  Store,
  Image as ImageIcon,
  Sliders,
  Shield,
  Building,
  Tags,
  MapPin,
  LogOut,
  LocateIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ROUTES, { ROUTES_OWNER } from "@/constants/routes";
import { useGetSession } from "@/hooks/useGetSession";
import { signOut } from "@/lib/actions/company/login.action";
import { queryClient } from "@/lib/queryClient";

const links = [
  { name: "Dashboard", href: ROUTES_OWNER.MAIN_DASHBOARD, Icon: Home },
  { name: "Media", href: "ROUTES.MEDIA", Icon: ImageIcon },
  { name: "Slider", href: "ROUTES.SLIDER", Icon: Sliders },
  { name: "Admins", href: "ROUTES.ADMINS", Icon: Shield },
  { name: "Pharmacist", href: "ROUTES.PHARMACIST", Icon: Users },
  { name: "Auth Admin", href: "ROUTES.AUTH_ADMIN", Icon: Shield },
  { name: "Brands", href: "ROUTES.BRANDS", Icon: Building },
  { name: "Categories", href: " ROUTES.CATEGORIES", Icon: Tags },
  { name: "Branches", href: "ROUTES.BRANCHES", Icon: MapPin },
  { name: "Locations", href: "ROUTES.LOCATIONS", Icon: LocateIcon },
  { name: "الملف الشخصي", href: "ROUTES.PROFILE", Icon: User },
  { name: "الإعدادات", href: "ROUTES.SETTINGS", Icon: Settings },
];

export default function OwnerDashboardLayout({
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

  if (isLoadingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">جارٍ التحقق من الجلسة...</p>
      </div>
    );
  }

  const isLoggedIn = !!session?.token;

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
              <span className="text-gray-800">Owner</span>
              <span className="text-blue-600">Dashboard</span>
            </div>
          ) : (
            <div className="mx-auto">
              <span className="font-bold text-blue-600">OD</span>
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
                {sidebarOpen && <span>{link.name}</span>}
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
          © 2026 Owner Dashboard
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
              alt="Owner Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-gray-300"
            />
            <span className="text-lg font-semibold text-gray-800">
              Owner Panel
            </span>
          </div>

          {/* روابط إضافية في الهيدر */}
          <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
            <HeaderNavLink
              href={ROUTES_OWNER.PRODUCTS}
              icon={<Package className="h-5 w-5" />}
            >
              المنتجات
            </HeaderNavLink>

            <HeaderNavLink
              href={ROUTES_OWNER.PHARMACIES}
              icon={<Store className="h-5 w-5" />}
            >
              الصيدليات
            </HeaderNavLink>

            <HeaderNavLink
              href={ROUTES_OWNER.COMPANIES}
              icon={<Building className="h-5 w-5" />}
            >
              الشركات
            </HeaderNavLink>
          </nav>

          {/* الإشعارات */}
          <div className="relative">
            <Bell className="h-6 w-6 cursor-pointer text-gray-700 hover:text-blue-600" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </div>
        </header>

        <div className="flex-1 bg-gray-50 p-6">{children}</div>
      </main>
    </div>
  );
}

//active link in nav
function HeaderNavLink({
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
      className={`flex items-center justify-start gap-2 px-3 py-2 rounded-md transition-all ${
        isActive
          ? " font-semibold text-blue-700"
          : "text-gray-700  hover:text-blue-600"
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
          ? "bg-blue-100 font-semibold text-blue-700"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      <span>{icon}</span>
      {sidebarOpen && <span>{children}</span>}
    </Link>
  );
}
