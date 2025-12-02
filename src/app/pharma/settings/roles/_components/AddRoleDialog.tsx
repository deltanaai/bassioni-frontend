"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateRoleSchema } from "@/schemas/pharma/roles";

import PermissionsSelector from "./PermissionsSelector";
import { useRoleMutations } from "../_hooks/useRoleMutations";

type CreateRoleFormData = z.infer<typeof CreateRoleSchema>;

interface AddRoleDialogProps {
  permissions: RolePermission[];
}

export default function AddRoleDialog({ permissions }: AddRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const { createMutation } = useRoleMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(CreateRoleSchema) as any,
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  const onSubmit = (data: CreateRoleFormData) => {
    createMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          setOpen(false);
          reset();
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r  from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Plus className="ml-2 h-5 w-5" />
          إضافة دور جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl border-gray-800 overflow-y-auto !bg-gray-950 max-h-[90vh]  shadow-2xl ">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="text-xl  font-semibold text-gray-100">
            إنشاء دور جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 ">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-400">
              اسم الدور
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="مثال: مدير الصيدلية"
              className="border-gray-800 bg-gray-900 text-gray-100 placeholder:text-gray-600 focus:border-purple-500"
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Permissions */}
          <PermissionsSelector
            permissions={permissions}
            selectedPermissions={watch("permissions")}
            onPermissionsChange={(perms: number[]) =>
              setValue("permissions", perms)
            }
          />

          {errors.permissions && (
            <p className="text-sm text-red-400">{errors.permissions.message}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-800 pt-4 ">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
            >
              {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء الدور"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
