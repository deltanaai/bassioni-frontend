"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiEye, FiClock, FiCheck, FiX } from "react-icons/fi";
import {
  getRequestedOfferDetails,
  showRequestedCompanyOffers,
} from "@/lib/actions/pharma/companyOffers.action";

export default function MyRequestsPage() {
  const [selectedRequest, setSelectedRequest] =
    useState<CompanyOfferResponse | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // جلب الطلبات المقدمة
  const {
    data: requestsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myRequests", currentPage],
    queryFn: () =>
      showRequestedCompanyOffers({
        page: currentPage,
        perPage: 10,
      }),
  });

  const requests = requestsData?.data?.data || [];
  const pagination = requestsData?.data?.meta;

  // عرض تفاصيل الطلب
  const showRequestDetails = async (requestId: number) => {
    try {
      const result = await getRequestedOfferDetails({ requestId });
      if (result.success) {
        setSelectedRequest(result.data as CompanyOfferResponse);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("فشل جلب تفاصيل الطلب:", error);
    }
  };

  // تحديد لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900 text-yellow-300";
      case "approved":
        return "bg-blue-900 text-blue-300";
      case "rejected":
        return "bg-red-900 text-red-300";
      case "completed":
        return "bg-emerald-900 text-emerald-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  // تحديد أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock className="w-4 h-4" />;
      case "approved":
        return <FiCheck className="w-4 h-4" />;
      case "rejected":
        return <FiX className="w-4 h-4" />;
      case "completed":
        return <FiCheck className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  // ترجمة الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "approved":
        return "مقبول";
      case "rejected":
        return "مرفوض";
      case "completed":
        return "مكتمل";
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* الهيدر */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-white">طلباتي للشركات</h1>
          <p className="text-gray-400 mt-1">
            متابعة حالة طلبات العروض المقدمة للشركات
          </p>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {pagination?.total || 0}
          </div>
          <div className="text-gray-400 text-sm">إجمالي الطلبات</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {requests.filter((r) => r.status === "pending").length}
          </div>
          <div className="text-gray-400 text-sm">قيد الانتظار</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {requests.filter((r) => r.status === "approved").length}
          </div>
          <div className="text-gray-400 text-sm">مقبولة</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-red-400">
            {requests.filter((r) => r.status === "rejected").length}
          </div>
          <div className="text-gray-400 text-sm">مرفوضة</div>
        </div>
      </div>

      {/* جدول الطلبات */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto"></div>
            <p className="text-gray-400 mt-2">جاري تحميل الطلبات...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            حدث خطأ في تحميل الطلبات
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            لا توجد طلبات مقدمة حالياً
          </div>
        ) : (
          <>
            {/* أدوات الجدول */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-750">
              <div className="text-sm text-gray-400">
                عرض {requests.length} من {pagination?.total} طلب
              </div>
              <div className="text-sm text-gray-400">
                الصفحة {currentPage} من {pagination?.last_page}
              </div>
            </div>

            {/* الجدول */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-750 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      رقم العرض
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الكمية
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      سعر الوحدة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      المبلغ الإجمالي
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {requests.map((request, index) => (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white text-sm">
                          عرض #{request.company_offer_id}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          الصيدلية: #{request.pharmacy_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 text-center">
                        {request.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-400 text-center">
                        {parseFloat(request.item_price).toFixed(2)} ج.م
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-400 text-center">
                        {request.total_price.toFixed(2)} ج.م
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            {getStatusText(request.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 text-center">
                        <div>
                          {new Date(request.created_at).toLocaleDateString(
                            "ar-EG"
                          )}
                        </div>
                        <div className="text-xs">
                          {new Date(request.created_at).toLocaleTimeString(
                            "ar-EG"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => showRequestDetails(request.id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-900 text-blue-300 rounded-lg hover:bg-blue-800 transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                            التفاصيل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* الترقيم */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex justify-center items-center p-4 border-t border-gray-700 bg-gray-750">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    السابق
                  </button>

                  {Array.from(
                    { length: Math.min(5, pagination.last_page) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pagination.last_page)
                      )
                    }
                    disabled={currentPage === pagination.last_page}
                    className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* مودال تفاصيل الطلب */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    تفاصيل الطلب #{selectedRequest.id}
                  </h2>
                  <p className="text-gray-400 mt-1">
                    معلومات كاملة عن الطلب المقدم
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-xl p-2"
                >
                  ✕
                </button>
              </div>

              {/* معلومات الطلب */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">رقم العرض</div>
                    <div className="text-white font-semibold">
                      #{selectedRequest.company_offer_id}
                    </div>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">رقم الصيدلية</div>
                    <div className="text-white font-semibold">
                      #{selectedRequest.pharmacy_id}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">الكمية المطلوبة</div>
                    <div className="text-white font-bold text-lg">
                      {selectedRequest.quantity} وحدة
                    </div>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">سعر الوحدة</div>
                    <div className="text-emerald-400 font-bold text-lg">
                      {parseFloat(selectedRequest.item_price).toFixed(2)} ج.م
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">المبلغ الإجمالي</div>
                    <div className="text-emerald-400 font-bold text-lg">
                      {selectedRequest.total_price.toFixed(2)} ج.م
                    </div>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">حالة الطلب</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          selectedRequest.status
                        )}`}
                      >
                        {getStatusIcon(selectedRequest.status)}
                        {getStatusText(selectedRequest.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">تاريخ الإنشاء</div>
                    <div className="text-white">
                      {new Date(selectedRequest.created_at).toLocaleString(
                        "ar-EG"
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">آخر تحديث</div>
                    <div className="text-white">
                      {new Date(selectedRequest.updated_at).toLocaleString(
                        "ar-EG"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
