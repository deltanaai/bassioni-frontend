"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {  FiClock, FiCheck, FiX } from "react-icons/fi";
import { toast } from "sonner";

import { useGetSession } from "@/hooks/useGetSession";
import { showPharmacyOrders } from "@/lib/actions/company/pharmacyOrders";
import {
  cancelRequestedOffer,
  showRequestedCompanyOffers,
} from "@/lib/actions/pharma/companyOffers.action";
import { queryClient } from "@/lib/queryClient";

export default function MyRequestsPage() {
  const session = useGetSession();
  const pharmacyId = session?.session?.user.pharmacy?.id;
  const [filter, setFilter] = useState<"all" | "default" | "offer">("all");
  const [currentPage, setCurrentPage] = useState(1);

  /** 🔹 Fetch offer-based orders */
  const {
    data: requestsData,
    isLoading: isLoadingOffers,
    error: offersError,
  } = useQuery({
    queryKey: ["myRequests", currentPage],
    queryFn: () =>
      showRequestedCompanyOffers({
        page: currentPage,
        perPage: 10,
      }),
  });

  /** 🔹 Fetch default product orders */
  const {
    data: ordersResponse,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: ["pharmacyOrders", pharmacyId],
    queryFn: () => showPharmacyOrders({ pharmacyId: pharmacyId! }),
    enabled: !!pharmacyId,
  });

  /** 🔹 Combine both datasets into unified shape */
  const unifiedOrders = useMemo(() => {
    /** 🔹 Extract and normalize data */
    const orders = ordersResponse?.data || [];
    const requests = requestsData?.data || [];
    console.log("ORDERS",orders);
    console.log("REQUESTS",requests);
    
    const defaultOrders =
      orders.map((order) => ({
        id: order.order_id,
        type: "default",
        quantity: order.items.reduce(
          (acc, item) => acc + Number(item.quantity),
          0
        ),
        // itemPrice: Number(order.unit_price),
        totalPrice: Number(order.total_price),
        status: order.status,
        createdAt: order.created_at,
        // updatedAt: order.updated_at,
        referenceId: order.order_id,
      })) || [];

    const offerOrders =
      requests.map((req) => ({
        id: req.id,
        type: "offer",
        quantity: req.quantity,
        itemPrice: parseFloat(req.item_price),
        totalPrice: req.total_price,
        status: req.status,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt,
        referenceId: req.offer.id,
      })) || [];

    return [...defaultOrders, ...offerOrders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [ordersResponse, requestsData]);

  /** 🔹 Apply filter */
  const filteredOrders = useMemo(() => {
    if (filter === "all") return unifiedOrders;
    return unifiedOrders.filter((o) => o.type === filter);
  }, [filter, unifiedOrders]);

  /** 🔹 Cancel an offer request */
  const cancelRequest = useMutation({
    mutationFn: (requestId: number) => cancelRequestedOffer({ requestId }),
    onSuccess: (res) => {
      if (res.success === true) {
        toast.success("تم إلغاء طلب العرض بنجاح");
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

  /** 🔹 Helpers for status display */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900 text-yellow-300";
      case "approved":
        return "bg-blue-900 text-blue-300";
      case "rejected":
      case "canceled":
        return "bg-red-900 text-red-300";
      case "completed":
        return "bg-emerald-900 text-emerald-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock className="h-4 w-4" />;
      case "approved":
      case "completed":
        return <FiCheck className="h-4 w-4" />;
      case "rejected":
      case "canceled":
        return <FiX className="h-4 w-4" />;
      default:
        return <FiClock className="h-4 w-4" />;
    }
  };

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

  const isLoadingCombined = isLoadingOffers || isLoadingOrders;
  const isErrorCombined = offersError || ordersError;

  return (
    <div className="min-h-screen space-y-6 bg-gray-900 p-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">
        <h1 className="text-2xl font-bold text-white">طلبات الصيدلية</h1>
        <p className="mt-1 text-gray-400">
          تشمل الطلبات على المنتجات والعروض الخاصة بالشركات
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-3">
        {[
          { label: "كل الطلبات", value: "all" },
          { label: "الطلبات العادية", value: "default" },
          { label: "عروض الشركات", value: "offer" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as "all" | "default" | "offer")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-emerald-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">
        {isLoadingCombined ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-400"></div>
            <p className="mt-2 text-gray-400">جاري تحميل الطلبات...</p>
          </div>
        ) : isErrorCombined ? (
          <div className="p-8 text-center text-red-400">
            حدث خطأ في تحميل الطلبات
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            لا توجد طلبات ضمن هذا التصنيف
          </div>
        ) : (
          <>
            <div className="bg-gray-750 flex items-center justify-between border-b border-gray-700 p-4">
              <div className="text-sm text-gray-400">
                عرض {filteredOrders.length} طلب
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-750 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase">
                      #
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase">
                      المرجع
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase">
                      الكمية
                    </th>
                    {/* <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase">
                      سعر الوحدة
                    </th> */}
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase">
                      الإجمالي
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase">
                      التاريخ
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase">
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={`${order.type}-${order.id}`}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            #{order.referenceId}
                          </span>
                          {order.type === "offer" && (
                            <span className="rounded-full bg-blue-900 px-2 py-1 text-xs text-blue-300">
                              عرض شركة
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-300">
                        {order.quantity}
                      </td>
                      {/* <td className="px-6 py-4 text-center text-sm text-emerald-400">
                        {order.itemPrice.toFixed(2)} ج.م
                      </td> */}
                      <td className="px-6 py-4 text-center text-sm font-bold text-emerald-400">
                        {order.totalPrice} ج.م
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {
                          // order.type === "offer" &&
                          order.status === "pending" && (
                            <button
                              onClick={() => handleCancelRequest(order.id)}
                              className="rounded-lg bg-red-900 px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-800"
                            >
                              إلغاء الطلب
                            </button>
                          )
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
