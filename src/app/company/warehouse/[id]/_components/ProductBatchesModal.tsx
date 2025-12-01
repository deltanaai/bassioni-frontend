"use client";

import { Calendar, Loader2, Package, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProductsByWarehouse } from "@/lib/actions/company/warehouseProducts.action";
import { formatIsoToArabicDate } from "@/lib/utils";

interface ProductBatchesModalProps {
  product: WarehouseProductsIndex | null;
  warehouseId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductBatchesModal({
  product,
  warehouseId,
  open,
  onOpenChange,
}: ProductBatchesModalProps) {
  const [batches, setBatches] = useState<ProductBatches[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<ProductBatches[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (open && product) {
      fetchBatches();
    } else {
      // Reset state when modal closes
      setBatches([]);
      setFilteredBatches([]);
      setSearchQuery("");
      setStatusFilter("all");
    }
  }, [open, product]);

  useEffect(() => {
    // Apply filters whenever batches, search, or status filter changes
    let filtered = [...batches];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((batch) =>
        batch.batch_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((batch) => {
        const daysUntilExpiry = batch.days_until_expiry;
        if (statusFilter === "expired") return daysUntilExpiry < 0;
        if (statusFilter === "expiring_soon")
          return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
        if (statusFilter === "good") return daysUntilExpiry > 30;
        return true;
      });
    }

    setFilteredBatches(filtered);
  }, [batches, searchQuery, statusFilter]);

  const fetchBatches = async () => {
    if (!product) return;

    setIsLoading(true);
    try {
      const response = await getProductsByWarehouse({
        warehouseId,
        productId: product.id,
      });

      if (response.success && response.data) {
        setBatches(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExpiryBadge = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          منتهي الصلاحية
        </Badge>
      );
    } else if (daysUntilExpiry <= 30) {
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
          قريب الانتهاء
        </Badge>
      );
    }
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        جيد
      </Badge>
    );
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl border-gray-200 bg-white">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <div>{product.name}</div>
              <div className="text-sm font-normal text-gray-500">
                الدفعات المتاحة في المخزن
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-4 border-b border-gray-200 pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Search */}
            <div className="space-y-2">
              <Label
                htmlFor="search"
                className="text-sm font-medium text-gray-700"
              >
                البحث برقم الدفعة
              </Label>
              <div className="relative">
                <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="ابحث برقم الدفعة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                فلترة حسب الحالة
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="good">جيد</SelectItem>
                  <SelectItem value="expiring_soon">قريب الانتهاء</SelectItem>
                  <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600">
            عرض {filteredBatches.length} من {batches.length} دفعة
          </div>
        </div>

        {/* Batches List */}
        <div className="max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                لا توجد دفعات
              </h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== "all"
                  ? "لا توجد دفعات مطابقة للبحث أو الفلاتر"
                  : "لا توجد دفعات متاحة لهذا المنتج"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      {/* Batch Number */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          رقم الدفعة:
                        </span>
                        <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-900">
                          {batch.batch_number}
                        </span>
                      </div>

                      {/* Stock */}
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">المخزون:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {batch.stock.toLocaleString()} وحدة
                        </span>
                      </div>

                      {/* Expiry Date */}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          تاريخ الانتهاء:
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {formatIsoToArabicDate(batch.expiry_date)}
                        </span>
                        <span className="text-xs text-gray-500">
                          (
                          {batch.days_until_expiry > 0
                            ? `${batch.days_until_expiry} يوم متبقي`
                            : `منتهي منذ ${Math.abs(
                                batch.days_until_expiry
                              )} يوم`}
                          )
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>{getExpiryBadge(batch.days_until_expiry)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
