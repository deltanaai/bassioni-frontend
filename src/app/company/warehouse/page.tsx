"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  ArrowRight,
  Plus,
  MapPin,
  Warehouse,
  Activity,
  ChevronLeft,
  ChevronRight,
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
import { getAllLocations } from "@/lib/actions/company/locations.action";

export default function WarehousesPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  // المخازنن
  const { data } = useQuery({
    queryKey: ["warehouses", currentPage],
    queryFn: () =>
      getAllWarehouses({
        page: currentPage,
        perPage: 9,
        deleted: false,
        paginate: true,
      }),
  });
  console.log(data);

  //   للمواقع
  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getAllLocations({ page: 1, perPage: 10 }),
  });
  const locations = locationsData?.data || [];
  console.log(locations);

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
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Warehouse className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold text-emerald-600">المخازن</h1>
            <p className="text-gray-600">إدارة وتنظيم مخازن الشركة</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-5 h-5" />
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
                <div className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-emerald-500" /> كود المخزن
                  :
                  <span className="font-semibold text-gray-900">
                    {warehouse.code}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                  الموقع:
                  <span className="font-semibold text-gray-900">
                    {warehouse.location}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" /> حاله النشاط
                  :
                  <div
                    className={`w-2 h-2 rounded-full ${
                      warehouse.active ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`font-semibold ${
                      warehouse.active ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {warehouse.active ? "نشط" : "غير نشط"}
                  </span>
                </div>
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
      {/* Pagination بس لما يكون فيه اكتر من صفحة */}
      {data?.meta && data.meta.last_page > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          {/* السهم اليمين */}
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>

          {/* أرقام الصفحات */}
          <div className="flex space-x-1">
            {Array.from({ length: data.meta.last_page }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-emerald-600 border border-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* السهم الشمال */}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === data.meta.last_page}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}
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
              <select
                {...register("locationId", { valueAsNumber: true })}
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
                defaultValue=""
              >
                <option value="" disabled>
                  -- اختر الموقع --
                </option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {errors.locationId && (
                <p className="text-sm text-red-500">
                  {errors.locationId.message}
                </p>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activecheckbox"
                  {...register("active")}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-emerald-600 focus:ring-emerald-500"
                  defaultChecked
                />
                <label
                  htmlFor="activecheckbox"
                  className="text-sm text-gray-700"
                >
                  المخزن نشط
                </label>
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
