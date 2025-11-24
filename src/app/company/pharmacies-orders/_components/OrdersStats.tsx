"use client";

import { Package, ShoppingCart, CheckCircle, XCircle } from "lucide-react";

interface OrdersStatsProps {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
}

export default function OrdersStats({
  total,
  pending,
  completed,
  cancelled,
}: OrdersStatsProps) {
  const stats = [
    {
      label: "إجمالي الطلبات",
      value: total,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "قيد الانتظار",
      value: pending,
      icon: Package,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      label: "مكتمل",
      value: completed,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "ملغي",
      value: cancelled,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className={`rounded-lg ${stat.bgColor} p-3`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
