"use client";
import { useState } from 'react';
import DemandedOffersList from './_components/DemandedOffersList';
import OffersFilter from './_components/OffersFilter';

type TabType = 'all' | 'pending' | 'completed' | 'cancelled';

export default function DemandedOffersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filters, setFilters] = useState({
    company: '',
    dateFrom: '',
    dateTo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const getTabFilters = () => {
    const baseFilters = { ...filters };
    
    switch (activeTab) {
      case 'pending':
        return { ...baseFilters, status: 'pending' };
      case 'completed':
        return { ...baseFilters, status: 'accepted' };
      case 'cancelled':
        return { ...baseFilters, status: 'rejected' };
      default:
        return baseFilters;
    }
  };

  const tabs = [
    { id: 'all' as TabType, name: 'كل الطلبات', count: 0 },
    { id: 'pending' as TabType, name: 'قيد الانتظار', count: 0 },
    { id: 'completed' as TabType, name: 'مكتمل', count: 0 },
    { id: 'cancelled' as TabType, name: 'ملغي', count: 0 },
  ];

  return (
    <div className="p-6 min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">طلبات العروض المقدمة</h1>
        <p className="text-gray-600">إدارة طلبات العروض والرد عليها</p>
      </div>

      {/* التبويبات */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-8 rtl:space-x-reverse">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`
                  whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className={`
                    ml-2 py-0.5 px-2 text-xs rounded-full
                    ${activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* الفلاتر */}
      {activeTab !== 'completed' && activeTab !== 'cancelled' && (
        <div className="mb-6">
          <OffersFilter 
          // TODO : لسا مفيش فلتره ب status فانا عملته اوبشنال في جزء الفلتره
            filters={filters}
            onFiltersChange={setFilters}
            showStatusFilter={activeTab === 'all'}
          />
        </div>
      )}

      {/* قائمة الطلبات */}
      <DemandedOffersList 
        filters={getTabFilters()}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        activeTab={activeTab}
      />
    </div>
  );
}