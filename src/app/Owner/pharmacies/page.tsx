"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Store,
  MapPin,
  Phone,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  deleted: boolean;
}

export default function PharmaciesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortStates, setSortStates] = useState({
    name: false,
    address: false,
    phone: false,
  });

  const mockPharmacies: Pharmacy[] = [
    {
      id: 1,
      name: "صيدلية النور",
      address: "شارع الجمهورية، القاهرة",
      phone: "01234567890",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
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
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    );
  };

  const filteredPharmacies = mockPharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">الصيدليات</h1>
            <p className="text-gray-600">إدارة وتنظيم الصيدليات</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
          <Plus className="w-5 h-5" />
          إضافة صيدلية
        </button>
      </div>

      {/* شريط البحث والإحصائيات */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="ابحث باسم الصيدلية أو العنوان أو التليفون..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              إجمالي الصيدليات: <strong>{filteredPharmacies.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="border-b border-gray-200 min-w-[800px]">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50">
              <div className="col-span-1 text-center">#</div>

              <div className="col-span-3 text-center">
                <button
                  onClick={() => handleSortClick("name")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
                >
                  <span>اسم الصيدلية</span>
                  {getSortIcon("name")}
                </button>
              </div>

              <div className="col-span-4 text-center">
                <button
                  onClick={() => handleSortClick("address")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
                >
                  <span>العنوان</span>
                  {getSortIcon("address")}
                </button>
              </div>

              <div className="col-span-2 text-center">
                <button
                  onClick={() => handleSortClick("phone")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
                >
                  <span>التليفون</span>
                  {getSortIcon("phone")}
                </button>
              </div>

              <div className="col-span-2 text-center">الإجراءات</div>
            </div>
          </div>
          {/* جسم الجدول */}
          <div className="divide-y divide-gray-200 min-w-[800px]">
            {filteredPharmacies.length > 0 ? (
              filteredPharmacies.map((pharmacy, index) => (
                <div
                  key={pharmacy.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1 text-sm text-gray-600 text-center">
                    {index + 1}
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center gap-3 justify-center text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Store className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {pharmacy.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {pharmacy.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-700 line-clamp-1">
                        {pharmacy.address}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-700">{pharmacy.phone}</p>
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
                <Store className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  لا توجد صيدليات
                </h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm
                    ? "لم نتمكن من العثور على صيدليات تطابق بحثك."
                    : "لم يتم إضافة أي صيدليات بعد."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* الباجينيشن */}
      {/* <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-6 py-3">
        <div className="text-sm text-gray-600">
          عرض <strong>1-{filteredPharmacies.length}</strong> من <strong>{filteredPharmacies.length}</strong>
        </div>
        
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            السابق
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            التالي
          </button>
        </div>
      </div> */}
    </div>
  );
}
