"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  Building,
  CheckCircle,
  XCircle,
  MoreVertical,
  LocateFixed,
} from "lucide-react";

interface Branch {
  id: number;
  name: string;
  code: string;
  pharmacy_id: number;
  location_id: number;
  address: string;
  active: boolean;
  pharmacy?: {
    name: string;
  };
  location?: {
    name: string;
  };
}

export default function BranchesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // بيانات وهمية للعرض فقط
  const mockBranches: Branch[] = [
    {
      id: 1,
      name: "فرع سوهاج",
      code: "SOHB",
      pharmacy_id: 1,
      location_id: 1,
      address: "سوهاج - الفتح - المعصرة",
      active: true,
      pharmacy: { name: "صيدلية النور" },
      location: { name: "الموقع الرئيسي" },
    },
    {
      id: 2,
      name: "فرع القاهرة",
      code: "CAIB",
      pharmacy_id: 2,
      location_id: 2,
      address: "القاهرة - مدينة نصر",
      active: true,
      pharmacy: { name: "صيدلية الحياة" },
      location: { name: "فرع مدينة نصر" },
    },
    {
      id: 3,
      name: "فرع الإسكندرية",
      code: "ALXB",
      pharmacy_id: 1,
      location_id: 3,
      address: "الإسكندرية - سموحة",
      active: false,
      pharmacy: { name: "صيدلية النور" },
      location: { name: "فرع المعادي" },
    },
  ];

  const filteredBranches = mockBranches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <LocateFixed className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">الفروع</h1>
            <p className="text-gray-600">إدارة وتنظيم الفروعع</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
          <Plus className="w-5 h-5" />
          إضافة فرع جديد
        </button>
      </div>

      {/* شريط البحث */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث باسم الفرع، الكود، أو العنوان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="font-semibold text-blue-700">
                {filteredBranches.length} فرع
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>
                نشطة: {filteredBranches.filter((b) => b.active).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* شبكة البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className={`bg-white rounded-2xl border-2 p-6 hover:shadow-lg transition-all duration-300  ${
              branch.active
                ? "border-blue-200 hover:border-blue-300"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* الهيدر */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    branch.active
                      ? "bg-blue-600"
                      : "bg-gradient-to-br from-gray-400 to-gray-500"
                  }`}
                >
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {branch.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-700">
                      {branch.code}
                    </code>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        branch.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {branch.active ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          نشط
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          غير نشط
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* المعلومات */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <div className="text-gray-500">العنوان</div>
                  <div className="font-medium text-gray-900 line-clamp-2">
                    {branch.address}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Building className="w-4 h-4 text-gray-400" />
                <div className="text-sm">
                  <div className="text-gray-500">الصيدلية</div>
                  <div className="font-medium text-gray-900">
                    {branch.pharmacy?.name || `صيدلية #${branch.pharmacy_id}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div className="text-sm">
                  <div className="text-gray-500">الموقع</div>
                  <div className="font-medium text-gray-900">
                    {branch.location?.name || `موقع #${branch.location_id}`}
                  </div>
                </div>
              </div>
            </div>

            {/* الإجراءات */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button className="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium text-center">
                تعديل
              </button>

              <button className="flex-1 bg-red-50 text-red-700 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium text-center">
                حذف
              </button>
              <button
                className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-medium text-center ${
                  branch.active
                    ? "bg-red-300 text-red-800 hover:bg-orange-100"
                    : "bg-blue-50 text-blue-700 hover:bg-green-100"
                }`}
              >
                {branch.active ? "إيقاف" : "تفعيل"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* حالة عدم وجود بيانات */}
      {filteredBranches.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {searchTerm ? "لا توجد نتائج" : "لا توجد فروع"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm
              ? "لم نتمكن من العثور على فروع تطابق بحثك."
              : "ابدأ بإضافة أول فرع إلى النظام."}
          </p>
        </div>
      )}
    </div>
  );
}
