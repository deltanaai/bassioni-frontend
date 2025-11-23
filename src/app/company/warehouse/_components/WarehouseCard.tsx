"use client";
import {
  Activity,
  MapPin,
  Package,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

interface WarehouseCardProps {
  warehouse: Warehouse;
}

export default function WarehouseCard({ warehouse }: WarehouseCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 transition-colors group-hover:from-emerald-100 group-hover:to-emerald-200">
            <WarehouseIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {warehouse.name}
            </h3>
            {warehouse.code && (
              <p className="text-sm text-gray-500">#{warehouse.code}</p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {typeof warehouse.active === "boolean" && (
          <Badge
            variant={warehouse.active ? "default" : "destructive"}
            className={
              warehouse.active
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                : "bg-red-100 text-red-700 hover:bg-red-100"
            }
          >
            <Activity className="mr-1 h-3 w-3" />
            {warehouse.active ? "نشط" : "غير نشط"}
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="mb-4 space-y-3">
        {warehouse.location && (
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">الموقع:</span>
            <span className="text-sm font-semibold text-gray-900">
              {warehouse.location}
            </span>
          </div>
        )}

        {warehouse.company?.name && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600">الشركة:</span>
            <span className="text-sm font-semibold text-blue-900">
              {warehouse.company.name}
            </span>
          </div>
        )}
      </div>

      {/* View Details Button */}
      <Link
        href={`/company/warehouse/${warehouse.id}`}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-md"
      >
        عرض التفاصيل
        <WarehouseIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
