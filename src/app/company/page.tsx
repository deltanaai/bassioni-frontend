"use client";
import dynamic from "next/dynamic";
import React from "react";
import { FiTrendingUp, FiUsers } from "react-icons/fi";

import {
  ChartCard,
  CompanyStatCard,
  DashboardHeader,
  RecentOrdersTable,
} from "@/components/dashboard";
import { dashboardStats, recentOrders } from "@/constants/dashboardData";

const OrderTrendChart = dynamic(() => import("./OrderTrendChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-white"></div>
  ),
});

const CustomerGrowthChart = dynamic(() => import("./CustomerGrowthChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-white"></div>
  ),
});

export default function ModernDashboard() {
  return (
    <div className="flex flex-col gap-6 bg-gray-50 p-6 text-black" dir="rtl">
      {/* Header with Search */}
      <DashboardHeader userName="دكتور محمد" />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Trend Chart */}
        <div className="col-span-2">
          <ChartCard
            title="اتجاهات الطلبات"
            subtitle="آخر 30 يومًا"
            icon={FiTrendingUp}
            iconColor="text-blue-500"
            selectOptions={["عرض الجميع", "الطلبات الناجحة", "الطلبات الملغاة"]}
          >
            <div className="h-80">
              <OrderTrendChart />
            </div>
          </ChartCard>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {dashboardStats.map((stat, index) => (
            <CompanyStatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon as "cart" | "users" | "chart"}
              gradient={stat.gradient}
              bgColor={stat.bgColor}
            />
          ))}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Customer Growth */}
        <div className="col-span-2">
          <ChartCard
            title="نمو العملاء"
            subtitle="آخر 12 شهرًا"
            icon={FiUsers}
            iconColor="text-green-500"
            selectOptions={["عرض الجميع", "العملاء الجدد", "العملاء المتكررين"]}
          >
            <div className="h-80">
              <CustomerGrowthChart />
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
}
