import { useQuery } from "@tanstack/react-query";

import { getSession } from "@/lib/session";

export const useGetSession = () => {
  const {
    data: session,
    isLoading: isLoadingSession,
    refetch,
  } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    refetchInterval: 5 * 60_000, // Refetch every 5 minutes
    staleTime: 5 * 60_000, // Data is fresh for 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });

  return { session, isLoadingSession, refetch };
};
