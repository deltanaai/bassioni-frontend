import { useGetSession } from "./useGetSession";

export const usePharmacySession = () => {
  const { session, ...rest } = useGetSession();

  const pharmacist = session?.user as Pharmacist | undefined;

  return { session, pharmacist, ...rest };
};
