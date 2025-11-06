"use client";
import { useQuery } from '@tanstack/react-query';
import { getAllDemandedOffers } from '@/lib/actions/company/responseOffers.action';
import DemandedOfferCard from './DemandedOfferCard';
import { Package } from 'lucide-react';

interface DemandedOffersListProps {
  filters: any;
  currentPage: number;
  onPageChange: (page: number) => void;
  activeTab: string;
}

export default function DemandedOffersList({ 
  filters, 
  currentPage, 
  onPageChange,
  activeTab 
}: DemandedOffersListProps) {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['demandedOffers', activeTab, filters, currentPage],
    queryFn: () => getAllDemandedOffers({
      page: currentPage,
      perPage: 10,
      filters: filters,
      paginate:true
    }),
  });
  
  const offers = response?.data?.data || [];
  console.log("offerss",offers)
  //مجربتوش لساا
  const pagination = response?.meta;
  console.log("paginationnn",pagination)

  const getTabTitle = () => {
    switch (activeTab) {
      case 'pending': return 'الطلبات قيد الانتظار';
      case 'completed': return 'الطلبات المكتملة';
      case 'cancelled': return 'الطلبات الملغية';
      default: return 'كل الطلبات';
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'pending': return 'لا توجد طلبات قيد الانتظار';
      case 'completed': return 'لا توجد طلبات مكتملة';
      case 'cancelled': return 'لا توجد طلبات ملغية';
      default: return 'لا توجد طلبات لعرضها';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg p-4 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-red-200 shadow-sm">
        <p className="text-red-600">حدث خطأ في تحميل الطلبات</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{getTabTitle()}</h2>
        <p className="text-gray-600 text-sm mt-1">
          إجمالي {pagination?.total || 0} طلب
        </p>
      </div>

      {/* قائمة الطلبات */}
      <div className="divide-y divide-gray-200">
        {offers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
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
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            عرض {offers.length} من {pagination.total}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-100 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-200"
            >
              السابق
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= pagination.last_page}
              className="px-3 py-1 bg-gray-100 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-200"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}