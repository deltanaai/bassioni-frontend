import { getAllBrands } from "@/lib/actions/owner/brands.actions";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

function useGetBrands() {
  const searchParams = useSearchParams();

  // Read values from URL
  const name = searchParams.get("name") || undefined;
  const showHome = searchParams.get("showHome") || undefined;
  const active = searchParams.get("active") || undefined;
  const orderBy = searchParams.get("orderBy") || "id";
  const deleted = searchParams.get("deleted");
  const orderByDirection = (searchParams.get("orderByDirection") || "desc") as
    | "asc"
    | "desc";
  const page = searchParams.get("page") || "1";

  // Build filters
  const filters: Record<string, string | boolean | number> = {};
  if (name) filters.name = name;
  if (showHome) filters.showHome = showHome === "true" ? true : false;
  if (active) filters.active = active === "true" ? true : false;
  const params: GetAllBrandsPayload = {
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    orderBy,
    orderByDirection,
    page: Number(page),
    deleted: deleted==="true",
  };

  const {
    data: brandsData,
    isLoading: isLoadingBrands,
    refetch,
  } = useQuery({
    queryKey: ["brands", params],
    queryFn: async () => await getAllBrands(params),
  });

  return { brandsData, isLoadingBrands, refetch };
}

export default useGetBrands;
