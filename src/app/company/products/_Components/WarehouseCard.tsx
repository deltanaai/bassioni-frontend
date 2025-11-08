"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React from "react";
import { FiChevronRight } from "react-icons/fi";

import { Batch } from "@/constants/staticProductDataPharma";
import {
  getAllProducts,
  getProductsByWarehouse,
} from "@/lib/actions/company/warehouseProducts.action";
import { formatIsoToArabicDate } from "@/lib/utils";

interface WarehouseCardProps {
  id: number;
  name: string;
  productId: number;
  expandedWarehouses: number[];
  onToggleWarehouse: (index: number) => void;
}

const WarehouseCard = ({
  id,
  name,
  productId,
  expandedWarehouses,
  onToggleWarehouse,
}: WarehouseCardProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["warehouseProductDetails", id, productId],
    queryFn: () =>
      getAllProducts({
        warehouseId: id,
        filters: { id: productId },
      }),
    enabled: !!productId,
  });

  const {
    data: warehouseProductDetails,
    isLoading: isWarehouseProductDetailsLoading,
  } = useQuery({
    queryKey: ["warehouseProductDetailsInfo", id, productId],
    queryFn: () =>
      getProductsByWarehouse({
        warehouseId: id,
        productId,
      }),
    enabled: !!productId,
  });

  const { total_batches: totalBatches, total_stock: totalStock } =
    data?.data?.[0] || {};

    const batchDetails = warehouseProductDetails?.data || [];

  const isExpanded = expandedWarehouses.includes(id);
  return (
    <div
      key={id}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Warehouse Header */}
      <button
        onClick={() => onToggleWarehouse(id)}
        className="flex w-full items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 transition-colors hover:from-gray-100 hover:to-gray-50"
      >
        <div className="flex items-center gap-3">
          <div
            className={`transform transition-transform ${
              isExpanded ? "rotate-90" : "rotate-0"
            }`}
          >
            <FiChevronRight className="h-4 w-4 text-gray-500" />
          </div>
          <h3 className="text-right text-lg font-semibold text-gray-900">
            {name}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{totalBatches || 0} دفعة</span>
          <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
            {totalStock || 0} وحدة
          </span>
        </div>
      </button>

      {/* Warehouse Collapsible Content */}
      {isExpanded && (
        <div className="animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border-l border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    رقم الدفعة
                  </th>
                  <th className="border-l border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    الكمية المتاحة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    تاريخ الانتهاء
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {batchDetails.map((batch) => (
                  <tr
                    key={batch.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="border-l border-gray-200 px-4 py-3 text-gray-900">
                      <div className="flex items-center justify-end gap-2">
                        <span className="mx-auto rounded border border-blue-200 bg-blue-100 px-2 py-1 text-xs text-blue-700">
                          #{batch.batch_number}
                        </span>
                      </div>
                    </td>
                    <td className="border-l border-gray-200 px-4 py-3 text-center">
                      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        {batch.stock } وحدة
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          new Date(batch.expiry_date) < new Date()
                            ? "border border-red-200 bg-red-100 text-red-700"
                            : "border border-orange-200 bg-orange-100 text-orange-700"
                        }`}
                      >
                        {formatIsoToArabicDate(batch.expiry_date)}
                        {new Date(batch.expiry_date) < new Date() && (
                          <span className="mr-1 text-xs">منتهي</span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="my-2 ml-5 flex justify-end">
              {/* <button
                onClick={() => setIsAddBatchOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-emerald-500 hover:to-emerald-400 hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                اضافة دفعة
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseCard;
