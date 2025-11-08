"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  ArrowLeft,
  Edit,
  Trash2,
  Building,
  RefreshCw,
  Calendar,
  Loader2,
  Circle,
  Warehouse,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getAllLocations } from "@/lib/actions/company/locations.action";
import { getMasterProducts } from "@/lib/actions/company/masterProducts";
import {
  deleteWarehouse,
  getWarehouse,
  updateWarehouse,
} from "@/lib/actions/company/warehouse.action";
import {
  storeWarehouseProduct,
  deleteProductFromWarehouse,
  getProductsByWarehouse,
} from "@/lib/actions/company/warehouseProducts.action";
import { formatArabicDate } from "@/lib/utils";
import { UpdateWarehouseSchema } from "@/schemas/company/warehouse";
import { StoreWarehouseProductSchema } from "@/schemas/company/warehouseProducts";
import { ProductInput } from "@/types/company/uiProps";

export default function WarehouseDetailsPage() {
  // warehouses
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);

  // products
  const [showProductModal, setShowProductModel] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: number;
    name: string;
    batch_number: string;
  } | null>(null);

  const params = useParams();
  const warehouseId = Number(params.id) || 0;
  const queryClient = useQueryClient();

  // جلب المخزن
  const { data, isLoading, error } = useQuery({
    queryKey: ["warehouse", warehouseId],
    queryFn: () => getWarehouse({ warehouseId }),
    enabled: !isNaN(warehouseId),
  });
  const warehouse = data?.data?.warehouse;
  console.log("Warehouse data:", warehouse);

  // المنتجات الرئيسية
  const { data: masterData } = useQuery({
    queryKey: ["masters"],
    queryFn: () => getMasterProducts({}),
  });
  const masterproducts = masterData?.data || [];
  console.log("Master products:", masterproducts);

  //   للمواقع
  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getAllLocations({}),
  });
  const locations = locationsData?.data || [];

  // جلب ادويه المخزن
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
    resolver: zodResolver(StoreWarehouseProductSchema),
    defaultValues: { warehouseId },
  });

  const addProductsmutation = useMutation({
    mutationFn: storeWarehouseProduct,
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

  const deleteProductFromWarehouseMutation = useMutation({
    mutationFn: deleteProductFromWarehouse,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء حذف المنتج");
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: ["warehouseProducts", warehouseId],
      });

      setShowDeleteProductModal(false);
      setProductToDelete(null);
      toast.success(`تم حذف المنتج من المستودع بنجاح`);
    },
    onError: () => {
      toast.error("حدث خطأ غير متوقع أثناء حذف المنتج");
    },
  });

  const handleProductDelete = () => {
    if (productToDelete) {
      deleteProductFromWarehouseMutation.mutate({
        warehouseId,
        itemsId: [productToDelete.id],
        batchNumber: productToDelete.batch_number,
      });
    }
  };

  // التحقق من صحة الـ ID
  if (isNaN(warehouseId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">خطأ</h1>
          <p className="mt-2 text-gray-600">معرف المخزن غير صحيح</p>
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
          <p className="mt-2 text-gray-600">المخزن غير موجود</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      {/* الأزرار العلوية */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <button
          onClick={() => window.history.back()}
          className="order-2 inline-flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 transition duration-200 hover:bg-gray-300 sm:order-1"
        >
          <ArrowLeft className="h-5 w-5 text-emerald-600" /> العودة
        </button>

        <div className="order-1 flex gap-2 sm:order-2">
          <button
            onClick={handleEditWarehouse}
            disabled={editMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600 disabled:opacity-50"
          >
            <Edit className="h-4 w-4" />
            {editMutation.isPending ? "جاري التحديث..." : "تعديل المخزن"}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-white transition duration-200 hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
            مسح المخزن
          </button>
        </div>
      </div>

      {/* معلومات المخزن */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-emerald-600">
          {warehouse?.name}
        </h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* <p className="flex items-center gap-2 text-gray-700">
            <Warehouse className="h-5 w-5 text-emerald-500" /> كود المخزن:
            <span className="font-semibold text-gray-900">
              {warehouse?.code}
            </span>
          </p> */}

          {/* الشركة */}
          <p className="flex items-center gap-2 text-gray-700">
            <Building className="h-5 w-5 text-emerald-500" /> الشركة:
            <span className="font-semibold text-gray-900">
              {warehouse?.company}
            </span>
          </p>

          {/* الموقع */}
          <p className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-emerald-500" /> الموقع:
            <span className="font-semibold text-gray-900">
              {warehouse?.location}
            </span>
          </p>

          {/* تاريخ الإنشاء */}
          <p className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-5 w-5 text-emerald-500" /> تاريخ الإنشاء:
            <span className="font-normal text-gray-900">
              {formatArabicDate(warehouse?.createdAt)}
            </span>
          </p>

          {/* آخر تحديث */}
          <p className="flex items-center gap-2 text-gray-700">
            <RefreshCw className="h-5 w-5 text-emerald-500" /> آخر تحديث:
            <span className="font-normal text-gray-900">
              {formatArabicDate(warehouse?.updatedAt)}
            </span>
          </p>

          {/* الحالة */}
          <p className="flex items-center gap-2 text-gray-700">
            <Circle
              className={`h-5 w-5 ${
                warehouse?.active ? "text-green-500" : "text-red-500"
              }`}
            />
            الحالة:
            <span
              className={`font-semibold ${
                warehouse?.active ? "text-green-600" : "text-red-600"
              }`}
            >
              {warehouse?.active ? "نشط" : "غير نشط"}
            </span>
          </p>
        </div>
      </div>

      {/* مودال تعديل المخزن */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">تعديل المخزن</h2>
            <form onSubmit={editForm.handleSubmit(onEditSubmitWarehouse)}>
              {/* إضافة hidden input */}
              <input type="hidden" {...editForm.register("warehouseId")} />
              <div className="space-y-4">
                {/* اسم المخزن */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    اسم المخزن
                  </label>
                  <input
                    {...editForm.register("name")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="أدخل اسم المخزن"
                  />
                  {editForm.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {editForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* كود المخزن */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    كود المخزن
                  </label>
                  <input
                    {...editForm.register("code")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="أدخل كود المخزن"
                  />
                  {editForm.formState.errors.code && (
                    <p className="mt-1 text-sm text-red-500">
                      {editForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                {/* الموقع */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
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
                    <p className="mt-1 text-sm text-red-500">
                      {editForm.formState.errors.locationId.message}
                    </p>
                  )}
                </div>
              </div>

              {/* حالة النشاط - Checkbox */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  {...editForm.register("active")}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  id="edit-activecheckbox"
                />
                <label
                  htmlFor="edit-activecheckbox"
                  className="text-sm font-medium text-gray-700"
                >
                  المخزن نشط
                </label>
              </div>
              {editForm.formState.errors.active && (
                <p className="mt-1 text-sm text-red-500">
                  {editForm.formState.errors.active.message}
                </p>
              )}

              {/* أزرار التحكم */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  {editMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* قسم المنتجات */}
      <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-md">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-emerald-600">🛒 المنتجات</h2>
          {/* <button
            onClick={() => setShowProductModel(true)}
            className="w-40 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            إضافة منتج +
          </button> */}
        </div>

        {/* جدول المنتجات */}
        {products.length > 0 ? (
          <table className="w-full border-collapse text-sm">
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
                  className="border-b border-gray-300 transition duration-200 hover:bg-gray-100"
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
                        className="p-1 text-blue-500 hover:text-blue-600"
                        title="تعديل"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteProductModal(true);
                          setProductToDelete(p);
                        }}
                        className="p-1 text-red-500 hover:text-red-600"
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
          <p className="mt-4 text-center text-xl text-gray-500">
            لا توجد منتجات بعد.
          </p>
        )}
      </div>

      {/* مودال حذف المخزن */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm scale-100 transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <Trash2 className="h-7 w-7 text-orange-500" />
            </div>

            <div className="mb-7 text-center">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                حذف المخزن
              </h3>
              <p className="mb-3 text-base leading-relaxed text-gray-700">
                هل تريد نقل
                <span className="mx-1 font-bold text-orange-600">
                  {warehouse?.name}
                </span>
                إلى سلة المحذوفات؟
              </p>
              <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
                يمكنك استعادة المخزن في أي وقت من خلال سلة المحذوفات
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteWarehouse}
                disabled={deleteWarehouseMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:bg-orange-600 hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteWarehouseMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
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
                  <label className="mb-1"> المنتج</label>
                  <select
                    {...register("productId", { valueAsNumber: true })}
                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- اختر المنتج --
                    </option>
                    {(Array.isArray(masterproducts) ? masterproducts : []).map(
                      (product: MasterProduct) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      )
                    )}
                  </select>
                  {errors.productId && (
                    <p className="text-sm text-red-500">
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
                    className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
                  />
                  {errors.warehousePrice && (
                    <p className="text-sm text-red-500">
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
                    className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500">
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
                    className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
                  />
                  {errors.reservedStock && (
                    <p className="text-sm text-red-500">
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
                    className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
                  />
                  {errors.batchNumber && (
                    <p className="text-sm text-red-500">
                      {errors.batchNumber.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    {...register("expiryDate")}
                    className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-red-500">
                      {errors.expiryDate.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModel(false);
                  }}
                  className="rounded-xl bg-gray-200 px-4 py-2 hover:bg-gray-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
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

      {/* مودال حذف المنتج */}
      {showDeleteProductModal && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
            {/* الهيدر مع لون متدرج */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="text-xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">حذف المنتج</h3>
                    <p className="text-sm text-red-100">عملية حذف نهائية</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDeleteProductModal(false);
                    setProductToDelete(null);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/20"
                >
                  <span className="text-lg text-white">✕</span>
                </button>
              </div>
            </div>

            {/* محتوى المودال */}
            <div className="p-6">
              <div className="mb-6 text-center">
                <p className="mb-4 text-lg font-medium text-gray-700">
                  هل أنت متأكد من حذف هذا المنتج؟
                </p>

                {/* بطاقة المنتج */}
                <div className="mb-4 transform rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 transition-transform hover:scale-[1.02]">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
                    <span className="text-2xl text-red-600">📦</span>
                  </div>
                  <p className="mb-2 text-xl font-bold text-gray-900">
                    {productToDelete.name}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-600">
                      #{productToDelete.batch_number}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
                  <span>ⓘ</span>
                  <p className="text-sm font-medium">
                    هذا الإجراء لا يمكن التراجع عنه
                  </p>
                </div>
              </div>
            </div>

            {/* أزرار المودال */}
            <div className="flex gap-3 border-t border-gray-200 bg-gray-50 p-6">
              <button
                onClick={() => {
                  setShowDeleteProductModal(false);
                  setProductToDelete(null);
                }}
                disabled={deleteProductFromWarehouseMutation.isPending}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-4 text-lg font-bold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md disabled:opacity-50"
              >
                تراجع
              </button>

              <button
                onClick={handleProductDelete}
                disabled={deleteProductFromWarehouseMutation.isPending}
                className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:bg-red-700 hover:shadow-xl disabled:opacity-50"
              >
                {deleteProductFromWarehouseMutation.isPending ? (
                  <>
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <span className="text-lg">🗑️</span>
                    تأكيد الحذف
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
