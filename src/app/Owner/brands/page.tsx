"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Home,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Badge,
} from "lucide-react";
import Image from "next/image";

interface Brand {
  id: number;
  name: string;
  showHome: boolean;
  position: number;
  active: boolean;
  imageUrl: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deleted: boolean;
}

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortStates, setSortStates] = useState({
    name: false,
    position: false,
    active: false,
  });

  // بيانات وهمية للعرض فقط
  const mockBrands: Brand[] = [
    {
      id: 2,
      name: "نايس",
      showHome: true,
      position: 2,
      active: true,
      imageUrl: "/brand.webp",
      image: null,
      createdAt: "2025-Oct-26 18:22:01 PM",
      updatedAt: "2025-Oct-26 18:22:01 PM",
      deletedAt: null,
      deleted: false,
    },
    {
      id: 1,
      name: "جونسون",
      showHome: false,
      position: 1,
      active: false,
      imageUrl: "/brand.webp",
      image: null,
      createdAt: "2025-Oct-26 18:22:00 PM",
      updatedAt: "2025-Oct-26 18:22:00 PM",
      deletedAt: null,
      deleted: false,
    },
  ];

  // دالة قلب السهم فقط
  const handleSortClick = (field: keyof typeof sortStates) => {
    setSortStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // دالة لعرض السهم
  const getSortIcon = (field: keyof typeof sortStates) => {
    return sortStates[field] ? (
      <ArrowUpDown className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowUpDown className="h-4 w-4 text-blue-600" />
    );
  };

  const handleToggleStatus = (brand: Brand) => {
    console.log("تغيير حالة البراند:", brand);
  };

  const filteredBrands = mockBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Badge className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">البراندات</h1>
            <p className="text-gray-600">إدارة وتنظيم البراندات</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
          <Plus className="w-5 h-5" />
          إضافة براند
        </button>
      </div>

      {/* شريط البحث والإحصائيات */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="ابحث باسم البراند..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              إجمالي البراندات: <strong>{filteredBrands.length}</strong>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>
                نشطة:
                <strong>{filteredBrands.filter((c) => c.active).length}</strong>
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* رأس الجدول */}
          <div className="border-b border-gray-200 min-w-[800px]">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50">
              <div className="col-span-1 text-center">#</div>

              <div className="col-span-2 text-center">
                <button
                  onClick={() => handleSortClick("name")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
                >
                  <span>اسم البراند</span>
                  {getSortIcon("name")}
                </button>
              </div>

              <div className="col-span-1 text-center">
                <button
                  onClick={() => handleSortClick("position")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
                >
                  <span>الترتيب</span>
                  {getSortIcon("position")}
                </button>
              </div>

              <div className="col-span-2 text-center">
                <span>العرض في الرئيسية</span>
              </div>

              <div className="col-span-2 text-center">
                <button
                  onClick={() => handleSortClick("active")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
                >
                  <span>الحالة</span>
                  {getSortIcon("active")}
                </button>
              </div>

              <div className="col-span-2 text-center">
                <span>الصورة</span>
              </div>

              <div className="col-span-2 text-center">الإجراءات</div>
            </div>
          </div>
          {/* جسم الجدول */}
          <div className="divide-y divide-gray-200 min-w-[800px]">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand, index) => (
                <div
                  key={brand.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1 text-sm text-gray-600 text-center">
                    {index + 1}
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-3 justify-center text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Badge className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {brand.name}
                        </p>
                        <p className="text-xs text-gray-500">ID: {brand.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-lg font-semibold mx-auto">
                      {brand.position}
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    {brand.showHome ? (
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <Home className="h-4 w-4" />
                        <span className="text-sm">معروض</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-gray-400">
                        <Home className="h-4 w-4" />
                        <span className="text-sm">مخفي</span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 text-center">
                    <button
                      onClick={() => handleToggleStatus(brand)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors mx-auto ${
                        brand.active
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {brand.active ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>نشط</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          <span>غير نشط</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden mx-auto">
                      <Image
                        src={brand.imageUrl}
                        alt={brand.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center min-w-[800px]">
                <Badge className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  لا توجد براندات
                </h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm
                    ? "لم نتمكن من العثور على براندات تطابق بحثك."
                    : "لم يتم إضافة أي براندات بعد."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
