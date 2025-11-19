"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Building,
  Phone,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import DataFieldCard from "@/components/settings/DataFieldCard";
import RolePreviewItem from "@/components/settings/RolePreviewItem";
import SectionCard from "@/components/settings/SectionCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES_COMPANY } from "@/constants/routes";
import { getCompanyInfo } from "@/lib/actions/company/company.action";
import { getAllRoles, getRoleById } from "@/lib/actions/company/role.action";

export default function SettingsPage() {
  const router = useRouter();

  const {
    data: companyData,
    isLoading: isLoadingCompany,
    error: companyError,
  } = useQuery({
    queryKey: ["companyData"],
    queryFn: getCompanyInfo,
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles", 1],
    queryFn: () =>
      getAllRoles({ page: 1, perPage: 5, deleted: false, paginate: true }),
  });

  const company = companyData?.success ? companyData.data : null;
  const roles = rolesData?.data || [];
  const pagination = rolesData?.meta;
  const totalRoles = pagination ? pagination.total : 0;

  // Fetch detailed data for each role to get accurate permission counts
  const roleDetailsQueries = useQueries({
    queries: Array.isArray(roles)
      ? roles.slice(0, 3).map((role: CompanyRole) => ({
          queryKey: ["role", role.id],
          queryFn: () => getRoleById({ roleId: role.id }),
          enabled: !!role.id,
        }))
      : [],
  });

  const isLoadingRoleDetails = roleDetailsQueries.some(
    (query) => query.isLoading
  );
  const rolesWithDetails = roleDetailsQueries
    .map((query) => (query.data?.success ? query.data.data : null))
    .filter((role): role is CompanyRole => role !== null);

  if (isLoadingCompany) {
    return (
      <div className="min-h-screen space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (companyError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-lg">
          <p className="text-red-600">حدث خطأ في تحميل بيانات الشركة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
          <p className="mt-1 text-gray-600">إدارة معلومات الشركة والأدوار</p>
        </div>
      </div>

      {/* Company Information */}
      <SectionCard
        title="معلومات الشركة"
        description="البيانات الأساسية للشركة"
        icon={Building}
        gradientFrom="from-blue-500"
        gradientTo="to-blue-600"
        badge={{
          text: company && !company.deleted ? "نشطة" : "غير متاحة",
          className:
            company && !company.deleted
              ? "bg-green-500 hover:bg-green-600"
              : "",
        }}
      >
        {company ? (
          <div className="grid gap-6 md:grid-cols-2">
            <DataFieldCard
              icon={Building}
              label="اسم الشركة"
              value={company.name || ""}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              hoverBgColor="from-blue-50"
              hoverBorderColor="blue-300"
            />
            <DataFieldCard
              icon={Phone}
              label="رقم الهاتف"
              value={company.phone || ""}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              hoverBgColor="from-purple-50"
              hoverBorderColor="purple-300"
            />
            <DataFieldCard
              icon={MapPin}
              label="العنوان"
              value={company.address || ""}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              hoverBgColor="from-green-50"
              hoverBorderColor="green-300"
            />
            <DataFieldCard
              icon={Calendar}
              label="تاريخ الإنشاء"
              value={
                company.createdAt
                  ? new Date(company.createdAt).toLocaleDateString("ar-EG")
                  : "غير محدد"
              }
              iconBgColor="bg-orange-100"
              iconColor="text-orange-600"
              hoverBgColor="from-orange-50"
              hoverBorderColor="orange-300"
            />
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Building className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500">لا توجد بيانات للشركة</p>
          </div>
        )}
      </SectionCard>

      {/* Roles Management */}
      <SectionCard
        title="إدارة الأدوار"
        description="الأدوار والصلاحيات في النظام"
        icon={Users}
        gradientFrom="from-indigo-500"
        gradientTo="to-indigo-600"
        badge={{
          text: `${totalRoles} ${totalRoles === 1 ? "دور" : "أدوار"}`,
          className: "bg-white/20 text-white backdrop-blur-sm",
          variant: "secondary",
        }}
      >
        <div className="space-y-4">
          {isLoadingRoles || isLoadingRoleDetails ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : rolesWithDetails.length > 0 ? (
            <div className="space-y-3">
              {rolesWithDetails.map((role) => (
                <RolePreviewItem key={role.id} role={role} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Users className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">لا توجد أدوار بعد</p>
            </div>
          )}

          <Button
            onClick={() => router.push(ROUTES_COMPANY.ROLES)}
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
            size="lg"
          >
            <Users className="ml-2 h-5 w-5" />
            إدارة جميع الأدوار
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
