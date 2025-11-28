"use client";

import React, { useState } from "react";
import { FileText, Image, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  value: File | null;
  onChange: (file: File) => void;
  onRemove: () => void;
}

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function handleFileValidation(file: File, onChange: (file: File) => void) {
  if (!allowedTypes.includes(file.type)) {
    toast.error("صيغة الملف غير مسموح بها");
    return;
  }

  onChange(file);
}

const getFileIcon = (file: File) => {
  if (file.type.includes("pdf")) {
    return <FileText className="w-5 h-5 text-red-500" />;
  } else if (file.type.includes("image")) {
    return <Image className="w-5 h-5 text-blue-500" />;
  }
  return <FileText className="w-5 h-5 text-gray-500" />;
};

export default function FileUpload({
  value,
  onChange,
  onRemove,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-4">
      {!value ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging
              ? "border-emerald-600 bg-emerald-50"
              : "border-gray-300 hover:border-gray-400 bg-white"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileValidation(file, onChange);
          }}
        >
          <div className="text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              قم برفع شهادة أو مستند يثبت صحة المنتج
            </p>

            <label
              htmlFor="proof-document-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer text-sm"
            >
              <Upload className="w-4 h-4" />
              اختر ملف الإثبات
            </label>

            <input
              id="proof-document-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileValidation(file, onChange);
              }}
            />

            <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG, WebP</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            {getFileIcon(value)}

            <div>
              <p className="font-medium text-gray-900 text-sm">{value.name}</p>
              <p className="text-xs text-gray-500">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="p-1 hover:bg-red-50 rounded transition-colors"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
