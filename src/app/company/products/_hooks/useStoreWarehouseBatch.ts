"use client";

import { useMutation } from "@tanstack/react-query";

import { storeWarehouseBatchProduct } from "@/lib/actions/company/warehouseProducts.action";

export function useStoreWarehouseBatch() {
  return useMutation({
    mutationFn: storeWarehouseBatchProduct,
  });
}
