"use client";

import {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

type ProductInput = {
  productId?: number;
  warehousePrice?: number;
  stock?: number;
  reservedStock?: number;
  batchNumber?: string;
  expiryDate?: string;
  warehouseId?: number;
};

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: ProductInput) => void;
  register: UseFormRegister<ProductInput>;
  handleSubmit: UseFormHandleSubmit<ProductInput>;
  errors: FieldErrors<ProductInput>;
  masterproducts: MasterProduct[];
  submitting?: boolean;
};

export default function AddWarehouseProductModal({
  show,
  onClose,
  onSubmit,
  register,
  handleSubmit,
  errors,
  masterproducts,
  submitting = false,
}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("warehouseId")} />

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
                  {errors.productId?.message as unknown as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1">سعر المخزن</label>
              <input
                type="number"
                step="0.01"
                {...register("warehousePrice", { valueAsNumber: true })}
                placeholder="السعر"
                className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
              />
              {errors.warehousePrice && (
                <p className="text-sm text-red-500">
                  {errors.warehousePrice?.message as unknown as string}
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
                  {errors.stock?.message as unknown as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1">المخزون المحجوز</label>
              <input
                type="number"
                {...register("reservedStock", { valueAsNumber: true })}
                placeholder="0"
                className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
              />
              {errors.reservedStock && (
                <p className="text-sm text-red-500">
                  {errors.reservedStock?.message as unknown as string}
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
                  {errors.batchNumber?.message as unknown as string}
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
                  {errors.expiryDate?.message as unknown as string}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="rounded-xl bg-gray-200 px-4 py-2 hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              disabled={submitting}
            >
              {submitting ? "جار الاضافه" : "اضافه الدواء"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
