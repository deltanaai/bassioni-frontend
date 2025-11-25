"use client";

import { Check, Clock, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          label: "قيد الانتظار",
          className: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50",
        };
      case "approved":
        return {
          icon: Check,
          label: "مقبول",
          className: "bg-blue-900/50 text-blue-300 border-blue-700/50",
        };
      case "rejected":
        return {
          icon: X,
          label: "مرفوض",
          className: "bg-red-900/50 text-red-300 border-red-700/50",
        };
      case "completed":
        return {
          icon: Check,
          label: "مكتمل",
          className: "bg-emerald-900/50 text-emerald-300 border-emerald-700/50",
        };
      case "canceled":
        return {
          icon: X,
          label: "ملغي",
          className: "bg-gray-700/50 text-gray-300 border-gray-600/50",
        };
      default:
        return {
          icon: Clock,
          label: status,
          className: "bg-gray-700/50 text-gray-300 border-gray-600/50",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 px-3 py-1 ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{config.label}</span>
    </Badge>
  );
}
