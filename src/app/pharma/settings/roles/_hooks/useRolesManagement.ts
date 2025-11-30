"use client";

import { useQuery } from "@tanstack/react-query";

import {
  indexPharmacyRoles,
  showPharmacyRolePermissions,
} from "@/lib/actions/pharma/roles.action";

export function useRolesManagement() {
  // Fetch all roles
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ["pharmacy-roles"],
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

  // Fetch all available permissions
  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
    error: permissionsError,
  } = useQuery({
    queryKey: ["pharmacy-permissions"],
    queryFn: async () => {
      const result = await showPharmacyRolePermissions();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch permissions");
      }

      return result.data || [];
    },
  });

  return {
    roles: rolesData || [],
    permissions: permissionsData || [],
    isLoading: isLoadingRoles || isLoadingPermissions,
    error: rolesError || permissionsError,
    refetchRoles,
  };
}
