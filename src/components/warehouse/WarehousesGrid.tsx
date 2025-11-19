"use client";
import WarehouseCard from "./WarehouseCardClean";

interface Props {
  warehouses: Warehouse[];
}

export default function WarehousesGrid({ warehouses }: Props) {
  if (!Array.isArray(warehouses) || warehouses.length === 0) {
    return (
      <div className="col-span-full flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 h-20 w-20 text-gray-400" />
          <h2 className="mb-3 text-2xl font-bold text-gray-600">
            لا توجد مخازن
          </h2>
          <p className="mb-6 text-lg text-gray-500">ابدأ بإضافة مخزنك الأول</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {warehouses.map((w: Warehouse) => (
        <WarehouseCard key={w.id} warehouse={w} />
      ))}
    </div>
  );
}
