"use client";
import {
  Activity,
  ArrowRight,
  Building,
  MapPin,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import Link from "next/link";

interface Props {
  warehouse: Warehouse;
}

export default function WarehouseCardClean({ warehouse }: Props) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-gray-900">{warehouse.name}</h2>

      <div className="space-y-3 text-sm text-gray-600">
        {warehouse.code && (
          <div className="flex items-center gap-2">
            <WarehouseIcon className="h-5 w-5 text-emerald-500" />
            <span>كود المخزن:</span>
            <span className="font-semibold text-gray-900">
              {warehouse.code}
            </span>
          </div>
        )}

        {warehouse.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-500" />
            <span>الموقع:</span>
            <span className="font-semibold text-gray-900">
              {warehouse.location}
            </span>
          </div>
        )}

        {typeof warehouse.active === "boolean" && (
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span>حالة النشاط:</span>
            <div
              className={`h-2 w-2 rounded-full ${
                warehouse.active ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span
              className={`font-semibold ${
                warehouse.active ? "text-green-700" : "text-red-700"
              }`}
            >
              {warehouse.active ? "نشط" : "غير نشط"}
            </span>
          </div>
        )}

        {warehouse.company?.name && (
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-emerald-500" />
            <span className="text-sm text-gray-500">الشركة:</span>
            <span className="font-semibold text-gray-900">
              {warehouse.company.name}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 text-left">
        <Link
          href={`/company/warehouse/${warehouse.id}`}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
        >
          المزيد
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
