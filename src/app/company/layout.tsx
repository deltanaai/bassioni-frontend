"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { CompanyHeader } from "@/components/company/CompanyHeader";
import { CompanySidebar } from "@/components/company/CompanySidebar";
import { ROUTES_OWNER } from "@/constants/routes";
import { useGetSession } from "@/hooks/useGetSession";
import { useSidebar } from "@/hooks/useSidebar";
import { signOut } from "@/lib/actions/company/login.action";
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
    mutationFn: signOut,
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
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">جارٍ التحقق من الجلسة...</p>
      </div>
    );
  }

  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      {/* Sidebar */}
      <CompanySidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="flex min-h-screen flex-1 flex-col overflow-y-auto">
        {/* Header */}
        <CompanyHeader />

        {/* Page Content */}
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
