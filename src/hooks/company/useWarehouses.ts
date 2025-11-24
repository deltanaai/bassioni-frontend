"use client";

import { useQuery } from "@tanstack/react-query";

import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";

export function useWarehouses() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await getAllWarehouses({ paginate: false });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "فشل في جلب المستودعات");
      }

      return response.data;
    },
  });

  return {
    warehouses: data || [],
    isLoading,
    error,
    refetch,
  };
}
