"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { PharmaHeader } from "@/components/pharma/PharmaHeader";
import { PharmaSidebar } from "@/components/pharma/PharmaSidebar";
import { ROUTES_OWNER } from "@/constants/routes";
import { useGetSession } from "@/hooks/useGetSession";
import { useSidebar } from "@/hooks/useSidebar";
import { logoutPharmacy } from "@/lib/actions/pharma/auth.action";
import { queryClient } from "@/lib/queryClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar(false);
  const { isLoadingSession } = useGetSession();

  const mutation = useMutation({
    mutationFn: logoutPharmacy,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message || "حدث خطأ أثناء تسجيل الخروج");
        return;
      }
      toast.success("تم تسجيل الخروج بنجاح");

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push(ROUTES_OWNER.LOGIN);
    },
  });

  if (isLoadingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 mx-auto animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-gray-400">جارٍ التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white" dir="rtl">
      {/* Sidebar */}
      <PharmaSidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="flex min-h-screen flex-1 flex-col overflow-y-auto">
        {/* Header */}
        <PharmaHeader />

        {/* Page Content */}
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
