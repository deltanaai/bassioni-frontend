"use client";

import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import React, { useState } from "react";

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  defaultExpanded?: boolean;
  showAddButton?: boolean;
  onAdd?: () => void;
  children: React.ReactNode;
}

export function SidebarSection({
  title,
  isCollapsed,
  defaultExpanded = true,
  showAddButton = false,
  onAdd,
  children,
}: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (isCollapsed) {
    return <div className="space-y-1">{children}</div>;
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2  font-medium text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3 rotate-180" />
          )}
          <span>{title}</span>
        </button>
        {showAddButton && (
          <button
            onClick={onAdd}
            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      {isExpanded && <div className="space-y-1">{children}</div>}
    </div>
  );
}
