"use client";

import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Users,
  Plus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES_COMPANY } from "@/constants/routes";
import { getPermissions } from "@/lib/actions/company/permissions.action";
import {
  addNewRole,
  deleteRoles,
  getAllRoles,
  getRoleById,
  updateRole,
} from "@/lib/actions/company/role.action";

import AddRoleForm from "./_components/AddRoleForm";
import DeleteRoleModal from "./_components/DeleteRoleModal";
import EditRoleModal from "./_components/EditRoleModal";
import RoleCard from "./_components/RoleCard";

export default function RolesManagementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showAddForm, setShowAddForm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<CompanyRole | null>(null);
  const [roleToUpdate, setRoleToUpdate] = useState<CompanyRole | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch roles
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles", currentPage],
    queryFn: () =>
      getAllRoles({
        page: currentPage,
        perPage: 10,
        deleted: false,
        paginate: true,
      }),
  });

  // Fetch permissions
  const { data: permissionsData } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  const roles = rolesData?.data || [];
  const permissions = permissionsData?.data || [];

  // Fetch detailed role data for correct permissions count
  const roleDetailsQueries = useQueries({
    queries: Array.isArray(roles)
      ? roles.map((role: CompanyRole) => ({
          queryKey: ["role", role.id],
          queryFn: () => getRoleById({ roleId: role.id }),
          enabled: !!role.id,
        }))
      : [],
  });

  const rolesWithDetails = roleDetailsQueries
    .map((query) => (query.data?.success ? query.data.data : null))
    .filter((role): role is CompanyRole => role !== null);

  // Add role mutation
  const addMutation = useMutation({
    mutationFn: addNewRole,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء إضافة الدور");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      await queryClient.invalidateQueries({ queryKey: ["role"] });
      toast.success("تم إضافة الدور بنجاح");
      setShowAddForm(false);
    },
  });

  // Update role mutation
  const updateMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء تعديل الدور");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      await queryClient.invalidateQueries({ queryKey: ["role"] });
      toast.success("تم تعديل الدور بنجاح");
      setRoleToUpdate(null);
    },
  });

  // Delete role mutation
  const deleteMutation = useMutation({
    mutationFn: deleteRoles,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء حذف الدور");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      await queryClient.invalidateQueries({ queryKey: ["role"] });
      toast.success("تم حذف الدور بنجاح");
      setRoleToDelete(null);
    },
  });

  return (
    <div className="min-h-screen space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push(ROUTES_COMPANY.SETTINGS)}
            variant="ghost"
            size="sm"
            className="rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الأدوار</h1>
            <p className="mt-1 text-gray-600">
              إدارة أدوار المستخدمين والصلاحيات في النظام
            </p>
          </div>
        </div>

        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="ml-2 h-5 w-5" />
            إضافة دور جديد
          </Button>
        )}
      </div>

      {/* Add Role Form */}
      {showAddForm && (
        <AddRoleForm
          permissions={permissions}
          mutation={addMutation}
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => setShowAddForm(false)}
        />
      )}

      {/* Roles List */}
      {isLoadingRoles ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : Array.isArray(rolesWithDetails) && rolesWithDetails.length > 0 ? (
        <div className="grid gap-4">
          {rolesWithDetails.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={setRoleToUpdate}
              onDelete={setRoleToDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
            <Users className="h-10 w-10 text-indigo-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            لا توجد أدوار بعد
          </h3>
          <p className="mb-6 text-gray-600">ابدأ بإضافة أول دور في النظام</p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="ml-2 h-5 w-5" />
            إضافة دور جديد
          </Button>
        </div>
      )}

      {/* Pagination */}
      {rolesData?.meta && rolesData.meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {Array.from(
              { length: rolesData.meta.last_page },
              (_, i) => i + 1
            ).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={`h-9 w-9 p-0 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    : ""
                }`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === rolesData.meta.last_page}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      {roleToUpdate && (
        <EditRoleModal
          role={roleToUpdate}
          permissions={permissions}
          mutation={updateMutation}
          onClose={() => setRoleToUpdate(null)}
        />
      )}

      {/* Delete Modal */}
      {roleToDelete && (
        <DeleteRoleModal
          role={roleToDelete}
          mutation={deleteMutation}
          onClose={() => setRoleToDelete(null)}
        />
      )}
    </div>
  );
}
