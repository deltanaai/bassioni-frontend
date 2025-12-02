import {
  Archive,
  ClipboardList,
  Home,
  Mail,
  Package,
  PlusCircle,
  Send,
  Settings,
  ShoppingBasket,
  Store,
  Tag,
  TicketPercent,
  Trash2,
  TrendingDown,
  User,
  Users,
} from "lucide-react";

import { ROUTES_PHARMA } from "./routes";

export const pharmaMainLinks = [
  { name: "الصفحة الرئيسية", href: ROUTES_PHARMA.DASHBOARD, Icon: Home },
  {
    name: "منتجات الشركات",
    href: ROUTES_PHARMA.COMPANIESPRODUCTS,
    Icon: Package,
  },
  { name: "طلبات اليوم", href: ROUTES_PHARMA.DAY_ORDERS, Icon: ClipboardList },
  { name: "السلة", href: ROUTES_PHARMA.CART, Icon: ShoppingBasket },
];

export const pharmaInvoicesLinks = [
  { name: "فواتير البيع", href: ROUTES_PHARMA.SELL_INVOICES, Icon: Archive },
  { name: "فواتير الشراء", href: ROUTES_PHARMA.BUY_INVOICES, Icon: Archive },
];

export const pharmaOrderLinks = [
  { name: "طلباتي", href: ROUTES_PHARMA.MY_ORDERS, Icon: Send },
  { name: "الفواتير", href: ROUTES_PHARMA.INVOICE, Icon: Archive },
];

export const pharmaProductLinks = [
  { name: "المنتجات", href: ROUTES_PHARMA.PRODUCTS, Icon: Mail },
  { name: "الرواكد", href: ROUTES_PHARMA.STAGNANT_GOODS, Icon: TrendingDown },
  {
    name: "الفئات والبراندات",
    href: ROUTES_PHARMA.ATTRIBUTES,
    Icon: PlusCircle,
  },
];

export const pharmaDiscountLinks = [
  { name: "العروض", href: ROUTES_PHARMA.OFFERS, Icon: Tag },
  { name: "الكوبونات", href: ROUTES_PHARMA.COUPONS, Icon: TicketPercent },
];

export const pharmaSettingsLinks = [
  { name: "الملف الشخصي", href: ROUTES_PHARMA.PROFILE, Icon: User },
  { name: "الإعدادات", href: ROUTES_PHARMA.SETTINGS, Icon: Settings },
  { name: "سلة المحذوفات", href: ROUTES_PHARMA.TRASH, Icon: Trash2 },
];

export const pharmaHeaderLinks = [
  { name: "الشركات", href: ROUTES_PHARMA.COMPANIES, Icon: Package },
  { name: "الفروع", href: ROUTES_PHARMA.BRANCHES, Icon: Store },
  { name: "الموظفين", href: ROUTES_PHARMA.ADD_EMPLOYEE, Icon: Users },
  { name: "النظام", href: ROUTES_PHARMA.SYSTEM, Icon: Settings },
];
