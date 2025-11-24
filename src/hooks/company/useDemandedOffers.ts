"use client";

import { useQuery } from "@tanstack/react-query";

import { getAllDemandedOffers } from "@/lib/actions/company/responseOffers.action";

interface UseDemandedOffersParams {
  filters?: Record<string, string | number | boolean | null>;
  page?: number;
  perPage?: number;
}

export function useDemandedOffers({
  filters = {},
  page = 1,
  perPage = 10,
}: UseDemandedOffersParams = {}) {
  const offersQuery = useQuery({
    queryKey: ["demandedOffers", filters, page, perPage],
    queryFn: async () => {
      const response = await getAllDemandedOffers({
        filters,
        page,
        perPage,
        paginate: true,
        deleted: false,
      });

      if (!response.success) {
        throw new Error(response.error?.message || "فشل في جلب الطلبات");
      }

      return response;
    },
  });

  return {
    offers: offersQuery.data?.data || [],
    meta: offersQuery.data?.meta,
    links: offersQuery.data?.links,
    isLoading: offersQuery.isLoading,
    error: offersQuery.error,
    refetch: offersQuery.refetch,
  };
}
