"use client";

import { Settings } from "lucide-react";

import ErrorDisplay from "@/components/pharma/settings/ErrorDisplay";
import PharmacistInfoCard from "@/components/pharma/settings/PharmacistInfoCard";
import PharmacyInfoCard from "@/components/pharma/settings/PharmacyInfoCard";
import RolesManagementCard from "@/components/pharma/settings/RolesManagementCard";
import { SettingsPageSkeleton } from "@/components/pharma/settings/SettingsPageSkeleton";
import { usePharmacySession } from "@/hooks/usePharmacySession";

import { usePharmacySettings } from "./_hooks/usePharmacySettings";

export default function SettingsPage() {
  const { pharmacist, isLoadingSession } = usePharmacySession();
  const { rolesCount, isLoadingRoles, rolesError } = usePharmacySettings();

  if (isLoadingSession || isLoadingRoles) {
    return <SettingsPageSkeleton />;
  }

  if (!pharmacist?.pharmacy) {
    return (
      <ErrorDisplay message="لم يتم العثور على بيانات الصيدلية. يرجى تسجيل الدخول مرة أخرى." />
    );
  }

  if (rolesError) {
    return (
      <ErrorDisplay message="فشل تحميل بيانات الصلاحيات. يرجى المحاولة لاحقاً." />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">الإعدادات</h1>
            <p className="text-gray-400">
              إدارة معلومات الصيدلية والصلاحيات
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="space-y-6">
        {/* Info Cards Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PharmacyInfoCard pharmacy={pharmacist.pharmacy} />
          <PharmacistInfoCard pharmacist={pharmacist} />
        </div>

        {/* Roles Management Card */}
        <RolesManagementCard rolesCount={rolesCount} />
      </div>
    </div>
  );
}
