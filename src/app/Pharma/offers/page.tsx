// components/CompanyOffersPage.tsx
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FiEye, FiShoppingCart, FiSearch, FiFilter } from "react-icons/fi";
import { toast } from "sonner";

import {
  getCompanyOffers,
  requestCompanyOffer,
  showCompanyOfferDetails,
} from "@/lib/actions/pharma/companyOffers.action";
import { queryClient } from "@/lib/queryClient";
import { formatIsoToArabicDate } from "@/lib/utils";

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
        // filters: {
        //   search: searchTerm,
        //   active: filters.active,
        // },
      }),
  });

  const offers = offersData?.data || [];
  const pagination = offersData?.meta;

  console.log("OFFERS", offers);

  // طلب عرض من الشركة
  const requestMutation = useMutation({
    mutationFn: requestCompanyOffer,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["companyOffers"] });
        setShowRequestModal(false);
        toast.success("تم تقديم الطلب بنجاح!");
      } else {
        toast.error(
          "فشل تقديم الطلب: " + (res.error?.message || "خطأ غير معروف")
        );
      }
    },
    onError: (error) => {
      console.error("فشل طلب العرض:", error);
      toast.error("فشل تقديم الطلب: حدث خطأ غير متوقع");
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
    <div className="min-h-screen space-y-6 bg-gray-900 p-6">
      {/* الهيدر */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-700 bg-gray-800 p-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">عروض الشركات</h1>
          <p className="mt-1 text-gray-400">
            استعرض واطلب من عروض الشركات المتاحة
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFilters({ ...filters, active: !filters.active })}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-colors ${
              filters.active
                ? "bg-emerald-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            <FiFilter className="h-4 w-4" />
            {filters.active ? "النشطة فقط" : "جميع العروض"}
          </button>
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
              placeholder="ابحث في عروض الشركات..."
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
          <div className="text-sm text-gray-400">إجمالي العروض</div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {offers.filter((o) => o.active).length}
          </div>
          <div className="text-sm text-gray-400">عروض نشطة</div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {offers.filter((o) => !o.active).length}
          </div>
          <div className="text-sm text-gray-400">عروض منتهية</div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {offers.reduce((sum, offer) => sum + offer.total_quantity, 0)}
          </div>
          <div className="text-sm text-gray-400">الكميات المتاحة</div>
        </div>
      </div>

      {/* جدول العروض */}
      <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-400"></div>
            <p className="mt-2 text-gray-400">جاري تحميل العروض...</p>
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
            <div className="bg-gray-750 flex items-center justify-between border-b border-gray-700 p-4">
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
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      #
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      وصف العرض
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      الخصم
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      الكمية
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      الفترة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider text-gray-300 uppercase">
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
                        <div className="text-sm font-semibold text-white">
                          {offer.description || `عرض #${offer.id}`}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          المنتج: #{offer.warehouse_product_id} | الشركة: #
                          {offer.company_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-red-900 px-3 py-1 text-xs font-medium text-red-300">
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
                          <div>{formatIsoToArabicDate(offer.start_date)}</div>
                          <div className="text-xs">إلى {formatIsoToArabicDate(offer.end_date)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            offer.active
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {offer.active ? "نشط" : "منتهي"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => showDetails(offer)}
                            className="flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm text-blue-300 transition-colors hover:bg-blue-800"
                          >
                            <FiEye className="h-4 w-4" />
                            التفاصيل
                          </button>
                          <button
                            onClick={() => handleRequestOffer(offer)}
                            disabled={
                              !offer.active || getAvailableQuantity(offer) === 0
                            }
                            className="flex items-center gap-2 rounded-lg bg-emerald-900 px-3 py-2 text-sm text-emerald-300 transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FiShoppingCart className="h-4 w-4" />
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

      {/* مودال تفاصيل العرض */}
      {showDetailsModal && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-800">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedOffer.description || `عرض #${selectedOffer.id}`}
                  </h2>
                  <p className="mt-1 text-gray-400">تفاصيل عرض الشركة</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-xl text-gray-400 transition-colors hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* معلومات العرض */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">الشركة</div>
                    <div className="font-semibold text-white">
                      #{selectedOffer.company_id}
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">نسبة الخصم</div>
                    <div className="text-lg font-bold text-red-400">
                      {selectedOffer.discount}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">المنتج</div>
                    <div className="font-semibold text-white">
                      #{selectedOffer.warehouse_product_id}
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">
                      الكمية الإجمالية
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedOffer.total_quantity} وحدة
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">
                      الحد الأدنى للطلب
                    </div>
                    <div className="font-semibold text-white">
                      {selectedOffer.min_quantity} وحدة
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                    <div className="text-sm text-gray-400">الحالة</div>
                    <div
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        selectedOffer.active
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {selectedOffer.active ? "نشط" : "منتهي"}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                  <div className="text-sm text-gray-400">فترة العرض</div>
                  <div className="font-semibold text-white">
                    من {selectedOffer.start_date} إلى {selectedOffer.end_date}
                  </div>
                </div>

                <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                  <div className="text-sm text-gray-400">تاريخ الإنشاء</div>
                  <div className="text-white">
                    {new Date(selectedOffer.created_at).toLocaleString("ar-EG")}
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
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleRequestOffer(selectedOffer);
                  }}
                  disabled={
                    !selectedOffer.active || selectedOffer.total_quantity === 0
                  }
                  className="rounded-xl bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">طلب عرض</h2>
                  <p className="mt-1 text-gray-400">
                    {selectedOffer.description || `عرض #${selectedOffer.id}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-2 text-xl text-gray-400 transition-colors hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-750 rounded-lg border border-gray-600 p-4">
                  <div className="text-sm text-gray-400">نسبة الخصم</div>
                  <div className="text-lg font-bold text-red-400">
                    {selectedOffer.discount}%
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
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
                    className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <div className="mt-1 text-xs text-gray-400">
                    الحد الأدنى: {selectedOffer.min_quantity} | الحد الأقصى:{" "}
                    {selectedOffer.total_quantity}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="rounded-xl border border-gray-600 px-6 py-2 text-gray-300 transition-colors hover:bg-gray-700"
                >
                  إلغاء
                </button>
                <button
                  onClick={submitRequest}
                  disabled={requestMutation.isPending}
                  className="rounded-xl bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
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
