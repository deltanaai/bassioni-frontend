"use client";

import { Loader2, Trash2 } from "lucide-react";
import React from "react";

type Props = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting?: boolean;
  warehouseName?: string | null;
};

export default function DeleteWarehouseModal({
  show,
  onClose,
  onConfirm,
  deleting = false,
  warehouseName,
}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm scale-100 transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <Trash2 className="h-7 w-7 text-orange-500" />
        </div>

        <div className="mb-7 text-center">
          <h3 className="mb-3 text-xl font-bold text-gray-900">حذف المخزن</h3>
          <p className="mb-3 text-base leading-relaxed text-gray-700">
            هل تريد نقل
            <span className="mx-1 font-bold text-orange-600">
              {warehouseName}
            </span>
            إلى سلة المحذوفات؟
          </p>
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
            يمكنك استعادة المخزن في أي وقت من خلال سلة المحذوفات
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-200"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:bg-orange-600 hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                تأكيد الحذف
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
