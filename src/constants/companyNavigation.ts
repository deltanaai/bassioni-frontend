import {
  Home,
  User,
  Settings,
  ClipboardList,
  Send,
  Archive,
  PlusCircle,
  Mail,
  Percent,
  Package,
  Users,
  Store,
  Tag,
  Shield,
  type LucideIcon,
} from "lucide-react";

import { ROUTES_COMPANY } from "./routes";

export interface NavLink {
  name: string;
  href: string;
  Icon: LucideIcon;
}

export const companyMainLinks: NavLink[] = [
  { name: "الصفحة الرئيسية", href: ROUTES_COMPANY.DASHBOARD, Icon: Home },
  { name: "المنتجات", href: ROUTES_COMPANY.PRODUCTS, Icon: Mail },
  {
    name: "طلبات الصيدليات",
    href: ROUTES_COMPANY.PHARMACIES_ORDERS,
    Icon: ClipboardList,
  },
  { name: "عروض الصيدليات", href: ROUTES_COMPANY.SENT_ORDERS, Icon: Tag },
  {
    name: "طلبات الشركة من الصيدليات",
    href: ROUTES_COMPANY.MY_ORDERS,
    Icon: Send,
  },
];

export const companyFavoriteLinks: NavLink[] = [
  { name: "عروضي", href: ROUTES_COMPANY.OFFERS, Icon: Percent },
  { name: "الفواتير", href: ROUTES_COMPANY.INVOICE, Icon: Archive },
  {
    name: "الفئات والبراندات",
    href: ROUTES_COMPANY.ATTRIBUTES,
    Icon: PlusCircle,
  },
];

export const companyInvoicesLinks: NavLink[] = [
  { name: "فواتير البيع", href: ROUTES_COMPANY.SELL_INVOICES, Icon: Archive },
  {
    name: "فواتير الشراء ",
    href: ROUTES_COMPANY.BUY_INVOICES,
    Icon: Archive,
  },
];

export const companySettingsLinks: NavLink[] = [
  { name: "الملف الشخصي", href: ROUTES_COMPANY.PROFILE, Icon: User },
  { name: "الإعدادات", href: ROUTES_COMPANY.SETTINGS, Icon: Settings },
  {
    name: "التواصل مع الادارة",
    href: ROUTES_COMPANY.ADMINISTRATION,
    Icon: Shield,
  },
];

export const companyHeaderLinks: NavLink[] = [
  // { name: "تقارير", href: "/company/", Icon: Package },
  { name: "المخازن", href: ROUTES_COMPANY.WAREHOUSES, Icon: Package },
  { name: "الموظفين", href: ROUTES_COMPANY.ADD_EMPLOYEE, Icon: Users },
  { name: "النظام", href: ROUTES_COMPANY.SYSTEM, Icon: Store },
];
