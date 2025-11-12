"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import {
  ROUTES_COMPANY,
  ROUTES_OWNER,
  ROUTES_PHARMA,
} from "@/constants/routes";
import { useGetSession } from "@/hooks/useGetSession";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { session, isLoadingSession, refetch } = useGetSession();

  const isAuthRoute = pathname.startsWith("/auth");
  // const userType =
  //   session?.user && "pharmacy" in session.user ? "pharmacy" : "company";

  useEffect(() => {
    if (!isAuthRoute) refetch();
  }, [refetch, pathname, isAuthRoute]);

  useEffect(() => {
    if (isLoadingSession) return;
    console.log("session data: ", session);
    if (!session?.token && !isAuthRoute) {
      router.replace(ROUTES_OWNER.LOGIN);
      return;
    }

    if (isAuthRoute && session?.token) {
      if (session?.user.userType === "Company")
        router.replace(ROUTES_COMPANY.DASHBOARD);
      else if (session?.user.userType === "Pharma")
        router.replace(ROUTES_PHARMA.DASHBOARD);
      else router.replace(ROUTES_OWNER.MAIN_DASHBOARD);
      return;
    }

    // if (
    //   session?.user.userType === "company" &&
    //   pathname.startsWith("/Company")
    // ) {
    //   router.replace(ROUTES_COMPANY.DASHBOARD);
    // } else if (
    //   session?.user.userType === "pharmacist" &&
    //   pathname.startsWith("/Pharma")
    // ) {
    //   router.replace(ROUTES_PHARMA.DASHBOARD);
    // } else if (
    //   session?.user.userType === "owner" &&
    //   pathname.startsWith("/Owner")
    // ) {
    //   router.replace(ROUTES_OWNER.MAIN_DASHBOARD);
    // }

    if (session?.token && !pathname.startsWith(`/${session?.user.userType}`)) {
      router.replace(`/${(session?.user.userType)?.toLowerCase()}`);
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
