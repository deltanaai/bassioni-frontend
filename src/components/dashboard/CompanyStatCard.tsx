import React from "react";
import {
  FiBarChart2,
  FiShoppingCart,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

interface CompanyStatCardProps {
  title: string;
  value: string;
  change: string;
  icon: "cart" | "users" | "chart";
  gradient: string;
  bgColor: string;
}

const iconMap = {
  cart: FiShoppingCart,
  users: FiUsers,
  chart: FiBarChart2,
};

const textColorMap = {
  "from-blue-600 to-blue-500": "text-blue-100",
  "from-green-600 to-green-500": "text-green-100",
  "from-purple-600 to-purple-500": "text-purple-100",
};

export function CompanyStatCard({
  title,
  value,
  change,
  icon,
  gradient,
  bgColor,
}: CompanyStatCardProps) {
  const Icon = iconMap[icon];
  const textColor =
    textColorMap[gradient as keyof typeof textColorMap] || "text-white";

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`font-medium ${textColor}`}>{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
          <div className="mt-3 flex items-center">
            <span
              className={`flex items-center rounded-full ${bgColor} px-2 py-1 text-xs ${textColor}`}
            >
              <FiTrendingUp className="ml-1" />
              {change}
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-white/20 p-3">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}
