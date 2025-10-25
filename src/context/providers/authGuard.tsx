"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import ROUTES from "@/constants/routes";
import { useGetSession } from "@/hooks/useGetSession";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { session, isLoadingSession, refetch } = useGetSession();

  const isAuthRoute = pathname.startsWith("/auth");
  const userType = "company";

  useEffect(() => {
    if (!isAuthRoute) refetch();
  }, [refetch, pathname, isAuthRoute]);

  useEffect(() => {
    if (isLoadingSession) return;

    if (!session?.token && !isAuthRoute) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (isAuthRoute && session?.token) {
      if (userType === "company") router.replace(ROUTES.COMPANY_DASHBOARD);
      else if (userType === "pharmacy") router.replace(ROUTES.PHARMA_DASHBOARD);
      return;
    }

    if (userType === "company" && pathname.startsWith("/Pharma")) {
      router.replace(ROUTES.COMPANY_DASHBOARD);
    } else if (userType !== "company" && pathname.startsWith("/company")) {
      router.replace(ROUTES.PHARMA_DASHBOARD);
    }
  }, [session, isLoadingSession, pathname, router, isAuthRoute]);

  if (isLoadingSession)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">جارٍ التحقق من الجلسة...</p>
      </div>
    );

  return <>{children}</>;
};

export default AuthGuard;
