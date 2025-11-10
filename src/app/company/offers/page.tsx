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
import { formatIsoToArabicDate } from "@/lib/utils";

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
      if (!res?.success) {
        toast.error(res?.error?.message || "فشل تحديث العرض");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("تم تحديث العرض بنجاح");
      setEditing(null);
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
                      الوصف
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">
                      الخصم
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
                  {offers.map((offer) => (
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
                      <td className="max-w-xs truncate p-4 text-sm text-gray-700">
                        {offer.description || "لا يوجد وصف"}
                      </td>
                      <td className="p-4 text-sm font-bold text-emerald-600">
                        {offer.discount}%
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
                  ))}
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
    description: offer.description || "",
    discount: offer.discount.toString(),
    active: offer.active,
    startDate: offer.start_date,
    endDate: offer.end_date,
  });

  const handleSubmit = () => {
    onSubmit({
      offerId: offer.id,
      warehouseProductId: offer.warehouse_product_id,
      discount: Number(form.discount),
      description: form.description,
      active: form.active,
      minQuantity: offer.min_quantity,
      totalQuantity: offer.total_quantity,
      startDate: form.startDate,
      endDate: form.endDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold">تعديل العرض #{offer.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              وصف العرض
            </label>
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              نسبة الخصم %
            </label>
            <input
              type="number"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                تاريخ البداية
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                تاريخ النهاية
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label className="text-sm text-gray-700">عرض نشط</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 rounded-b-2xl border-t bg-gray-50 p-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-xl bg-emerald-600 px-6 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>
    </div>
  );
}
