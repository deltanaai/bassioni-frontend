"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface PharmaSidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export function PharmaSidebarSection({
  title,
  isCollapsed,
  defaultExpanded = false,
  children,
}: PharmaSidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (isCollapsed) {
    return <div className="space-y-1">{children}</div>;
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:bg-gray-700/30 hover:text-gray-300"
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 pr-2">{children}</div>
      </div>
    </div>
  );
}
