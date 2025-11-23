"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { importWarehouseProducts } from "@/lib/actions/company/warehouseProducts.action";

interface ImportProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseId: number;
  warehouseName: string;
}

export default function ImportProductsModal({
  isOpen,
  onClose,
  warehouseId,
  warehouseName,
}: ImportProductsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: importWarehouseProducts,
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء استيراد المنتجات");
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ["warehouseProducts", warehouseId],
      });
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success(res.message ?? "تم استيراد المنتجات بنجاح");
      handleClose();
    },
    onError: () => {
      toast.error("حدث خطأ أثناء استيراد المنتجات");
    },
  });

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx")) {
        toast.error("الملف يجب أن يكون بصيغة .xlsx");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx")) {
        toast.error("الملف يجب أن يكون بصيغة .xlsx");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("الرجاء اختيار ملف");
      return;
    }

    // Convert file to FormData for server action
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("warehouseId", warehouseId.toString());

    mutation.mutate({
      warehouseId,
      file: selectedFile,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                إضافة رصيد أول المدة
              </h2>
              <p className="text-sm text-gray-600">{warehouseName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={mutation.isPending}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Info Box */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="text-lg">ℹ️</span>
              </div>
              <div className="space-y-1 text-sm text-blue-900">
                <p className="font-semibold">تعليمات الاستيراد:</p>
                <ul className="list-inside list-disc space-y-1 text-blue-800">
                  <li>الملف يجب أن يكون بصيغة Excel (.xlsx)</li>
                  <li>تأكد من صحة البيانات قبل الرفع</li>
                  <li>سيتم إضافة المنتجات إلى المستودع المحدد</li>
                </ul>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${
              dragActive
                ? "border-emerald-500 bg-emerald-50"
                : selectedFile
                ? "border-emerald-300 bg-emerald-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="hidden"
              disabled={mutation.isPending}
            />

            {selectedFile ? (
              <div className="space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={mutation.isPending}
                  className="text-sm text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                >
                  اختيار ملف آخر
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="mb-1 text-lg font-semibold text-gray-900">
                    اسحب الملف هنا
                  </p>
                  <p className="text-sm text-gray-600">أو</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-200"
                >
                  اختر ملف من الجهاز
                </button>
                <p className="text-xs text-gray-500">Excel (.xlsx) فقط</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending || !selectedFile}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            {mutation.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
