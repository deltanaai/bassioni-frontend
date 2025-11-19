"use client";

import React from "react";

type ProductShape = { id: number; name: string; batch_number: string };

type Props = {
  show: boolean;
  product: ProductShape | null;
  onClose: () => void;
  onConfirm: () => void;
  deleting?: boolean;
};

export default function DeleteWarehouseProductModal({
  show,
  product,
  onClose,
  onConfirm,
  deleting = false,
}: Props) {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        {/* header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">حذف المنتج</h3>
                <p className="text-sm text-red-100">عملية حذف نهائية</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/20"
            >
              <span className="text-lg text-white">✕</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 text-center">
            <p className="mb-4 text-lg font-medium text-gray-700">
              هل أنت متأكد من حذف هذا المنتج؟
            </p>

            <div className="mb-4 transform rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 transition-transform hover:scale-[1.02]">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
                <span className="text-2xl text-red-600">📦</span>
              </div>
              <p className="mb-2 text-xl font-bold text-gray-900">
                {product.name}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-600">
                  #{product.batch_number}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
              <span>ⓘ</span>
              <p className="text-sm font-medium">
                هذا الإجراء لا يمكن التراجع عنه
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 bg-gray-50 p-6">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-4 text-lg font-bold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md disabled:opacity-50"
          >
            تراجع
          </button>

          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:bg-red-700 hover:shadow-xl disabled:opacity-50"
          >
            {deleting ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                جاري الحذف...
              </>
            ) : (
              <>
                <span className="text-lg">🗑️</span>
                تأكيد الحذف
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
