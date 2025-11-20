"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { usePharmacySession } from "@/hooks/usePharmacySession";
import { showPharmacyOrders } from "@/lib/actions/company/pharmacyOrders";
import {
  cancelRequestedOffer,
  showRequestedCompanyOffers,
} from "@/lib/actions/pharma/companyOffers.action";
import { queryClient } from "@/lib/queryClient";

import EmptyOrders from "./_components/EmptyOrders";
import OrderCard from "./_components/OrderCard";
import OrderTypeFilter from "./_components/OrderTypeFilter";

type UnifiedOrder = {
  id: number;
  type: "default" | "offer";
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  referenceId: number;
  items?: PharmacyOrderItem[];
};

export default function MyOrdersPage() {
  const session = usePharmacySession();
  const pharmacyId = session.pharmacist?.pharmacy.id;
  const [filter, setFilter] = useState<"all" | "default" | "offer">("all");

  // Fetch offer-based orders
  const {
    data: requestsData,
    isLoading: isLoadingOffers,
    error: offersError,
  } = useQuery({
    queryKey: ["requestedOffers", pharmacyId],
    queryFn: () =>
      showRequestedCompanyOffers({
        page: 1,
        perPage: 100,
      }),
    enabled: !!pharmacyId,
  });

  // Fetch default product orders
  const {
    data: ordersResponse,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: ["pharmacyOrders", pharmacyId],
    queryFn: () => showPharmacyOrders({ pharmacyId: pharmacyId! }),
    enabled: !!pharmacyId,
  });

  // Combine and normalize both datasets
  const unifiedOrders = useMemo(() => {
    const orders = ordersResponse?.data || [];
    const requests = requestsData?.data || [];

    const defaultOrders: UnifiedOrder[] = orders.map((order) => ({
      id: order.order_id,
      type: "default",
      quantity: order.items.reduce(
        (acc, item) => acc + Number(item.quantity),
        0
      ),
      totalPrice: Number(order.total_price),
      status: order.status,
      createdAt: order.created_at,
      referenceId: order.order_id,
      items: order.items,
    }));

    const offerOrders: UnifiedOrder[] = requests.map((req) => ({
      id: req.id,
      type: "offer",
      quantity: req.quantity,
      totalPrice: req.total_price,
      status: req.status,
      createdAt: req.createdAt,
      referenceId: req.offer.id,
    }));

    return [...defaultOrders, ...offerOrders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [ordersResponse, requestsData]);

  // Apply filter
  const filteredOrders = useMemo(() => {
    if (filter === "all") return unifiedOrders;
    return unifiedOrders.filter((o) => o.type === filter);
  }, [filter, unifiedOrders]);

  // Calculate counts for filter badges
  const counts = useMemo(
    () => ({
      all: unifiedOrders.length,
      default: unifiedOrders.filter((o) => o.type === "default").length,
      offer: unifiedOrders.filter((o) => o.type === "offer").length,
    }),
    [unifiedOrders]
  );

  // Cancel offer request mutation
  const cancelMutation = useMutation({
    mutationFn: (requestId: number) => cancelRequestedOffer({ requestId }),
    onSuccess: (res) => {
      if (res.success === true) {
        toast.success("تم إلغاء الطلب بنجاح");
        queryClient.invalidateQueries({ queryKey: ["requestedOffers"] });
        queryClient.invalidateQueries({ queryKey: ["pharmacyOrders"] });
      } else {
        toast.error(res.error?.message || "فشل إلغاء الطلب");
      }
    },
    onError: () => {
      toast.error("فشل إلغاء الطلب. حاول مرة أخرى.");
    },
  });

  const handleCancelOrder = (orderId: number) => {
    if (confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) {
      cancelMutation.mutate(orderId);
    }
  };

  const isLoading = isLoadingOffers || isLoadingOrders;
  const error = offersError || ordersError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-24 w-full bg-gray-700" />
          <Skeleton className="h-16 w-full bg-gray-700" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">خطأ في تحميل الطلبات</h3>
                <p className="text-sm">{(error as Error).message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
            <ClipboardList className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">طلبات الصيدلية</h1>
            <p className="text-gray-400">
              {unifiedOrders.length > 0
                ? `${unifiedOrders.length} طلب إجمالي`
                : "لا توجد طلبات"}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <OrderTypeFilter
          activeFilter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={`${order.type}-${order.id}`}
                order={order}
                onCancel={handleCancelOrder}
                isCanceling={cancelMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
