import { LucideIcon } from "lucide-react";

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconBgColor?: string;
  iconColor?: string;
}

export default function InfoItem({
  icon: Icon,
  label,
  value,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
}: InfoItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBgColor}`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
