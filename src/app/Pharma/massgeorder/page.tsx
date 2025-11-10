"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiEye, FiClock, FiCheck, FiX } from "react-icons/fi";
import { toast } from "sonner";

import {
  cancelRequestedOffer,
  getRequestedOfferDetails,
  showRequestedCompanyOffers,
} from "@/lib/actions/pharma/companyOffers.action";
import { queryClient } from "@/lib/queryClient";

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

  const requests = requestsData?.data || [];
  const pagination = requestsData?.meta;

  // عرض تفاصيل الطلب
  const { data: requestDetailsResponse } = useQuery({
    queryKey: ["requestDetails", selectedRequest?.id],
    queryFn: () => getRequestedOfferDetails({ requestId: selectedRequest!.id }),
  });

  const cancelRequest = useMutation({
    mutationFn: (requestId: number) => cancelRequestedOffer({ requestId }),
    onSuccess: (res) => {
      if (res.success === true) {
        toast.success("تم إلغاء طلب العرض بنجاح");
        // إعادة جلب الطلبات بعد الإلغاء
        queryClient.invalidateQueries({ queryKey: ["myRequests"] });
      } else {
        toast.error(
          res.error?.message || "فشل إلغاء طلب العرض. حاول مرة أخرى."
        );
      }
    },
    onError: (error) => {
      toast.error(
        (error as Error).message || "فشل إلغاء طلب العرض. حاول مرة أخرى."
      );
    },
  });

  const handleCancelRequest = (requestId: number) => {
    if (confirm("هل أنت متأكد من إلغاء طلب العرض؟")) {
      cancelRequest.mutate(requestId);
    }
  };
  const requestDetails = requestDetailsResponse?.data;

  // const showRequestDetails = async (requestId: number) => {
  //   try {
  //     const result = await getRequestedOfferDetails({ requestId });
  //     if (result.success) {
  //       setSelectedRequest(result.data as CompanyOfferResponse);
  //       setShowDetailsModal(true);
  //     }
  //   } catch (error) {
  //     console.error("فشل جلب تفاصيل الطلب:", error);
  //   }
  // };

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
      case "canceled":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  // تحديد أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock className="h-4 w-4" />;
      case "approved":
        return <FiCheck className="h-4 w-4" />;
      case "rejected":
        return <FiX className="h-4 w-4" />;
      case "completed":
        return <FiCheck className="h-4 w-4" />;
      case "canceled":
        return <FiX className="h-4 w-4" />;
      default:
        return <FiClock className="h-4 w-4" />;
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
      case "canceled":
        return "ملغي";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-gray-900 p-6">
      {/* الهيدر */}
      <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">
        <div>
          <h1 className="text-2xl font-bold text-white">طلباتي للشركات</h1>
          <p className="mt-1 text-gray-400">
            متابعة حالة طلبات العروض المقدمة للشركات
          </p>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {pagination?.total || 0}
          </div>
          <div className="text-sm text-gray-400">إجمالي الطلبات</div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {requests.filter((r) => r.status === "pending").length}
          </div>
          <div className="text-sm text-gray-400">قيد الانتظار</div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {requests.filter((r) => r.status === "approved").length}
          </div>
          <div className="text-sm text-gray-400">مقبولة</div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {requests.filter((r) => r.status === "rejected").length}
          </div>
          <div className="text-sm text-gray-400">مرفوضة</div>
        </div>
      </div>

      {/* جدول الطلبات */}
      <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-400"></div>
            <p className="mt-2 text-gray-400">جاري تحميل الطلبات...</p>
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
            <div className="bg-gray-750 flex items-center justify-between border-b border-gray-700 p-4">
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
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      #
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      رقم العرض
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      الكمية
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      سعر الوحدة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      المبلغ الإجمالي
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      التاريخ
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
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
                        <div className="text-sm font-semibold text-white">
                          عرض #{request.company_offer_id}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          الصيدلية: #{request.pharmacy_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-300">
                        {request.quantity}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-emerald-400">
                        {parseFloat(request.item_price).toFixed(2)} ج.م
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-emerald-400">
                        {request.total_price} ج.م
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            {getStatusText(request.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">
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
                        <div className="flex flex-col justify-end gap-2 ">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetailsModal(true);
                            }}
                            className="flex flex-1 items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm text-blue-300 transition-colors hover:bg-blue-800"
                          >
                            <FiEye className="h-4 w-4" />
                            التفاصيل
                          </button>
                          {request.status === "pending" && (
                            <button
                              onClick={() => handleCancelRequest(request.id)}
                              className="flex items-center gap-2 rounded-lg bg-red-900 px-3 py-2 text-center text-sm text-red-300 transition-colors hover:bg-red-800"
                            >
                              إلغاء الطلب
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* الترقيم */}
            {pagination && pagination.last_page > 1 && (
              <div className="bg-gray-750 flex items-center justify-center border-t border-gray-700 p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg bg-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-600 disabled:opacity-50"
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
                          className={`rounded-lg px-3 py-2 text-sm transition-colors ${
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
                    className="rounded-lg bg-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-600 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-800">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    تفاصيل الطلب #{selectedRequest.id}
                  </h2>
                  <p className="mt-1 text-gray-400">
                    معلومات كاملة عن الطلب المقدم
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-xl text-gray-400 transition-colors hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* معلومات الطلب */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">رقم العرض</div>
                    <div className="font-semibold text-white">
                      #{selectedRequest.company_offer_id}
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">رقم الصيدلية</div>
                    <div className="font-semibold text-white">
                      #{selectedRequest.pharmacy_id}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">الكمية المطلوبة</div>
                    <div className="text-lg font-bold text-white">
                      {selectedRequest.quantity} وحدة
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">سعر الوحدة</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {parseFloat(selectedRequest.item_price).toFixed(2)} ج.م
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">المبلغ الإجمالي</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {selectedRequest.total_price} ج.م
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">حالة الطلب</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
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
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">تاريخ الإنشاء</div>
                    <div className="text-white">
                      {new Date(selectedRequest.created_at).toLocaleString(
                        "ar-EG"
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">آخر تحديث</div>
                    <div className="text-white">
                      {new Date(selectedRequest.updated_at).toLocaleString(
                        "ar-EG"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="rounded-xl border border-gray-600 px-6 py-2 text-gray-300 transition-colors hover:bg-gray-700"
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
