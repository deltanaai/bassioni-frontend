"use client";
import { Warehouse } from "lucide-react";

import WarehouseCard from "./WarehouseCard";

interface WarehousesGridProps {
  warehouses: Warehouse[];
}

export default function WarehousesGrid({ warehouses }: WarehousesGridProps) {
  if (!Array.isArray(warehouses) || warehouses.length === 0) {
    return (
      <div className="col-span-full flex items-center justify-center py-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
            <Warehouse className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-700">
            لا توجد مخازن
          </h2>
          <p className="text-gray-500">
            لم يتم العثور على مخازن مطابقة للبحث أو الفلاتر المحددة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {warehouses.map((warehouse: Warehouse) => (
        <WarehouseCard key={warehouse.id} warehouse={warehouse} />
      ))}
    </div>
  );
}
