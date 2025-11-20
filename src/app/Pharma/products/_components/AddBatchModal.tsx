"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { storeBranchBatchProduct } from "@/lib/actions/pharma/branchProducts.action";
import { formatDateForBackend } from "@/lib/utils";

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: number;
  productId: number;
}

export default function AddBatchModal({
  isOpen,
  onClose,
  branchId,
  productId,
}: AddBatchModalProps) {
  const [formData, setFormData] = useState({
    batchNumber: "",
    quantity: 0,
    expiryDate: "",
    reservedStock: 0,
  });

  const { mutate: storeBatchMutation, isPending } = useMutation({
    mutationFn: storeBranchBatchProduct,
  });
  const queryClient = useQueryClient();
  const expiryDate = formatDateForBackend(formData.expiryDate);
  console.log(expiryDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    storeBatchMutation(
      {
        branchId,
        productId,
        stock: formData.quantity,
        batchNumber: formData.batchNumber,
        expiryDate,
      },
      {
        onSuccess: (res) => {
          if (res.success === true) {
            toast.success("تمت إضافة الدفعة بنجاح");
            // Invalidate all queries related to this product
            queryClient.invalidateQueries({
              queryKey: ["branchProductDetails", branchId, productId],
            });
            queryClient.invalidateQueries({
              queryKey: ["productDetails", productId],
            });
            queryClient.invalidateQueries({
              queryKey: ["warehouseProductDetails", branchId, productId],
            });
            handleClose();
          } else {
            toast.error(res.error?.message || "حدث خطأ أثناء إضافة الدفعة");
          }
        },
        onError: (err) => {
          toast.error(err.message || "حدث خطأ أثناء إضافة الدفعة");
        },
      }
    );
  };

  const handleClose = () => {
    setFormData({
      batchNumber: "",
      quantity: 0,
      expiryDate: "",
      reservedStock: 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white">إضافة دفعة جديدة</h2>
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
            {/* Batch number */}
            <div>
              <label className="mb-2 block text-right text-sm font-medium text-gray-300">
                رقم الدفعة
              </label>
              <input
                type="text"
                required
                value={formData.batchNumber}
                onChange={(e) =>
                  setFormData({ ...formData, batchNumber: e.target.value })
                }
                className="w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-right text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                placeholder="أدخل رقم الدفعة"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block text-right text-sm font-medium text-gray-300">
                الكمية
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-right text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                placeholder="أدخل الكمية"
              />
            </div>

            {/* Expiry date */}
            <div>
              <label className="mb-2 block text-right text-sm font-medium text-gray-300">
                تاريخ الصلاحية
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-right text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Reserved Stock (Optional) */}
            <div>
              <label className="mb-2 block text-right text-sm font-medium text-gray-300">
                الكمية المحجوزة{" "}
                <span className="text-xs text-gray-500">(اختياري)</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.reservedStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reservedStock: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-right text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                القيمة الافتراضية: 0 إذا لم يتم التحديد
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
              {isPending ? "جاري الإضافة..." : "إضافة الدفعة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
