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
  ChevronDown
} from "lucide-react";

interface Company {
  id: number;
  name: string;
  address: string;
  phone: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  deleted: boolean;
}

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortStates, setSortStates] = useState({
    name: false,
    address: false,
    phone: false
  });

  const mockCompanies: Company[] = [
    {
      id: 1,
      name: "شركه الحياه ",
      address: "شارع الجمهورية، القاهرة",
      phone: "0000000000",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
      deletedAt: null,
      deleted: false
    }
  ];

  // دالة قلب السهم فقط
  const handleSortClick = (field: keyof typeof sortStates) => {
    setSortStates(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // دالة لعرض السهم
  const getSortIcon = (field: keyof typeof sortStates) => {
    return sortStates[field] 
      ? <ChevronUp className="h-4 w-4 text-blue-600" />
      : <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  const filteredCompanies = mockCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الشركات</h1>
          <p className="text-gray-600 mt-1">عرض وإدارة جميع الشركات في النظام</p>
        </div>
        
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-fit">
          <Plus className="h-5 w-5" />
          <span>إضافة شركة</span>
        </button>
      </div>

      {/* شريط البحث والإحصائيات */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="ابحث باسم الشركة أو العنوان أو التليفون..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>إجمالي الشركات: <strong>{filteredCompanies.length}</strong></span>
          </div>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* رأس الجدول مع أزرار الترتيب */}
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50">
            <div className="col-span-1">#</div>
            
            <div className="col-span-3">
              <button 
                onClick={() => handleSortClick('name')}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <span>اسم الشركة</span>
                {getSortIcon('name')}
              </button>
            </div>
            
            <div className="col-span-4">
              <button 
                onClick={() => handleSortClick('address')}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <span>العنوان</span>
                {getSortIcon('address')}
              </button>
            </div>
            
            <div className="col-span-2">
              <button 
                onClick={() => handleSortClick('phone')}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <span>التليفون</span>
                {getSortIcon('phone')}
              </button>
            </div>
            
            <div className="col-span-2 text-center">الإجراءات</div>
          </div>
        </div>

        {/* جسم الجدول */}
        <div className="divide-y divide-gray-200">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => (
              <div key={company.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-1 text-sm text-gray-600">
                  {index + 1}
                </div>
                
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Store className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-500">ID: {company.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-700 line-clamp-1">{company.address}</p>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-700">{company.phone}</p>
                  </div>
                </div>
                
                <div className="col-span-2">
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
            <div className="px-6 py-12 text-center">
              <Store className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد شركات</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm ? "لم نتمكن من العثور على شركة تطابق بحثك." : "لم يتم إضافة أي شركات بعد."}
              </p>
            </div>
          )}
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