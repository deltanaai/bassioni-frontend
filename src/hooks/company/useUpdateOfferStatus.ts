"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateDemandedOfferStatus } from "@/lib/actions/company/responseOffers.action";

export function useUpdateOfferStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      offerId,
      status,
      warehouseId,
    }: {
      offerId: number;
      status: "pending" | "approved" | "rejected";
      warehouseId: number;
    }) => {
      const response = await updateDemandedOfferStatus({
        offerId,
        status,
        warehouseId,
      });

      if (!response.success) {
        throw new Error(response.error?.message || "فشل تحديث حالة العرض");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demandedOffers"] });
      toast.success("تم تحديث حالة العرض بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث حالة العرض");
    },
  });
}
