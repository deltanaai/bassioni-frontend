"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewRole,
  deleteRoles,
  getAllRoles,
  updateRole,
} from "@/lib/actions/company/role.action";
import { useForm } from "react-hook-form";
import { roleCreateInput, UpdateRoleInput } from "@/types/company/uiProps";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddNewRoleSchema, UpdateRoleSchema } from "@/schemas/company/role";
import { toast } from "sonner";
import { ROUTES_COMPANY } from "@/constants/routes";
import { getPermissions } from "@/lib/actions/company/permissions.action";
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

  //roles
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
  console.log(roles);

  //permissions
  const { data: permissionsData } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });
  const permissions = permissionsData?.data || [];
  console.log(permissions);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<roleCreateInput>({
    resolver: zodResolver(AddNewRoleSchema),
    defaultValues: {
      name: "",
      permissions: []
    }
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

  //التعديل
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

  //التعديل
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

  return (
    <div className="p-6 space-y-6 bg-gray-50 text-gray-800 min-h-screen">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(ROUTES_COMPANY.SETTINGS)}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة الأدوار</h1>
            <p className="text-gray-600">إدارة أدوار المستخدمين في النظام</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          إضافة دور جديد
        </button>
      </div>

      {/* نموذج إضافة دور جديد */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-indigo-600 mb-4">
            إضافة دور جديد
          </h3>

          <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الدور
                </label>
                <input
                  type="text"
                  placeholder="أدخل اسم الدور"
                  {...register("name")}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
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
                  onClick={() => {
                    setShowAddForm(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition"
                >
                  {mutation.isPending ? "جار الاضافه" : "اضافه "}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
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
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Users className="w-6 h-6 text-indigo-600" />
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
                <button className=" p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Edit
                    onClick={() => {
                      setRoleToUpdate(role);
                      setShowEditModal(true);
                    }}
                    className="w-5 h-5"
                  />
                </button>
                <button
                  onClick={() => {
                    setRoleToDelete(role);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* رسالة عندما لا توجد أدوار */}
      {Array.isArray(roles) && roles.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد أدوار
          </h3>
          <p className="text-gray-600 mb-4">ابدأ بإضافة أول دور في النظام</p>
        </div>
      )}

      {/* Pagination بس لما يكون فيه اكتر من صفحة */}
      {rolesData?.meta && rolesData.meta.last_page > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          {/* السهم اليسار */}
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-indigo-600 border border-indigo-600 hover:bg-indigo-100"
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
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* مودال التعديل */}
      {showEditModal && roleToUpdate && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-600">
                تعديل الدور
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={handleEditSubmit(onSubmitEdit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الدور
                </label>
                <input type="hidden" {...registerEdit("roleId")} />
                <input
                  type="text"
                  {...registerEdit("name")}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="أدخل اسم الدور"
                />
                {editErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {editErrors.name.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
                >
                  {editMutation.isPending ? "جاري التعديل..." : "حفظ التعديلات"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            {/* الهيدر */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                تأكيد الحذف
              </h3>
              <button
                onClick={() => {
                  setRoleToDelete(null);
                  setShowDeleteModal(false);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
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
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  {deleteMutation.isPending ? "جاري الحذف..." : "احذف الدور"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
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
