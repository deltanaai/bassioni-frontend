"use client";
import { useState } from "react";
import { 
  Trash2, 
  User, 
  Package, 
  RotateCcw, 
  Search,
  Filter
} from "lucide-react";

// بيانات تجريبية 
const trashData = [
  {
    id: "1",
    type: "employee",
    name: "أحمد محمد",
    role: "مدير مبيعات",
    deletedAt: "2024-01-15",
    originalId: "emp_123"
  },
  {
    id: "2", 
    type: "warehouse",
    name: "مستودع الرياض",
    code: "WH-RYD",
    deletedAt: "2024-01-14",
    originalId: "wh_456"
  },
  {
    id: "3",
    type: "employee", 
    name: "فاطمة أحمد",
    role: "منسق مخازن",
    deletedAt: "2024-01-13",
    originalId: "emp_789"
  }
];

export default function TrashPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredItems = trashData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* الهيدر */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">سلة المحذوفات</h1>
              <p className="text-gray-600">إدارة العناصر المحذوفة حديثاً</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600">إجمالي العناصر المحذوفة</p>
          <p className="text-2xl text-center font-bold text-gray-900">{trashData.length}</p>
        </div>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* بحث */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في المحذوفات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* تصفية */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pr-10 pl-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">جميع العناصر</option>
                <option value="employee">الموظفين</option>
                <option value="warehouse">المخازن</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة المحذوفات */}
      <div className="grid gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* أيقونة النوع */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    item.type === "employee" ? "bg-blue-100" : "bg-orange-100"
                  }`}>
                    {item.type === "employee" ? (
                      <User className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Package className="w-6 h-6 text-orange-600" />
                    )}
                  </div>

                  {/* المعلومات */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className={`px-3 py-1 rounded-full ${
                        item.type === "employee" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {item.type === "employee" ? "موظف" : "مخزن"}
                      </span>
                      {item.type === "employee" ? (
                        <span>الدور: {item.role}</span>
                      ) : (
                        <span>الكود: {item.code}</span>
                      )}
                      <span>تم الحذف: {item.deletedAt}</span>
                    </div>
                  </div>
                </div>

                {/* الأزرار */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-sm font-semibold text-white transition duration-300">
                    <RotateCcw className="w-4 h-4" />
                    استعادة
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-2xl text-sm font-semibold text-white transition duration-300">
                    <Trash2 className="w-4 h-4" />
                    حذف نهائي
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
            <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">
              لا توجد عناصر محذوفة
            </h2>
            <p className="text-gray-500">سيظهر هنا العناصر التي تقوم بحذفها</p>
          </div>
        )}
      </div>
    </div>
  );
}