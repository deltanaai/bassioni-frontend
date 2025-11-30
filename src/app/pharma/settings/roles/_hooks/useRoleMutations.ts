"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createPharmacyRole,
  deletePharmacyRoles,
  updatePharmacyRole,
} from "@/lib/actions/pharma/roles.action";

export function useRoleMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPharmacyRole,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "تم إنشاء الدور بنجاح");
        queryClient.invalidateQueries({ queryKey: ["pharmacy-roles"] });
      } else {
        toast.error(data.message || "فشل إنشاء الدور");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء الدور");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePharmacyRole,
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success(data.message || "تم تحديث الدور بنجاح");
        queryClient.invalidateQueries({ queryKey: ["pharmacy-roles"] });
        // Invalidate the specific role details to reflect changes immediately
        queryClient.invalidateQueries({
          queryKey: ["pharmacy-role", variables.roleId],
        });
      } else {
        toast.error(data.message || "فشل تحديث الدور");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث الدور");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePharmacyRoles,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "تم حذف الأدوار بنجاح");
        queryClient.invalidateQueries({ queryKey: ["pharmacy-roles"] });
      } else {
        toast.error(data.message || "فشل حذف الأدوار");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف الأدوار");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
