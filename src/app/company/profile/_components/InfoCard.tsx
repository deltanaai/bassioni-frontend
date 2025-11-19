import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

export default function InfoCard({
  title,
  icon: Icon,
  children,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Icon className="h-4 w-4 text-emerald-600" />
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
