"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

type Props<TFormValues extends Record<string, unknown>> = {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
  editForm: UseFormReturn<TFormValues>;
  saving?: boolean;
};

export default function EditWarehouseModal<
  TFormValues extends Record<string, unknown>
>({ show, onClose, onSubmit, editForm, saving = false }: Props<TFormValues>) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">تعديل المخزن</h2>
        <form onSubmit={editForm.handleSubmit(onSubmit)}>
          {/* hidden id */}
          <input type="hidden" {...(editForm.register as any)("warehouseId")} />

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                اسم المخزن
              </label>
              <input
                {...(editForm.register as any)("name")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="أدخل اسم المخزن"
              />
              {editForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {editForm.formState.errors.name.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">الموقع</label>

              <input
                {...(editForm.register as any)("location")}
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
                placeholder="أدخل موقع المخزن"
              />
              {editForm.formState.errors.location && (
                <p className="mt-1 text-sm text-red-500">
                  {editForm.formState.errors.location.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              {...(editForm.register as any)("active")}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              id="edit-activecheckbox"
            />
            <label
              htmlFor="edit-activecheckbox"
              className="text-sm font-medium text-gray-700"
            >
              المخزن نشط
            </label>
          </div>
          {editForm.formState.errors.active && (
            <p className="mt-1 text-sm text-red-500">
              {editForm.formState.errors.active.message as string}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
