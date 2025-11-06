"use client";

import { useQuery } from "@tanstack/react-query";
import { Building } from "lucide-react";
import { useState } from "react";
import { FiSearch, FiEye, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";

import {
  getPharmaCompanies,
  showPharmaCompanyDetails,
} from "@/lib/actions/pharma/companies";

export default function PharmaCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] =
    useState<PharmacyCompany | null>(null);
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
        filters: {},
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
    <div className="min-h-screen space-y-6 bg-gray-900 p-6">
      {/* الهيدر */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-700 bg-gray-800 p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-2">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">الشركات </h1>
            <p className="mt-1 text-gray-400">
              إدارة وعرض جميع شركات الصيدلة المسجلة
            </p>
          </div>
        </div>

        <div className="rounded-full border border-emerald-700 bg-emerald-900 px-3 py-1 text-sm font-semibold text-emerald-400">
          {pagination?.total || 0} شركة
        </div>
      </div>

      {/* شريط البحث */}
      <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم الشركة أو العنوان..."
              className="w-full rounded-xl border border-gray-600 bg-gray-700 py-3 pr-10 pl-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-6 py-3 text-white transition-colors hover:bg-emerald-700"
          >
            بحث
          </button>
        </form>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {pagination?.total || 0}
          </div>
          <div className="text-sm text-gray-400">إجمالي الشركات</div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {companies.filter((c) => !c.deleted).length}
          </div>
          <div className="text-sm text-gray-400">شركات نشطة</div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {companies.filter((c) => c.deleted).length}
          </div>
          <div className="text-sm text-gray-400">شركات محذوفة</div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {
              new Set(
                companies.map((c) => c.address?.split(",")?.[0] || c.address)
              ).size
            }
          </div>
          <div className="text-sm text-gray-400">مدينة مختلفة</div>
        </div>
      </div>

      {/* جدول الشركات */}
      <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-400"></div>
            <p className="mt-2 text-gray-400">جاري تحميل الشركات...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            حدث خطأ في تحميل بيانات الشركات
          </div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Building className="mx-auto mb-4 h-16 w-16" />
            <p className="text-xl font-semibold">لا توجد شركات</p>
            <p className="mt-2">لم يتم العثور على شركات متطابقة مع بحثك</p>
          </div>
        ) : (
          <>
            {/* أدوات الجدول */}
            <div className="bg-gray-750 flex items-center justify-between border-b border-gray-700 p-4">
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
                    <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      #
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      اسم الشركة
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      العنوان
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      الهاتف
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      تاريخ التسجيل
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      الحالة
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold tracking-wider text-gray-300 uppercase">
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
                      <td className="px-4 py-4 text-center text-sm text-gray-300">
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-right font-semibold text-white">
                          {company.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-right">
                          <FiMapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {company.address}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <FiPhone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {company.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-400">
                        {company.createdAt}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            company.deleted
                              ? "bg-red-900 text-red-300"
                              : "bg-emerald-900 text-emerald-300"
                          }`}
                        >
                          {company.deleted ? "محذوفة" : "نشطة"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <button
                            onClick={() => showCompanyDetails(company.id)}
                            className="flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm text-blue-300 transition-colors hover:bg-blue-800"
                          >
                            <FiEye className="h-4 w-4" />
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
              <div className="bg-gray-750 flex items-center justify-center border-t border-gray-700 p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg bg-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-600 disabled:opacity-50"
                  >
                    السابق
                  </button>

                  {Array.from(
                    { length: Math.min(5, pagination.last_page) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                            currentPage === pageNum
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pagination.last_page)
                      )
                    }
                    disabled={currentPage === pagination.last_page}
                    className="rounded-lg bg-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-600 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-800">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCompany.name}
                  </h2>
                  <p className="mt-1 text-gray-400">تفاصيل شركة الصيدلة</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-xl text-gray-400 transition-colors hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* معلومات الشركة */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="mb-2 text-sm text-gray-400">اسم الشركة</div>
                    <div className="font-semibold text-white">
                      {selectedCompany.name}
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="mb-2 text-sm text-gray-400">رقم الهاتف</div>
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                      {selectedCompany.phone}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                  <div className="mb-2 text-sm text-gray-400">العنوان</div>
                  <div className="flex items-center gap-2 text-white">
                    <FiMapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    {selectedCompany.address}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="mb-2 text-sm text-gray-400">
                      تاريخ التسجيل
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <FiCalendar className="h-4 w-4 text-gray-400" />
                      {selectedCompany.createdAt}
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="mb-2 text-sm text-gray-400">آخر تحديث</div>
                    <div className="flex items-center gap-2 text-white">
                      <FiCalendar className="h-4 w-4 text-gray-400" />
                      {selectedCompany.updatedAt}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                  <div className="mb-2 text-sm text-gray-400">حالة الشركة</div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        selectedCompany.deleted
                          ? "bg-red-900 text-red-300"
                          : "bg-emerald-900 text-emerald-300"
                      }`}
                    >
                      {selectedCompany.deleted ? "محذوفة" : "نشطة"}
                    </span>
                    {selectedCompany.deletedAt && (
                      <span className="text-sm text-gray-400">
                        (تم الحذف في{" "}
                        {new Date(selectedCompany.deletedAt).toLocaleDateString(
                          "ar-EG"
                        )}
                        )
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="rounded-xl border border-gray-600 px-6 py-2 text-gray-300 transition-colors hover:bg-gray-700"
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
