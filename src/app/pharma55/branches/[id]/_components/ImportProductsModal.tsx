"use client";

import { FileSpreadsheet, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { importBranchProducts } from "@/lib/actions/pharma/branchProducts.action";
import { queryClient } from "@/lib/queryClient";

interface ImportProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: number;
  branchName: string;
}

export default function ImportProductsModal({
  isOpen,
  onClose,
  branchId,
  branchName,
}: ImportProductsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.name.endsWith(".xlsx")) {
      setSelectedFile(file);
    } else {
      toast.error("الرجاء اختيار ملف بصيغة .xlsx فقط");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("الرجاء اختيار ملف أولاً");
      return;
    }

    setIsUploading(true);

    try {
      const result = await importBranchProducts({
        branchId,
        file: selectedFile,
      });

      if (result.success) {
        toast.success("تم استيراد المنتجات بنجاح");
        queryClient.invalidateQueries({
          queryKey: ["branchProducts", branchId],
        });
        setSelectedFile(null);
        onClose();
      } else {
        toast.error(result.error?.message || "فشل في استيراد المنتجات");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء استيراد المنتجات");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg scale-100 transform rounded-2xl border border-gray-800/50 bg-gray-900 p-6 shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20">
              <FileSpreadsheet className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                إضافة رصيد أول المدة
              </h2>
              <p className="text-sm text-gray-400">{branchName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-white"
            disabled={isUploading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`mb-6 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? "border-emerald-500/50 bg-emerald-950/20"
              : "border-gray-800/50 bg-gray-950/30"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
                isDragging
                  ? "bg-emerald-500/20"
                  : "bg-gradient-to-br from-blue-500/20 to-indigo-600/20"
              }`}
            >
              <Upload
                className={`h-8 w-8 ${
                  isDragging ? "text-emerald-400" : "text-blue-400"
                }`}
              />
            </div>

            {selectedFile ? (
              <div className="w-full">
                <div className="rounded-lg border border-gray-800/50 bg-gray-950/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-400 transition-colors hover:text-red-300"
                      disabled={isUploading}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-sm font-medium text-white">
                    اسحب وأفلت ملف Excel هنا
                  </p>
                  <p className="mt-1 text-xs text-gray-500">أو</p>
                </div>

                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-500 hover:to-indigo-500">
                    <Upload className="h-4 w-4" />
                    اختر ملف
                  </span>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>

                <p className="text-xs text-gray-500">
                  يُقبل فقط ملفات Excel (.xlsx)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mb-6 rounded-lg border border-blue-900/30 bg-blue-950/20 p-4">
          <p className="text-sm text-blue-300">
            💡 تأكد من أن ملف Excel يحتوي على الأعمدة المطلوبة: اسم المنتج،
            الكمية، السعر، رقم الدفعة، تاريخ الانتهاء
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700 hover:text-white"
            disabled={isUploading}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                جاري الرفع...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                رفع الملف
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
