"use client";

import { useQuery } from "@tanstack/react-query";

import { IndexAllCategories } from "@/lib/actions/pharma/categories.action";

interface UseCategoriesParams {
  filters?: Record<string, string | number | boolean | null>;
  page?: number;
  perPage?: number;
  orderBy?: string;
  orderByDirection?: "asc" | "desc";
}

export function useCategories({
  filters = {},
  page = 1,
  perPage = 50,
  orderBy = "id",
  orderByDirection = "desc",
}: UseCategoriesParams = {}) {
  const categoriesQuery = useQuery({
    queryKey: [
      "pharma-categories",
      filters,
      page,
      perPage,
      orderBy,
      orderByDirection,
    ],
    queryFn: async () => {
      const response = await IndexAllCategories({
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
    categories: categoriesQuery.data?.data || [],
    meta: categoriesQuery.data?.meta,
    links: categoriesQuery.data?.links,
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,
    refetch: categoriesQuery.refetch,
  };
}
