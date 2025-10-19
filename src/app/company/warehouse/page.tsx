"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  ShoppingCart,
  DollarSign,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  addNewWarehouse,
  getAllWarehouses,
} from "@/lib/actions/company/warehouse.action";
import { AddWarehouseSchema } from "@/schemas/warehouse";
import { WarehouseFormData } from "@/types";

export default function WarehousesPage() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouses({ page: 1, perPage: 10 }),
  });

  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(AddWarehouseSchema),
  });

  const mutation = useMutation({
    mutationFn: addNewWarehouse,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء إنشاء المخزن");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["warehouses"] });

      setShowModal(false);
      reset();

      toast.success(`تم إنشاء المخزن بنجاح`);
    },
  });

  const onSubmit = (data: WarehouseFormData) => {
    mutation.mutate(data);
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-400">المخازن</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2 font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          إضافة مخزن
        </button>
      </div>

      {/* عرض المخازن */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.isArray(data?.data) && data.data.length > 0 ? (
          data.data.map((warehouse) => (
            <div
              key={warehouse.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              {/* العنوان */}
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {warehouse.name}
              </h2>

              {/* بيانات المخزن */}
              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-500" /> كود المخزن :
                  <span className="font-semibold text-gray-900">
                    {warehouse.code}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-emerald-500" /> كود
                  الموقع:
                  <span className="font-semibold text-gray-900">
                    {warehouse.locationId}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" /> النشاط :
                  <span className="font-semibold text-gray-900">
                    {warehouse.active}
                  </span>
                </p>
              </div>

              <div className="mt-6 text-left">
                <Link
                  href={`/company/warehouse/${warehouse.id}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
                >
                  المزيد
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
              <Package className="mx-auto mb-4 h-20 w-20 text-gray-400" />
              <h2 className="mb-3 text-2xl font-bold text-gray-600">
                لا توجد مخازن
              </h2>
              <p className="mb-6 text-lg text-gray-500">
                ابدأ بإضافة مخزنك الأول
              </p>
            </div>
          </div>
        )}
      </div>
      {/* مودال الإضافة */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 text-gray-900 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-emerald-600">
              إضافة مخزن جديد
            </h2>

            {/* فورم المخزن */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("name")}
                placeholder="اسم المخزن"
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}

              <input
                {...register("code")}
                placeholder="كود المخزن "
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}

              {/* الموقع */}
              <input
                type="number"
                {...register("locationId", { valueAsNumber: true })}
                placeholder=" كود الموقع"
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
              />
              {errors.locationId && (
                <p className="text-sm text-red-500">
                  {errors.locationId.message}
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
                  onClick={() => setShowModal(false)}
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
      )}
    </div>
  );
}
