"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";

import { useForm } from "react-hook-form";
import { CreateEmployeeSchema } from "@/schemas/employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeCreateInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addEmployee,
  getAllEmployees,
} from "@/lib/actions/company/employee.action";
import Link from "next/link";
import { toast } from "sonner";

export default function EmployeesPage() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getAllEmployees({ page: 1, perPage: 10 }),
  });
  // console.log('Full data:', data);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeCreateInput>({
    resolver: zodResolver(CreateEmployeeSchema),
    defaultValues: {
      active: true,
      warehouseId: null,
      address: null,
    },
  });

  const mutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء إنشاء الموظف");
        return;
      }
       await queryClient.invalidateQueries({ queryKey: ["employees"] });

       setShowModal(false);
       reset();

      toast.success(`تم إنشاء الموظف بنجاح`);
    },
  });

  const onSubmit = (data: EmployeeCreateInput) => {
    mutation.mutate(data);
    console.log(data);
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-600">الموظفين</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white font-semibold transition"
        >
          <Plus className="w-5 h-5" />
          إضافة موظف
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(data?.data) && data.data.length > 0 ? (
          data.data.map((employee) => (
            <div
              key={employee.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {employee.name}
              </h2>

              <p className="text-gray-600 mt-1">
                الدور:{" "}
                <span className="font-bold text-gray-800">{employee.role}</span>
              </p>
              <p className="text-gray-600 mt-1">
                نشط:{" "}
                <span className="font-bold text-gray-800">
                  {employee.active ? "نشط" : "غير نشط"}
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                المستودع:{" "}
                <span className="font-bold text-gray-800">
                  {employee.warehouse ? employee.warehouse : "لا يوجد"}
                </span>
              </p>
              <div className="mt-6 text-left">
                <Link
                  href={`/company/add-employee/${employee.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-sm font-semibold text-white transition duration-300"
                >
                  المزيد
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-lg">لا يوجد موظفين</p>
          </div>
        )}
      </div>

      {/* مودال الإضافة  */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xl shadow-lg">
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">
              إضافة موظف جديد
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* اسم الموظف */}
                <div>
                  <input
                    type="text"
                    placeholder="اسم الموظف"
                    {...register("name")}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    {...register("email")}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* رقم الهاتف */}
                <div>
                  <input
                    type="tel"
                    dir="rtl"
                    placeholder="رقم الهاتف"
                    {...register("phone")}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* العنوان */}
                <div>
                  <input
                    type="text"
                    placeholder="العنوان (اختياري)"
                    {...register("address")}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* الدور */}
                <div>
                  <select
                    {...register("roleId", { valueAsNumber: true })}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">اختر الدور</option>
                    <option value="1">صيدلي</option>
                    <option value="2">محاسب</option>
                    <option value="3">إداري</option>
                  </select>
                  {errors.roleId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.roleId.message}
                    </p>
                  )}
                </div>

                {/* المستودع */}
                <div>
                  <select
                    {...register("warehouseId", { valueAsNumber: true })}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">اختر المستودع (اختياري)</option>
                    <option value="1">المستودع الرئيسي</option>
                    <option value="2">المستودع الفرعي</option>
                  </select>
                  {errors.warehouseId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.warehouseId.message}
                    </p>
                  )}
                </div>
              </div>
              {/* كلمة المرور */}
              <div>
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  {...register("password")}
                  className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* تأكيد كلمة المرور */}
              <div>
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  {...register("passwordConfirmation")}
                  className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                {errors.passwordConfirmation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.passwordConfirmation.message}
                  </p>
                )}
              </div>

              {/* الحالة */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  {...register("active")}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="active" className="text-gray-700">
                  موظف نشط
                </label>
              </div>
              {errors.active && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.active.message}
                </p>
              )}

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    reset();
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl border border-gray-300"
                >
                  إلغاء
                </button>
                <button
                  disabled={mutation.isPending}
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white"
                >
                  {mutation.isPending ? "جار الاضافه" : "اضافه الموظف"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
