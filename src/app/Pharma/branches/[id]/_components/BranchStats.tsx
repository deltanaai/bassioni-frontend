"use client";

import { Building2, MapPin, Package, Users } from "lucide-react";

interface BranchStatsProps {
  branch: Branch;
}

export default function BranchStats({ branch }: BranchStatsProps) {
  const statCards = [
    {
      title: "اسم الفرع",
      value: branch.name,
      icon: Building2,
      gradient: "from-emerald-500/20 to-emerald-600/20",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-800/30",
    },
    {
      title: "الموقع",
      value: branch.address,
      icon: MapPin,
      gradient: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-800/30",
    },
    {
      title: "الصيدلية الرئيسية",
      value: branch.pharmacy?.name || "غير محدد",
      icon: Package,
      gradient: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-800/30",
    },
    {
      title: "رقم التعريف",
      value: `#${branch.id}`,
      icon: Users,
      gradient: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-400",
      borderColor: "border-orange-800/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`rounded-2xl border ${stat.borderColor} bg-gray-900/30 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  {stat.title}
                </p>
                <p className="mt-2 text-xl font-bold text-white">
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
