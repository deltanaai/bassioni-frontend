"use client";

import { useState } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WarehouseFormData } from "@/types";
import { addNewWarehouse, getAllWarehouses } from "@/lib/actions/company/warehouse.action";
import { AddWarehouseSchema } from "@/schemas/warehouse";
import { toast } from "sonner";



export default function WarehousesPage() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["warehouses"],
    queryFn:()=> getAllWarehouses({page:1 , perPage: 10}),
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

  const mutation =useMutation({
    mutationFn:addNewWarehouse,
    onSuccess: async (res)=>{
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء إنشاء المخزن");
        return;
      }
       await queryClient.invalidateQueries({ queryKey: ["warehouses"] });

       setShowModal(false);
       reset();

      toast.success(`تم إنشاء المخزن بنجاح`);
    }
  })

  const onSubmit = (data: WarehouseFormData) => {
    mutation.mutate(data);
    console.log(data);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-400">المخازن</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white font-semibold transition"
        >
          <Plus className="w-5 h-5" />
          إضافة مخزن
        </button>
      </div>

      {/* عرض المخازن */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {Array.isArray(data?.data) && data.data.length > 0 ? (
    data.data.map((warehouse) => (
      <div
        key={warehouse.id}
        className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-lg p-6 transition-all duration-300"
      >
        {/* العنوان */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {warehouse.name}
        </h2>

        {/* بيانات المخزن */}
        <div className="space-y-3 text-gray-600 text-sm">
          <p className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" /> كود المخزن :
            <span className="font-semibold text-gray-900">
              {warehouse.code}
            </span>
          </p>

          <p className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-500" /> كود الموقع:
            <span className="font-semibold text-gray-900">
              {warehouse.locationId}
            </span>
          </p>

          <p className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" /> النشاط :
            <span className="font-semibold text-gray-900">
              {warehouse.active}
            </span>
          </p>
        </div>

        <div className="mt-6 text-left">
          <Link
            href={`/company/warehouse/${warehouse.id}`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-sm font-semibold text-white transition duration-300"
          >
            المزيد
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-full flex justify-center items-center">
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-3">
          لا توجد مخازن
        </h2>
        <p className="text-gray-500 mb-6 text-lg">ابدأ بإضافة مخزنك الأول</p>
        
      </div>
    </div>
  )}
</div>
      {/* مودال الإضافة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white max-h-[90vh] overflow-y-auto p-6 rounded-2xl w-full max-w-xl shadow-lg text-gray-900">
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">
              إضافة مخزن جديد
            </h2>

            {/* فورم المخزن */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <input
                {...register("name")}
                placeholder="اسم المخزن"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}

              <input
                {...register("code")}
                placeholder="كود المخزن "
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}

              {/* الموقع */}
              <input
                {...register("locationId")}
                placeholder=" كود الموقع" 
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400"
              />
              {errors.locationId && (
                <p className="text-red-500 text-sm">
                  {errors.locationId.message}
                </p>
              )}
            
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("active")}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                    defaultChecked
                  />
                  <label className="text-sm text-gray-700">المخزن نشط</label>
                </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white disabled:opacity-50"
                >
                  {mutation.isPending
                    ? "جارٍ الحفظ..."
                    : "حفظ المخزن"}
                </button>
              </div>
            </form>

            
          </div>
        </div>
      )}
    </div>
  );
}
