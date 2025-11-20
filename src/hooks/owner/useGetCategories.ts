import { getAllCategories } from "@/lib/actions/owner/categories.actions";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

function useGetCategories() {
  const searchParams = useSearchParams();

  // Read values from URL
  const name = searchParams.get("name") || undefined;
  const showHome = searchParams.get("showHome") || undefined;
  const active = searchParams.get("active") || undefined;
  const orderBy = searchParams.get("orderBy") || "id";
  const deleted = searchParams.get("deleted") ;
  const orderByDirection = (searchParams.get("orderByDirection") || "desc") as
    | "asc"
    | "desc";
  const page = searchParams.get("page") || "1";

  // Build filters
  const filters: Record<string, string | boolean | number> = {};
  if (name) filters.name = name;
  if (showHome) filters.showHome = showHome === "true";
  if (active) filters.active = active === "true";

  const params: GetAllCategoriesPayload = {
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    orderBy,
    orderByDirection,
    page: Number(page),
    deleted: deleted==="true"
  };

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    refetch,
  } = useQuery({
    queryKey: ["categories", params],
    queryFn: async () => await getAllCategories(params),
  });

  return { categoriesData, isLoadingCategories, refetch };
}

export default useGetCategories;
