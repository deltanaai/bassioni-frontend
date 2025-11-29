"use client";

import { Calendar, Mail, MapPin, Phone, Shield } from "lucide-react";

interface PersonalInfoCardProps {
  user: SessionUser;
}

export default function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  const infoItems = [
    {
      icon: Mail,
      label: "البريد الإلكتروني",
      value: user.email,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-900/30",
    },
    {
      icon: Phone,
      label: "رقم الهاتف",
      value: user.phone || "غير متوفر",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-900/30",
    },
    {
      icon: MapPin,
      label: "العنوان",
      value: user.address || "غير متوفر",
      iconColor: "text-purple-400",
      iconBg: "bg-purple-900/30",
    },
    {
      icon: Shield,
      label: "الدور الوظيفي",
      value: user.role,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-900/30",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-800 shadow-lg">
      <div className="border-b border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white">المعلومات الشخصية</h2>
        <p className="text-sm text-gray-400">البيانات الأساسية للحساب</p>
      </div>

      <div className="space-y-4 p-6">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="bg-gray-750 flex items-center gap-4 rounded-xl border border-gray-700 p-4 transition-colors hover:border-gray-600"
          >
            <div className={`rounded-lg ${item.iconBg} p-3`}>
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="font-medium text-white">{item.value}</p>
            </div>
          </div>
        ))}

        <div className="bg-gray-750 flex items-center gap-4 rounded-xl border border-gray-700 p-4">
          <div className="rounded-lg bg-gray-700/50 p-3">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400">تاريخ الإنشاء</p>
            <p className="font-medium text-white">
              {(() => {
                try {
                  const date = new Date(user.createdAt);
                  return isNaN(date.getTime())
                    ? "غير متوفر"
                    : date.toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                } catch {
                  return "غير متوفر";
                }
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
