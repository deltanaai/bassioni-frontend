"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  CheckCircle,
  XCircle,
  ArrowRight,
  Shield,
  Activity,
  Edit,
  Calendar,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteEmployees,
  getEmployeeById,
  updateEmployee,
} from "@/lib/actions/company/employee.action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateEmployeeSchema } from "@/schemas/employee";
import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";
import { getAllRoles } from "@/lib/actions/company/role.action";

export default function EmployeeDetailsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  

  const deleteMutation = useMutation({
    mutationFn: deleteEmployees,
    onSuccess: () => {
      console.log("تم حذف الموظف بنجاح");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      window.location.href = "/company/add-employee";
    },
    onError: (error) => {
      console.error("خطأ في حذف الموظف:", error);
      alert("حدث خطأ أثناء حذف الموظف");
      setShowDeleteModal(false);
    },
  });

  const handleDeleteEmployee = () => {
    deleteMutation.mutate({
      employeesId: [employee.id],
    });
  };
  const params = useParams();
  const queryClient = useQueryClient();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);


  const employeeId = parseInt(params.id as string);

  const { data, isLoading, error } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => getEmployeeById({ employeeId }),
    enabled: !isNaN(employeeId),
  });

  //roles
  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles({}),
  });
  const roles = rolesData?.data || [];

  //warehouses
  const { data: warehousesdata } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouses({}),
  });
  const warehouses = warehousesdata?.data || [];

  const editForm = useForm({
    resolver: zodResolver(UpdateEmployeeSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      roleId: undefined as number | undefined,
      warehouseId: undefined as number | undefined,
      active: false,
      password: "",
      passwordConfirmation: "",
    },
  });

  useEffect(() => {
    if (showEditModal && editingEmployee) {
    
      console.log("Role:", editingEmployee.id);
      console.log("Warehouse:", editingEmployee.warehouse_id);
      editForm.reset({
        name: editingEmployee.name,
        email: editingEmployee.email,
        phone: editingEmployee.phone,
        address: editingEmployee.address || "",
        roleId: Number(editingEmployee.role), //لساا مش شغالههههه
        warehouseId: editingEmployee.warehouse_id,
        active: editingEmployee.active,
        password: "",
        passwordConfirmation: "",
      });
    }
  }, [showEditModal, editingEmployee, editForm]);

  const editMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      console.log("تم تحديث بيانات الموظف بنجاح");
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setShowEditModal(false);
      setEditingEmployee(null);
      editForm.reset();
    },
    onError: (error) => {
      console.error("خطأ في تحديث بيانات الموظف:", error);
      alert("حدث خطأ أثناء تحديث بيانات الموظف");
    },
  });

  const onEditSubmit = (formData: Record<string, unknown>) => {
    if (!editingEmployee) {
      return;
    }
    const submitData = {
      employeeId: editingEmployee.id,
      ...formData,
    };

    editMutation.mutate(submitData);
  };

  if (isNaN(employeeId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">خطأ</h1>
          <p className="text-gray-600 mt-2">معرف الموظف غير صحيح</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !data?.success || !data.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">خطأ</h1>
          <p className="text-gray-600 mt-2">الموظف غير موجود</p>
        </div>
      </div>
    );
  }

  const employee = data.data;
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* الهيدر */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-2xl transition"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-emerald-600 mb-2">
              تفاصيل الموظف
            </h1>
            <p className="text-gray-600">عرض معلومات الموظف الأساسية</p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingEmployee(employee);
            setShowEditModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white font-semibold transition shadow-lg shadow-emerald-600/25"
        >
          <Edit className="w-5 h-5" />
          تعديل البيانات
        </button>
      </div>
      {/* مودال تعديل الموظف */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xl shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">
              تعديل بيانات الموظف
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                editForm.handleSubmit((data) => {
                  onEditSubmit(data);
                })(e);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* اسم الموظف */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم
                  </label>
                  <input
                    type="text"
                    placeholder="اسم الموظف"
                    {...editForm.register("name")}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  {editForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {editForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    {...editForm.register("email")}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  {editForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {editForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* رقم الهاتف */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    {...editForm.register("phone")}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  {editForm.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {editForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                {/* العنوان */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان
                  </label>
                  <input
                    type="text"
                    placeholder="العنوان (اختياري)"
                    {...editForm.register("address")}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  {editForm.formState.errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {editForm.formState.errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* الدور */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الدور
                  </label>
                  <select
                    {...editForm.register("roleId", {
                      setValueAs: (v) => (v ? Number(v) : null),
                    })}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
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
                  {editForm.formState.errors.roleId && (
                    <p className="text-red-500 text-sm mt-1">
                      {editForm.formState.errors.roleId.message}
                    </p>
                  )}
                </div>

                {/* المستودع */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المستودع
                  </label>
                  <select
                    {...editForm.register("warehouseId", {
                      setValueAs: (v) => (v ? Number(v) : null),
                    })}
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
                  {editForm.formState.errors.warehouseId && (
                    <p className="text-red-500 text-sm mt-1">
                      {editForm.formState.errors.warehouseId.message}
                    </p>
                  )}
                </div>
              </div>

              {/* كلمة المرور (اختياري في التعديل) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  كلمة المرور{" "}
                  <span className="text-gray-400 text-xs">(اختياري)</span>
                </label>
                <input
                  type="password"
                  placeholder="اتركه فارغاً للحفاظ على كلمة المرور الحالية"
                  {...editForm.register("password")}
                  className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                {editForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {editForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* تأكيد كلمة المرور (اختياري) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تأكيد كلمة المرور{" "}
                  <span className="text-gray-400 text-xs">(اختياري)</span>
                </label>
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  {...editForm.register("passwordConfirmation")}
                  className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                {editForm.formState.errors.passwordConfirmation && (
                  <p className="text-red-500 text-sm mt-1">
                    {editForm.formState.errors.passwordConfirmation.message}
                  </p>
                )}
              </div>

              {/* الحالة */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-activecheckbox"
                  {...editForm.register("active")}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="edit-activecheckbox" className="text-gray-700">
                  موظف نشط
                </label>
              </div>
              {editForm.formState.errors.active && (
                <p className="text-red-500 text-sm mt-1">
                  {editForm.formState.errors.active.message}
                </p>
              )}

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingEmployee(null);
                    editForm.reset();
                  }}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl border border-gray-300 transition"
                >
                  إلغاء
                </button>
                <button
                  disabled={editMutation.isPending}
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white transition disabled:opacity-50"
                >
                  {editMutation.isPending ? "جارٍ التحديث..." : "حفظ التعديلات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* الكارد الأولى   */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                المعلومات الشخصية
              </h2>
              <p className="text-sm text-gray-500">البيانات الأساسية للموظف</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* الاسم */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <User className="w-4 h-4 text-emerald-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">الاسم الكامل</p>
                <p className="font-medium text-gray-900">{employee.name}</p>
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="w-4 h-4 text-emerald-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="font-medium text-gray-900">{employee.email}</p>
              </div>
            </div>

            {/* رقم الهاتف */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-4 h-4 text-emerald-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">رقم الهاتف</p>
                <p className="font-medium text-gray-900">{employee.phone}</p>
              </div>
            </div>

            {/* العنوان */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">العنوان</p>
                <p className="font-medium text-gray-900">
                  {employee.address || "غير محدد"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* الكارد الثانية */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                معلومات الوظيفة
              </h2>
              <p className="text-sm text-gray-500">بيانات العمل والصلاحيات</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* الدور */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">الدور الوظيفي</p>
                <p className="font-medium text-gray-900">{employee.role}</p>
              </div>
            </div>

            {/* المستودع */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Building className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">المستودع المسؤول</p>
                <p className="font-medium text-gray-900">
                  {employee.warehouse_name
                    ? ` ${employee.warehouse_name}`
                    : "لا يوجد"}
                </p>
              </div>
            </div>

            {/* الحالة */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Activity className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">حالة الموظف</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.active ? "نشط" : "غير نشط"}
                  </span>
                  {employee.active ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>

            {/* الصلاحيات */}
            {/* <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Shield className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">نوع الصلاحية</p>
                <p className="font-medium text-gray-900">
                  {employee.role == "manager"
                    ? "صلاحيات كاملة"
                    : employee.role == "محاسب"
                    ? "صلاحيات محاسب"
                    : "صلاحيات إدارية"}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/*تاريخ الإنشاء والتحديث */}
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">التواريخ</h2>
              <p className="text-sm text-gray-500">تاريخ الإنشاء وآخر تحديث</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">تاريخ الإنشاء</p>
                <p className="font-medium text-gray-900">
                  {employee.createdAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <RefreshCw className="w-5 h-5 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">آخر تحديث</p>
                <p className="font-medium text-gray-900">
                  {employee.updatedAt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  معلومات خاصة
                </h2>
                <p className="text-sm text-gray-500">بيانات تسجيل الدخول</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">كلمة المرور</p>
                <p className="font-medium text-gray-900">••••••••</p>
              </div>
            </div>
          </div>
          {/* كارد إجراءات خطيرة */}
          <div className="bg-white rounded-2xl border-gray-200 shadow-sm border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h2 className="font-bold text-orange-900">إجراءات إدارية</h2>
                <p className="text-md text-orange-500">
                  إجراءات تتطلب انتباهاً
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium text-sm transition"
              >
                <Trash2 className="w-3 h-3" />
                حذف الموظف
              </button>
            </div>
          </div>
          {/* مودال الحذف */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 backdrop-blur-md">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Trash2 className="w-7 h-7 text-orange-500" />
                </div>

                <div className="text-center mb-7">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    حذف الموظف
                  </h3>
                  <p className="text-base text-gray-700 mb-3 leading-relaxed">
                    هل تريد نقل
                    <span className="font-bold text-orange-600 mx-1">
                      {employee.name}
                    </span>
                    إلى سلة المحذوفات؟
                  </p>
                  <p className="text-sm text-gray-500 bg-gray-50 rounded-lg py-2 px-3">
                    يمكنك استعادة الموظف في أي وقت من خلال سلة المحذوفات
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-semibold border border-gray-300 hover:border-gray-400"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleDeleteEmployee}
                    disabled={deleteMutation.isPending}
                    className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري الحذف...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        تأكيد الحذف
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
