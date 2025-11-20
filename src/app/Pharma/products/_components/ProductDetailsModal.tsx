"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  ChevronDown,
  Package,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { indexBranches } from "@/lib/actions/pharma/branches.action";
import { showBranchProductDetails } from "@/lib/actions/pharma/branchProducts.action";
import { pharmaMasterProductDetails } from "@/lib/actions/pharma/masterProducts";

import AddBatchModal from "./AddBatchModal";

interface ProductWithBranches extends MasterProduct {
  branches?: Branch[];
}

interface BranchWithStats extends Branch {
  total_stock?: number;
  total_batches?: number;
}

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MasterProduct | null;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) {
  const [expandedBranch, setExpandedBranch] = useState<number | null>(null);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [selectedBranchForBatch, setSelectedBranchForBatch] = useState<
    number | null
  >(null);

  const { data: productDetails, isLoading } = useQuery({
    queryKey: ["productDetails", product?.id],
    queryFn: () => pharmaMasterProductDetails({ productId: product!.id }),
    enabled: isOpen && !!product,
  });

  // Fetch all pharmacy branches
  const { data: allBranches, isLoading: isBranchesLoading } = useQuery({
    queryKey: ["allBranches"],
    queryFn: () => indexBranches({}),
    enabled: isOpen,
  });

  const branches = (allBranches?.data || []) as BranchWithStats[];

  // Fetch batch data for all branches to show badges
  const branchBatchQueries = useQueries({
    queries: branches.map((branch) => ({
      queryKey: ["branchProductDetails", branch.id, product?.id],
      queryFn: () =>
        showBranchProductDetails({
          branchId: branch.id,
          productId: product!.id,
        }),
      enabled: isOpen && !!product && branches.length > 0,
    })),
  });

  const { data: branchBatches, isLoading: isBatchesLoading } = useQuery({
    queryKey: ["branchProductDetails", expandedBranch, product?.id],
    queryFn: () =>
      showBranchProductDetails({
        branchId: expandedBranch!,
        productId: product!.id,
      }),
    enabled: !!expandedBranch && !!product,
  });

  if (!isOpen || !product) return null;

  const details = (productDetails?.data || product) as ProductWithBranches;

  // Helper function to get branch stats from queries
  const getBranchStats = (branchId: number) => {
    const branchIndex = branches.findIndex((b) => b.id === branchId);
    if (branchIndex === -1) return { batches: 0, quantity: 0, reserved: 0 };

    const queryResult = branchBatchQueries[branchIndex];
    if (!queryResult?.data?.data)
      return { batches: 0, quantity: 0, reserved: 0 };

    const batches = queryResult.data.data;
    const batchCount = batches.length;
    const totalQuantity = batches.reduce(
      (sum, batch) => sum + (batch.stock || 0),
      0
    );
    const reservedStock = batches.reduce(
      (sum, batch) => sum + (batch.reserved_stock || 0),
      0
    );

    return {
      batches: batchCount,
      quantity: totalQuantity,
      reserved: reservedStock,
    };
  };

  // Calculate totals
  const totalBranches = branches.length;
  const totalQuantity = branchBatchQueries.reduce((sum, query) => {
    if (!query?.data?.data) return sum;
    return (
      sum +
      query.data.data.reduce(
        (batchSum, batch) => batchSum + (batch.stock || 0),
        0
      )
    );
  }, 0);
  const totalBatches = branchBatchQueries.reduce((sum, query) => {
    if (!query?.data?.data) return sum;
    return sum + query.data.data.length;
  }, 0);
  const totalReservedStock = branchBatchQueries.reduce((sum, query) => {
    if (!query?.data?.data) return sum;
    return (
      sum +
      query.data.data.reduce(
        (batchSum, batch) => batchSum + (batch.reserved_stock || 0),
        0
      )
    );
  }, 0);

  const toggleBranch = (branchId: number) => {
    setExpandedBranch(expandedBranch === branchId ? null : branchId);
  };

  const handleAddBatch = (branchId: number) => {
    setSelectedBranchForBatch(branchId);
    setIsAddBatchOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "expired":
      case "منتهي الصلاحية":
        return "bg-red-900/50 text-red-300";
      case "expiring soon":
      case "قريب الانتهاء":
        return "bg-yellow-900/50 text-yellow-300";
      case "good":
      case "جيد":
        return "bg-emerald-900/50 text-emerald-300";
      default:
        return "bg-gray-900/50 text-gray-300";
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-gray-800 px-6 py-4">
            <h2 className="text-xl font-bold text-white">تفاصيل المنتج</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {isLoading || isBranchesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Product Info Summary */}
                <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    {details.name}
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20">
                        <Building2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">عدد الفروع</p>
                        <p className="text-xl font-bold text-white">
                          {totalBranches}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20">
                        <Package className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">إجمالي الكمية</p>
                        <p className="text-xl font-bold text-white">
                          {totalQuantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600/20">
                        <Package className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">المخزون المحجوز</p>
                        <p className="text-xl font-bold text-white">
                          {totalReservedStock}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20">
                        <Calendar className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">عدد الدفعات</p>
                        <p className="text-xl font-bold text-white">
                          {totalBatches}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branches Accordion */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    الفروع
                  </h3>

                  {branches.length === 0 ? (
                    <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-8 text-center">
                      <Building2 className="mx-auto mb-2 h-12 w-12 text-gray-600" />
                      <p className="text-gray-400">
                        لا توجد فروع متاحة لهذا المنتج
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {branches.map((branch) => (
                        <div
                          key={branch.id}
                          className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900/30"
                        >
                          {/* Branch Header */}
                          <button
                            onClick={() => toggleBranch(branch.id)}
                            className="flex w-full items-center justify-between p-4 text-right transition-colors hover:bg-gray-700/30"
                          >
                            <div className="flex items-center gap-3">
                              <Building2 className="h-5 w-5 text-emerald-400" />
                              <div>
                                <p className="font-medium text-white">
                                  {branch.name}
                                </p>
                                {branch.address && (
                                  <p className="text-xs text-gray-500">
                                    {branch.address}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Branch Stats Badges */}
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-900/50 text-blue-300">
                                  <Package className="ml-1 h-3 w-3" />
                                  {getBranchStats(branch.id).quantity}
                                </Badge>
                                <Badge className="bg-orange-900/50 text-orange-300">
                                  <Package className="ml-1 h-3 w-3" />
                                  {getBranchStats(branch.id).reserved}
                                </Badge>
                                <Badge className="bg-purple-900/50 text-purple-300">
                                  <Calendar className="ml-1 h-3 w-3" />
                                  {getBranchStats(branch.id).batches}
                                </Badge>
                              </div>

                              <ChevronDown
                                className={`h-5 w-5 text-gray-400 transition-transform ${
                                  expandedBranch === branch.id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </button>

                          {/* Branch Batches */}
                          {expandedBranch === branch.id && (
                            <div className="border-t border-gray-700 bg-gray-800/50 p-4">
                              {isBatchesLoading ? (
                                <div className="space-y-2">
                                  <Skeleton className="h-16 w-full" />
                                  <Skeleton className="h-16 w-full" />
                                </div>
                              ) : branchBatches?.data &&
                                branchBatches.data.length > 0 ? (
                                <>
                                  <p className="mb-3 text-sm text-gray-400">
                                    أحدث 3 دفعات
                                  </p>
                                  <div className="space-y-2">
                                    {branchBatches.data
                                      .slice(0, 3)
                                      .map((batch, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/50 p-3"
                                        >
                                          <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-medium text-white">
                                                دفعة #{batch.batch_number}
                                              </span>
                                              <Badge
                                                className={getStatusColor(
                                                  batch.status_label
                                                )}
                                              >
                                                {batch.status_label}
                                              </Badge>
                                            </div>
                                            <div className="flex gap-4 text-xs text-gray-400">
                                              <span>الكمية: {batch.stock}</span>
                                              <span>
                                                الانتهاء: {batch.expiry_date}
                                              </span>
                                              {batch.days_until_expiry !==
                                                null && (
                                                <span>
                                                  متبقي:{" "}
                                                  {batch.days_until_expiry} يوم
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </>
                              ) : (
                                <div className="py-4 text-center text-sm text-gray-400">
                                  لا توجد دفعات لهذا الفرع
                                </div>
                              )}

                              {/* Add Batch Button */}
                              <Button
                                onClick={() => handleAddBatch(branch.id)}
                                className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                              >
                                <Plus className="ml-2 h-4 w-4" />
                                إضافة دفعة جديدة
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Batch Modal */}
      {selectedBranchForBatch && product && (
        <AddBatchModal
          isOpen={isAddBatchOpen}
          onClose={() => {
            setIsAddBatchOpen(false);
            setSelectedBranchForBatch(null);
          }}
          branchId={selectedBranchForBatch}
          productId={product.id}
        />
      )}
    </>
  );
}
