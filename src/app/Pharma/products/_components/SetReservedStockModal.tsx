"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { storeBranchProduct } from "@/lib/actions/pharma/branchProducts.action";

interface SetReservedStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: number;
  productId: number;
  branchName: string;
}

export default function SetReservedStockModal({
  isOpen,
  onClose,
  branchId,
  productId,
  branchName,
}: SetReservedStockModalProps) {
  const [reservedStock, setReservedStock] = useState(0);

  const queryClient = useQueryClient();

  const { mutate: setReservedStockMutation, isPending } = useMutation({
    mutationFn: storeBranchProduct,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setReservedStockMutation(
      {
        branchId,
        productId,
        reservedStock,
      },
      {
        onSuccess: (res) => {
          if (res.success === true) {
            toast.success("تم تعيين المخزون المحجوز بنجاح");
            // Invalidate all queries related to reserved stock
            queryClient.invalidateQueries({
              queryKey: ["branchProducts", branchId, productId],
            });
            queryClient.invalidateQueries({
              queryKey: ["branchProducts"],
            });
            queryClient.invalidateQueries({
              queryKey: ["branchProductDetails", branchId, productId],
            });
            queryClient.invalidateQueries({
              queryKey: ["productDetails", productId],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              تعيين المخزون المحجوز
            </h2>
            <p className="mt-1 text-sm text-gray-400">{branchName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Reserved Stock */}
            <div>
              <label className="mb-2 block text-right text-sm font-medium text-gray-300">
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
                className="w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-right text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                placeholder="أدخل المخزون المحجوز"
              />
              <p className="mt-2 text-xs text-gray-400">
                المخزون المحجوز يتم حسابه على مستوى الصيدلية بالكامل وليس لفرع
                محدد
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-gray-600 bg-gray-700 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-600"
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
