"use client";

import { useQuery } from "@tanstack/react-query";

import { listCompanyOrders } from "@/lib/actions/company/orders.action";

interface UseCompanyOrdersParams {
  filters?: Record<string, string | number | boolean | null>;
}

export function useCompanyOrders({
  filters = {},
}: UseCompanyOrdersParams = {}) {
  const ordersQuery = useQuery({
    queryKey: ["companyOrders", filters],
    queryFn: async () => {
      const response = await listCompanyOrders();

      if (!response.success) {
        throw new Error(response.error?.message || "فشل في جلب الطلبات");
      }

      return response;
    },
  });

  return {
    orders: ordersQuery.data?.data || [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    refetch: ordersQuery.refetch,
  };
}
