"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CreateBranchSchema } from "@/schemas/pharma/branches";

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBranchParams) => void;
  isLoading?: boolean;
}

export default function AddBranchModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddBranchModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBranchParams>({
    resolver: zodResolver(CreateBranchSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: CreateBranchParams) => {
    onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md scale-100 transform rounded-2xl border border-gray-800/50 bg-gray-900 p-6 shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20">
              <Plus className="h-5 w-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white md:text-2xl">
              إضافة فرع جديد
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
              {isLoading ? "جاري الإضافة..." : "إضافة الفرع"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
