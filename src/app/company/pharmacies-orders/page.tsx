"use client";
import { useState } from "react";

import OffersFilter from "./_components/OffersFilter";
import OrdersList from "./_components/DemandedOffersList";

type TabType = "all" | "pending" | "completed" | "cancelled";

export default function DemandedOffersPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [filters, setFilters] = useState({
    company: "",
    dateFrom: "",
    dateTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const getTabFilters = () => {
    const baseFilters = { ...filters };

    switch (activeTab) {
      case "pending":
        return { ...baseFilters, status: "pending" };
      case "completed":
        return { ...baseFilters, status: "approved" };
      case "cancelled":
        return { ...baseFilters, status: "rejected" };
      default:
        return baseFilters;
    }
  };

  const tabs = [
    { id: "all" as TabType, name: "كل الطلبات", count: 0 },
    { id: "pending" as TabType, name: "قيد الانتظار", count: 0 },
    { id: "completed" as TabType, name: "مكتمل", count: 0 },
    { id: "cancelled" as TabType, name: "ملغي", count: 0 },
  ];

  return (
    <div className="min-h-screen bg-white p-6 text-gray-900">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">طلبات العروض المقدمة</h1>
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
                  border-b-2 px-2 py-4 text-sm font-medium whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }
                `}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span
                    className={`
                    ml-2 rounded-full px-2 py-0.5 text-xs
                    ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* الفلاتر */}
      {activeTab !== "completed" && activeTab !== "cancelled" && (
        <div className="mb-6">
          <OffersFilter
            // TODO : لسا مفيش فلتره ب status فانا عملته اوبشنال في جزء الفلتره
            filters={filters}
            onFiltersChange={setFilters}
            showStatusFilter={activeTab === "all"}
          />
        </div>
      )}

      {/* قائمة الطلبات */}
      <OrdersList
        filters={getTabFilters()}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        activeTab={activeTab}
      />
    </div>
  );
}
