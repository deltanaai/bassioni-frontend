"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import {
  WarehouseHeader,
  WarehousesGrid,
  AddWarehouseModal,
} from "@/components/warehouse";
import { useWarehouses } from "@/hooks/warehouse";

export default function WarehousesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, isError } = useWarehouses(currentPage);

  const warehouses = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <WarehouseHeader />

        <div className="-mt-20">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            إضافة مخزن
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
            <p>جاري تحميل المخازن...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="mt-8 text-center text-red-600">
          حدث خطأ أثناء تحميل المخازن
        </div>
      ) : (
        <div className="mt-6">
          <WarehousesGrid warehouses={warehouses} />

          {/* Pagination */}
          {data?.meta && data.meta.last_page > 1 && (
            <div className="mt-6 flex items-center justify-center space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-600 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                ←
              </button>

              <div className="flex space-x-1">
                {Array.from(
                  { length: data.meta.last_page },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-emerald-600 text-white shadow-md"
                        : "border border-emerald-600 text-emerald-600 hover:bg-emerald-100"
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
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-600 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                →
              </button>
            </div>
          )}
        </div>
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
