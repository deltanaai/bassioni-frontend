"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSchema } from "@/schemas/owner/admins";
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
import { Switch } from "@/components/ui/Switch";
import z from "zod";
import { addOrUpdateAdmin } from "@/lib/actions/owner/admins.action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import SpinnerMini from "../custom/SpinnerMini";
import { useGetRoles } from "@/hooks/owner/useGetRoles";

type AdminFormValues = z.infer<typeof adminSchema>;

interface AddAdminDialogProps {
  admin?: AdminViewT | null;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddAdminDialog({
  admin = null,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddAdminDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const isEditMode = !!admin;

  const { roles, isLoading: rolesLoading } = useGetRoles();

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      superAdmin: false,
      role_id: undefined,
    },
  });
  const queryClient = useQueryClient();

  // Update form values when admin prop changes (for edit mode)
  useEffect(() => {
    if (admin) {
      form.reset({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        password: "", // Don't pre-fill password for security
        superAdmin: admin.superAdmin,
        role_id: admin.role_id,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        superAdmin: false,
        role_id: undefined,
      });
    }
  }, [admin, form]);

  const onSubmit = async (data: AdminFormValues) => {
    try {
      console.log("Form data:", data);
      const response = await addOrUpdateAdmin(data);
      console.log(response);
      if (response && response.success) {
        // Invalidate and refetch admins query to update the list
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("admins")
            ),
        });
        toast.success(
          isEditMode ? "تم تحديث المشرف بنجاح" : "تم إضافة المشرف بنجاح"
        );
        // Close dialog and reset form on success
        setOpen(false);
        form.reset();
      } else {
        toast.error(
          isEditMode
            ? "حدث خطأ أثناء تحديث المشرف"
            : "حدث خطأ أثناء إضافة المشرف"
        );
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!trigger && (
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            <Plus className="w-5 h-5" />
            إضافة مشرف جديد
          </button>
        </DialogTrigger>
      )}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {isEditMode ? "تعديل المشرف" : "إضافة مشرف جديد"}
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
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم المشرف"
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    كلمة المرور {isEditMode && "(اتركها فارغة لعدم التغيير)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        isEditMode
                          ? "اترك فارغاً لعدم التغيير"
                          : "أدخل كلمة المرور"
                      }
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدور</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      disabled={rolesLoading}
                    >
                      <option value="">
                        {rolesLoading ? "جاري التحميل..." : "اختر الدور"}
                      </option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Super Admin Switch */}
            <FormField
              control={form.control}
              name="superAdmin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">مدير رئيسي</FormLabel>
                    <div className="text-sm text-gray-500">
                      منح صلاحيات المدير الرئيسي لهذا المشرف
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
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
