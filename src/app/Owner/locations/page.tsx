"use client";
import { useState } from "react";
import { Plus, Search, MapPin, MoreVertical, Calendar } from "lucide-react";

interface Location {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockLocations: Location[] = [
    {
      id: 1,
      name: "الموقع الرئيسي",
      createdAt: "2025-Oct-26 18:22:01 PM",
      updatedAt: "2025-Oct-26 18:22:01 PM",
    },
    {
      id: 2,
      name: "فرع مدينة نصر",
      createdAt: "2025-Oct-27 14:23:10 PM",
      updatedAt: "2025-Oct-27 14:23:10 PM",
    },
    {
      id: 3,
      name: "فرع المعادي",
      createdAt: "2025-Oct-28 10:15:30 PM",
      updatedAt: "2025-Oct-28 10:15:30 PM",
    },
    {
      id: 4,
      name: "فرع الشيخ زايد",
      createdAt: "2025-Oct-29 09:45:20 PM",
      updatedAt: "2025-Oct-29 09:45:20 PM",
    },
  ];

  // دالة لتنسيق التاريخ
  const formatDate = (dateString: string) => {
    return dateString.replace("PM", "م").replace("AM", "ص");
  };

  const filteredLocations = mockLocations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">المواقع</h1>
            <p className="text-gray-600">إدارة وتنظيم المواقع</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
          <Plus className="w-5 h-5" />
          إضافة موقع جديد
        </button>
      </div>

      {/* شريط البحث */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث عن موقع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="font-semibold text-blue-700">
                {filteredLocations.length} موقع
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* شبكة البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLocations.map((location) => (
          <div
            key={location.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 "
          >
            {/* الهيدر */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {location.name}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {location.id}</p>
                </div>
              </div>

              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* المعلومات */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div className="text-sm">
                  <div>أنشئ في</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(location.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div className="text-sm">
                  <div> اخر تحديث</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(location.updatedAt)}
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
            </div>
          </div>
        ))}
      </div>

      {/* حالة عدم وجود بيانات */}
      {filteredLocations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? "لا توجد نتائج" : "لا توجد مواقع"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "لم نتمكن من العثور على مواقع تطابق بحثك."
              : "ابدأ بإضافة أول موقع إلى النظام."}
          </p>
        </div>
      )}
    </div>
  );
}
