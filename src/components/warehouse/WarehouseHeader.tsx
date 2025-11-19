"use client";
import { Warehouse } from "lucide-react";

export default function WarehouseHeader() {
  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6">
      <div className="flex items-center gap-3">
        <Warehouse className="h-8 w-8 text-emerald-600" />
        <div>
          <h1 className="text-3xl font-bold text-emerald-600">المخازن</h1>
          <p className="text-gray-600">إدارة وتنظيم مخازن الشركة</p>
        </div>
      </div>
    </div>
  );
}
