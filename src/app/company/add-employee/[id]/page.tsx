'use client'
import React from 'react'
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
  Edit
} from 'lucide-react'

// البيانات اللي هتجيلك من ال API
const mockEmployeeData = {
  id: 1,
  name: "Main Accountant",
  email: "Accountant@company.com", 
  phone: "1234565545060",
  password: "Accountant@2021",
  password_confirmation: "Accountant@2021",
  role_id: 1,
  warehouse_id: null,
  active: true,
  address: null
}

// دالة علشان تحول role_id لاسم
const getRoleName = (roleId: number) => {
  const roles = {
    1: "صيدلي",
    2: "محاسب", 
    3: "إداري"
  }
  return roles[roleId as keyof typeof roles] || "غير محدد"
}

export default function EmployeeDetailsPage() {
  const employee = mockEmployeeData

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
      <h1 className="text-3xl font-bold text-emerald-600 mb-2">تفاصيل الموظف</h1>
      <p className="text-gray-600">عرض معلومات الموظف الأساسية</p>
    </div>
  </div>
  
  <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white font-semibold transition shadow-lg shadow-emerald-600/25">
    <Edit className="w-5 h-5" />
    تعديل البيانات
  </button>
</div>

      {/* الكاردين جنب بعض */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* الكارد الأولى - المعلومات الشخصية */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">المعلومات الشخصية</h2>
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

        {/* الكارد الثانية - معلومات الوظيفة */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">معلومات الوظيفة</h2>
              <p className="text-sm text-gray-500">بيانات العمل والصلاحيات</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* الدور */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">الدور الوظيفي</p>
                <p className="font-medium text-gray-900">{getRoleName(employee.role_id)}</p>
              </div>
            </div>

            {/* المستودع */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Building className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">المستودع المسؤول</p>
                <p className="font-medium text-gray-900">
                  {employee.warehouse_id ? `المستودع ${employee.warehouse_id}` : "لا يوجد"}
                </p>
              </div>
            </div>

            {/* الحالة */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Activity className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">حالة الموظف</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
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
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Shield className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">نوع الصلاحية</p>
                <p className="font-medium text-gray-900">
                  {employee.role_id === 1 ? "صلاحيات كاملة" : 
                   employee.role_id === 2 ? "صلاحيات محاسب" : 
                   "صلاحيات إدارية"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* كارد إضافية لو عايزة تضيفي حاجة */}
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">معلومات خاصة</h2>
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
      </div>
    </div>
  )
}