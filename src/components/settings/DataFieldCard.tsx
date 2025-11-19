import { LucideIcon } from "lucide-react";

interface DataFieldCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconBgColor: string;
  iconColor: string;
  hoverBgColor: string;
  hoverBorderColor: string;
}

export default function DataFieldCard({
  icon: Icon,
  label,
  value,
  iconBgColor,
  iconColor,
  hoverBgColor,
  hoverBorderColor,
}: DataFieldCardProps) {
  return (
    <div
      className={`group rounded-xl border border-gray-200 bg-gradient-to-br ${hoverBgColor} hover:border- to-white p-4 transition-all${hoverBorderColor} hover:shadow-md`}
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          className={`rounded-lg ${iconBgColor} group-hover: p-2 transition-colors${iconBgColor.replace(
            "100",
            "200"
          )}`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <label className="text-sm font-medium text-gray-600">{label}</label>
      </div>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
