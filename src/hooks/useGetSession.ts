import { useQuery } from "@tanstack/react-query";

import { getSession } from "@/lib/session";

export const useGetSession = () => {
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });

  return { session, isLoadingSession };
};
