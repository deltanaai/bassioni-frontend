"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface PharmaSidebarNavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isCollapsed: boolean;
}

export function PharmaSidebarNavLink({
  href,
  icon,
  children,
  isCollapsed,
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
      <span className={isActive ? "text-emerald-400" : ""}>{icon}</span>
      {!isCollapsed && <span className="flex-1">{children}</span>}
    </Link>
  );
}
