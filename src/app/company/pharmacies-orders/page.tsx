"use client";

import { Package2, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompanyOrders } from "@/hooks/company/useCompanyOrders";
import { useDemandedOffers } from "@/hooks/company/useDemandedOffers";

import {
  OfferCard,
  OfferDetailsModal,
  OrderCard,
  OrderDetailsModal,
  OrdersStats,
} from "./_components";

type OrderType = "orders" | "offers";
type StatusFilter = "all" | "pending" | "approved" | "rejected" | "completed";

export default function PharmaciesOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderType>("orders");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Fetch data
  const { orders, isLoading: ordersLoading } = useCompanyOrders();
  const {
    offers,
    meta,
    isLoading: offersLoading,
  } = useDemandedOffers({ page: currentPage });

  // Filter orders by status
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  // Filter offers by status
  const filteredOffers = useMemo(() => {
    if (statusFilter === "all") return offers;
    return offers.filter((offer) => offer.status === statusFilter);
  }, [offers, statusFilter]);

  // Calculate stats for orders
  const ordersStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "rejected").length,
      approved: orders.filter((o) => o.status === "approved").length,
    };
  }, [orders]);

  // Calculate stats for offers
  const offersStats = useMemo(() => {
    return {
      total: offers.length,
      pending: offers.filter((o) => o.status === "pending").length,
      completed: offers.filter((o) => o.status === "completed").length,
      approved: offers.filter((o) => o.status === "approved").length,
      cancelled: offers.filter((o) => o.status === "rejected").length,
    };
  }, [offers]);

  const handleViewOrderDetails = (order: CompanyOrder) => {
    setSelectedOrderId(order.order_id);
    setIsOrderModalOpen(true);
  };

  const handleViewOfferDetails = (offer: CompanyResponseOffers) => {
    setSelectedOfferId(offer.id);
    setIsOfferModalOpen(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as OrderType);
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const renderStatusFilters = () => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setStatusFilter("all")}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          statusFilter === "all"
            ? "bg-emerald-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        الكل
      </button>
      <button
        onClick={() => setStatusFilter("pending")}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          statusFilter === "pending"
            ? "bg-yellow-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        قيد الانتظار
      </button>
      <button
        onClick={() => setStatusFilter("approved")}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          statusFilter === "approved"
            ? "bg-emerald-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        موافق عليه
      </button>
      <button
        onClick={() => setStatusFilter("completed")}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          statusFilter === "completed"
            ? "bg-emerald-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        مكتمل
      </button>
      <button
        onClick={() => setStatusFilter("rejected")}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          statusFilter === "rejected"
            ? "bg-red-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        مرفوض
      </button>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-emerald-100 p-3">
          <ShoppingCart className="h-7 w-7 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">طلبات الصيدليات</h1>
          <p className="text-sm text-gray-600">
            إدارة طلبات الصيدليات وطلبات العروض
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} dir="rtl">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="orders" className="gap-2">
            <Package2 className="h-4 w-4" />
            الطلبات العادية
          </TabsTrigger>
          <TabsTrigger value="offers" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            طلبات العروض
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          {/* Stats */}
          <OrdersStats
            total={ordersStats.total}
            pending={ordersStats.pending}
            completed={ordersStats.completed}
            cancelled={ordersStats.cancelled}
            approved={ordersStats.approved}
          />

          {/* Status Filters */}
          <div className="flex items-center justify-between">
            {renderStatusFilters()}
            <div className="text-sm text-gray-600">
              {filteredOrders.length} نتيجة
            </div>
          </div>

          {/* Orders List */}
          {ordersLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-gray-400">
              <Package2 className="h-16 w-16" />
              <p className="text-lg font-medium">لا توجد طلبات</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onViewDetails={handleViewOrderDetails}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Offers Tab */}
        <TabsContent value="offers" className="space-y-6">
          {/* Stats */}
          <OrdersStats
            total={offersStats.total}
            pending={offersStats.pending}
            completed={offersStats.completed}
            cancelled={offersStats.cancelled}
            approved={ordersStats.approved}
          />

          {/* Status Filters */}
          <div className="flex items-center justify-between">
            {renderStatusFilters()}
            <div className="text-sm text-gray-600">
              {filteredOffers.length} نتيجة
            </div>
          </div>

          {/* Offers List */}
          {offersLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-gray-400">
              <ShoppingCart className="h-16 w-16" />
              <p className="text-lg font-medium">لا توجد طلبات عروض</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onViewDetails={handleViewOfferDetails}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.total > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-sm text-gray-600">
                عرض {filteredOffers.length} من {meta.total}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  السابق
                </button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm font-medium text-gray-900">
                    {currentPage}
                  </span>
                  <span className="text-sm text-gray-500">من</span>
                  <span className="text-sm font-medium text-gray-900">
                    {meta.last_page}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(meta.last_page, p + 1))
                  }
                  disabled={currentPage >= meta.last_page}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <OrderDetailsModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrderId(null);
        }}
        orderId={selectedOrderId}
      />
      <OfferDetailsModal
        isOpen={isOfferModalOpen}
        onClose={() => {
          setIsOfferModalOpen(false);
          setSelectedOfferId(null);
        }}
        offerId={selectedOfferId}
      />
    </div>
  );
}
