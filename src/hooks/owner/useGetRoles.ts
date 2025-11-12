"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllRoles,
  getAllPermissions,
} from "@/lib/actions/owner/roles.actions";

export function useGetRoles() {
  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const permissionsQuery = useQuery({
    queryKey: ["permissions"],
    queryFn: () => getAllPermissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    roles: rolesQuery.data?.data || [],
    permissions: permissionsQuery.data?.data || [],
    isLoading: rolesQuery.isLoading || permissionsQuery.isLoading,
    error: rolesQuery.error || permissionsQuery.error,
    refetch: () => {
      rolesQuery.refetch();
      permissionsQuery.refetch();
    },
  };
}
