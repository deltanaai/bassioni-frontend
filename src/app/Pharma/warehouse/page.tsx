"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {  FiSearch, FiEye, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import { getPharmaCompanies, showPharmaCompanyDetails } from "@/lib/actions/pharma/companies";
import { Building } from "lucide-react";

export default function PharmaCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<PharmacyCompany | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // جلب الشركات 
  const {
    data: companiesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pharmaCompanies", currentPage, searchTerm],
    queryFn: () =>
      getPharmaCompanies({
        page: currentPage,
        perPage: 10,
        filters: {
          search: searchTerm,
        },
      }),
  });

  const companies = companiesData?.data || [];
  const pagination = companiesData?.meta;
console.log("companies", companies);
console.log("pagination", pagination);
  // عرض تفاصيل الشركة
  const showCompanyDetails = async (companyId: number) => {
    try {
      const result = await showPharmaCompanyDetails({ id: companyId });
      if (result.success) {
        setSelectedCompany(result.data as PharmacyCompany);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("فشل جلب تفاصيل الشركة:", error);
    }
  };

  // البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">الشركات </h1>
            <p className="text-gray-400 mt-1">إدارة وعرض جميع شركات الصيدلة المسجلة</p>
          </div>
        </div>
        
        <div className="text-sm text-emerald-400 font-semibold bg-emerald-900 px-3 py-1 rounded-full border border-emerald-700">
          {pagination?.total || 0} شركة
        </div>
      </div>

      {/* شريط البحث */}
      <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم الشركة أو العنوان..."
              className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-4 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            بحث
          </button>
        </form>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {pagination?.total || 0}
          </div>
          <div className="text-gray-400 text-sm">إجمالي الشركات</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {companies.filter(c => !c.deleted).length}
          </div>
          <div className="text-gray-400 text-sm">شركات نشطة</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-red-400">
            {companies.filter(c => c.deleted).length}
          </div>
          <div className="text-gray-400 text-sm">شركات محذوفة</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {new Set(companies.map(c => c.address?.split(',')?.[0] || c.address)).size}
          </div>
          <div className="text-gray-400 text-sm">مدينة مختلفة</div>
        </div>
      </div>

      {/* جدول الشركات */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto"></div>
            <p className="text-gray-400 mt-2">جاري تحميل الشركات...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            حدث خطأ في تحميل بيانات الشركات
          </div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Building className="w-16 h-16 mx-auto mb-4" />
            <p className="font-semibold text-xl">لا توجد شركات</p>
            <p className="mt-2">لم يتم العثور على شركات متطابقة مع بحثك</p>
          </div>
        ) : (
          <>
            {/* أدوات الجدول */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-750">
              <div className="text-sm text-gray-400">
                عرض {companies.length} من {pagination?.total} شركة
              </div>
              <div className="text-sm text-gray-400">
                الصفحة {currentPage} من {pagination?.last_page || 1}
              </div>
            </div>

            {/* الجدول */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-750 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      اسم الشركة
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      العنوان
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الهاتف
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      تاريخ التسجيل
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {companies.map((company, index) => (
                    <tr
                      key={company.id}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-gray-300 text-center">
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-white text-right">
                          {company.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-right">
                          <FiMapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">
                            {company.address}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <FiPhone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">
                            {company.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400 text-center">
                        {new Date(company.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          company.deleted 
                            ? "bg-red-900 text-red-300" 
                            : "bg-emerald-900 text-emerald-300"
                        }`}>
                          {company.deleted ? "محذوفة" : "نشطة"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <button
                            onClick={() => showCompanyDetails(company.id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-900 text-blue-300 rounded-lg hover:bg-blue-800 transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                            التفاصيل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* الترقيم */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex justify-center items-center p-4 border-t border-gray-700 bg-gray-750">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    السابق
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))}
                    disabled={currentPage === pagination.last_page}
                    className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* مودال تفاصيل الشركة */}
      {showDetailsModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCompany.name}
                  </h2>
                  <p className="text-gray-400 mt-1">تفاصيل شركة الصيدلة</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-xl p-2"
                >
                  ✕
                </button>
              </div>

              {/* معلومات الشركة */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm mb-2">اسم الشركة</div>
                    <div className="text-white font-semibold">{selectedCompany.name}</div>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm mb-2">رقم الهاتف</div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      {selectedCompany.phone}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                  <div className="text-gray-400 text-sm mb-2">العنوان</div>
                  <div className="text-white flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {selectedCompany.address}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm mb-2">تاريخ التسجيل</div>
                    <div className="text-white flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedCompany.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm mb-2">آخر تحديث</div>
                    <div className="text-white flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedCompany.updatedAt).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                  <div className="text-gray-400 text-sm mb-2">حالة الشركة</div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCompany.deleted 
                        ? "bg-red-900 text-red-300" 
                        : "bg-emerald-900 text-emerald-300"
                    }`}>
                      {selectedCompany.deleted ? "محذوفة" : "نشطة"}
                    </span>
                    {selectedCompany.deletedAt && (
                      <span className="text-gray-400 text-sm">
                        (تم الحذف في {new Date(selectedCompany.deletedAt).toLocaleDateString('ar-EG')})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
