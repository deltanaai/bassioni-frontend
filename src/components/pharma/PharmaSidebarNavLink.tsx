"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Badge } from "@/components/ui/badge";

interface PharmaSidebarNavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isCollapsed: boolean;
  badge?: number;
}

export function PharmaSidebarNavLink({
  href,
  icon,
  children,
  isCollapsed,
  badge,
}: PharmaSidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
        isCollapsed ? "justify-center" : "justify-start"
      } ${
        isActive
          ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 shadow-md shadow-emerald-500/10"
          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
      }`}
    >
      <span className={`relative ${isActive ? "text-emerald-400" : ""}`}>
        {icon}
        {badge !== undefined && badge > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 min-w-[1.25rem] rounded-full bg-emerald-600 px-1 text-[10px] font-bold">
            {badge}
          </Badge>
        )}
      </span>
      {!isCollapsed && <span className="flex-1">{children}</span>}
      {!isCollapsed && badge !== undefined && badge > 0 && (
        <Badge className="bg-emerald-600 px-2 text-xs font-bold">{badge}</Badge>
      )}
    </Link>
  );
}
