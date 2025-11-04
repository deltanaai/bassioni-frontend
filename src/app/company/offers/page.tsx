"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOffers, createOffer, updateOffer, deleteOffers } from "@/lib/actions/company/offers.action";
import { toast } from "sonner";
import { FiPlus, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { getProductsByWarehouse } from "@/lib/actions/company/warehouseProducts.action";
import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";

export default function OffersPage() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);

  // جلب العروض
  const { data: offersData, isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: () => getOffers({}),
  });

  const offers: Offer[] = Array.isArray(offersData?.data)
    ? ((offersData?.data as unknown as Offer[]) || [])
    : (((offersData?.data as unknown as PaginatedResponse<Offer>)?.data) || []);
  console.log("offers", offers, offersData);

  const createMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: (res) => {
      console.log("📥 استجابة إنشاء العرض:", JSON.stringify(res, null, 2));
      if (!res?.success) {
        const errorMsg = res?.error?.message || "فشل إنشاء العرض";
        console.error("❌ فشل إنشاء العرض:", errorMsg);
        console.error("❌ تفاصيل الخطأ:", JSON.stringify(res?.error, null, 2));
        console.error("❌ الاستجابة الكاملة:", JSON.stringify(res, null, 2));
        
        // عرض تفاصيل أكثر في الـ toast
        let fullErrorMsg = errorMsg;
        if (res?.error?.details) {
          const detailsStr = JSON.stringify(res.error.details);
          fullErrorMsg += `: ${detailsStr}`;
        } else if (res?.error) {
          const errorStr = JSON.stringify(res.error);
          fullErrorMsg += `: ${errorStr}`;
        }
        
        toast.error(fullErrorMsg.length > 200 ? errorMsg : fullErrorMsg);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("تم إنشاء العرض بنجاح");
      setIsCreateOpen(false);
    },
    onError: (error) => {
      console.error("❌ خطأ في إنشاء العرض:", error);
      toast.error(`خطأ في إنشاء العرض: ${error instanceof Error ? error.message : "خطأ غير معروف"}`);
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
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelectedIds(offers.map(offer => offer.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">العروض والتخفيضات</h1>
          <p className="text-gray-600 mt-1">إدارة عروض المنتجات والتخفيضات</p>
        </div>
        
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={() => deleteMutation.mutate({ offerIds: selectedIds })}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50"
            >
              <FiTrash2 className="w-4 h-4" />
              حذف المحدد ({selectedIds.length})
            </button>
          )}
          
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
          >
            <FiPlus className="w-4 h-4" />
            عرض جديد
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-emerald-600">{offers.length}</div>
          <div className="text-gray-600 text-sm">إجمالي العروض</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">
            {offers.filter(o => o.active).length}
          </div>
          <div className="text-gray-600 text-sm">عروض نشطة</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-orange-600">
            {offers.filter(o => !o.active).length}
          </div>
          <div className="text-gray-600 text-sm">عروض غير نشطة</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">
            {selectedIds.length}
          </div>
          <div className="text-gray-600 text-sm">محدد للحذف</div>
        </div>
      </div>

      {/* جدول العروض */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">جاري تحميل العروض...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            لا توجد عروض حالياً
          </div>
        ) : (
          <>
            {/* أدوات الجدول */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
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
              <div className="text-sm text-gray-600">
                {offers.length} عرض
              </div>
            </div>

            {/* الجدول */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-right">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === offers.length && offers.length > 0}
                        onChange={selectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">#</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">الوصف</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">الخصم</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">الحالة</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">الفترة</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(offer.id)}
                          onChange={() => toggleSelect(offer.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-900">{offer.id}</td>
                      <td className="p-4 text-sm text-gray-700 max-w-xs truncate">
                        {offer.description || "لا يوجد وصف"}
                      </td>
                      <td className="p-4 text-sm font-bold text-emerald-600">
                        {offer.discount}%
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          offer.active 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {offer.active ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {offer.start_date} إلى {offer.end_date}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setEditing(offer)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <FiEdit className="w-3 h-3" />
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

// مكون منفصل لإنشاء العرض مع جمع كل المنتجات
import { CreateOfferSchema } from "@/schemas/company/offers"; 

type CreateOfferModalProps = { onClose: () => void; onSubmit: (data: CreateOfferParams) => void; isLoading: boolean };
function CreateOfferModal({ onClose, onSubmit, isLoading }: CreateOfferModalProps) {
  const [form, setForm] = useState({
    productId: "",
    discount: "",
    description: "",
    active: true,
    minQuantity: "1",
    totalQuantity: "1",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // جلب كل المنتجات من جميع المخازن
  const { data: warehousesData } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouses({}),
  });
  const warehouses: Warehouse[] = Array.isArray(warehousesData?.data)
    ? (warehousesData?.data as Warehouse[])
    : (((warehousesData?.data as unknown as PaginatedResponse<Warehouse>)?.data) || []);

  const { data: allProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["allWarehouseProducts", warehouses],
    enabled: warehouses.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        warehouses.map(async (w) => {
          const res = await getProductsByWarehouse({ warehouseId: w.id });
          return { w, res };
        })
      );
      const list: Array<{ wid: number; name?: string; price?: string | number; warehouseName: string; batch?: string }> = [];
      for (const { w, res } of results) {
        console.log(`🔍 بيانات المخزن ${w.name}:`, res);
        type ItemShape = { warehouse?: Warehouse; products?: Array<{ id?: number; product_id?: number; warehouse_product_id?: number; name?: string; price?: number | string; batch_number?: string }>};
        const items = Array.isArray(res?.data) ? (res?.data as Array<ItemShape>) : [];
        const item = items.find((x) => x?.warehouse?.id === w.id);
        const products = item?.products || [];
        console.log(`📦 منتجات المخزن ${w.name}:`, products);
        for (const p of products) {
          // حاول تحديد معرف منتج المخزن الصحيح (warehouse_product_id)
          type ProductShape = { warehouse_product_id?: number; id?: number; product_id?: number; name?: string; price?: number | string; batch_number?: string };
          const pp = p as ProductShape;
          // استخدم id من WarehouseProduct مباشرة (هذا هو warehouse_product_id)
          const warehouseProductId = pp.id;
          console.log(`🔑 منتج: ${pp.name}, id: ${pp.id}, warehouse_product_id: ${pp.warehouse_product_id}, product_id: ${pp.product_id}`);
          if (warehouseProductId) {
            list.push({ wid: warehouseProductId, name: p.name, price: p.price, warehouseName: w.name, batch: p.batch_number });
          }
        }
      }
      console.log("📋 القائمة النهائية للمنتجات:", list);
      return list;
    },
  });

  const handleSubmit = () => {
    setErrors({});

    // تحقق من الحقول الأساسية
    if (!form.productId || !form.discount) {
      setErrors({
        productId: !form.productId ? "يجب اختيار منتج" : "",
        discount: !form.discount ? "يجب إدخال نسبة الخصم" : ""
      });
      return;
    }

    // هيئ البيانات للإرسال
    const submitData: CreateOfferParams = {
      warehouseProductId: Number(form.productId),
      discount: Number(form.discount),
      description: form.description ?? "",
      active: form.active,
      minQuantity: Number(form.minQuantity) || 1,
      totalQuantity: Number(form.totalQuantity) || 1,
      startDate: form.startDate,
      endDate: form.endDate,
    };

    console.log("📤 إرسال بيانات العرض:", JSON.stringify(submitData, null, 2));
    console.log("📤 warehouseProductId:", submitData.warehouseProductId);
    console.log("📤 جميع المنتجات المتاحة:", JSON.stringify(allProducts, null, 2));

    // استخدم الـ Schema للتحقق
    try {
      CreateOfferSchema.parse(submitData);
      onSubmit(submitData);
    } catch (error) {
      console.error("❌ فشل التحقق من Schema:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      const zodIssues = (error as { issues?: Array<{ path: (string | number)[]; message: string }> })?.issues;
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
      <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl">
        
        {/* الهيدر */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">عمل عرض جديد</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        {/* الفورم */}
        <div className="p-6 space-y-4">
          
          {/* اختيار المنتج */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر المنتج *
            </label>
            
            {productsLoading ? (
              <div className="text-center py-4 text-gray-500">
                بيتم تحميل المنتجات...
              </div>
            ) : (
              <>
                <select
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.warehouseProductId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- اختر منتج --</option>
                  {allProducts?.map((product: { wid: number; name?: string; warehouseName: string; batch?: string }) => (
                    <option key={`${product.wid}-${product.warehouseName}`} value={product.wid}>
                      {product.name ?? "منتج"} {product.batch ? `- #${product.batch}` : ""} - {product.warehouseName}
                    </option>
                  ))}
                </select>
                {getError('warehouseProductId')}
              </>
            )}
          </div>

          {/* نسبة الخصم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نسبة الخصم % *
            </label>
            <input
              type="number"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.discount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="10"
              min="1"
              max="100"
            />
            {getError('discount')}
          </div>

          {/* التواريخ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                يبدأ من *
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getError('startDate')}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ينتهي في *
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getError('endDate')}
            </div>
          </div>

          {/* وصف العرض */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف العرض
            </label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="مثل: عرض خاص لفترة محدودة..."
            />
            {getError('description')}
          </div>

          {/* الكميات */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                أقل كمية *
              </label>
              <input
                type="number"
                value={form.minQuantity}
                onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.minQuantity ? 'border-red-500' : 'border-gray-300'
                }`}
                min="1"
              />
              {getError('minQuantity')}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                إجمالي الكمية *
              </label>
              <input
                type="number"
                value={form.totalQuantity}
                onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })}
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.totalQuantity ? 'border-red-500' : 'border-gray-300'
                }`}
                min="1"
              />
              {getError('totalQuantity')}
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
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !form.productId || productsLoading}
            className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? "بيتم الإنشاء..." : "أنشئ العرض"}
          </button>
        </div>
      </div>
    </div>
  );
}

// مكون منفصل لتعديل العرض
type EditOfferModalProps = { offer: Offer; onClose: () => void; onSubmit: (data: UpdateOfferParams) => void; isLoading: boolean };
function EditOfferModal({ offer, onClose, onSubmit, isLoading }: EditOfferModalProps) {
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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">تعديل العرض #{offer.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف العرض</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الخصم %</label>
            <input
              type="number"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النهاية</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
        
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>
    </div>
  );
}