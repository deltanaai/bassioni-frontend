import { useState } from "react";
import { X } from "lucide-react";
import { Batch, AddBatchModalProps } from "../types/product.types";

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
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* الهيدر */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">إضافة دفعة جديدة</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* الفورم */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* رقم الدفعة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                رقم الدفعة
              </label>
              <input
                type="text"
                required
                value={formData.batchNumber}
                onChange={(e) =>
                  setFormData({ ...formData, batchNumber: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-right"
                placeholder="أدخل رقم الدفعة"
              />
            </div>

            {/* الكمية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
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
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-right"
                placeholder="أدخل الكمية"
              />
            </div>

            {/* تاريخ الصلاحية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                تاريخ الصلاحية
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-right"
              />
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
            >
              إضافة الدفعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
