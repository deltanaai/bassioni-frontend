"use client";

import DashboardLayout from "../layout";
import React from "react";
import { useRouter } from "next/navigation";
import { Users, MapPin, Building, Phone, Calendar } from "lucide-react";
import { ROUTES_COMPANY } from "@/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { getCompanyInfo } from "@/lib/actions/company/company.action";

export default function SettingsPage() {
  const router = useRouter();

  const {
    data: CompanyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companyData"],
    queryFn: getCompanyInfo,
    placeholderData: {
      success: true,
      data: {
        id: 1,
        name: "شركة تجريبية",
        address: "عنوان تجريبي",
        phone: "0100000000",
        createdAt: "1-10-2020",
        updatedAt: "20-2-2025",
        deleted: false,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات الشركة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>حدث خطأ في تحميل بيانات الشركة</p>
        </div>
      </div>
    );
  }
  const company = CompanyData?.success ? CompanyData.data : null;
  console.log(company);

  return (
    <div className="p-6 space-y-8 bg-gray-50 text-gray-800 min-h-screen">
      {/* معلومات الشركة  */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                معلومات الشركة
              </h2>
              <p className="text-sm text-gray-500">تفاصيل الشركة الأساسية</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
            {company ? "نشطة" : "غير متاحة"}
          </div>
        </div>

        {company ? (
          <div className="grid lg:grid-cols-2 gap-4">
            {/* الاسم */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-blue-500" />
                <label className="text-sm font-medium text-gray-700">
                  اسم الشركة
                </label>
              </div>
              <p className="text-base text-gray-900">{company.name}</p>
            </div>

            {/* العنوان */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-green-50 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <label className="text-sm font-medium text-gray-700">
                  العنوان
                </label>
              </div>
              <p className="text-base text-gray-900">{company.address}</p>
            </div>

            {/* الهاتف */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-purple-50 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-purple-500" />
                <label className="text-sm font-medium text-gray-700">
                  رقم الهاتف
                </label>
              </div>
              <p className="text-base text-gray-900 direction-ltr text-right">
                {company.phone}
              </p>
            </div>

            {/* تاريخ الإنشاء */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-orange-50 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <label className="text-sm font-medium text-gray-700">
                  تاريخ الإنشاء
                </label>
              </div>
              <p className="text-base text-gray-900">
                {company.createdAt
                  ? new Date(company.createdAt).toLocaleDateString("ar-EG")
                  : "غير محدد"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">لا توجد بيانات للشركة</p>
          </div>
        )}
      </section>
      {/* إدارة الأدوار */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-indigo-600 border-b border-gray-200 pb-2">
          إدارة الأدوار والصلاحيات
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* كارد إدارة الأدوار */}
          <div
            className="p-4 border-2 border-indigo-200 bg-indigo-50 rounded-xl cursor-pointer hover:bg-indigo-100 transition-all duration-200 hover:shadow-md"
            onClick={() => router.push(ROUTES_COMPANY.ROLES)}
          >
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-700" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-indigo-700">
                  إدارة الأدوار
                </h3>
                <p className="text-sm text-indigo-600">
                  إضافة، تعديل أو حذف الأدوار مثل مدير، محاسب، مشرف وغيرها
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* إدارة المواقع */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-green-600 border-b border-gray-200 pb-2">
          إدارة المواقع والفروع
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* كارد إدارة المواقع */}
          <div
            className="p-4 border-2 border-green-200 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition-all duration-200 hover:shadow-md"
            onClick={() => router.push(ROUTES_COMPANY.LOCATIONS)}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-green-700" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-green-700">
                  إدارة المواقع
                </h3>
                <p className="text-sm text-green-600">
                  إضافة، تعديل أو حذف المواقع والفروع المختلفة
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* إعدادات الخصوصية */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-emerald-600 border-b border-gray-200 pb-2">
          الخصوصية
        </h2>
        <div className="space-y-4">
          <ToggleItem label="إظهار الطلبات للمستخدمين الآخرين" />
          <ToggleItem label="السماح بتعليقات الآخرين على ملفي" defaultChecked />
        </div>
      </section>

      {/* إعدادات الإشعارات */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-200 pb-2">
          الإشعارات
        </h2>
        <div className="space-y-4">
          <ToggleItem label="تفعيل إشعارات البريد الإلكتروني" defaultChecked />
          <ToggleItem label="تفعيل إشعارات الهاتف المحمول" />
        </div>
      </section>

      {/* إعدادات المظهر */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-purple-600 border-b border-gray-200 pb-2">
          المظهر
        </h2>
        <div className="space-y-2">
          <label className="text-sm text-gray-600">اختر الوضع:</label>
          <select className="w-full bg-gray-100 text-gray-800 rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition">
            <option>فاتح (Light)</option>
            <option>داكن (Dark)</option>
            <option>النظام التلقائي</option>
          </select>
        </div>
      </section>

      {/* إعدادات اللغة */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-yellow-600 border-b border-gray-200 pb-2">
          اللغة
        </h2>
        <div className="space-y-2">
          <label className="text-sm text-gray-600">اختر اللغة:</label>
          <select className="w-full bg-gray-100 text-gray-800 rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">
            <option>العربية</option>
            <option>الإنجليزية</option>
            <option>فرنسية</option>
          </select>
        </div>
      </section>

      {/* الأمان */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-red-600 border-b border-gray-200 pb-2">
          الأمان
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">كلمة المرور الحالية</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-red-400 transition"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">كلمة المرور الجديدة</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-red-400 transition"
            />
          </div>
        </div>
        <div className="text-right mt-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
            تحديث كلمة المرور
          </button>
        </div>
      </section>

      {/* حذف الحساب */}
      <section className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-red-700 border-b border-red-200 pb-2">
          حذف الحساب
        </h2>
        <p className="text-sm text-gray-600">
          عند حذف حسابك، سيتم إزالة جميع بياناتك نهائيًا ولا يمكن استعادتها.
          يرجى التأكد قبل المتابعة.
        </p>
        <div className="text-right">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
            حذف الحساب نهائيًا
          </button>
        </div>
      </section>
    </div>
  );
}

// ✅ مكون التبديل Switch بنفس الهوية
function ToggleItem({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-5 w-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-400 transition"
      />
    </label>
  );
}

SettingsPage.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
