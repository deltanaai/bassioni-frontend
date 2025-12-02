"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";

import { indexCompanyProducts } from "@/lib/actions/company/companyProducts.action";
import { formatDateForBackend } from "@/lib/utils";
import { CreateOfferSchema } from "@/schemas/company/offers";

type CreateOfferModalProps = {
  onClose: () => void;
  onSubmit: (data: CreateOfferParams) => void;
  isLoading: boolean;
};
export default function CreateOfferModal({
  onClose,
  onSubmit,
  isLoading,
}: CreateOfferModalProps) {
  const [form, setForm] = useState({
    productId: "",
    offerType: "DISCOUNT" as "DISCOUNT" | "BUY_X_GET_Y",
    discount: "",
    freeQuantity: "",
    maxRedemptions: "",
    description: "",
    active: true,
    minQuantity: "1",
    totalQuantity: "1",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // جلب كل المنتجات من جميع المخازن
  const { data: companyProductsResponse, isLoading: productsLoading } =
    useQuery({
      queryKey: ["companyProducts"],
      queryFn: () => indexCompanyProducts(),
    });

  const allProducts = companyProductsResponse?.data || [];

  const handleSubmit = () => {
    setErrors({});

    // تحقق من الحقول الأساسية
    if (!form.productId) {
      setErrors({
        productId: "يجب اختيار منتج",
      });
      return;
    }

    // تحقق من الحقول حسب نوع العرض
    if (form.offerType === "DISCOUNT" && !form.discount) {
      setErrors({ discount: "يجب إدخال نسبة الخصم" });
      return;
    }

    if (form.offerType === "BUY_X_GET_Y") {
      if (!form.freeQuantity) {
        setErrors({ freeQuantity: "يجب إدخال الكمية المجانية" });
        return;
      }
      if (!form.maxRedemptions) {
        setErrors({
          maxRedemptions: "يجب إدخال الحد الأقصى لعمليات الاسترداد",
        });
        return;
      }
    }

    const startDate = formatDateForBackend(form.startDate);
    const endDate = formatDateForBackend(form.endDate);

    console.log("START DATE", startDate);
    console.log("END DATE", endDate);

    // هيئ البيانات للإرسال
    const submitData: CreateOfferParams = {
      productId: Number(form.productId),
      offerType: form.offerType,
      discount: form.discount ? Number(form.discount) : undefined,
      freeQuantity: form.freeQuantity ? Number(form.freeQuantity) : undefined,
      maxRedemptions: form.maxRedemptions
        ? Number(form.maxRedemptions)
        : undefined,
      description: form.description || undefined,
      active: form.active,
      minQuantity: Number(form.minQuantity) || 1,
      totalQuantity: Number(form.totalQuantity) || 1,
      startDate,
      endDate,
    };

    console.log("📤 إرسال بيانات العرض:", JSON.stringify(submitData, null, 2));
    console.log("📤 productId:", submitData.productId);
    console.log(
      "📤 جميع المنتجات المتاحة:",
      JSON.stringify(allProducts, null, 2)
    );

    // استخدم الـ Schema للتحقق
    try {
      CreateOfferSchema.parse(submitData);
      onSubmit(submitData);
    } catch (error) {
      console.error(
        "❌ فشل التحقق من Schema:",
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      );
      const zodIssues = (
        error as {
          issues?: Array<{ path: (string | number)[]; message: string }>;
        }
      )?.issues;
      if (zodIssues && Array.isArray(zodIssues)) {
        const newErrors: Record<string, string> = {};
        zodIssues.forEach((issue) => {
          const field = String(issue.path[0]);
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        toast.error(`خطأ في التحقق: ${Object.values(newErrors).join(", ")}`);
      } else {
        toast.error("حدث خطأ في التحقق من البيانات");
      }
    }
  };

  // دالة مساعدة لعرض الخطأ
  const getError = (field: string) => {
    return errors[field] ? (
      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white">
        {/* الهيدر */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold">عمل عرض جديد</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* الفورم */}
        <div className="space-y-4 p-6">
          {/* اختيار المنتج */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              اختر المنتج *
            </label>

            {productsLoading ? (
              <div className="py-4 text-center text-gray-500">
                بيتم تحميل المنتجات...
              </div>
            ) : (
              <>
                <select
                  value={form.productId}
                  onChange={(e) =>
                    setForm({ ...form, productId: e.target.value })
                  }
                  className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    errors.productId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- اختر منتج --</option>
                  {allProducts?.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {getError("productId")}
              </>
            )}
          </div>

          {/* نوع العرض */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              نوع العرض *
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="DISCOUNT">خصم</option>
              <option value="BUY_X_GET_Y">اشتري واحصل على</option>
            </select>
          </div>

          {/* نسبة الخصم - يظهر فقط إذا كان النوع خصم */}
          {form.offerType === "DISCOUNT" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                نسبة الخصم % *
              </label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                  errors.discount ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="10"
                min="0"
                max="100"
              />
              {getError("discount")}
            </div>
          )}

          {/* الكمية المجانية والحد الأقصى - تظهر فقط إذا كان النوع اشتري واحصل على */}
          {form.offerType === "BUY_X_GET_Y" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  الكمية المجانية *
                </label>
                <input
                  type="number"
                  value={form.freeQuantity}
                  onChange={(e) =>
                    setForm({ ...form, freeQuantity: e.target.value })
                  }
                  className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    errors.freeQuantity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1"
                  min="1"
                />
                {getError("freeQuantity")}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  الحد الأقصى لعمليات الاسترداد *
                </label>
                <input
                  type="number"
                  value={form.maxRedemptions}
                  onChange={(e) =>
                    setForm({ ...form, maxRedemptions: e.target.value })
                  }
                  className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    errors.maxRedemptions ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="100"
                  min="1"
                />
                {getError("maxRedemptions")}
              </div>
            </>
          )}

          {/* التواريخ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                يبدأ من *
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {getError("startDate")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                ينتهي في *
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {getError("endDate")}
            </div>
          </div>

          {/* وصف العرض */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              وصف العرض
            </label>
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="مثل: عرض خاص لفترة محدودة..."
            />
            {getError("description")}
          </div>

          {/* الكميات */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                أقل كمية *
              </label>
              <input
                type="number"
                value={form.minQuantity}
                onChange={(e) =>
                  setForm({ ...form, minQuantity: e.target.value })
                }
                className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                  errors.minQuantity ? "border-red-500" : "border-gray-300"
                }`}
                min="1"
              />
              {getError("minQuantity")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                إجمالي الكمية *
              </label>
              <input
                type="number"
                value={form.totalQuantity}
                onChange={(e) =>
                  setForm({ ...form, totalQuantity: e.target.value })
                }
                className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                  errors.totalQuantity ? "border-red-500" : "border-gray-300"
                }`}
                min="1"
              />
              {getError("totalQuantity")}
            </div>
          </div>

          {/* تفعيل العرض */}
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

        {/* الأزرار */}
        <div className="flex justify-end gap-3 rounded-b-2xl border-t bg-gray-50 p-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !form.productId || productsLoading}
            className="rounded-xl bg-emerald-600 px-6 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? "بيتم الإنشاء..." : "أنشئ العرض"}
          </button>
        </div>
      </div>
    </div>
  );
}
