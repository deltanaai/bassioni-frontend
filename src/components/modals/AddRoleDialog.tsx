"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema } from "@/schemas/owner/roles";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addOrUpdateRole } from "@/lib/actions/owner/roles.actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PERMISSION_LABELS } from "@/constants";
import SpinnerMini from "../custom/SpinnerMini";

interface AddRoleDialogProps {
  role?: RoleViewT | null;
  trigger?: React.ReactNode;
  showTrigger?: boolean;
  triggerText?: string | React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  permissions?: PermissionT[];
  featuredPermission?: PermissionT;
}

export default function AddRoleDialog({
  role = null,
  trigger,
  showTrigger = true,
  triggerText,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  permissions = [],
  featuredPermission,
}: AddRoleDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const isEditMode = !!role;

  const form = useForm<RoleT>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });
  const queryClient = useQueryClient();

  // Update form values when role prop changes (for edit mode)
  React.useEffect(() => {
    if (role) {
      form.reset({
        id: role.id,
        name: role.name,
        permissions: role.permissions?.map((p) => p.id) || [],
      });
    } else {
      form.reset({
        name: "",
        permissions: [],
      });
    }
  }, [role, form]);

  const onSubmit = async (data: RoleT) => {
    try {
      console.log("Form data:", data);
      const response = await addOrUpdateRole(data);
      console.log(response);
      if (response && response.success) {
        // Invalidate and refetch roles query to update the list
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("roles")
            ),
        });
        toast.success(
          isEditMode ? "تم تحديث الدور بنجاح" : "تم إضافة الدور بنجاح"
        );
        // Close dialog and reset form on success
        setOpen(false);
        form.reset();
      } else {
        toast.error(
          isEditMode ? "حدث خطأ أثناء تحديث الدور" : "حدث خطأ أثناء إضافة الدور"
        );
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    const currentPermissions = form.getValues("permissions") || [];

    if (featuredPermission && permissionId === featuredPermission.id) {
      if (checked) {
        form.setValue("permissions", [permissionId]);
      } else {
        form.setValue("permissions", []);
      }
      return;
    }

    if (checked) {
      form.setValue("permissions", [...currentPermissions, permissionId]);
    } else {
      form.setValue(
        "permissions",
        currentPermissions.filter((id) => id !== permissionId)
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!trigger && showTrigger && (
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            {triggerText || (
              <>
                <Plus className="w-5 h-5" />
                إضافة دور جديد
              </>
            )}
          </button>
        </DialogTrigger>
      )}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {isEditMode ? "تعديل الدور" : "إضافة دور جديد"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الدور</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم الدور"
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permissions Section */}
            <div className="space-y-4">
              <FormLabel className="text-base font-semibold">
                الأذونات
              </FormLabel>

              {/* الصلاحية الكبيره */}
              {featuredPermission && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id={`permission-${featuredPermission.id}`}
                      checked={
                        form
                          .watch("permissions")
                          ?.includes(featuredPermission.id) || false
                      }
                      onChange={(e) =>
                        handlePermissionChange(
                          featuredPermission.id,
                          e.target.checked
                        )
                      }
                      className=" w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      htmlFor={`permission-${featuredPermission.id}`}
                      className="mr-1 text-sm font-medium leading-none cursor-pointer text-blue-800"
                    >
                      {PERMISSION_LABELS[featuredPermission.name] ||
                        featuredPermission.name}
                    </label>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    هذه الصلاحية تمنح جميع الصلاحيات الأخرى
                  </p>
                </div>
              )}

              {/* الصلاحيات العادية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {permissions.length > 0 ? (
                  permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <input
                        type="checkbox"
                        id={`permission-${permission.id}`}
                        checked={
                          form.watch("permissions")?.includes(permission.id) ||
                          false
                        }
                        onChange={(e) =>
                          handlePermissionChange(
                            permission.id,
                            e.target.checked
                          )
                        }
                        disabled={form
                          .watch("permissions")
                          ?.includes(featuredPermission?.id || 0)}
                        className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
                          form
                            .watch("permissions")
                            ?.includes(featuredPermission?.id || 0)
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-gray-100"
                        }`}
                      />
                      <label
                        htmlFor={`permission-${permission.id}`}
                        className={`mr-1 text-sm font-medium leading-none cursor-pointer ${
                          form
                            .watch("permissions")
                            ?.includes(featuredPermission?.id || 0)
                            ? "text-gray-400 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {PERMISSION_LABELS[permission.name] || permission.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm col-span-2">
                    لا توجد أذونات متاحة
                  </p>
                )}
              </div>
              <FormMessage />
            </div>

            <DialogFooter className="gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <SpinnerMini />
                ) : isEditMode ? (
                  "تحديث"
                ) : (
                  "حفظ"
                )}
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
