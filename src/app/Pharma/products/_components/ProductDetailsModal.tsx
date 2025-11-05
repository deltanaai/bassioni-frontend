"use client";

import { FiChevronRight } from "react-icons/fi";
import { staticWarehouses, getProductDetails, Warehouse, Batch } from "@/constants/staticProductDataPharma";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  expandedWarehouses: number[];
  onToggleWarehouse: (index: number) => void;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  productId,
  productName,
  expandedWarehouses,
  onToggleWarehouse,
}: ProductDetailsModalProps) {
  if (!isOpen) return null;

  // استخدام البيانات من الملف المنفصل
  const productDetails = getProductDetails(productId, productName);

  // حساب الإجماليات
  const totalWarehouses = staticWarehouses.length;
  const totalBatches = staticWarehouses.reduce((sum, warehouse) => sum + warehouse.batches.length, 0);
  const totalQuantity = staticWarehouses.reduce((sum, warehouse) => sum + warehouse.totalQuantity, 0);

  // التحقق من انتهاء الصلاحية
  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* الهيدر */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {productDetails.name}
              </h2>
              <p className="text-gray-400 mt-1">تفاصيل المنتج والمخزون</p>
              
              {/* معلومات المنتج */}
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg border border-gray-600">
                  الفئة: {productDetails.category}
                </span>
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg border border-gray-600">
                  البراند: {productDetails.brand}
                </span>
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg border border-gray-600">
                  السعر: {productDetails.price.toFixed(2)} ج.م
                </span>
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg border border-gray-600">
                  التقييم: {productDetails.rating} ⭐ ({productDetails.rating_count})
                </span>
              </div>

              {/* وصف المنتج */}
              <div className="mt-4 p-4 bg-gray-750 rounded-lg border border-gray-600">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {productDetails.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-xl p-2"
            >
              ✕
            </button>
          </div>

          {/* الإحصائيات */}
          <div className="mt-6 p-6 bg-gray-750 rounded-xl border border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="text-gray-400 text-sm mb-2">عدد المخازن</div>
                <div className="text-white font-bold text-2xl">
                  {totalWarehouses}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="text-gray-400 text-sm mb-2">إجمالي الدفعات</div>
                <div className="text-white font-bold text-2xl">
                  {totalBatches}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="text-gray-400 text-sm mb-2">إجمالي المخزون</div>
                <div className="text-emerald-400 font-bold text-2xl">
                  {totalQuantity} وحدة
                </div>
              </div>
            </div>
          </div>

          {/* المخازن */}
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">المخازن المتاحة</h3>
            
            {staticWarehouses.map((warehouse: Warehouse, warehouseIndex: number) => {
              const isExpanded = expandedWarehouses.includes(warehouseIndex);

              return (
                <div
                  key={warehouse.id}
                  className="bg-gray-750 rounded-xl border border-gray-600 overflow-hidden"
                >
                  {/* هيدر المخزن */}
                  <button
                    onClick={() => onToggleWarehouse(warehouseIndex)}
                    className="w-full bg-gray-700 px-6 py-4 border-b border-gray-600 hover:bg-gray-600 transition-colors flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                        <FiChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="text-right">
                        <h3 className="font-semibold text-white text-lg">
                          {warehouse.name}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {warehouse.batches.length} دفعة متاحة
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 text-sm">
                        {warehouse.batches.length} دفعة
                      </span>
                      <span className="bg-emerald-900 text-emerald-300 px-3 py-1 rounded-full text-sm border border-emerald-700">
                        {warehouse.totalQuantity} وحدة
                      </span>
                    </div>
                  </button>

                  {/* محتوى المخزن */}
                  {isExpanded && (
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-700">
                            <tr>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300 border-l border-gray-600">
                                رقم الدفعة
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300 border-l border-gray-600">
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
                            {warehouse.batches.map((batch: Batch, batchIndex: number) => {
                              const expired = isExpired(batch.expiryDate);
                              return (
                                <tr key={batchIndex} className="hover:bg-gray-700 transition-colors">
                                  <td className="px-4 py-3 border-l border-gray-600">
                                    <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded text-sm">
                                      #{batch.batchNumber}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 border-l border-gray-600 text-center">
                                    <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm">
                                      {batch.quantity} وحدة
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="text-gray-300 text-sm">
                                      {batch.expiryDate}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                      expired 
                                        ? "bg-red-900 text-red-300" 
                                        : "bg-emerald-900 text-emerald-300"
                                    }`}>
                                      {expired ? "منتهي الصلاحية" : "ساري"}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* ملخص المخزن */}
                      <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                        <div className="flex justify-between items-center text-sm text-gray-300">
                          <span>المخزن: {warehouse.name}</span>
                          <span>إجمالي الوحدات: <strong className="text-emerald-400">{warehouse.totalQuantity}</strong></span>
                          <span>عدد الدفعات: <strong>{warehouse.batches.length}</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ملخص نهائي */}
          <div className="mt-6 p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="text-gray-400">إجمالي المخازن</div>
                <div className="text-white font-semibold">{totalWarehouses}</div>
              </div>
              <div>
                <div className="text-gray-400">إجمالي الدفعات</div>
                <div className="text-white font-semibold">{totalBatches}</div>
              </div>
              <div>
                <div className="text-gray-400">إجمالي الوحدات</div>
                <div className="text-emerald-400 font-semibold">{totalQuantity}</div>
              </div>
              <div>
                <div className="text-gray-400">متوسط السعر</div>
                <div className="text-white font-semibold">{productDetails.price.toFixed(2)} ج.م</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}