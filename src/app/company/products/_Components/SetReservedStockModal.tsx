"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { storeWarehouseProduct } from "@/lib/actions/company/warehouseProducts.action";

interface SetReservedStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseId: number;
  productId: number;
  warehouseName: string;
}

export default function SetReservedStockModal({
  isOpen,
  onClose,
  warehouseId,
  productId,
  warehouseName,
}: SetReservedStockModalProps) {
  const [reservedStock, setReservedStock] = useState(0);

  const queryClient = useQueryClient();

  const { mutate: setReservedStockMutation, isPending } = useMutation({
    mutationFn: storeWarehouseProduct,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setReservedStockMutation(
      {
        warehouseId,
        productId,
        reservedStock,
      },
      {
        onSuccess: (res) => {
          if (res.success === true) {
            toast.success("تم تعيين المخزون المحجوز بنجاح");
            // Invalidate all queries related to reserved stock
            queryClient.invalidateQueries({
              queryKey: ["warehouseProducts", warehouseId, productId],
            });
            queryClient.invalidateQueries({
              queryKey: ["warehouseProducts"],
            });
            queryClient.invalidateQueries({
              queryKey: ["warehouseProductDetails", warehouseId, productId],
            });
            queryClient.invalidateQueries({
              queryKey: ["warehouseProductDetailsInfo", warehouseId, productId],
            });
            queryClient.invalidateQueries({
              queryKey: ["warehouseProductStats", warehouseId, productId],
            });
            queryClient.invalidateQueries({
              queryKey: ["productDetails", productId],
            });
            queryClient.invalidateQueries({
              queryKey: ["MasterproductInfo"],
            });
            handleClose();
          } else {
            toast.error(
              res.error?.message || "حدث خطأ أثناء تعيين المخزون المحجوز"
            );
          }
        },
        onError: (err) => {
          toast.error(err.message || "حدث خطأ أثناء تعيين المخزون المحجوز");
        },
      }
    );
  };

  const handleClose = () => {
    setReservedStock(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              تعيين المخزون المحجوز
            </h2>
            <p className="mt-1 text-sm text-gray-600">{warehouseName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Reserved Stock */}
            <div>
              <label className="mb-2 block text-right text-sm font-medium text-gray-700">
                المخزون المحجوز
              </label>
              <input
                type="number"
                required
                min="0"
                value={reservedStock}
                onChange={(e) =>
                  setReservedStock(parseInt(e.target.value) || 0)
                }
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-right text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="أدخل المخزون المحجوز"
              />
              <p className="mt-2 text-xs text-gray-500">
                المخزون المحجوز يتم حسابه على مستوى المخزن
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-emerald-500 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-70"
            >
              {isPending ? "جاري التعيين..." : "تعيين"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
