"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface PharmaHeaderNavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function PharmaHeaderNavLink({
  href,
  icon,
  children,
}: PharmaHeaderNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
        isActive
          ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 font-semibold text-emerald-400 shadow-sm"
          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
      }`}
    >
      <span className={isActive ? "text-emerald-400" : ""}>{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
