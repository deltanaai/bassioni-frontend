"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Lock,
  Package,
  Plus,
} from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllWarehouseProducts,
  getProductsByWarehouse,
} from "@/lib/actions/company/warehouseProducts.action";

import AddBatchModal from "./AddBatchModal";
import SetReservedStockModal from "./SetReservedStockModal";

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
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isSetReservedStockOpen, setIsSetReservedStockOpen] = useState(false);
  const [showAllBatches, setShowAllBatches] = useState(false);

  const { data, isLoading: isWarehouseLoading } = useQuery({
    queryKey: ["warehouseProductDetails", id, productId],
    queryFn: () =>
      getAllWarehouseProducts({
        warehouseId: id,
        filters: { id: productId },
      }),
    enabled: !!productId,
  });

  const { data: warehouseProductDetails, isLoading: isBatchesLoading } =
    useQuery({
      queryKey: ["warehouseProductDetailsInfo", id, productId],
      queryFn: () =>
        getProductsByWarehouse({
          warehouseId: id,
          productId,
        }),
      enabled: !!productId,
    });

  const warehouseProduct = data?.data?.[0];
  const totalBatches = warehouseProduct?.total_batches || 0;
  const totalStock = warehouseProduct?.total_stock || 0;
  const reservedStock = warehouseProduct?.reserved_stock || 0;

  const batchDetails = warehouseProductDetails?.data || [];

  const displayedBatches = showAllBatches
    ? batchDetails
    : batchDetails.slice(0, 3);
  const hasMoreBatches = batchDetails.length > 3;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "expired":
      case "منتهي الصلاحية":
        return "border-red-200 bg-red-50 text-red-700";
      case "expiring soon":
      case "قريب الانتهاء":
        return "border-orange-200 bg-orange-50 text-orange-700";
      case "good":
      case "جيد":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.floor(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const getStatusLabel = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return "منتهي الصلاحية";
    if (days <= 30) return "قريب الانتهاء";
    return "جيد";
  };

  if (isWarehouseLoading || isBatchesLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Batches List */}
        {batchDetails.length > 0 ? (
          <>
            <p className="text-sm text-gray-600">
              {showAllBatches
                ? `جميع الدفعات (${batchDetails.length})`
                : `أحدث 3 دفعات`}
            </p>
            <div className="space-y-2">
              {displayedBatches.map((batch, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        دفعة #{batch.batch_number}
                      </span>
                      <Badge
                        className={getStatusColor(
                          getStatusLabel(batch.expiry_date)
                        )}
                      >
                        {getStatusLabel(batch.expiry_date)}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-600">
                      <span>الكمية: {batch.stock}</span>
                      <span>
                        الانتهاء:{" "}
                        {new Date(batch.expiry_date).toLocaleDateString(
                          "ar-EG"
                        )}
                      </span>
                      {getDaysUntilExpiry(batch.expiry_date) >= 0 && (
                        <span>
                          متبقي: {getDaysUntilExpiry(batch.expiry_date)} يوم
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {hasMoreBatches && (
              <button
                onClick={() => setShowAllBatches(!showAllBatches)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {showAllBatches ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    عرض أقل
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    عرض المزيد ({batchDetails.length - 3} دفعات إضافية)
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="py-4 text-center text-sm text-gray-500">
            لا توجد دفعات لهذا المخزن
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsAddBatchOpen(true)}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة دفعة جديدة
          </Button>
          <Button
            onClick={() => setIsSetReservedStockOpen(true)}
            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
          >
            <Lock className="ml-2 h-4 w-4" />
            تعيين المخزون المحجوز
          </Button>
        </div>
      </div>

      {/* Add Batch Modal */}
      <AddBatchModal
        isOpen={isAddBatchOpen}
        onClose={() => setIsAddBatchOpen(false)}
        warehouseId={id}
        productId={productId}
      />

      {/* Set Reserved Stock Modal */}
      <SetReservedStockModal
        isOpen={isSetReservedStockOpen}
        onClose={() => setIsSetReservedStockOpen(false)}
        warehouseId={id}
        productId={productId}
        warehouseName={name}
      />
    </>
  );
};

export default WarehouseCard;
