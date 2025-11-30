"use client";

import { useQuery } from "@tanstack/react-query";

import { indexPharmacyRoles } from "@/lib/actions/pharma/roles.action";

export function usePharmacySettings() {
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useQuery({
    queryKey: ["pharmacy-roles-count"],
    queryFn: async () => {
      const result = await indexPharmacyRoles({
        paginate: false,
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch roles");
      }

      return result.data || [];
    },
  });

  return {
    roles: rolesData || [],
    rolesCount: rolesData?.length || 0,
    isLoadingRoles,
    rolesError,
  };
}
