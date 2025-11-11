import { getAllAdmins } from "@/lib/actions/owner/admins.action";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

function useGetAdmins() {
  const searchParams = useSearchParams();

  // قراءة القيم من URL
  const name = searchParams.get("name") || undefined;
  const email = searchParams.get("email") || undefined;
  const orderBy = searchParams.get("orderBy") || "id";
  const orderByDirection = (searchParams.get("orderByDirection") || "desc") as
    | "asc"
    | "desc";
  const page = searchParams.get("page") || "1";

  // بناء الفلاتر
  const filters: Record<string, string> = {};
  if (name) filters.name = name;
  if (email) filters.email = email;

  const params: getAllAdminsPayload = {
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    orderBy,
    orderByDirection,
    page: Number(page),
  };

  const {
    data: adminsData,
    isLoading: isLoadingAdmins,
    refetch,
  } = useQuery({
    queryKey: ["admins", params],
    queryFn: async () => await getAllAdmins(params),
  });

  return { adminsData, isLoadingAdmins, refetch };
}

export default useGetAdmins;
