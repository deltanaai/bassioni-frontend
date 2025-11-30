"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateRoleSchema } from "@/schemas/pharma/roles";

import PermissionsSelector from "./PermissionsSelector";
import { useRoleDetails } from "../_hooks/useRoleDetails";
import { useRoleMutations } from "../_hooks/useRoleMutations";

const UpdateRoleSchema = CreateRoleSchema.extend({
  roleId: z.number(),
});

type UpdateRoleFormData = z.infer<typeof UpdateRoleSchema>;

interface EditRoleDialogProps {
  role: CompanyRole | null;
  permissions: RolePermission[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditRoleDialog({
  role,
  permissions,
  open,
  onOpenChange,
}: EditRoleDialogProps) {
  const { updateMutation } = useRoleMutations();

  // Fetch full role details with permissions
  const { data: roleDetails, isLoading: isLoadingDetails } = useRoleDetails(
    role?.id || null,
    open && !!role
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UpdateRoleFormData>({
    resolver: zodResolver(UpdateRoleSchema) as any,
  });

  useEffect(() => {
    if (roleDetails) {
      reset({
        roleId: roleDetails.id,
        name: roleDetails.name,
        permissions: roleDetails.permissions?.map((p) => p.id) || [],
      });
    }
  }, [roleDetails, reset]);

  const onSubmit = (data: UpdateRoleFormData) => {
    updateMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          onOpenChange(false);
        }
      },
    });
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-gray-800 bg-gray-950 shadow-2xl">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-100">
            تعديل الدور: {role.name}
          </DialogTitle>
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <input type="hidden" {...register("roleId")} />

            {/* Role Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-400"
              >
                اسم الدور
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="مثال: مدير الصيدلية"
                className="border-gray-800 bg-gray-900 text-gray-100 placeholder:text-gray-600 focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Permissions */}
            <PermissionsSelector
              permissions={permissions}
              selectedPermissions={watch("permissions")}
              onPermissionsChange={(perms) => setValue("permissions", perms)}
            />

            {errors.permissions && (
              <p className="text-sm text-red-400">
                {errors.permissions.message}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 border-t border-gray-800 pt-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
              >
                {updateMutation.isPending ? "جاري التحديث..." : "حفظ التغييرات"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              >
                إلغاء
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
