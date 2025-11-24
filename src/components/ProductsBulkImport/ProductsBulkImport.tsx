import { importBulkProducts } from "@/lib/actions/owner/products.actions";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

type ProductsBulkImportProps = {
  onClose: () => void;
};

export default function ProductsBulkImport({
  onClose,
}: ProductsBulkImportProps) {
  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate extension
    const allowedExtensions = [".xlsx", ".xls", ".csv"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      toast.error("Invalid file format! Please upload Excel or CSV only.");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);

    // Preview data
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    setPreviewData(jsonData);
  };

  const mutation = useMutation({
    mutationFn: importBulkProducts,
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء استيراد المنتجات");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast.success(res.message ?? "تم استيراد المنتجات بنجاح");
      onClose();
    },
    onError: () => {
      toast.error("حدث خطأ أثناء استيراد المنتجات");
    },
  });

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error("الرجاء اختيار ملف");
      return;
    }

    mutation.mutate({ file: selectedFile });
  };

  return (
    <>
      <div className="max-w-4xl overflow-y-auto max-h-[80vh] mx-auto p-6 space-y-6  rounded-xl ">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Import Products
          </h2>
          <p className="text-gray-600">
            Upload Excel or CSV files to import your product catalog
          </p>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors duration-200 bg-gray-50">
          <div className="text-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-600 mb-2">
              Drag and drop your file here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports .xlsx, .xls, .csv files
            </p>
          </div>

          <label className="inline-flex items-center gap-3 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Choose File
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleupload}
              className="hidden"
            />
          </label>
        </div>

        {/* Selected File Info */}
        {fileName && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <p className="font-medium text-blue-800">Selected file:</p>
              <p className="text-sm text-blue-600">{fileName}</p>
            </div>
          </div>
        )}

        {/* Preview Table */}
        {previewData.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Preview Data (first 5 rows)
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Review your data before confirming the upload
                <span className="font-bold text-gray-600 ml-3 ">
                  total products is: {previewData.length}
                </span>
              </p>
            </div>

            <div className="overflow-x-auto border rounded p-2">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {Object.keys(previewData[0]).map((key) => (
                      <th
                        key={key}
                        className="border px-2 py-1 text-left text-xs font-medium"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="even:bg-gray-50">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="border px-2 py-1 text-xs">
                          {JSON.stringify(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/*  Buttons */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {mutation.isPending ? " is aploading..." : "Confirm Upload"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
