"use client";

import { Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DeleteBranchModalProps {
  isOpen: boolean;
  branch: Branch | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteBranchModal({
  isOpen,
  branch,
  onClose,
  onConfirm,
  isLoading,
}: DeleteBranchModalProps) {
  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm scale-100 transform rounded-2xl border border-gray-800/50 bg-gray-900 p-6 shadow-2xl transition-all duration-300">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20">
          <Trash2 className="h-7 w-7 text-orange-400" />
        </div>

        {/* Content */}
        <div className="mb-7 text-center">
          <h3 className="mb-3 text-xl font-bold text-white">حذف الفرع</h3>
          <p className="mb-3 text-base leading-relaxed text-gray-300">
            هل تريد نقل{" "}
            <span className="mx-1 font-bold text-orange-400">
              {branch.name}
            </span>{" "}
            إلى سلة المحذوفات؟
          </p>
          <div className="rounded-lg border border-gray-800/50 bg-gray-950/50 px-3 py-2 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              يمكنك استعادة الفرع في أي وقت من خلال سلة المحذوفات
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700 hover:text-white"
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-red-600 hover:shadow-orange-500/40"
            disabled={isLoading}
          >
            {isLoading ? (
              "جاري الحذف..."
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                تأكيد الحذف
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
