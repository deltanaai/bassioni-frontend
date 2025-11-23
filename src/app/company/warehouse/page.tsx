"use client";

import { Package, Plus, Warehouse as WarehouseIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AddWarehouseModal } from "@/components/warehouse";
import { useWarehouses } from "@/hooks/warehouse";

import WarehouseFilters from "./_components/WarehouseFilters";
import WarehouseSearch from "./_components/WarehouseSearch";
import WarehousesGrid from "./_components/WarehousesGrid";

export default function WarehousesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  const { data, isLoading, isError } = useWarehouses(currentPage);

  const warehouses = useMemo(() => data?.data || [], [data?.data]);

  // Client-side filtering with useMemo
  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((warehouse) => {
      const matchesSearch =
        searchQuery === "" ||
        warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.code?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && warehouse.active === true) ||
        (selectedStatus === "inactive" && warehouse.active === false);

      const matchesLocation =
        selectedLocation === "all" || warehouse.location === selectedLocation;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [warehouses, searchQuery, selectedStatus, selectedLocation]);

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedLocation("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
            <Package className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-emerald-600">المخازن</h1>
            <p className="text-gray-600">إدارة وتنظيم مخازن الشركة</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          إضافة مخزن
        </button>
      </div>

      {/* Search and Filters Section */}
      <div className="mb-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <WarehouseSearch value={searchQuery} onChange={setSearchQuery} />
        <WarehouseFilters
          selectedStatus={selectedStatus}
          selectedLocation={selectedLocation}
          onStatusChange={setSelectedStatus}
          onLocationChange={setSelectedLocation}
          onClearFilters={handleClearFilters}
          totalWarehouses={filteredWarehouses.length}
          warehouses={warehouses}
        />
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
            <p className="text-gray-600">جاري تحميل المخازن...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <WarehouseIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-red-900">
              حدث خطأ أثناء تحميل المخازن
            </h2>
            <p className="text-red-700">الرجاء المحاولة مرة أخرى</p>
          </div>
        </div>
      ) : (
        <>
          <WarehousesGrid warehouses={filteredWarehouses} />

          {/* Pagination */}
          {data?.meta && data.meta.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-emerald-600 bg-white text-emerald-600 shadow-sm transition-all hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white"
              >
                ←
              </button>

              <div className="flex gap-1">
                {Array.from(
                  { length: Math.min(data.meta.last_page, 5) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold shadow-sm transition-all ${
                      currentPage === page
                        ? "bg-emerald-600 text-white shadow-md"
                        : "border-2 border-emerald-600 bg-white text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(data?.meta?.last_page ?? prev + 1, prev + 1)
                  )
                }
                disabled={currentPage === data.meta.last_page}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-emerald-600 bg-white text-emerald-600 shadow-sm transition-all hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white"
              >
                →
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <AddWarehouseModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
