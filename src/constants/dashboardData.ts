export interface Order {
  id: number;
  customer: string;
  items: string[];
  amount: number;
  status: string;
  date: string;
}

export const statusStyles = {
  مكتمل: "bg-green-100 text-green-800",
  "قيد التحضير": "bg-blue-100 text-blue-800",
  ملغي: "bg-red-100 text-red-800",
  "جاهز للتسليم": "bg-amber-100 text-amber-800",
} as const;

export const recentOrders: Order[] = [
  {
    id: 10258,
    customer: "أحمد محمد",
    items: ["باراسيتامول", "فيتامين سي"],
    amount: 85,
    status: "مكتمل",
    date: "اليوم - 10:45 ص",
  },
  {
    id: 10257,
    customer: "سارة عبدالله",
    items: ["أوميبرازول", "كلورفينيرامين"],
    amount: 120,
    status: "قيد التحضير",
    date: "اليوم - 09:30 ص",
  },
  {
    id: 10256,
    customer: "خالد علي",
    items: ["أموكسيسيلين", "إيبوبروفين"],
    amount: 65,
    status: "ملغي",
    date: "أمس - 03:15 م",
  },
  {
    id: 10255,
    customer: "نورا سعد",
    items: ["فيتامين د3", "كالسيوم"],
    amount: 95,
    status: "مكتمل",
    date: "أمس - 11:20 ص",
  },
  {
    id: 10254,
    customer: "يوسف أحمد",
    items: ["باراسيتامول", "كيتوبروفين"],
    amount: 45,
    status: "جاهز للتسليم",
    date: "٢ يونيو - 04:30 م",
  },
];

export interface StatCardData {
  title: string;
  value: string;
  change: string;
  icon: string;
  gradient: string;
  bgColor: string;
}

export const dashboardStats: StatCardData[] = [
  {
    title: "إجمالي الطلبات",
    value: "1,248",
    change: "12% عن الشهر الماضي",
    icon: "cart",
    gradient: "from-blue-600 to-blue-500",
    bgColor: "bg-blue-700",
  },
  {
    title: "العملاء الجدد",
    value: "85",
    change: "8% عن الشهر الماضي",
    icon: "users",
    gradient: "from-green-600 to-green-500",
    bgColor: "bg-green-700",
  },
  {
    title: "إجمالي المبيعات",
    value: "42,850 ر.س",
    change: "15% عن الشهر الماضي",
    icon: "chart",
    gradient: "from-purple-600 to-purple-500",
    bgColor: "bg-purple-700",
  },
];
