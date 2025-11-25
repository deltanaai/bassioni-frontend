import DashboardLayout from '../layout';
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-8 text-white">
      {/* إعدادات الخصوصية */}
      <section className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-emerald-400 border-b border-gray-700 pb-2">الخصوصية</h2>
        <div className="space-y-4">
          <ToggleItem label="إظهار الطلبات للمستخدمين الآخرين" />
          <ToggleItem label="السماح بتعليقات الآخرين على ملفي" defaultChecked />
        </div>
      </section>

      {/* إعدادات الإشعارات */}
      <section className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-blue-400 border-b border-gray-700 pb-2">الإشعارات</h2>
        <div className="space-y-4">
          <ToggleItem label="تفعيل إشعارات البريد الإلكتروني" defaultChecked />
          <ToggleItem label="تفعيل إشعارات الهاتف المحمول" />
        </div>
      </section>

      {/* إعدادات المظهر */}
      <section className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-purple-400 border-b border-gray-700 pb-2">المظهر</h2>
        <div className="space-y-2">
          <label className="text-sm text-gray-300">اختر الوضع:</label>
          <select className="w-full bg-gray-800 text-white rounded-md px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>داكن (Dark)</option>
            <option>فاتح (Light)</option>
            <option>النظام التلقائي</option>
          </select>
        </div>
      </section>

      {/* إعدادات اللغة */}
      <section className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-yellow-400 border-b border-gray-700 pb-2">اللغة</h2>
        <div className="space-y-2">
          <label className="text-sm text-gray-300">اختر اللغة:</label>
          <select className="w-full bg-gray-800 text-white rounded-md px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <option>العربية</option>
            <option>الإنجليزية</option>
            <option>فرنسية</option>
          </select>
        </div>
      </section>

      {/* الأمان */}
      <section className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-red-400 border-b border-gray-700 pb-2">الأمان</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">كلمة المرور الحالية</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">كلمة المرور الجديدة</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <div className="text-right mt-4">
          <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md">تحديث كلمة المرور</button>
        </div>
      </section>

      {/* حذف الحساب */}
      <section className="bg-gradient-to-r from-red-900 to-red-800 border border-red-700 rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-red-300 border-b border-red-700 pb-2">حذف الحساب</h2>
        <p className="text-sm text-gray-300">
          عند حذف حسابك، سيتم إزالة جميع بياناتك نهائيًا ولا يمكن استعادتها. يرجى التأكد قبل المتابعة.
        </p>
        <div className="text-right">
          <button className="bg-red-700 hover:bg-red-800 px-6 py-2 rounded-md">حذف الحساب نهائيًا</button>
        </div>
      </section>
    </div>
  );
}

// مكون للتبديلات Switch
function ToggleItem({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-gray-300">{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="form-checkbox h-5 w-5 text-emerald-500 transition duration-150"
      />
    </label>
  );
}

SettingsPage.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
