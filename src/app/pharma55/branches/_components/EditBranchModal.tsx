"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

// Schema for form fields only (without branchId)
const EditBranchFormSchema = z.object({
  name: z.string().min(1, "اسم الفرع مطلوب"),
  address: z.string().min(1, "الموقع مطلوب"),
});

type EditBranchFormData = z.infer<typeof EditBranchFormSchema>;

interface EditBranchModalProps {
  isOpen: boolean;
  branch: Branch | null;
  onClose: () => void;
  onSubmit: (data: UpdateBranchParams) => void;
  isLoading?: boolean;
}

export default function EditBranchModal({
  isOpen,
  branch,
  onClose,
  onSubmit,
  isLoading,
}: EditBranchModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditBranchFormData>({
    resolver: zodResolver(EditBranchFormSchema),
  });

  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name,
        address: branch.address,
      });
    }
  }, [branch, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: EditBranchFormData) => {
    if (!branch) return;
    onSubmit({ ...data, branchId: branch.id });
  };

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md scale-100 transform rounded-2xl border border-gray-800/50 bg-gray-900 p-6 shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20">
              <Edit className="h-5 w-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white md:text-2xl">
              تعديل بيانات الفرع
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
          {/* Branch Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              اسم الفرع <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="أدخل اسم الفرع"
              className="w-full rounded-lg border border-gray-800/50 bg-gray-950/50 px-4 py-2.5 text-white backdrop-blur-xl transition-all placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              الموقع <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register("address")}
              placeholder="أدخل عنوان الفرع"
              className="w-full rounded-lg border border-gray-800/50 bg-gray-950/50 px-4 py-2.5 text-white backdrop-blur-xl transition-all placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              disabled={isLoading}
            />
            {errors.address && (
              <p className="text-sm text-red-400">{errors.address.message}</p>
            )}
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
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
