"use client";

import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import ErrorDisplay from "@/components/pharma/settings/ErrorDisplay";
import { SettingsPageSkeleton } from "@/components/pharma/settings/SettingsPageSkeleton";

import AddRoleDialog from "./_components/AddRoleDialog";
import DeleteRoleDialog from "./_components/DeleteRoleDialog";
import EditRoleDialog from "./_components/EditRoleDialog";
import RoleCard from "./_components/RoleCard";
import { useRolesManagement } from "./_hooks/useRolesManagement";

export default function RolesManagementPage() {
  const { roles, permissions, isLoading, error, refetchRoles } =
    useRolesManagement();

  const [editingRole, setEditingRole] = useState<CompanyRole | null>(null);
  const [deletingRole, setDeletingRole] = useState<{
    id: number;
    name: string;
  } | null>(null);

  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  if (error) {
    return (
      <ErrorDisplay
        message="فشل تحميل بيانات الأدوار والصلاحيات"
        retry={refetchRoles}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/pharma/settings"
          className="mb-4 inline-flex items-center gap-2 text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة إلى الإعدادات
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">إدارة الصلاحيات</h1>
              <p className="text-gray-400">
                إدارة أدوار الموظفين والصلاحيات المتاحة
              </p>
            </div>
          </div>

          <AddRoleDialog permissions={permissions} />
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-purple-900/20 to-purple-800/20 p-4">
            <p className="text-sm text-gray-400">إجمالي الأدوار</p>
            <p className="text-3xl font-bold text-white">{roles.length}</p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-indigo-900/20 to-indigo-800/20 p-4">
            <p className="text-sm text-gray-400">الصلاحيات المتاحة</p>
            <p className="text-3xl font-bold text-white">{permissions.length}</p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 p-4">
            <p className="text-sm text-gray-400">الأدوار النشطة</p>
            <p className="text-3xl font-bold text-white">{roles.length}</p>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      {roles.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-800">
                <Shield className="h-10 w-10 text-gray-600" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              لا توجد أدوار بعد
            </h3>
            <p className="mb-6 text-gray-400">
              ابدأ بإنشاء أول دور للموظفين
            </p>
            <AddRoleDialog permissions={permissions} />
          </div>
        </div>
      ) : (
        <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={setEditingRole}
              onDelete={(id) =>
                setDeletingRole({ id, name: role.name })
              }
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <EditRoleDialog
        role={editingRole}
        permissions={permissions}
        open={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
      />

      {/* Delete Dialog */}
      <DeleteRoleDialog
        roleId={deletingRole?.id || null}
        roleName={deletingRole?.name || ""}
        open={!!deletingRole}
        onOpenChange={(open) => !open && setDeletingRole(null)}
      />
    </div>
  );
}
