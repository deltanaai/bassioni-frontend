"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Plus,
  Trash2,
  ArrowLeft,
  X,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ROUTES_COMPANY } from "@/constants/routes";
import { getPermissions } from "@/lib/actions/company/permissions.action";
import {
  addNewRole,
  deleteRoles,
  getAllRoles,
  updateRole,
} from "@/lib/actions/company/role.action";
import { AddNewRoleSchema, UpdateRoleSchema } from "@/schemas/company/role";
import { roleCreateInput, UpdateRoleInput } from "@/types/company/uiProps";

import PermissionsSelector from "./components/PermissionsSelector";

export default function RolesManagementPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<CompanyRole | null>(null);
  const [roleToUpdate, setRoleToUpdate] = useState<CompanyRole | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  // roles
  const { data: rolesData } = useQuery({
    queryKey: ["roles", currentPage],
    queryFn: () =>
      getAllRoles({
        page: currentPage,
        perPage: 5,
        deleted: false,
        paginate: true,
      }),
  });
  const roles = rolesData?.data || [];
  // console.log(roles);

  // permissions
  const { data: permissionsData } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });
  const permissions = permissionsData?.data || [];
  // console.log("PERMISSIONS",permissions);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues
  } = useForm<roleCreateInput>({
    resolver: zodResolver(AddNewRoleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  //   الاضافه
  const mutation = useMutation({
    mutationFn: addNewRole,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء اضافه الدور ");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["roles"] });

      setShowAddForm(false);
      reset();

      toast.success(`تم إضافه الدور بنجاح`);
    },
  });

  const onSubmit = (data: roleCreateInput) => {
    console.log("DATA: ", data);

    mutation.mutate(data);
  };

  //   الحذف
  const deleteMutation = useMutation({
    mutationFn: deleteRoles,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء حذف الدور ");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      setShowDeleteModal(false);

      toast.success("تم حذف الدور بنجاح");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({
      itemsIds: roleToDelete?.id !== undefined ? [roleToDelete.id] : [],
    });
  };

  // التعديل
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    formState: { errors: editErrors },
    reset: resetEdit,
  } = useForm<UpdateRoleInput>({
    resolver: zodResolver(UpdateRoleSchema),
  });

  useEffect(() => {
    if (showEditModal && roleToUpdate) {
      resetEdit({
        roleId: roleToUpdate.id,
        name: roleToUpdate.name,
      });
    }
  }, [showEditModal, roleToUpdate, resetEdit]);

  // التعديل
  const editMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء تعديل الدور ");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      setShowEditModal(false);

      toast.success("تم تعديل الدور بنجاح");
    },
  });
  const onSubmitEdit = (data: UpdateRoleInput) => {
    editMutation.mutate(data);
  };

  useEffect(() => {
    console.log("ERRRROOORRS",errors);
    console.log("VALUES", getValues());
    
  }, [errors, getValues]);

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6 text-gray-800">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(ROUTES_COMPANY.SETTINGS)}
            className="rounded-lg p-2 transition hover:bg-gray-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة الأدوار</h1>
            <p className="text-gray-600">إدارة أدوار المستخدمين في النظام</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          إضافة دور جديد
        </button>
      </div>

      {/* نموذج إضافة دور جديد */}
      {showAddForm && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-indigo-600">
            إضافة دور جديد
          </h3>

          <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  اسم الدور
                </label>
                <input
                  type="text"
                  placeholder="أدخل اسم الدور"
                  {...register("name")}
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 transition focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <PermissionsSelector
                permissions={permissions}
                register={register}
                errors={errors}
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {mutation.isPending ? "جار الاضافه" : "اضافه "}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                  }}
                  className="rounded-lg bg-gray-500 px-6 py-2 text-white transition hover:bg-gray-600"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* قائمة الأدوار */}
      <div className="grid gap-4">
        {(Array.isArray(roles) ? roles : []).map((role: CompanyRole) => (
          <div
            key={role.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-indigo-100 p-3">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {role.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Guard: {role.guard_name}
                  </p>
                </div>
              </div>

              <div className="flex">
                <button className=" rounded-lg p-2 text-blue-600 transition hover:bg-blue-50">
                  <Edit
                    onClick={() => {
                      setRoleToUpdate(role);
                      setShowEditModal(true);
                    }}
                    className="h-5 w-5"
                  />
                </button>
                <button
                  onClick={() => {
                    setRoleToDelete(role);
                    setShowDeleteModal(true);
                  }}
                  className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* رسالة عندما لا توجد أدوار */}
      {Array.isArray(roles) && roles.length === 0 && (
        <div className="py-12 text-center">
          <Users className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            لا توجد أدوار
          </h3>
          <p className="mb-4 text-gray-600">ابدأ بإضافة أول دور في النظام</p>
        </div>
      )}

      {/* Pagination بس لما يكون فيه اكتر من صفحة */}
      {rolesData?.meta && rolesData.meta.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-4">
          {/* السهم اليسار */}
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-600 text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>

          {/* أرقام الصفحات */}
          <div className="flex space-x-1">
            {Array.from(
              { length: rolesData.meta.last_page },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-md"
                    : "border border-indigo-600 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* السهم اليمين */}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === rolesData.meta.last_page}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-600 text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* مودال التعديل */}
      {showEditModal && roleToUpdate && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-600">
                تعديل الدور
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-1 transition hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={handleEditSubmit(onSubmitEdit)}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  اسم الدور
                </label>
                <input type="hidden" {...registerEdit("roleId")} />
                <input
                  type="text"
                  {...registerEdit("name")}
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="أدخل اسم الدور"
                />
                {editErrors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {editErrors.name.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {editMutation.isPending ? "جاري التعديل..." : "حفظ التعديلات"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-lg bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال تأكيد الحذف */}
      {showDeleteModal && roleToDelete && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {/* الهيدر */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                تأكيد الحذف
              </h3>
              <button
                onClick={() => {
                  setRoleToDelete(null);
                  setShowDeleteModal(false);
                }}
                className="rounded-lg p-1 transition hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* المحتوى */}
            <div className="space-y-4">
              <p className="text-gray-600">
                هل أنت متأكد من حذف دور{" "}
                <span className="font-semibold text-red-600 capitalize">
                  {roleToDelete.name}
                </span>
                ؟
              </p>
              <p className="text-sm text-gray-500">
                يمكنك استعادة الدور في أي وقت من خلال سلة المحذوفات
              </p>

              {/* الأزرار */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                >
                  {deleteMutation.isPending ? "جاري الحذف..." : "احذف الدور"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-lg bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
