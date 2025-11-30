"use client";

import { useQuery } from "@tanstack/react-query";

import { showPharmacyRole } from "@/lib/actions/pharma/roles.action";

export function useRoleDetails(roleId: number | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["pharmacy-role", roleId],
    queryFn: async () => {
      if (!roleId) return null;

      const result = await showPharmacyRole({ roleId });

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch role details");
      }

      return result.data;
    },
    enabled: enabled && !!roleId,
  });
}
