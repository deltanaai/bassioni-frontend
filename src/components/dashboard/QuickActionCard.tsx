import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
}

export default function QuickActionCard({
  title,
  href,
  icon: Icon,
  gradient,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-gray-800/50 bg-gray-900/30 p-4 backdrop-blur-xl transition-all hover:scale-105 hover:border-gray-700/50 hover:shadow-lg"
    >
      {/* Background Gradient on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity group-hover:opacity-5`}
      />

      <div className="relative flex items-center gap-3">
        {/* Icon */}
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        {/* Title */}
        <span className="font-medium text-gray-200 transition-colors group-hover:text-white">
          {title}
        </span>
      </div>

      {/* Bottom Border Effect */}
      <div
        className={`absolute bottom-0 right-0 h-0.5 w-0 bg-gradient-to-r ${gradient} transition-all duration-300 group-hover:w-full`}
      />
    </Link>
  );
}
