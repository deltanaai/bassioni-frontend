"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getAllCompanies } from "@/lib/actions/owner/compnay.actions";

export function useGetCompanies() {
  const searchParams = useSearchParams();

  const filters: Record<string, string | number | boolean | null> = {};

  // Build filters from URL search params
  const name = searchParams.get("name");
  if (name) filters.name = name;

  const address = searchParams.get("address");
  if (address) filters.address = address;

  const phone = searchParams.get("phone");
  if (phone) filters.phone = phone;

  const owner_email = searchParams.get("owner_email");
  if (owner_email) filters.owner_email = owner_email;


  // Get pagination and sorting params
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage");
  const orderBy = searchParams.get("orderBy");
  const orderByDirection = searchParams.get("orderByDirection");

  const deleted = searchParams.get("deleted");

  const queryParams = {
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    page: page ? parseInt(page) : undefined,
    perPage: perPage ? parseInt(perPage) : undefined,
    orderBy: orderBy || undefined,
    orderByDirection: (orderByDirection as "asc" | "desc") || undefined,
    paginate: true,
    deleted: deleted === "true",

  };



  return useQuery({
    queryKey: ["companies", queryParams],
    queryFn: () => getAllCompanies(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
