"use client";
import { Activity, Building2, Shield, Users } from "lucide-react";
import { useMemo } from "react";

interface EmployeeStatsProps {
  employees: Employee[];
}

export default function EmployeeStats({ employees }: EmployeeStatsProps) {
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.active).length;
    const inactiveEmployees = employees.filter((e) => !e.active).length;
    const employeesWithWarehouse = employees.filter(
      (e) => e.warehouse_id
    ).length;

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      employeesWithWarehouse,
    };
  }, [employees]);

  const statCards = [
    {
      title: "إجمالي الموظفين",
      value: stats.totalEmployees,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "الموظفون النشطون",
      value: stats.activeEmployees,
      icon: Activity,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "غير النشطين",
      value: stats.inactiveEmployees,
      icon: Shield,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "مع مستودع",
      value: stats.employeesWithWarehouse,
      icon: Building2,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.bgGradient} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className={`h-7 w-7 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
