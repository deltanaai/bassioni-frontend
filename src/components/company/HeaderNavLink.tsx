"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface HeaderNavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function HeaderNavLink({ href, icon, children }: HeaderNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center justify-start gap-2 rounded-md px-3 py-2 transition-all ${
        isActive
          ? "font-semibold text-emerald-700"
          : "text-gray-700 hover:text-emerald-600"
      }`}
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
