"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addNewWarehouse } from "@/lib/actions/company/warehouse.action";
import { AddWarehouseSchema } from "@/schemas/company/warehouse";
import type { WarehouseFormData } from "@/types/company/uiProps";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddWarehouseModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState } =
    useForm<WarehouseFormData>({
      resolver: zodResolver(AddWarehouseSchema),
    });

  const mutation = useMutation({
    mutationFn: addNewWarehouse,
    onSuccess: async (res: unknown) => {
      const payload = res as {
        success?: boolean;
        error?: { message?: string };
      };
      if (!payload.success) {
        toast.error(payload.error?.message ?? "حدث خطأ أثناء إنشاء المخزن");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      reset();
      onClose();
      toast.success(`تم إنشاء المخزن بنجاح`);
    },
    onError: (err: unknown) => {
      const e = err as { message?: string };
      toast.error(e?.message ?? "حدث خطأ أثناء إنشاء المخزن");
    },
  });

  const onSubmit = (data: WarehouseFormData) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 text-gray-900 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 text-2xl font-bold text-emerald-600">
            إضافة مخزن جديد
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name")}
            placeholder="اسم المخزن"
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
          />
          {formState.errors?.name && (
            <p className="text-sm text-red-500">
              {String(formState.errors.name.message)}
            </p>
          )}

          <input
            {...register("location")}
            placeholder="موقع المخزن"
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
          />
          {formState.errors?.location && (
            <p className="text-sm text-red-500">
              {String(formState.errors.location.message)}
            </p>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("active")}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-emerald-600 focus:ring-emerald-500"
              defaultChecked
            />
            <label className="text-sm text-gray-700">المخزن نشط</label>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {mutation.isPending ? "جارٍ الحفظ..." : "حفظ المخزن"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
