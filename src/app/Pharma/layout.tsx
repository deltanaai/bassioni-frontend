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
import { ROUTES_OWNER, ROUTES_PHARMA } from "@/constants/routes";
import { useGetSession } from "@/hooks/useGetSession";
import { signOut } from "@/lib/actions/company/login.action";
import { queryClient } from "@/lib/queryClient";

const links = [
  { name: "الصفحة الرئيسية", href: ROUTES_PHARMA.DASHBOARD, Icon: Home },
  { name: "طلبات اليوم", href: ROUTES_PHARMA.DAY_ORDERS, Icon: ClipboardList },
  { name: "عروض الشركات", href: ROUTES_PHARMA.SENT_ORDERS, Icon: Send },
  { name: "طلباتي", href: ROUTES_PHARMA.MY_ORDERS, Icon: Send },
  { name: "الفواتير", href: ROUTES_PHARMA.INVOICE, Icon: Archive },
  {
    name: "الأصناف والبراندات",
    href: ROUTES_PHARMA.ATTRIBUTES,
    Icon: PlusCircle,
  },
  { name: "المنتجات", href: ROUTES_PHARMA.PRODUCTS, Icon: Mail },
  { name: "الرواكد", href: ROUTES_PHARMA.STAGNANT_GOODS, Icon: Package },
  { name: "الخصومات", href: ROUTES_PHARMA.DISCOUNT, Icon: Percent },
  { name: "سلة المحذوفات", href: ROUTES_PHARMA.TRASH, Icon: Trash2 },
  { name: "الملف الشخصي", href: ROUTES_PHARMA.PROFILE, Icon: User },
  { name: "الإعدادات", href: ROUTES_PHARMA.SETTINGS, Icon: Settings },
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
    mutationFn: signOut, // TODO : change to pharma signOut action when available
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
    ? { name: "تسجيل الخروج", href: "", Icon: LogOut }
    : { name: "تسجيل الدخول", href: "/auth/login", Icon: LogIn };

  const sideLinks = [...links, authLinks];

  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <div className="flex  min-h-screen text-white" dir="rtl">
      {/* القائمة الجانبية */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } sticky top-0 flex h-screen flex-col bg-gradient-to-b from-gray-800 to-gray-900 transition-all duration-300 ease-in-out`}
      >
        {/* اللوجو */}
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          {sidebarOpen ? (
            <div className="text-center text-2xl font-bold tracking-wide">
              <span className="text-white">Pharma</span>
              <span className="text-emerald-400">bassiony</span>
            </div>
          ) : (
            <div className="mx-auto">
              <span className="font-bold text-emerald-400">PC</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-1 hover:bg-gray-700"
          >
            {sidebarOpen ? (
              <ChevronDown className="h-5 w-5 rotate-90 transform" />
            ) : (
              <ChevronUp className="h-5 w-5 rotate-90 transform" />
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
            ) : link.href === ROUTES_PHARMA.DISCOUNT ? (
              <SidebarDropdown sidebarOpen={sidebarOpen} key={link.name} />
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
          {/* <NavLink
            href="/Pharma"
            icon={<Home className="w-5 h-5" />}
            sidebarOpen={sidebarOpen}
          >
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
          {/* <SidebarDropdown sidebarOpen={sidebarOpen} />

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
          </NavLink> */}
        </nav>

        {/* الفوتر */}
        <div className="border-t border-gray-700 p-4 text-center text-xs text-gray-400">
          © 2026 PharmaCare
        </div>
      </aside>

      {/* المحتوى */}
      <main className="flex min-h-screen flex-1 flex-col overflow-y-auto bg-gray-950">
        {/* الهيدر */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-gray-900 px-6 py-4 shadow-sm">
          {/* لوجو + زرار القائمة */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-md p-1 hover:bg-gray-700 md:hidden"
            >
              {sidebarOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </button>
            <Image
              src="/images.png"
              alt="Company Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-gray-600"
            />
            <span className="text-lg font-semibold text-white">بسيوني</span>
          </div>

          {/* روابط إضافية في الهيدر */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="/Pharma/"
              className="flex items-center gap-2 text-gray-300 transition hover:text-emerald-400"
            >
              <Package className="h-5 w-5" />
              <span>تقارير</span>
            </Link>
            <Link
              href="/Pharma/warehouse"
              className="flex items-center gap-2 text-gray-300 transition hover:text-emerald-400"
            >
              <Package className="h-5 w-5" />
              <span>المخازن</span>
            </Link>
            <Link
              href="/Pharma/add-pharmacy"
              className="flex items-center gap-2 text-gray-300 transition hover:text-emerald-400"
            >
              <Store className="h-5 w-5" />
              <span>إضافة صيدلية</span>
            </Link>
            <Link
              href="/Pharma/add-employee"
              className="flex items-center gap-2 text-gray-300 transition hover:text-emerald-400"
            >
              <Users className="h-5 w-5" />
              <span>إضافة موظفين</span>
            </Link>
            <Link
              href="/Pharma/system"
              className="flex items-center gap-2 text-gray-300 transition hover:text-emerald-400"
            >
              <Store className="h-5 w-5" />
              <span>النظام </span>
            </Link>
          </nav>

          {/* الإشعارات */}
          <div className="relative">
            <Bell className="h-6 w-6 cursor-pointer text-white hover:text-emerald-400" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </div>
        </header>

        <div className="flex-1 bg-gray-950 p-6 text-white">{children}</div>
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
      className={`flex items-center ${
        sidebarOpen ? "justify-start gap-3 px-4" : "justify-center px-2"
      } rounded-md py-2 transition-all ${
        isActive
          ? "bg-emerald-600/20 text-emerald-400"
          : "bg-white/5 hover:bg-emerald-600/20"
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
        } rounded-xl border border-gray-700 bg-white/5 py-2 text-white transition-all hover:bg-emerald-600/20`}
      >
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5" />
          {sidebarOpen && <span>الخصومات</span>}
        </div>
        {sidebarOpen &&
          (isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          ))}
      </button>

      {sidebarOpen && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 space-y-1 rounded-xl border border-gray-700 bg-gray-800 px-2 py-2">
            <Link
              href={ROUTES_PHARMA.OFFERS}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-white transition hover:bg-emerald-600/20"
            >
              <Tag className="h-4 w-4" />
              <span>العروض</span>
            </Link>
            <Link
              href={ROUTES_PHARMA.COUPONS}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-white transition hover:bg-emerald-600/20"
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
