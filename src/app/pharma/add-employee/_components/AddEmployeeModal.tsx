"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { indexPharmacyRoles } from "@/lib/actions/pharma/roles.action";

const AddEmployeeFormSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  passwordConfirmation: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  roleId: z.number().min(1, "الدور الوظيفي مطلوب"),
  address: z.string().optional(),
});

type AddEmployeeFormData = z.infer<typeof AddEmployeeFormSchema>;

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmployeeParams) => void;
  isLoading?: boolean;
}

export default function AddEmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddEmployeeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddEmployeeFormData>({
    resolver: zodResolver(AddEmployeeFormSchema),
  });

  const selectedRoleId = watch("roleId");

  // Fetch roles
  const { data: rolesResponse } = useQuery({
    queryKey: ["roles"],
    queryFn: () => indexPharmacyRoles({}),
  });

  const roles = rolesResponse?.data || [];
  console.log(roles, "roles");

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: AddEmployeeFormData) => {
    onSubmit({
      ...data,
      active: true,
    });
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-800/50 bg-gray-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20">
              <Plus className="h-5 w-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white md:text-2xl">
              إضافة موظف جديد
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-white"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                الاسم <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="أدخل اسم الموظف"
                className="w-full rounded-lg border border-gray-800/50 bg-gray-950/50 px-4 py-2.5 text-white placeholder:text-gray-500 backdrop-blur-xl transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                البريد الإلكتروني <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="example@email.com"
                className="w-full rounded-lg border border-gray-800/50 bg-gray-950/50 px-4 py-2.5 text-white placeholder:text-gray-500 backdrop-blur-xl transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                رقم الهاتف <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="01xxxxxxxxx"
                className="w-full rounded-lg border border-gray-800/50 bg-gray-950/50 px-4 py-2.5 text-white placeholder:text-gray-500 backdrop-blur-xl transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-sm text-red-400">{errors.phone.message}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                الدور الوظيفي <span className="text-red-400">*</span>
              </label>
              <Select
                value={selectedRoleId?.toString()}
                onValueChange={(value) => setValue("roleId", parseInt(value))}
                disabled={isLoading}
              >
                <SelectTrigger className="h-[42px] w-full flex-row-reverse justify-between rounded-lg border-gray-800/50 bg-gray-950/50 text-right text-white backdrop-blur-xl transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-gray-800/50 bg-gray-900/95 text-right text-white backdrop-blur-xl">
                  {roles.map((role) => (
                    <SelectItem
                      key={role.id}
                      value={role.id.toString()}
                      className="text-right focus:bg-emerald-900/30 focus:text-emerald-300"
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && (
                <p className="text-sm text-red-400">{errors.roleId.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                كلمة المرور <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-800/50 bg-gray-950/50 px-4 py-2.5 text-white placeholder:text-gray-500 backdrop-blur-xl transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Password Confirmation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                تأكيد كلمة المرور <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                {...register("passwordConfirmation")}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-800/50 bg-gray-950/50 px-4 py-2.5 text-white placeholder:text-gray-500 backdrop-blur-xl transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={isLoading}
              />
              {errors.passwordConfirmation && (
                <p className="text-sm text-red-400">
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">العنوان</label>
            <input
              type="text"
              {...register("address")}
              placeholder="أدخل عنوان الموظف"
              className="w-full rounded-lg border border-gray-800/50 bg-gray-950/50 px-4 py-2.5 text-white placeholder:text-gray-500 backdrop-blur-xl transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700 hover:text-white"
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500"
              disabled={isLoading}
            >
              {isLoading ? "جاري الإضافة..." : "إضافة الموظف"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
