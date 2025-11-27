import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { AddNewRoleSchema } from "@/schemas/company/role";
import { roleCreateInput } from "@/types/company/uiProps";

import PermissionsSelector from "./PermissionsSelector";

interface AddRoleFormProps {
  permissions: RolePermission[];
  mutation: UseMutationResult<
    ActionResponse<RolePermission>,
    Error,
    roleCreateInput
  >;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function AddRoleForm({
  permissions,
  mutation,
  onCancel,
  onSuccess,
}: AddRoleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<roleCreateInput>({
    resolver: zodResolver(AddNewRoleSchema) as any,
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  const onSubmit = (data: roleCreateInput) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <div className="rounded-2xl border-0 bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
        <h3 className="text-lg font-semibold text-indigo-900">
          إضافة دور جديد
        </h3>
        <button
          onClick={onCancel}
          className="rounded-lg p-1.5 text-gray-500 transition hover:bg-white hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            اسم الدور
          </label>
          <input
            type="text"
            placeholder="أدخل اسم الدور (مثال: مدير، محاسب، مشرف)"
            {...register("name")}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <PermissionsSelector
          permissions={permissions}
          register={register}
          errors={errors}
          watch={watch}
        />

        <div className="flex gap-3 border-t border-gray-200 pt-6">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {mutation.isPending ? "جاري الإضافة..." : "إضافة الدور"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
}
