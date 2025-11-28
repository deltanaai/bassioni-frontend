"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductRequestDetails } from "../_types/product.types";

interface ProductRequestDetailsModalProps {
  request: ProductRequestDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductRequestDetailsModal({
  request,
  open,
  onOpenChange,
}: ProductRequestDetailsModalProps) {
  if (!request) return null;

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          text: "قيد المراجعة",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          badgeColor: "text-yellow-800 bg-yellow-100",
        };
      case "approved":
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          text: "مقبول",
          color: "bg-green-100 text-green-800 border-green-200",
          badgeColor: "text-green-800 bg-green-100",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          text: "مرفوض",
          color: "bg-red-100 text-red-800 border-red-200",
          badgeColor: "text-red-800 bg-red-100",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5 text-gray-500" />,
          text: status,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          badgeColor: "text-gray-800 bg-gray-100",
        };
    }
  };

  const handleDownloadProof = () => {
    if (request.proof_document_url) {
      const link = document.createElement("a");
      link.href = request.proof_document_url;
      link.download = `proof_document_${request.id}.pdf`;
      link.target = "_blank";
      link.click();
    }
  };

  const handleViewProof = () => {
    if (request.proof_document_url) {
      window.open(request.proof_document_url, "_blank");
    }
  };

  const statusDetails = getStatusDetails(request.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            تفاصيل طلب المنتج
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">اسم المنتج</h3>
              <p className="text-gray-700">{request.name_ar}</p>
              <p className="text-sm text-gray-500">{request.name_en}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">الحالة</h3>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusDetails.badgeColor}`}
              >
                {statusDetails.icon}
                {statusDetails.text}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">رقم الطلب</h3>
              <p className="text-gray-700">#{request.id}</p>
            </div>
          </div>
          {/* Proof Document  */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              وثيقة الإثبات
            </h3>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">
                    مستند الإثبات المرفق
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.proof_document_url
                      ? "تم رفع الملف بنجاح"
                      : "لا يوجد ملف مرفق"}
                  </p>
                </div>
              </div>

              {request.proof_document_url && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleViewProof}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    عرض
                  </Button>
                  <Button
                    onClick={handleDownloadProof}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    تحميل
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                المعلومات الأساسية
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    الاسم العربي
                  </label>
                  <p className="text-gray-900 mt-1">{request.name_ar}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    الاسم الإنجليزي
                  </label>
                  <p className="text-gray-900 mt-1">{request.name_en}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      الفئة
                    </label>
                    <p className="text-gray-900 mt-1">
                      {request.selectedcategory.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      العلامة التجارية
                    </label>
                    <p className="text-gray-900 mt-1">{request.brand}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                المعلومات المالية
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      السعر
                    </label>
                    <p className="text-gray-900 mt-1">
                      {request.price
                        ? `${request.price.toFixed(2)} ج.م`
                        : "غير محدد"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      الضريبة
                    </label>
                    <p className="text-gray-900 mt-1">{request.tax}%</p>
                  </div>
                </div>

                {request.price && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      السعر الإجمالي
                    </label>
                    <p className="text-gray-900 mt-1 font-semibold">
                      {((request.price || 0) * (1 + request.tax / 100)).toFixed(
                        2
                      )}{" "}
                      ج.م
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              رموز التعريف
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  GTIN
                </label>
                <p className="text-gray-900 mt-1">
                  {request.gtin || "غير محدد"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  الباركود
                </label>
                <p className="text-gray-900 mt-1">
                  {request.bar_code || "غير محدد"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  رمز QR
                </label>
                <p className="text-gray-900 mt-1">
                  {request.qr_code || "غير محدد"}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                المعلومات الطبية
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    الاسم العلمي
                  </label>
                  <p className="text-gray-900 mt-1">
                    {request.scientific_name || "غير محدد"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    شكل الجرعة
                  </label>
                  <p className="text-gray-900 mt-1">
                    {request.dosage_form || "غير محدد"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                المكونات والوصف
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    المكونات الفعالة
                  </label>
                  <p className="text-gray-900 mt-1 whitespace-pre-line">
                    {request.active_ingredients || "غير محدد"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    الوصف
                  </label>
                  <p className="text-gray-900 mt-1 whitespace-pre-line">
                    {request.description || "غير محدد"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              التواريخ والأوقات
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">تاريخ التقديم</p>
                  <p className="text-sm text-gray-600">
                    {request.submitted_at}
                  </p>
                </div>
              </div>

              {request.reviewed_at && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">تاريخ المراجعة</p>
                    <p className="text-sm text-gray-600">
                      {request.reviewed_at}
                    </p>
                    {request.reviewed_by && (
                      <p className="text-xs text-gray-500 mt-1">
                        بواسطة: {request.reviewed_by.name}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* سبب الرفض لو موجود */}
          {request.status === "rejected" && request.rejection_reason && (
            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                سبب الرفض
              </h3>

              <div className="p-4 bg-white rounded-lg border border-red-200">
                <p className="text-red-700 whitespace-pre-line">
                  {request.rejection_reason}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
