"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "sonner";

import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffers,
} from "@/lib/actions/company/offers.action";
// مكون منفصل لإنشاء العرض مع جمع كل المنتجات
import { queryClient } from "@/lib/queryClient";
import { formatDateForBackend, formatIsoToArabicDate } from "@/lib/utils";

import CreateOfferModal from "./_components/CreateOfferModal";

export default function OffersPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);

  // جلب العروض
  const { data: offersResponse, isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: () => getOffers({}),
  });

  const offers = offersResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["offers"] });
        toast.success("تم إنشاء العرض بنجاح");
        setIsCreateOpen(false);
      } else {
        toast.error(res?.error?.message || "فشل إنشاء العرض");
      }
    },
    onError: (error) => {
      console.error("❌ خطأ في إنشاء العرض:", error);
      toast.error(
        `خطأ في إنشاء العرض: ${
          error instanceof Error ? error.message : "خطأ غير معروف"
        }`
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateOffer,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["offers"] });
        toast.success("تم تحديث العرض بنجاح");
        setEditing(null);
      } else {
        toast.error(res?.error?.message || "فشل تحديث العرض");
      }
    },
    onError: (error) => {
      console.error("❌ خطأ في تحديث العرض:", error);
      toast.error(" خطأ في تحديث العرض");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOffers,
    onSuccess: (res) => {
      if (!res?.success) {
        toast.error(res?.error?.message || "فشل حذف العروض");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("تم حذف العروض بنجاح");
      setSelectedIds([]);
    },
  });

  // دوال مساعدة
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(offers?.map((offer) => offer.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">
      {/* الهيدر */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            العروض والتخفيضات
          </h1>
          <p className="mt-1 text-gray-600">إدارة عروض المنتجات والتخفيضات</p>
        </div>

        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={() => deleteMutation.mutate({ offerIds: selectedIds })}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              <FiTrash2 className="h-4 w-4" />
              حذف المحدد ({selectedIds.length})
            </button>
          )}

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            <FiPlus className="h-4 w-4" />
            عرض جديد
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-emerald-600">
            {offers?.length}
          </div>
          <div className="text-sm text-gray-600">إجمالي العروض</div>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {offers?.filter((o) => o.active).length}
          </div>
          <div className="text-sm text-gray-600">عروض نشطة</div>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {offers.filter((o) => !o.active).length}
          </div>
          <div className="text-sm text-gray-600">عروض غير نشطة</div>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {selectedIds.length}
          </div>
          <div className="text-sm text-gray-600">محدد للحذف</div>
        </div>
      </div>

      {/* جدول العروض */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div>
            <p className="mt-2 text-gray-600">جاري تحميل العروض...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            لا توجد عروض حالياً
          </div>
        ) : (
          <>
            {/* أدوات الجدول */}
            <div className="flex items-center justify-between border-b bg-gray-50 p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={selectAll}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  تحديد الكل
                </button>
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  إلغاء التحديد
                </button>
              </div>
              <div className="text-sm text-gray-600">{offers.length} عرض</div>
            </div>

            {/* الجدول */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="p-4 text-right">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === offers.length &&
                          offers.length > 0
                        }
                        onChange={selectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">
                      #
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">
                      نوع العرض
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">
                      الوصف
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">
                      تفاصيل العرض
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">
                      الحالة
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">
                      الفترة
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {offers.map((offer) => {
                    const offerType = offer.offer_type;
                    return (
                      <tr
                        key={offer.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(offer.id)}
                            onChange={() => toggleSelect(offer.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900">
                          {offer.id}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              offerType === "DISCOUNT"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {offerType === "DISCOUNT"
                              ? "خصم"
                              : "اشتري واحصل على"}
                          </span>
                        </td>
                        <td className="max-w-xs truncate p-4 text-sm text-gray-700">
                          {offer.description || "لا يوجد وصف"}
                        </td>
                        <td className="p-4">
                          {offerType === "DISCOUNT" ? (
                            <span className="text-sm font-bold text-emerald-600">
                              {offer.discount}%
                            </span>
                          ) : (
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">
                                احصل على {offer.get_free_quantity || 0} مجانًا
                              </span>
                              <br />
                              <span className="text-xs text-gray-500">
                                الحد الأقصى:{" "}
                                {offer.max_redemption_per_invoice || 0}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              offer.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {offer.active ? "نشط" : "غير نشط"}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {formatIsoToArabicDate(offer.start_date)} إلى{" "}
                          {formatIsoToArabicDate(offer.end_date)}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setEditing(offer)}
                            className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                          >
                            <FiEdit className="h-3 w-3" />
                            تعديل
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* مودال إنشاء عرض */}
      {isCreateOpen && (
        <CreateOfferModal
          onClose={() => setIsCreateOpen(false)}
          onSubmit={createMutation.mutate}
          isLoading={createMutation.isPending}
        />
      )}

      {/* مودال تعديل عرض */}
      {editing && (
        <EditOfferModal
          offer={editing}
          onClose={() => setEditing(null)}
          onSubmit={updateMutation.mutate}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  );
}

// مكون منفصل لتعديل العرض
type EditOfferModalProps = {
  offer: Offer;
  onClose: () => void;
  onSubmit: (data: UpdateOfferParams) => void;
  isLoading: boolean;
};
function EditOfferModal({
  offer,
  onClose,
  onSubmit,
  isLoading,
}: EditOfferModalProps) {
  const [form, setForm] = useState({
    offerType: offer.offer_type,
    description: offer.description || "",
    discount: offer.discount?.toString() || "",
    freeQuantity: offer.get_free_quantity?.toString() || "",
    maxRedemptions: offer.max_redemption_per_invoice?.toString() || "",
    active: offer.active,
    startDate: formatDateForBackend(offer.start_date),
    endDate: formatDateForBackend(offer.end_date),
  });

  const handleSubmit = () => {
    onSubmit({
      offerId: offer.id,
      productId: offer.product.id,
      offerType: form.offerType,
      discount: form.discount ? Number(form.discount) : undefined,
      freeQuantity: form.freeQuantity ? Number(form.freeQuantity) : undefined,
      maxRedemptions: form.maxRedemptions
        ? Number(form.maxRedemptions)
        : undefined,
      description: form.description,
      active: form.active,
      minQuantity: offer.min_quantity,
      totalQuantity: offer.total_quantity,
      startDate: form.startDate,
      endDate: form.endDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950">
        <div className="flex items-center justify-between border-b border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white">
            تعديل العرض #{offer.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/* نوع العرض */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              نوع العرض
            </label>
            <select
              value={form.offerType}
              onChange={(e) =>
                setForm({
                  ...form,
                  offerType: e.target.value as "DISCOUNT" | "BUY_X_GET_Y",
                  // Reset conditional fields when switching offer type
                  discount: "",
                  freeQuantity: "",
                  maxRedemptions: "",
                })
              }
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="DISCOUNT">خصم</option>
              <option value="BUY_X_GET_Y">اشتري واحصل على</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              وصف العرض
            </label>
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* نسبة الخصم - يظهر فقط إذا كان النوع خصم */}
          {form.offerType === "DISCOUNT" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                نسبة الخصم %
              </label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                min="0"
                max="100"
              />
            </div>
          )}

          {/* الكمية المجانية والحد الأقصى - تظهر فقط إذا كان النوع اشتري واحصل على */}
          {form.offerType === "BUY_X_GET_Y" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  الكمية المجانية
                </label>
                <input
                  type="number"
                  value={form.freeQuantity}
                  onChange={(e) =>
                    setForm({ ...form, freeQuantity: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  min="1"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  الحد الأقصى لعمليات الاسترداد
                </label>
                <input
                  type="number"
                  value={form.maxRedemptions}
                  onChange={(e) =>
                    setForm({ ...form, maxRedemptions: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  min="1"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                تاريخ البداية
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                تاريخ النهاية
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="rounded border-gray-700 bg-gray-900"
            />
            <label className="text-sm text-gray-300">عرض نشط</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 rounded-b-2xl border-t border-gray-800 bg-gray-900 p-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-700 px-6 py-2 text-gray-300 hover:bg-gray-800"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-xl bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>
    </div>
  );
}
