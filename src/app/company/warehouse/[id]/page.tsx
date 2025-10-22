"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import {
  MapPin,
  ArrowLeft,
  Edit,
  Trash2,
  Code,
  Building,
  RefreshCw,
  Calendar,
  Loader2,
  Circle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddProductSchema } from "@/schemas/warehouseProducts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteWarehouse,
  getWarehouse,
  updateWarehouse,
} from "@/lib/actions/company/warehouse.action";
import { UpdateWarehouseSchema } from "@/schemas/warehouse";
import { getAllLocations } from "@/lib/actions/company/locations.action";
import {
  addProductToWarehouse,
  getProductsByWarehouse,
} from "@/lib/actions/company/warehouseProducts.action";
import { toast } from "sonner";
import { ProductInput } from "@/types";

export default function WarehouseDetailsPage() {
  //warehouses
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);

  //products
  const [showProductModal, setShowProductModel] = useState(false);

  const params = useParams();
  const warehouseId = Number(params.id) || 0;
  const queryClient = useQueryClient();

  // start fuctions warehouse
  // جلب بيانات المخزن
  const { data, isLoading, error } = useQuery({
    queryKey: ["warehouse", warehouseId],
    queryFn: () => getWarehouse({ warehouseId }),
    enabled: !isNaN(warehouseId),
  });
  const warehouse = data?.data?.warehouse;
  console.log("Warehouse data:", warehouse);

  //   للمواقع
  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getAllLocations({ page: 1, perPage: 10 }),
  });
  const locations = locationsData?.data || [];

  //جلب ادويه المخزن
  const { data: produtsData } = useQuery({
    queryKey: ["warehouseProducts", warehouseId],
    queryFn: () => getProductsByWarehouse({ warehouseId }),
  });
  // تصفية البيانات لاستخراج منتجات المخزن الحالي فقط
  const allWarehousesData = produtsData?.data || [];
  const currentWarehouseData = allWarehousesData.find(
    (item: any) => item.warehouse?.id === warehouseId
  );

  const products = currentWarehouseData?.products || [];

  console.log(" Current warehouse ID:", warehouseId);
  console.log(" All warehouses data:", allWarehousesData);
  console.log(" Current warehouse data:", currentWarehouseData);
  console.log(" Products to display:", products);

  // نموذج تعديل المخزن
  const editForm = useForm({
    resolver: zodResolver(UpdateWarehouseSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      locationId: undefined as number | undefined,
      warehouseId: undefined as number | undefined,
      active: true,
    },
  });

  // تعبئة النموذج عند التعديل
  useEffect(() => {
    if (showEditModal && editingWarehouse) {
      editForm.reset({
        name: editingWarehouse.name,
        code: editingWarehouse.code,
        locationId: editingWarehouse.locationId,
        warehouseId: editingWarehouse.id,
        active: editingWarehouse.active ?? true,
      });
    }
  }, [showEditModal, editingWarehouse, editForm]);

  // طلب التعديل
  const editMutation = useMutation({
    mutationFn: updateWarehouse,
    onSuccess: () => {
      console.log("تم تحديث بيانات المخزن بنجاح");
      queryClient.invalidateQueries({ queryKey: ["warehouse", warehouseId] });
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      setShowEditModal(false);
      setEditingWarehouse(null);
      editForm.reset();
    },
    onError: (error) => {
      console.error("خطأ في تحديث بيانات المخزن:", error);
      alert("حدث خطأ أثناء تحديث بيانات المخزن");
    },
  });

  // طلب الحذف
  const deleteWarehouseMutation = useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      console.log("تم حذف المخزن بنجاح");
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      window.location.href = "/company/warehouse";
    },
    onError: (error) => {
      console.error("خطأ في حذف المخزن:", error);
      alert("حدث خطأ أثناء حذف المخزن");
      setShowDeleteModal(false);
    },
  });

  // إرسال التعديل
  const onEditSubmitWarehouse = (formData: Record<string, unknown>) => {
    if (!editingWarehouse) return;

    const submitData = {
      warehouseId: editingWarehouse.id,
      ...formData,
    };

    editMutation.mutate(submitData);
  };

  // معالجة الحذف
  const handleDeleteWarehouse = () => {
    deleteWarehouseMutation.mutate({
      itemsIds: [warehouseId],
    });
  };

  // فتح modal التعديل
  const handleEditWarehouse = () => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setShowEditModal(true);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductInput>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: { warehouseId: warehouseId },
  });

  const addProductsmutation = useMutation({
    mutationFn: addProductToWarehouse,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء اضافة المنتج");
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: ["warehouseProducts", warehouseId],
      });

      setShowProductModel(false);
      reset();

      toast.success(`تم اضافه المنتج للمستودع بنجاح`);
    },
  });

  const onSubmitproduct = (data: ProductInput) => {
    console.log("onSubmitproduct:", data);

    addProductsmutation.mutate({
      ...data,
      warehouseId,
    });
  };

  // التحقق من صحة الـ ID
  if (isNaN(warehouseId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">خطأ</h1>
          <p className="text-gray-600 mt-2">معرف المخزن غير صحيح</p>
        </div>
      </div>
    );
  }
  // endd functios warehouse

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !data?.success || !data.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">خطأ</h1>
          <p className="text-gray-600 mt-2">المخزن غير موجود</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
      {/* الأزرار العلوية */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition duration-200 order-2 sm:order-1"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-600" /> العودة
        </button>

        <div className="flex gap-2 order-1 sm:order-2">
          <button
            onClick={handleEditWarehouse}
            disabled={editMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition duration-200 disabled:opacity-50"
          >
            <Edit className="w-4 h-4" />
            {editMutation.isPending ? "جاري التحديث..." : "تعديل المخزن"}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition duration-200"
          >
            <Trash2 className="w-4 h-4" />
            مسح المخزن
          </button>
        </div>
      </div>

      {/* معلومات المخزن */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h1 className="text-2xl font-bold text-emerald-600 mb-4">
          {warehouse?.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="flex items-center gap-2 text-gray-700">
            <Code className="w-5 h-5 text-emerald-500" /> الكود:
            <span className="font-semibold text-gray-900">
              {warehouse?.code}
            </span>
          </p>

          {/* الشركة */}
          <p className="flex items-center gap-2 text-gray-700">
            <Building className="w-5 h-5 text-emerald-500" /> الشركة:
            <span className="font-semibold text-gray-900">
              {warehouse?.company}
            </span>
          </p>

          {/* الموقع */}
          <p className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5 text-emerald-500" /> الموقع:
            <span className="font-semibold text-gray-900">
              {warehouse?.location}
            </span>
          </p>

          {/* تاريخ الإنشاء */}
          <p className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5 text-emerald-500" /> تاريخ الإنشاء:
            <span className="font-semibold text-gray-900">
              {warehouse?.createdAt}
            </span>
          </p>

          {/* آخر تحديث */}
          <p className="flex items-center gap-2 text-gray-700">
            <RefreshCw className="w-5 h-5 text-emerald-500" /> آخر تحديث:
            <span className="font-semibold text-gray-900">
              {warehouse?.updatedAt}
            </span>
          </p>

          {/* الحالة */}
          <p className="flex items-center gap-2 text-gray-700">
            <Circle
              className={`w-5 h-5 ${
                warehouse?.deleted ? "text-red-500" : "text-green-500"
              }`}
            />
            الحالة:
            <span
              className={`font-semibold ${
                warehouse?.deleted ? "text-red-600" : "text-green-600"
              }`}
            >
              {warehouse?.deleted ? "محذوف" : "نشط"}
            </span>
          </p>
        </div>
      </div>

      {/* مودال تعديل المخزن */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">تعديل المخزن</h2>
            <form onSubmit={editForm.handleSubmit(onEditSubmitWarehouse)}>
              {/* إضافة hidden input */}
              <input type="hidden" {...editForm.register("warehouseId")} />
              <div className="space-y-4">
                {/* اسم المخزن */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    اسم المخزن
                  </label>
                  <input
                    {...editForm.register("name")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="أدخل اسم المخزن"
                  />
                  {editForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {editForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* كود المخزن */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    كود المخزن
                  </label>
                  <input
                    {...editForm.register("code")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="أدخل كود المخزن"
                  />
                  {editForm.formState.errors.code && (
                    <p className="text-red-500 text-sm mt-1">
                      {editForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                {/* الموقع */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    الموقع{" "}
                  </label>

                  <select
                    {...editForm.register("locationId", {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="" disabled>
                      -- اختر الموقع --
                    </option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {editForm.formState.errors.locationId && (
                    <p className="text-red-500 text-sm mt-1">
                      {editForm.formState.errors.locationId.message}
                    </p>
                  )}
                </div>
              </div>

              {/* حالة النشاط - Checkbox */}
              <div className="flex mt-4 items-center gap-2">
                <input
                  type="checkbox"
                  {...editForm.register("active")}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  id="active-checkbox"
                />
                <label
                  htmlFor="active-checkbox"
                  className="text-sm font-medium text-gray-700"
                >
                  المخزن نشط
                </label>
              </div>
              {editForm.formState.errors.active && (
                <p className="text-red-500 text-sm mt-1">
                  {editForm.formState.errors.active.message}
                </p>
              )}

              {/* أزرار التحكم */}
              <div className="mt-6 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50"
                >
                  {editMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* قسم المنتجات */}
      <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-emerald-600">🛒 المنتجات</h2>
          <button
            onClick={() => setShowProductModel(true)}
            className="w-40 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold"
          >
            إضافة منتج +
          </button>
        </div>

        {/* جدول المنتجات */}
        {products.length > 0 ? (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-center">ID</th>
                <th className="p-3 text-center">المنتج</th>
                <th className="p-3 text-center">رقم الدفعة</th>
                <th className="p-3 text-center">المتوفر</th>
                <th className="p-3 text-center">سعر المخزن</th>
                <th className="p-3 text-center">القيمة</th>
                <th className="p-3 text-center">تاريخ الانتهاء</th>
                <th className="p-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={`${p.id}-${p.batch_number}-${p.expiry_date}`}
                  className="border-b border-gray-300 hover:bg-gray-100 transition duration-200"
                >
                  <td className="p-3 text-center">{p.id}</td>
                  <td className="p-3 text-center">{p.name}</td>
                  <td className="p-3 text-center">{p.batch_number}</td>
                  <td className="p-3 text-center">{p.stock}</td>
                  <td className="p-3 text-center">{p.price} ج.م</td>
                  <td className="p-3 text-center">
                    {((p.stock ?? 0) * Number(p.price)).toLocaleString()} ج.م
                  </td>
                  <td className="p-3 text-center">{p.expiry_date}</td>
                  <td className="p-3 text-center">
                    <div className="inline-flex justify-center gap-2">
                      <button
                        // onClick={() => handleEditProduct(p)}
                        className="text-blue-500 hover:text-blue-600 p-1"
                        title="تعديل"
                      >
                        <Edit />
                      </button>
                      <button
                        // onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        title="حذف"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4 text-gray-500 text-center text-xl">
            لا توجد منتجات بعد.
          </p>
        )}
      </div>

      {/* مودال حذف المخزن */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-7 h-7 text-orange-500" />
            </div>

            <div className="text-center mb-7">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                حذف المخزن
              </h3>
              <p className="text-base text-gray-700 mb-3 leading-relaxed">
                هل تريد نقل
                <span className="font-bold text-orange-600 mx-1">
                  {warehouse?.name}
                </span>
                إلى سلة المحذوفات؟
              </p>
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg py-2 px-3">
                يمكنك استعادة المخزن في أي وقت من خلال سلة المحذوفات
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-semibold border border-gray-300 hover:border-gray-400"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteWarehouse}
                disabled={deleteWarehouseMutation.isPending}
                className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
              >
                {deleteWarehouseMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    تأكيد الحذف
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال إضافة المنتج */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xl shadow-lg">
            <form
              onSubmit={handleSubmit(onSubmitproduct)}
              className="space-y-4"
            >
              <input
                type="hidden"
                {...register("warehouseId")}
                defaultValue={warehouseId}
              />

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="mb-1">معرف المنتج</label>
                  <input
                    type="number"
                    {...register("productId", { valueAsNumber: true })}
                    placeholder="ID"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {errors.productId && (
                    <p className="text-red-500 text-sm">
                      {errors.productId.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">سعر المخزن</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("warehousePrice", {
                      valueAsNumber: true,
                    })}
                    placeholder="السعر"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {errors.warehousePrice && (
                    <p className="text-red-500 text-sm">
                      {errors.warehousePrice.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="mb-1">المخزون المتاح</label>
                  <input
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    placeholder="الكمية"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm">
                      {errors.stock.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">المخزون المحجوز</label>
                  <input
                    type="number"
                    {...register("reservedStock", {
                      valueAsNumber: true,
                    })}
                    placeholder="0"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {errors.reservedStock && (
                    <p className="text-red-500 text-sm">
                      {errors.reservedStock.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="mb-1">رقم الدفعة</label>
                  <input
                    {...register("batchNumber")}
                    placeholder="Batch.No"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {errors.batchNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.batchNumber.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    {...register("expiryDate")}
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm">
                      {errors.expiryDate.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModel(false);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white"
                  disabled={addProductsmutation.isPending}
                >
                  {addProductsmutation.isPending
                    ? "جار الاضافه"
                    : "اضافه الدواء"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
