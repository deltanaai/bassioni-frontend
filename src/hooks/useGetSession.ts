import { useQuery } from "@tanstack/react-query";

import { getSession } from "@/lib/session";

export const useGetSession = () => {
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
  });

  return { session, isLoadingSession };
};
