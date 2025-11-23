"use client";
import { AlertTriangle, Archive, Package, ShoppingCart } from "lucide-react";
import { useMemo } from "react";

interface WarehouseStatsProps {
  products: WarehouseProduct[];
}

export default function WarehouseStats({ products }: WarehouseStatsProps) {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.available_stock, 0);
    const totalReserved = products.reduce(
      (sum, p) => sum + p.reserved_stock,
      0
    );

    // Count expiring products (within 30 days)
    const today = new Date();
    const expiringProducts = products.filter((p) => {
      const expiry = new Date(p.expiry_date);
      const daysUntilExpiry = Math.ceil(
        (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    }).length;

    return {
      totalProducts,
      totalStock,
      totalReserved,
      expiringProducts,
    };
  }, [products]);

  const statCards = [
    {
      title: "إجمالي المنتجات",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      gradient: "from-emerald-50 to-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
    {
      title: "الكمية المتوفرة",
      value: stats.totalStock.toLocaleString(),
      icon: Archive,
      gradient: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "الكمية المحجوزة",
      value: stats.totalReserved.toLocaleString(),
      icon: ShoppingCart,
      gradient: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      title: "قريب الانتهاء",
      value: stats.expiringProducts.toLocaleString(),
      icon: AlertTriangle,
      gradient: "from-red-50 to-red-100",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`rounded-2xl border ${stat.borderColor} bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient}`}
              >
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
