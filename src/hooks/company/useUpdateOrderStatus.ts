"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateOrderStatus } from "@/lib/actions/company/orders.action";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      warehouseId,
      reason,
    }: {
      orderId: number;
      status: "approved" | "rejected";
      warehouseId?: number;
      reason?: string;
    }) => {
      const response = await updateOrderStatus({
        orderId,
        status,
        warehouseId,
        reason,
      });

      if (!response.success) {
        throw new Error(response.error?.message || "فشل تحديث حالة الطلب");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyOrders"] });
      toast.success("تم تحديث حالة الطلب بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث حالة الطلب");
    },
  });
}
