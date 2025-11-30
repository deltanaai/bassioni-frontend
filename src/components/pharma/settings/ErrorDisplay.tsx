"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  retry?: () => void;
}

export default function ErrorDisplay({ message, retry }: ErrorDisplayProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-6">
      <div className="rounded-2xl border border-red-800 bg-gradient-to-br from-red-900/20 to-red-800/20 p-8 text-center shadow-xl">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">حدث خطأ</h3>
        <p className="mb-6 text-gray-300">{message}</p>
        {retry && (
          <button
            onClick={retry}
            className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 font-medium text-white transition hover:from-red-700 hover:to-red-800"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  );
}
