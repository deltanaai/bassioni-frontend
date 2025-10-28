"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Mail,
  Shield,
  ShieldCheck,
} from "lucide-react";

interface Admin {
  id: number;
  name: string;
  email: string;
  superAdmin: boolean;
}

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockAdmins: Admin[] = [
    {
      id: 5,
      name: "Emily",
      email: "emily@wsa-network.com",
      superAdmin: false,
    },

    {
      id: 1,
      name: "Adam Smith",
      email: "adam@wsa-network.com",
      superAdmin: true,
    },
  ];

  const filteredAdmins = mockAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">ادارة المشرفين</h1>
            <p className="text-gray-600">
              إدارة وتنظيم جميع المشرفين في النظام
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
          <Plus className="w-5 h-5" />
          إضافة مشرف جديد
        </button>
      </div>

      {/* شريط البحث */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث باسم المشرف أو الإيميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="font-semibold text-blue-700">
                {filteredAdmins.length} مشرف
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>
                سوبر أدمن: {filteredAdmins.filter((a) => a.superAdmin).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* رأس الجدول */}
          <div className="border-b border-gray-200 min-w-[600px]">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-700 bg-gray-50">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4 text-center">المشرف</div>
              <div className="col-span-4 text-center">البريد الإلكتروني</div>
              <div className="col-span-2 text-center">النوع</div>
              <div className="col-span-1 text-center">الإجراءات</div>
            </div>
          </div>

          {/* جسم الجدول */}
          <div className="divide-y divide-gray-200 min-w-[600px]">
            {filteredAdmins.map((admin, index) => (
              <div
                key={admin.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-1 text-sm text-gray-600 text-center">
                  {index + 1}
                </div>

                <div className="col-span-4">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{admin.name}</p>
                      <p className="text-xs text-gray-500">ID: {admin.id}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="flex items-center gap-2 justify-center">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-700">{admin.email}</p>
                  </div>
                </div>

                <div className="col-span-2 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      admin.superAdmin
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {admin.superAdmin ? (
                      <>
                        <ShieldCheck className="w-3 h-3" />
                        سوبر أدمن
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3" />
                        مشرف عادي
                      </>
                    )}
                  </span>
                </div>

                <div className="col-span-1 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* حالة عدم وجود بيانات */}
        {filteredAdmins.length === 0 && (
          <div className="px-6 py-12 text-center min-w-[600px]">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm ? "لا توجد نتائج" : "لا توجد مشرفين"}
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm
                ? "لم نتمكن من العثور على مشرفين تطابق بحثك."
                : "ابدأ بإضافة أول مشرف إلى النظام."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
