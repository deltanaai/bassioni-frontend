"use client";

import { useQuery } from "@tanstack/react-query";
import { FiChevronRight } from "react-icons/fi";

import {
  staticWarehouses,
  Warehouse,
  Batch,
} from "@/constants/staticProductDataPharma";
import { indexBranches } from "@/lib/actions/pharma/branches.action";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expandedBranches: number[];
  selectedProduct: MasterProduct | null;
  onToggleWarehouse: (index: number) => void;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  expandedBranches,
  onToggleWarehouse,
  selectedProduct,
}: ProductDetailsModalProps) {
  const { data: branchesResponse, isLoading: branchesIsLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: () => indexBranches({}),
    enabled: isOpen,
  });

  const branches = branchesResponse?.data || [];
  console.log("RESPONSE",branchesResponse);
  
  console.log("BRANCHES",branches);
  

  if (!isOpen || !selectedProduct) return null;

  // const {} = useQuery({
  //   queryKey: ["branchProducts", selectedProduct.id],
  //   queryFn:
  // })

  const {
    name,
    description,
    price,
    rating,
    rating_count: ratingCount,
    brand,
    category,
  } = selectedProduct;

  // حساب الإجماليات
  const totalWarehouses = staticWarehouses.length;
  const totalBatches = staticWarehouses.reduce(
    (sum, warehouse) => sum + warehouse.batches.length,
    0
  );
  const totalQuantity = staticWarehouses.reduce(
    (sum, warehouse) => sum + warehouse.totalQuantity,
    0
  );

  // التحقق من انتهاء الصلاحية
  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-800">
        <div className="p-6">
          {/* الهيدر */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{name}</h2>
              <p className="mt-1 text-gray-400">تفاصيل المنتج والمخزون</p>

              {/* معلومات المنتج */}
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <span className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-1 text-gray-300">
                  الفئة: {category.name}
                </span>
                <span className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-1 text-gray-300">
                  البراند: {brand}
                </span>
                <span className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-1 text-gray-300">
                  السعر: {price.toFixed(2)} ج.م
                </span>
                <span className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-1 text-gray-300">
                  التقييم: {rating} ⭐ ({ratingCount})
                </span>
              </div>

              {/* وصف المنتج */}
              <div className="bg-gray-750 mt-4 rounded-lg border border-gray-600 p-4">
                <p className="text-sm leading-relaxed text-gray-300">
                  {description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-xl text-gray-400 transition-colors hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* الإحصائيات */}
          <div className="bg-gray-750 mt-6 rounded-xl border border-gray-600 p-6">
            <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
              <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
                <div className="mb-2 text-sm text-gray-400">عدد الفروع</div>
                <div className="text-2xl font-bold text-white">
                  {branches.length}
                </div>
              </div>
              <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
                <div className="mb-2 text-sm text-gray-400">إجمالي الدفعات</div>
                <div className="text-2xl font-bold text-white">
                  {totalBatches}
                </div>
              </div>
              <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
                <div className="mb-2 text-sm text-gray-400">إجمالي المخزون</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {totalQuantity} وحدة
                </div>
              </div>
            </div>
          </div>

          {/* الفروع */}
          <div className="mt-6 space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-white">
              الفروع المتاحة
            </h3>

            {branches.map(
              (branch) => {
                const isExpanded = expandedBranches.includes(branch.id);

                return (
                  <div
                    key={branch.id}
                    className="bg-gray-750 overflow-hidden rounded-xl border border-gray-600"
                  >
                    {/* هيدر المخزن */}
                    <button
                      onClick={() => onToggleWarehouse(branch.id)}
                      className="flex w-full items-center justify-between border-b border-gray-600 bg-gray-700 px-6 py-4 transition-colors hover:bg-gray-600"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`transform transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        >
                          <FiChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="text-right">
                          <h3 className="text-lg font-semibold text-white">
                            {branch.name}
                          </h3>
                          {/* <p className="mt-1 text-sm text-gray-400">
                            {warehouse.batches.length} دفعة متاحة
                          </p> */}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* <span className="text-sm text-gray-300">
                          {warehouse.batches.length} دفعة
                        </span> */}
                        {/* <span className="rounded-full border border-emerald-700 bg-emerald-900 px-3 py-1 text-sm text-emerald-300">
                          {warehouse.totalQuantity} وحدة
                        </span> */}
                      </div>
                    </button>

                    {/* محتوى المخزن */}
                    {isExpanded && (
                      <div className="p-6">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-700">
                              <tr>
                                <th className="border-l border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-300">
                                  رقم الدفعة
                                </th>
                                <th className="border-l border-gray-600 px-4 py-3 text-right text-sm font-semibold text-gray-300">
                                  الكمية المتاحة
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                                  تاريخ الانتهاء
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                                  الحالة
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                              {/* {warehouse.batches.map(
                                (batch: Batch, batchIndex: number) => {
                                  const expired = isExpired(batch.expiryDate);
                                  return (
                                    <tr
                                      key={batchIndex}
                                      className="transition-colors hover:bg-gray-700"
                                    >
                                      <td className="border-l border-gray-600 px-4 py-3">
                                        <span className="rounded bg-blue-900 px-3 py-1 text-sm text-blue-300">
                                          #{batch.batchNumber}
                                        </span>
                                      </td>
                                      <td className="border-l border-gray-600 px-4 py-3 text-center">
                                        <span className="rounded-full bg-green-900 px-3 py-1 text-sm text-green-300">
                                          {batch.quantity} وحدة
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <span className="text-sm text-gray-300">
                                          {batch.expiryDate}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <span
                                          className={`rounded-full px-3 py-1 text-sm ${
                                            expired
                                              ? "bg-red-900 text-red-300"
                                              : "bg-emerald-900 text-emerald-300"
                                          }`}
                                        >
                                          {expired ? "منتهي الصلاحية" : "ساري"}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                }
                              )} */}
                            </tbody>
                          </table>
                        </div>

                        {/* ملخص المخزن */}
                        <div className="mt-4 rounded-lg border border-gray-600 bg-gray-700 p-4">
                          <div className="flex items-center justify-between text-sm text-gray-300">
                            <span>المخزن: {branch.name}</span>
                            <span>
                              إجمالي الوحدات:{" "}
                              {/* <strong className="text-emerald-400">
                                {warehouse.totalQuantity}
                              </strong> */}
                            </span>
                            <span>
                              عدد الدفعات:{" "}
                              {/* <strong>{warehouse.batches.length}</strong> */}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          {/* ملخص نهائي */}
          <div className="bg-gray-750 mt-6 rounded-lg border border-gray-600 p-4">
            <div className="grid grid-cols-2 gap-4 text-center text-sm md:grid-cols-4">
              <div>
                <div className="text-gray-400">إجمالي الفروع</div>
                <div className="font-semibold text-white">
                  {totalWarehouses}
                </div>
              </div>
              <div>
                <div className="text-gray-400">إجمالي الدفعات</div>
                <div className="font-semibold text-white">{totalBatches}</div>
              </div>
              <div>
                <div className="text-gray-400">إجمالي الوحدات</div>
                <div className="font-semibold text-emerald-400">
                  {totalQuantity}
                </div>
              </div>
              <div>
                <div className="text-gray-400">متوسط السعر</div>
                <div className="font-semibold text-white">
                  {price.toFixed(2)} ج.م
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
