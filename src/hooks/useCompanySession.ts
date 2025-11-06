import { useGetSession } from "@/hooks/useGetSession";

export const useCompanySession = () => {
  const { session, ...rest } = useGetSession();

  const companyUser = session?.user as SessionUser | undefined;

  return { session, companyUser, ...rest };
};
