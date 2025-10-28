"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  User,
  Users,
  Warehouse,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { CreateEmployeeSchema } from "@/schemas/company/employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeCreateInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addEmployee,
  getAllEmployees,
} from "@/lib/actions/company/employee.action";
import Link from "next/link";
import { toast } from "sonner";
import { getAllRoles } from "@/lib/actions/company/role.action";
import logger from "@/lib/logger";
import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";
import BulkAssignModal from "@/components/BulkAssignModal";

export default function EmployeesPage() {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const queryClient = useQueryClient();

  //roles
  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles({ page: 1, perPage: 10 }),
  });
  console.log(rolesData);
  const roles = rolesData?.data || [];

  //warehouses
  const { data: warehousesdata } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouses({ page: 1, perPage: 10 }),
  });
  const warehouses = warehousesdata?.data || [];

  //employees
  const { data } = useQuery({
    queryKey: ["employees", currentPage],
    queryFn: () =>
      getAllEmployees({
        page: currentPage,
        perPage: 9,
        deleted: false,
        paginate: true,
      }),
  });

  console.log("كامل البيانات:", data);

  logger.info(`Employees data: ${JSON.stringify(data)}`);

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
      <div className="flex justify-between items-center mb-8 p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold text-emerald-600">
              ادارة الموظفين
            </h1>
            <p className="text-gray-600">إدارة وتنظيم فريق العمل</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Settings className="w-5 h-5" />
            تعيين جماعي
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            إضافة موظف
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6"></div>

      <BulkAssignModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(data?.data) && data.data.length > 0 ? (
          data.data.map((employee) => (
            <div
              key={employee.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              {/* الهيدر مع صورة المستخدم */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User size={24} color="#059669" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {employee.name}
                </h2>
              </div>

              {/* معلومات الموظف */}
              <div className="space-y-3">
                {/* الدور */}
                <div className="flex items-center gap-2">
                  <Briefcase size={16} color="#6B7280" />
                  <span className="text-gray-600">الدور:</span>
                  <span className="font-bold text-gray-800 mr-1">
                    {employee.role}
                  </span>
                </div>

                {/* النشاط */}
                <div className="flex items-center gap-2">
                  <Activity
                    className={`w-4 h-4 ${
                      employee.active ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span className="text-gray-600">نشط:</span>
                  <span
                    className={`font-bold ${
                      employee.active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {employee.active ? "نشط" : "غير نشط"}
                  </span>
                </div>

                {/* المستودع */}
                <div className="flex items-center gap-2">
                  <Warehouse size={16} color="#6B7280" />
                  <span className="text-gray-600">المستودع:</span>
                  <span className="font-bold text-gray-800 mr-1">
                    {employee.warehouse_name
                      ? employee.warehouse_name
                      : "لا يوجد"}
                  </span>
                </div>
              </div>

              {/* زر المزيد */}
              <div className="mt-6 text-left">
                <Link
                  href={`/company/add-employee/${employee.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-sm font-semibold text-white transition duration-300"
                >
                  المزيد
                  <ArrowRight size={20} />
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
                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- اختر الدور --
                    </option>
                    {(Array.isArray(roles) ? roles : []).map((role: any) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
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
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- اختر المستودع (اختياري) --
                    </option>
                    {(Array.isArray(warehouses) ? warehouses : []).map(
                      (warehouse: any) => (
                        <option key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </option>
                      )
                    )}
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
                  id="activecheckbox"
                  {...register("active")}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="activecheckbox" className="text-gray-700">
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
