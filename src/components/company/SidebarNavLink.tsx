"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarNavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isCollapsed: boolean;
}

export function SidebarNavLink({
  href,
  icon,
  children,
  isCollapsed,
}: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center ${
        isCollapsed ? "justify-center px-2" : "justify-start gap-3 px-4"
      } rounded-md py-2 transition-all ${
        isActive
          ? "bg-emerald-100 font-semibold text-emerald-700"
          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
      }`}
    >
      <span>{icon}</span>
      {!isCollapsed && <span>{children}</span>}
    </Link>
  );
}
