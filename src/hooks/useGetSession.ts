import { getSession } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";

export const useGetSession = () => {
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
  });

  return { session, isLoadingSession };
};
