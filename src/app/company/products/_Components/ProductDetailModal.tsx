"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  ChevronDown,
  Lock,
  Package,
  Warehouse,
  X,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { indexCompanyProducts } from "@/lib/actions/company/companyProducts.action";
import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";
import { getAllWarehouseProducts } from "@/lib/actions/company/warehouseProducts.action";

import WarehouseCard from "./WarehouseCard";
import { ProductDetailsModalProps } from "../_types/product.types";

export default function ProductDetailsModal({
  isOpen,
  onClose,
  productId,
  productName,
  expandedWarehouses,
  onToggleWarehouse,
}: Omit<ProductDetailsModalProps, "warehouses">) {
  const numericProductId = Number(productId);
  const [localExpandedWarehouses, setLocalExpandedWarehouses] = useState<
    number[]
  >([]);

  const { data: MasterProductInfo, isLoading: productLoading } = useQuery({
    queryKey: ["MasterproductInfo", numericProductId],
    queryFn: () => indexCompanyProducts(),
    enabled: !!numericProductId && isOpen && !isNaN(numericProductId),
  });

  const MasterProductDetail = MasterProductInfo?.data?.find(
    (item) => item.id === numericProductId
  );

  const totalBatches = MasterProductDetail?.total_batches || 0;
  const totalStock = MasterProductDetail?.total_stock || 0;
  const totalReservedStock = MasterProductDetail?.total_reserved_stock || 0;
  const totalWarehouses = MasterProductDetail?.total_warehouses || 0;

  const { data: warehousesResponse, isLoading: warehousesLoading } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouses(),
    enabled: isOpen,
  });

  const warehouses = warehousesResponse?.data || [];

  // Fetch warehouse products data to get stats for each warehouse
  const warehouseProductsQueries = useQueries({
    queries: warehouses.map((warehouse) => ({
      queryKey: [
        "warehouseProductStats",
        warehouse.id,
        numericProductId,
        "modal",
      ],
      queryFn: async () => {
        const result = await getAllWarehouseProducts({
          warehouseId: warehouse.id,
          filters: { id: numericProductId },
          paginate: false,
        });
        return result;
      },
      enabled: isOpen && !!numericProductId && warehouses.length > 0,
      staleTime: 0, // Always fetch fresh data
      refetchOnMount: true,
    })),
  });

  if (!isOpen) return null;

  const toggleWarehouse = (warehouseId: number) => {
    if (onToggleWarehouse) {
      onToggleWarehouse(warehouseId);
    } else {
      setLocalExpandedWarehouses((prev) =>
        prev.includes(warehouseId)
          ? prev.filter((id) => id !== warehouseId)
          : [...prev, warehouseId]
      );
    }
  };

  const isWarehouseExpanded = (warehouseId: number) => {
    return expandedWarehouses
      ? expandedWarehouses.includes(warehouseId)
      : localExpandedWarehouses.includes(warehouseId);
  };

  // Helper function to get warehouse stats from queries
  const getWarehouseStats = (warehouseId: number) => {
    const warehouseIndex = warehouses.findIndex((w) => w.id === warehouseId);
    if (warehouseIndex === -1) return { batches: 0, quantity: 0, reserved: 0 };

    const queryResult = warehouseProductsQueries[warehouseIndex];

    if (!queryResult?.data?.data || !Array.isArray(queryResult.data.data))
      return { batches: 0, quantity: 0, reserved: 0 };

    // ✅ FIX: Find the correct product by ID instead of taking [0]
    const warehouseProduct = queryResult.data.data.find(
      (product) => product.id === numericProductId
    );

    if (!warehouseProduct) {
      return { batches: 0, quantity: 0, reserved: 0 };
    }

    return {
      batches: warehouseProduct.total_batches || 0,
      quantity: warehouseProduct.total_stock || 0,
      reserved: warehouseProduct.reserved_stock || 0,
    };
  };

  if (productLoading || warehousesLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
            <p className="text-gray-600">
              جاري تحميل بيانات المنتج والمخازن...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!MasterProductDetail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <Package className="h-8 w-8 text-red-500" />
            </div>
            <div className="mb-2 text-xl font-bold text-gray-900">
              المنتج غير موجود
            </div>
            <p className="mb-4 text-gray-600">تعذر العثور على بيانات المنتج</p>
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-6 py-2 text-gray-900 transition-colors hover:bg-gray-200"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">تفاصيل المنتج</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Product Info Summary */}
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {MasterProductDetail.name ?? productName}
              </h3>

              {/* Stats Grid - 4 columns like pharmacy */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">عدد المخازن</p>
                    <p className="text-xl font-bold text-gray-900">
                      {totalWarehouses}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">إجمالي الكمية</p>
                    <p className="text-xl font-bold text-gray-900">
                      {totalStock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-orange-100 bg-orange-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                    <Lock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">المخزون المحجوز</p>
                    <p className="text-xl font-bold text-gray-900">
                      {totalReservedStock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-purple-100 bg-purple-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">عدد الدفعات</p>
                    <p className="text-xl font-bold text-gray-900">
                      {totalBatches}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouses Section */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                المخازن
              </h3>

              {warehouses?.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                  <Warehouse className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                  <p className="mb-1 text-lg font-semibold text-gray-900">
                    لا توجد مخازن تحتوي على هذا المنتج
                  </p>
                  <p className="text-sm text-gray-600">
                    هذا المنتج غير متوفر في أي مخزن حالياً
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {warehouses?.map((warehouse) => (
                    <div
                      key={warehouse.id}
                      className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                    >
                      {/* Warehouse Header */}
                      <button
                        onClick={() => toggleWarehouse(warehouse.id)}
                        className="flex w-full items-center justify-between p-4 text-right transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {warehouse.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Warehouse Stats Badges */}
                          <div className="flex items-center gap-2">
                            <Badge className="border-blue-200 bg-blue-50 text-blue-700">
                              <Package className="ml-1 h-3 w-3" />
                              {getWarehouseStats(warehouse.id).quantity}
                            </Badge>
                            <Badge className="border-orange-200 bg-orange-50 text-orange-700">
                              <Lock className="ml-1 h-3 w-3" />
                              {getWarehouseStats(warehouse.id).reserved}
                            </Badge>
                            <Badge className="border-purple-200 bg-purple-50 text-purple-700">
                              <Calendar className="ml-1 h-3 w-3" />
                              {getWarehouseStats(warehouse.id).batches}
                            </Badge>
                          </div>

                          <ChevronDown
                            className={`h-5 w-5 text-gray-400 transition-transform ${
                              isWarehouseExpanded(warehouse.id)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Warehouse Content */}
                      {isWarehouseExpanded(warehouse.id) && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4">
                          <WarehouseCard
                            id={warehouse.id}
                            name={warehouse.name}
                            productId={numericProductId}
                            // expandedWarehouses={expandedWarehouses}
                            // onToggleWarehouse={onToggleWarehouse}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
