// components/CompanyOffersPage.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEye, FiShoppingCart, FiSearch, FiFilter } from "react-icons/fi";
import {
  getCompanyOffers,
  requestCompanyOffer,
  showCompanyOfferDetails,
} from "@/lib/actions/pharma/companyOffers.action";

export default function CompanyOffersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<CompanyOffer | null>(null);
  const [requestQuantity, setRequestQuantity] = useState<{
    [key: number]: number;
  }>({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    active: true,
  });

  const queryClient = useQueryClient();

  // جلب عروض الشركات
  const {
    data: offersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companyOffers", currentPage, searchTerm, filters],
    queryFn: () =>
      getCompanyOffers({
        page: currentPage,
        perPage: 10,
        filters: {
          search: searchTerm,
          active: filters.active,
        },
      }),
  });

  const offers = offersData?.data?.data || [];
  const pagination = offersData?.data?.meta;

  // طلب عرض من الشركة
  const requestMutation = useMutation({
    mutationFn: requestCompanyOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyOffers"] });
      setShowRequestModal(false);
      alert("تم تقديم الطلب بنجاح!");
    },
    onError: (error) => {
      console.error("فشل طلب العرض:", error);
      alert("فشل تقديم الطلب!");
    },
  });

  // عرض تفاصيل العرض
  const showDetails = async (offer: CompanyOffer) => {
    try {
      const result = await showCompanyOfferDetails({ offerId: offer.id });
      if (result.success) {
        setSelectedOffer(result.data as CompanyOffer);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("فشل جلب التفاصيل:", error);
      // إذا فشل جلب التفاصيل من السيرفر، نعرض البيانات الأساسية
      setSelectedOffer(offer);
      setShowDetailsModal(true);
    }
  };

  // طلب عرض
  const handleRequestOffer = (offer: CompanyOffer) => {
    setSelectedOffer(offer);
    setRequestQuantity({
      ...requestQuantity,
      [offer.id]: offer.min_quantity,
    });
    setShowRequestModal(true);
  };

  // إرسال الطلب
  const submitRequest = () => {
    if (!selectedOffer) return;

    const quantity =
      requestQuantity[selectedOffer.id] || selectedOffer.min_quantity;

    if (quantity < selectedOffer.min_quantity) {
      alert(`الكمية يجب أن تكون ${selectedOffer.min_quantity} على الأقل`);
      return;
    }

    if (quantity > selectedOffer.total_quantity) {
      alert(`الكمية المتاحة ${selectedOffer.total_quantity} فقط`);
      return;
    }

    // افترضنا أن pharmacyId بيكون متاح من السياق
    const pharmacyId = 1; // يجب استبداله بالقيمة الفعلية

    requestMutation.mutate({
      companyOfferId: selectedOffer.id,
      pharmacyId,
      quantity,
    });
  };

  // البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // حساب الكمية المتاحة
  const getAvailableQuantity = (offer: CompanyOffer) => {
    return offer.total_quantity;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-white">عروض الشركات</h1>
          <p className="text-gray-400 mt-1">
            استعرض واطلب من عروض الشركات المتاحة
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFilters({ ...filters, active: !filters.active })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              filters.active
                ? "bg-emerald-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            <FiFilter className="w-4 h-4" />
            {filters.active ? "النشطة فقط" : "جميع العروض"}
          </button>
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
              placeholder="ابحث في عروض الشركات..."
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
          <div className="text-gray-400 text-sm">إجمالي العروض</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {offers.filter((o) => o.active).length}
          </div>
          <div className="text-gray-400 text-sm">عروض نشطة</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {offers.filter((o) => !o.active).length}
          </div>
          <div className="text-gray-400 text-sm">عروض منتهية</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {offers.reduce((sum, offer) => sum + offer.total_quantity, 0)}
          </div>
          <div className="text-gray-400 text-sm">الكميات المتاحة</div>
        </div>
      </div>

      {/* جدول العروض */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto"></div>
            <p className="text-gray-400 mt-2">جاري تحميل العروض...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            حدث خطأ في تحميل العروض
          </div>
        ) : offers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            لا توجد عروض متاحة حالياً
          </div>
        ) : (
          <>
            {/* أدوات الجدول */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-750">
              <div className="text-sm text-gray-400">
                عرض {offers.length} من {pagination?.total} عرض
              </div>
              <div className="text-sm text-gray-400">
                الصفحة {currentPage} من {pagination?.last_page}
              </div>
            </div>

            {/* الجدول */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-750 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      وصف العرض
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الخصم
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الكمية
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الفترة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {offers.map((offer, index) => (
                    <tr
                      key={offer.id}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white text-sm">
                          {offer.description || `عرض #${offer.id}`}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          المنتج: #{offer.warehouse_product_id} | الشركة: #
                          {offer.company_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300">
                          {offer.discount}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div className="text-center">
                          <div>{getAvailableQuantity(offer)} متاح</div>
                          <div className="text-xs text-gray-400">
                            أدنى: {offer.min_quantity}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        <div className="text-center">
                          <div>{offer.start_date}</div>
                          <div className="text-xs">إلى {offer.end_date}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            offer.active
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {offer.active ? "نشط" : "منتهي"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => showDetails(offer)}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-900 text-blue-300 rounded-lg hover:bg-blue-800 transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                            التفاصيل
                          </button>
                          <button
                            onClick={() => handleRequestOffer(offer)}
                            disabled={
                              !offer.active || getAvailableQuantity(offer) === 0
                            }
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-900 text-emerald-300 rounded-lg hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiShoppingCart className="w-4 h-4" />
                            طلب
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
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
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
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

      {/* مودال تفاصيل العرض */}
      {showDetailsModal && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedOffer.description || `عرض #${selectedOffer.id}`}
                  </h2>
                  <p className="text-gray-400 mt-1">تفاصيل عرض الشركة</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-xl p-2"
                >
                  ✕
                </button>
              </div>

              {/* معلومات العرض */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">الشركة</div>
                    <div className="text-white font-semibold">
                      #{selectedOffer.company_id}
                    </div>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">نسبة الخصم</div>
                    <div className="text-red-400 font-bold text-lg">
                      {selectedOffer.discount}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">المنتج</div>
                    <div className="text-white font-semibold">
                      #{selectedOffer.warehouse_product_id}
                    </div>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">
                      الكمية الإجمالية
                    </div>
                    <div className="text-white font-bold text-lg">
                      {selectedOffer.total_quantity} وحدة
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">
                      الحد الأدنى للطلب
                    </div>
                    <div className="text-white font-semibold">
                      {selectedOffer.min_quantity} وحدة
                    </div>
                  </div>
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                    <div className="text-gray-400 text-sm">الحالة</div>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOffer.active
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {selectedOffer.active ? "نشط" : "منتهي"}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                  <div className="text-gray-400 text-sm">فترة العرض</div>
                  <div className="text-white font-semibold">
                    من {selectedOffer.start_date} إلى {selectedOffer.end_date}
                  </div>
                </div>

                <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                  <div className="text-gray-400 text-sm">تاريخ الإنشاء</div>
                  <div className="text-white">
                    {new Date(selectedOffer.created_at).toLocaleString("ar-EG")}
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
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleRequestOffer(selectedOffer);
                  }}
                  disabled={
                    !selectedOffer.active || selectedOffer.total_quantity === 0
                  }
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  طلب العرض
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال طلب العرض */}
      {showRequestModal && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">طلب عرض</h2>
                  <p className="text-gray-400 mt-1">
                    {selectedOffer.description || `عرض #${selectedOffer.id}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-xl p-2"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                  <div className="text-gray-400 text-sm">نسبة الخصم</div>
                  <div className="text-red-400 font-bold text-lg">
                    {selectedOffer.discount}%
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الكمية المطلوبة *
                  </label>
                  <input
                    type="number"
                    value={
                      requestQuantity[selectedOffer.id] ||
                      selectedOffer.min_quantity
                    }
                    onChange={(e) =>
                      setRequestQuantity({
                        ...requestQuantity,
                        [selectedOffer.id]:
                          parseInt(e.target.value) ||
                          selectedOffer.min_quantity,
                      })
                    }
                    min={selectedOffer.min_quantity}
                    max={selectedOffer.total_quantity}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    الحد الأدنى: {selectedOffer.min_quantity} | الحد الأقصى:{" "}
                    {selectedOffer.total_quantity}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={submitRequest}
                  disabled={requestMutation.isPending}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {requestMutation.isPending ? "جاري الطلب..." : "تأكيد الطلب"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
