"use client";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";

import { getAllDemandedOffers } from "@/lib/actions/company/responseOffers.action";

import DemandedOfferCard from "./DemandedOfferCard";

interface DemandedOffersListProps {
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
}: DemandedOffersListProps) {
  const {
    data: offersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["demandedOffers", activeTab, filters, currentPage],
    queryFn: () =>
      getAllDemandedOffers({
        page: currentPage,
        perPage: 10,
        paginate: true,
      }),
  });

  // const {
    
  // } = useQuery({
  //   queryKey: ["orders", activeTab, filters, currentPage],
  //   queryFn:()=> 
  // })

 

  const offers = offersResponse?.data || [];
  console.log("offerss", offers);
  // مجربتوش لساا
  const pagination = offersResponse?.meta;
  console.log("paginationnn", pagination);

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

      {/* قائمة الطلبات */}
      <div className="divide-y divide-gray-200">
        {offers.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Package className="mx-auto mb-4 h-16 w-16 opacity-50" />
            <p>{getEmptyMessage()}</p>
          </div>
        ) : (
          offers.map((offer) => (
            <DemandedOfferCard
              key={offer.id}
              offer={offer}
              activeTab={activeTab}
            />
          ))
        )}
      </div>

      {/* Pagination */}
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
