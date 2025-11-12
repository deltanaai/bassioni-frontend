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

  // Normalize for consistent checks
  const lowerPath = pathname.toLowerCase();
  const isAuthRoute = lowerPath.startsWith("/auth");
  const userType = session?.user?.userType?.toLowerCase();

  /**
   * ✅ Always refetch session when pathname changes
   * This ensures that if the user manually deletes the session (token),
   * the guard immediately detects it and redirects appropriately.
   */
  useEffect(() => {
    refetch();
  }, [pathname, refetch]);

  useEffect(() => {
    if (isLoadingSession) return;

    // 1️⃣ If user not logged in and not on /auth -> redirect to login
    if (!session?.token && !isAuthRoute) {
      router.replace(ROUTES_OWNER.LOGIN);
      return;
    }

    // 2️⃣ If user is logged in and visiting /auth -> redirect to dashboard
    if (isAuthRoute && session?.token) {
      switch (userType) {
        case "company":
          router.replace(ROUTES_COMPANY.DASHBOARD);
          break;
        case "pharma":
          router.replace(ROUTES_PHARMA.DASHBOARD);
          break;
        default:
          router.replace(ROUTES_OWNER.MAIN_DASHBOARD);
          break;
      }
      return;
    }

    // 3️⃣ If logged in but on the wrong dashboard -> correct route
    if (session?.token && !lowerPath.startsWith(`/${userType}`)) {
      router.replace(`/${userType}`);
    }
  }, [
    session,
    isLoadingSession,
    pathname,
    router,
    isAuthRoute,
    userType,
    lowerPath,
  ]);

  // 4️⃣ While verifying session -> show loader
  if (isLoadingSession)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">جارٍ التحقق من الجلسة...</p>
      </div>
    );

  return <>{children}</>;
};

export default AuthGuard;
