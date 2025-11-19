"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

// locations removed: backend doesn't have locations collection so avoid fetching
import { getMasterProducts } from "@/lib/actions/company/masterProducts";
import {
  deleteWarehouse,
  getWarehouse,
  updateWarehouse,
} from "@/lib/actions/company/warehouse.action";
import {
  deleteProductFromWarehouse,
  getAllWarehouseProducts,
  storeWarehouseProduct,
} from "@/lib/actions/company/warehouseProducts.action";
import { queryClient } from "@/lib/queryClient";

export default function useWarehouseDetails(warehouseId: number) {
  const warehouseQuery = useQuery({
    queryKey: ["warehouse", warehouseId],
    queryFn: () => getWarehouse({ warehouseId }),
    enabled: !isNaN(warehouseId),
  });

  const masterQuery = useQuery({
    queryKey: ["masters"],
    queryFn: () => getMasterProducts({}),
  });

  // locationsQuery removed to avoid unnecessary network call

  const productsQuery = useQuery({
    queryKey: ["warehouseProducts", warehouseId],
    queryFn: () => getAllWarehouseProducts({ warehouseId }),
    enabled: !isNaN(warehouseId),
  });

  const editMutation = useMutation({
    mutationFn: updateWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse", warehouseId] });
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });

  const addProductMutation = useMutation({
    mutationFn: storeWarehouseProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouseProducts", warehouseId],
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductFromWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouseProducts", warehouseId],
      });
    },
  });

  return {
    warehouseQuery,
    masterQuery,
    productsQuery,
    editMutation,
    deleteMutation,
    addProductMutation,
    deleteProductMutation,
    queryClient,
  };
}
