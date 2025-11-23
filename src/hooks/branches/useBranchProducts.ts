"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  branchProductsIndex,
  importBranchProducts,
} from "@/lib/actions/pharma/branchProducts.action";
import { queryClient } from "@/lib/queryClient";

export default function useBranchProducts(branchId: number) {
  const productsQuery = useQuery({
    queryKey: ["branchProducts", branchId],
    queryFn: () => branchProductsIndex({ branchId }),
    enabled: !isNaN(branchId),
  });

  const importMutation = useMutation({
    mutationFn: importBranchProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["branchProducts", branchId],
      });
    },
  });

  return {
    productsQuery,
    importMutation,
    queryClient,
  };
}
