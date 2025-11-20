import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  href: string;
  gradient: string;
  isLoading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  href,
  gradient,
  isLoading = false,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-900/30 p-6 backdrop-blur-xl transition-all hover:scale-105 hover:border-gray-700/50 hover:shadow-xl hover:shadow-emerald-500/10"
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 transition-opacity group-hover:opacity-10`}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center">
        {/* Icon */}
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>

        {/* Value */}
        <h3 className="mb-1 text-3xl font-bold text-white">
          {isLoading ? (
            <span className="inline-block h-9 w-16 animate-pulse rounded bg-gray-700" />
          ) : (
            value
          )}
        </h3>

        {/* Title */}
        <p className="text-sm font-medium text-gray-400">{title}</p>
      </div>

      {/* Hover Effect Border */}
      <div
        className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${gradient} transition-all duration-300 group-hover:w-full`}
      />
    </Link>
  );
}
