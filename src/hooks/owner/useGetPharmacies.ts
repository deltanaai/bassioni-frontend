"use client"

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getAllPharmacies } from "@/lib/actions/owner/pharmacy.actions";

export function useGetPharmacies() {
  const searchParams = useSearchParams();

  // Build filters from URL params
  const filters: Record<string, string | number | boolean | null> = {};

  const name = searchParams.get("name");
  if (name) filters.name = name;

  const phone = searchParams.get("phone");
  if (phone) filters.phone = phone;

  const address = searchParams.get("address");
  if (address) filters.address = address;

  const owner_email = searchParams.get("owner_email");
  if (owner_email) filters.owner_email = owner_email;

  const page = searchParams.get("page");
  const currentPage = page ? parseInt(page) : 1;
  const deleted = searchParams.get("deleted");


  const orderBy = searchParams.get("orderBy") || undefined;
  const orderByDirection =
    (searchParams.get("orderByDirection") as "asc" | "desc") || undefined;

  const {
    data: pharmaciesData,
    isLoading: isLoadingPharmacies,
    refetch,
  } = useQuery({
    queryKey: ["pharmacies", filters, currentPage, orderBy, orderByDirection, deleted],
    queryFn: async () => {
      const response = await getAllPharmacies({
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        page: currentPage,
        paginate: true,
        orderBy,
        orderByDirection,
        deleted: deleted === "true",

      });
      return response;
    },
  });

  return {
    pharmaciesData,
    isLoadingPharmacies,
    refetch,
  };
}
