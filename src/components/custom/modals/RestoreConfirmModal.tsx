"use client";

import { useState } from "react";
import { RefreshCw, X } from "lucide-react";

interface RestoreConfirmModalProps {
  trigger: React.ReactNode;
  message?: string;
  onConfirm: () => void;
  itemName?: string;
}

export default function RestoreConfirmModal({
  trigger,
  message,
  onConfirm,
  itemName = "هذا العنصر",
}: RestoreConfirmModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error restoring:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* الزرار اللي بيopen المودال */}
      <div onClick={() => setIsOpen(true)}>{trigger}</div>

      {/* المودال نفسه */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            {/* الهيدر */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  استعادة العنصر
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* المحتوى */}
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-2">
                {message || `هل أنت متأكد من استعادة ${itemName}؟`}
              </p>
              <p className="text-gray-500 text-sm">
                سيتم إعادة العنصر إلى القائمة الرئيسية ويمكن استخدامه مرة أخرى.
              </p>
            </div>

            {/* الأزرار */}
            <div className="flex items-center gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الاستعادة...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    نعم، استعادة
                  </>
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
