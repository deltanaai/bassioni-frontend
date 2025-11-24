"use client";

import { CheckCircle2, XCircle, Package2, Eye } from "lucide-react";

interface AttributeStatsProps {
  total: number;
  active: number;
  inactive: number;
  showHome: number;
}

export default function AttributeStats({
  total,
  active,
  inactive,
  showHome,
}: AttributeStatsProps) {
  const stats = [
    {
      label: "إجمالي العناصر",
      value: total,
      icon: Package2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "نشط",
      value: active,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "غير نشط",
      value: inactive,
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      label: "معروض في الرئيسية",
      value: showHome,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
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
