"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  FileText,
  Clock,
  Check,
  X,
  Search,
  Filter,
  Eye,
  ArrowRight,
} from "lucide-react";
import ProductRequestDetailsModal from "../_Components/ProductRequestDetailsModal";
import { ProductRequest, ProductRequestDetails } from "../_types/product.types";
import { ROUTES_COMPANY } from "@/constants/routes";
import Pagination from "@/components/custom/pagination";

const mockRequests: ProductRequest[] = [
  {
    id: 1,
    name_ar: "باراسيتامول 500 مجم",
    name_en: "Paracetamol 500mg",
    status: "pending",
    submitted_date: "2024-01-15",
  },
  {
    id: 2,
    name_ar: "فيتامين سي 1000 مجم",
    name_en: "Vitamin C 1000mg",
    status: "approved",
    submitted_date: "2024-01-14",
  },
  {
    id: 3,
    name_ar: "أوميغا 3 كبسولات",
    name_en: "Omega 3 Capsules",
    status: "rejected",
    submitted_date: "2024-01-13",
  },
];

export default function ProductRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedRequest, setSelectedRequest] =
    useState<ProductRequestDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (request: ProductRequest) => {
    // عشان detailModalll
    const requestDetails: ProductRequestDetails = {
      id: request.id,
      name_ar: request.name_ar,
      name_en: request.name_en,
      gtin: "1234567890123",
      bar_code: "9780201379624",
      qr_code: "QR123456",
      dosage_form: "أقراص",
      scientific_name: "Paracetamol",
      active_ingredients: "باراسيتامول 500 مجم",
      description: "مسكن للألم وخافض للحرارة",
      selectedcategory: { id: 1, name: "مسكنات" },
      brand: "فارماسيا",
      price: 25.5,
      tax: 14,
      status: request.status,
      proof_document_url: "/documents/sample.pdf",
      rejection_reason:
        request.status === "rejected"
          ? "المستندات المقدمة غير كافية أو غير واضحة. يرجى تقديم وثائق أكثر وضوحاً تثبت صحة المنتج."
          : undefined,
      submitted_at: request.submitted_date,
      reviewed_at:
        request.status !== "pending" ? "2024-01-16T10:30:00Z" : undefined,
      reviewed_by:
        request.status !== "pending" ? { id: 1, name: "أحمد محمد" } : undefined,
    };

    setSelectedRequest(requestDetails);
    setIsModalOpen(true);
  };

  // فلترة البيانات
  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.name_en.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  //  عندما لا توجد بيانات
  if (mockRequests.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className=" items-center gap-4">
              <Link
                href={ROUTES_COMPANY.PRODUCTS}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                العودة للمنتجات
              </Link>
              <h1 className="text-3xl mt-5 font-bold text-gray-900">طلباتي</h1>
            </div>

            <Link
              href={ROUTES_COMPANY.NEW_PRODUCT_REQ}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              طلب إضافة منتج
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            لا توجد طلبات
          </h3>
          <p className="text-gray-600 mb-6">
            لم تقم بتقديم أي طلبات إضافة منتجات بعد.
          </p>
        </div>
      </div>
    );
  }

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="w-4 h-4" />,
          text: "قيد المراجعة",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "approved":
        return {
          icon: <Check className="w-4 h-4" />,
          text: "مقبول",
          color: "bg-green-100 text-green-800 border-green-200",
        };
      case "rejected":
        return {
          icon: <X className="w-4 h-4" />,
          text: "مرفوض",
          color: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          text: status,
          color: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className=" items-center gap-4">
            <Link
              href={ROUTES_COMPANY.PRODUCTS}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للمنتجات
            </Link>
            <h1 className="text-3xl mt-5 font-bold text-gray-900">طلباتي</h1>
          </div>

          <Link
            href={ROUTES_COMPANY.NEW_PRODUCT_REQ}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            طلب إضافة منتج
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد المراجعة</option>
              <option value="approved">مقبول</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم المنتج
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ التقديم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const statusDetails = getStatusDetails(request.status);
                return (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.name_ar}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.name_en}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusDetails.color}`}
                      >
                        {statusDetails.icon}
                        {statusDetails.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.submitted_date}
                    </td>
                    <td className="px- text-center py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination count={filteredRequests.length} pageSize={8} />
      </div>
      <ProductRequestDetailsModal
        request={selectedRequest}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
