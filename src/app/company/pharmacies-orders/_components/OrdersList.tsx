"use client";

import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { useState } from "react";

import { listCompanyOrders } from "@/lib/actions/company/orders.action";
import { getAllDemandedOffers } from "@/lib/actions/company/responseOffers.action";

import DemandedOfferCard from "./DemandedOfferCard";

interface OrdersListProps {
  filters?: Record<string, unknown>;
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
  // Local view: show orders or offers
  const [viewSource, setViewSource] = useState<"orders" | "offers">("orders");

  // Fetch orders separately
  const ordersQuery = useQuery({
    queryKey: ["companyOrders", filters, currentPage, activeTab],
    queryFn: async () => {
      const res = await listCompanyOrders({ companyId: 1 }); // TODO: use actual companyId
      return res;
    },
  });

  // Fetch offers separately (paginated)
  const offersQuery = useQuery({
    queryKey: ["demandedOffers", currentPage, filters, activeTab],
    queryFn: async () => {
      const res = await getAllDemandedOffers({
        page: currentPage,
        perPage: 10,
        paginate: true,
      });
      return res;
    },
  });

  const orders = ordersQuery.data?.data ?? [];
  const offers = offersQuery.data?.data ?? [];
  const pagination = offersQuery.data?.meta;

  console.log("ORDERS:", orders);
  console.log("OFFERS:", offers);

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

  const displayList = viewSource === "orders" ? orders : offers;
  const isLoading =
    viewSource === "orders" ? ordersQuery.isLoading : offersQuery.isLoading;
  const fetchError =
    viewSource === "orders" ? ordersQuery.error : offersQuery.error;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{getTabTitle()}</h2>
          <p className="mt-1 text-sm text-gray-600">
            إجمالي{" "}
            {viewSource === "offers" ? pagination?.total ?? 0 : orders.length}{" "}
            طلب
          </p>
        </div>

        {/* Source tabs: Orders | Offers */}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setViewSource("orders")}
            className={`rounded-xl px-3 py-1 text-sm font-medium ${
              viewSource === "orders"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            الطلبات
          </button>
          <button
            onClick={() => setViewSource("offers")}
            className={`rounded-xl px-3 py-1 text-sm font-medium ${
              viewSource === "offers"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            طلبات العروض
          </button>
        </div>
      </div>

      {/* Orders / Offers List */}
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-gray-200 p-4"></div>
              ))}
            </div>
          </div>
        ) : fetchError ? (
          <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
            <p className="text-red-600">حدث خطأ في تحميل البيانات</p>
          </div>
        ) : displayList.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Package className="mx-auto mb-4 h-16 w-16 opacity-50" />
            <p>{getEmptyMessage()}</p>
          </div>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          displayList.map((item: any) => (
            <DemandedOfferCard
              key={`${viewSource}-${item.id}`}
              offer={item}
              activeTab={activeTab}
              showBadge={viewSource === "offers"}
            />
          ))
        )}
      </div>

      {/* Pagination (offers only) */}
      {viewSource === "offers" && pagination && pagination.total > 0 && (
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
