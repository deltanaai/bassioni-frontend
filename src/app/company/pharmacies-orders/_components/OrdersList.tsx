"use client";

import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";

import { listCompanyOrders } from "@/lib/actions/company/orders.action";
import { getAllDemandedOffers } from "@/lib/actions/company/responseOffers.action";

import DemandedOfferCard from "./DemandedOfferCard";

interface OrdersListProps {
  filters: any;
  currentPage: number;
  onPageChange: (page: number) => void;
  activeTab: string;
}

export default function OrdersList({
  filters,
  currentPage,
  onPageChange,
  activeTab,
}: OrdersListProps) {
  // Fetch both in parallel
  const { data, isLoading, error } = useQuery({
    queryKey: ["ordersAndOffers", activeTab, filters, currentPage],
    queryFn: async () => {
      const [ordersRes, offersRes] = await Promise.all([
        listCompanyOrders({ companyId: 1 }), // TODO: use actual companyId
        getAllDemandedOffers({
          page: currentPage,
          perPage: 10,
          paginate: true,
        }),
      ]);

      return {
        orders: ordersRes?.data ?? [],
        offers: offersRes?.data ?? [],
        meta: offersRes?.meta,
      };
    },
  });

  const orders = data?.orders || [];
  const offers = data?.offers || [];
  const pagination = data?.meta;

  // Combine both lists
  const combinedOrders = [
    ...orders.map((order) => ({ ...order, type: "order" })),
    ...offers.map((offer) => ({ ...offer, type: "offer" })),
  ];

  // Optional: sort by created date if both share it
  combinedOrders.sort((a, b) => {
    const dateA = new Date(a.created_at ?? 0).getTime();
    const dateB = new Date(b.created_at ?? 0).getTime();
    return dateB - dateA;
  });

  const getTabTitle = () => {
    switch (activeTab) {
      case "pending":
        return "الطلبات قيد الانتظار";
      case "completed":
        return "الطلبات المكتملة";
      case "cancelled":
        return "الطلبات الملغية";
      default:
        return "كل الطلبات";
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "pending":
        return "لا توجد طلبات قيد الانتظار";
      case "completed":
        return "لا توجد طلبات مكتملة";
      case "cancelled":
        return "لا توجد طلبات ملغية";
      default:
        return "لا توجد طلبات لعرضها";
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-gray-200 p-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
        <p className="text-red-600">حدث خطأ في تحميل الطلبات</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900">{getTabTitle()}</h2>
        <p className="mt-1 text-sm text-gray-600">
          إجمالي {pagination?.total || 0} طلب
        </p>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-200">
        {combinedOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Package className="mx-auto mb-4 h-16 w-16 opacity-50" />
            <p>{getEmptyMessage()}</p>
          </div>
        ) : (
          combinedOrders.map((item) => (
            <DemandedOfferCard
              key={`${item.type}-${item.id}`}
              offer={item}
              activeTab={activeTab}
              showBadge={item.type === "offer"}
            />
          ))
        )}
      </div>

      {/* Pagination (from offers only) */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            عرض {offers.length} من {pagination.total}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 bg-gray-100 px-3 py-1 hover:bg-gray-200 disabled:opacity-50"
            >
              السابق
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= pagination.last_page}
              className="rounded border border-gray-300 bg-gray-100 px-3 py-1 hover:bg-gray-200 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
