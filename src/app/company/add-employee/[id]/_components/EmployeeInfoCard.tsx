"use client";
import { LucideIcon } from "lucide-react";

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor?: string;
}

function InfoItem({
  icon: Icon,
  label,
  value,
  iconColor = "text-emerald-500",
}: InfoItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
      <Icon className={`h-4 w-4 ${iconColor}`} />
      <div className="flex-1">
        <p className="text-xs text-gray-600">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

interface EmployeeInfoCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  items: InfoItemProps[];
}

export default function EmployeeInfoCard({
  title,
  description,
  icon: Icon,
  iconBgColor,
  iconColor,
  items,
}: EmployeeInfoCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColor}`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <InfoItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
