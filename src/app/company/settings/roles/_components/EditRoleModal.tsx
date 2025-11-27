import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { UpdateRoleSchema } from "@/schemas/company/role";
import { UpdateRoleInput } from "@/types/company/uiProps";

import PermissionsSelector from "./PermissionsSelector";

interface EditRoleModalProps {
  role: CompanyRole;
  permissions: RolePermission[];
  mutation: UseMutationResult<
    ActionResponse<{ message: string }>,
    Error,
    UpdateRoleInput
  >;
  onClose: () => void;
}

export default function EditRoleModal({
  role,
  permissions,
  mutation,
  onClose,
}: EditRoleModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateRoleInput>({
    resolver: zodResolver(UpdateRoleSchema) as any,
    defaultValues: {
      name: role.name,
      permissions: role.permissions.map((p) => p.id),
    },
  });

  useEffect(() => {
    const permissionIds = role.permissions?.map((p) => p.id) || [];
    reset({
      roleId: role.id,
      name: role.name,
      permissions: permissionIds,
    });
  }, [role, reset]);

  const onSubmit = (data: UpdateRoleInput) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center  justify-center bg-black/50 p-4">
      <div className="my-8 w-full max-w-4xl rounded-2xl bg-white overflow-y-auto max-h-[95vh] shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-blue-900">تعديل الدور</h3>
          <button
            onClick={onClose}
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
            <input type="hidden" {...register("roleId")} />
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="أدخل اسم الدور"
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {mutation.isPending ? "جاري التعديل..." : "حفظ التعديلات"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
