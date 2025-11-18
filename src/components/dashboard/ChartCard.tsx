import React from "react";
import { type IconType } from "react-icons";

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: IconType;
  iconColor?: string;
  selectOptions?: string[];
  children: React.ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-500",
  selectOptions = ["عرض الجميع"],
  children,
}: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2
            className={`flex items-center gap-2 text-lg font-semibold text-gray-800`}
          >
            <Icon className={iconColor} />
            <span>{title}</span>
          </h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {selectOptions.length > 0 && (
          <select className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500">
            {selectOptions.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        )}
      </div>
      {children}
    </div>
  );
}
