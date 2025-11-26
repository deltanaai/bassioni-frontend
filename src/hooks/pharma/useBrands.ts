"use client";

import { useQuery } from "@tanstack/react-query";

import { IndexAllBrands } from "@/lib/actions/pharma/brands.action";

interface UseBrandsParams {
  filters?: Record<string, string | number | boolean | null>;
  page?: number;
  perPage?: number;
  orderBy?: string;
  orderByDirection?: "asc" | "desc";
}

export function useBrands({
  filters = {},
  page = 1,
  perPage = 50,
  orderBy = "id",
  orderByDirection = "desc",
}: UseBrandsParams = {}) {
  const brandsQuery = useQuery({
    queryKey: [
      "pharma-brands",
      filters,
      page,
      perPage,
      orderBy,
      orderByDirection,
    ],
    queryFn: async () => {
      const response = await IndexAllBrands({
        filters,
        page,
        perPage,
        paginate: true,
        deleted: false,
        orderBy,
        orderByDirection,
      });

      if (!response.success) {
        throw new Error(response.error?.message || "فشل في جلب البيانات");
      }

      return response;
    },
  });

  return {
    brands: brandsQuery.data?.data || [],
    meta: brandsQuery.data?.meta,
    links: brandsQuery.data?.links,
    isLoading: brandsQuery.isLoading,
    error: brandsQuery.error,
    refetch: brandsQuery.refetch,
  };
}
