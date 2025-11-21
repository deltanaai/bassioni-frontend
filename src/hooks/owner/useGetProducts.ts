import { getAllProducts } from "@/lib/actions/owner/products.actions";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

function useGetProducts() {
  const searchParams = useSearchParams();

  // Read values from URL
  const name = searchParams.get("name") || undefined;
  const category_id = searchParams.get("category_id") || undefined;
  const brand_id = searchParams.get("brand_id") || undefined;
  const show_home = searchParams.get("show_home") || undefined;
  const active = searchParams.get("active") || undefined;
  const orderBy = searchParams.get("orderBy") || "id";
  const deleted = searchParams.get("deleted");
  const orderByDirection = (searchParams.get("orderByDirection") || "desc") as
    | "asc"
    | "desc";
  const page = searchParams.get("page") || "1";


  // Build filters
  const filters: Record<string, string | number | boolean> = {};
   if (name) filters.search_index = name;
  if (category_id) filters.category_id = category_id;
  if (brand_id) filters.brand_id = brand_id;
  if (show_home) filters.show_home = show_home === "true"; 
  if (active) filters.active = active === "true"; 



  const params: GetAllProductsPayload = {
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    orderBy,
    orderByDirection,
    page: Number(page),
    deleted:deleted==="true"
  };
  console.log(params,"paramss")

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch,
  } = useQuery({
    queryKey: ["products", params],
    queryFn: async () => await getAllProducts(params),
  });

  return { productsData, isLoadingProducts, refetch };
}

export default useGetProducts;
