import { X } from "lucide-react";
import { useState } from "react";

import { Batch, AddBatchModalProps } from "../_types/product.types";

export default function AddBatchModal({
  isOpen,
  onClose,
  onAddBatch,
}: AddBatchModalProps) {
  const [formData, setFormData] = useState<Omit<Batch, "id">>({
    batchNumber: "",
    quantity: 0,
    expiryDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBatch({
      ...formData,
      id: Date.now(),
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      batchNumber: "",
      quantity: 0,
      expiryDate: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white">
        {/* الهيدر */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800">إضافة دفعة جديدة</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* الفورم */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* رقم الدفعة */}
            <div>
              <label className="mb-2 block text-right text-sm font-medium text-gray-700">
                رقم الدفعة
              </label>
              <input
                type="text"
                required
                value={formData.batchNumber}
                onChange={(e) =>
                  setFormData({ ...formData, batchNumber: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 p-3 text-right focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                placeholder="أدخل رقم الدفعة"
              />
            </div>

            {/* الكمية */}
            <div>
              <label className="mb-2 block text-right text-sm font-medium text-gray-700">
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
                className="w-full rounded-xl border border-gray-300 p-3 text-right focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                placeholder="أدخل الكمية"
              />
            </div>

            {/* تاريخ الصلاحية */}
            <div>
              <label className="mb-2 block text-right text-sm font-medium text-gray-700">
                تاريخ الصلاحية
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 p-3 text-right focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* الأزرار */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl bg-gray-200 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-500 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
            >
              إضافة الدفعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
