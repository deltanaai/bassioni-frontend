import { FiChevronRight } from "react-icons/fi";
import { ProductDetailsModalProps } from "../types/product.types";

export default function ProductDetailsModal({
  isOpen,
  onClose,
  productName,
  warehouses,
  expandedWarehouses,
  onToggleWarehouse,
}: ProductDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {productName}
              </h2>
              <p className="text-gray-600 mt-1">تفاصيل المخزون والدفعات</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl p-2"
            >
              ✕
            </button>
          </div>

          {/* Total Summary */}
          <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-gray-600 text-sm">عدد المخازن</div>
                <div className="text-gray-900 font-bold text-lg">
                  {warehouses.length}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">إجمالي الدفعات</div>
                <div className="text-gray-900 font-bold text-lg">
                  {warehouses.reduce((total, warehouse) => {
                    const batches = Object.values(warehouse)[0];
                    return total + batches.length;
                  }, 0)}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">إجمالي المخزون</div>
                <div className="text-emerald-600 font-bold text-lg">
                  {warehouses.reduce((total, warehouse) => {
                    const batches = Object.values(warehouse)[0];
                    return (
                      total +
                      batches.reduce((sum, batch) => sum + batch.quantity, 0)
                    );
                  }, 0)}{" "}
                  وحدة
                </div>
              </div>
            </div>
          </div>

          {/* Warehouses Section */}
          <div className="space-y-4 mt-6">
            {warehouses.map((warehouseObj, warehouseIndex) => {
              const [warehouseName, batches] = Object.entries(warehouseObj)[0];
              const isExpanded = expandedWarehouses.includes(warehouseIndex);

              return (
                <div
                  key={warehouseIndex}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  {/* Warehouse Header */}
                  <button
                    onClick={() => onToggleWarehouse(warehouseIndex)}
                    className="w-full bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 border-b border-gray-200 hover:from-gray-100 hover:to-gray-50 transition-colors flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`transform transition-transform ${
                          isExpanded ? "rotate-90" : "rotate-0"
                        }`}
                      >
                        <FiChevronRight className="w-4 h-4 text-gray-500" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg text-right">
                        {warehouseName.replace("warehouse", "مخزن ")}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{batches.length} دفعة</span>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs border border-emerald-200">
                        {batches.reduce(
                          (total, batch) => total + batch.quantity,
                          0
                        )}{" "}
                        وحدة
                      </span>
                    </div>
                  </button>

                  {/* Warehouses Collapsible */}
                  {isExpanded && (
                    <div className="animate-fadeIn">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="border-l border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                رقم الدفعة
                              </th>
                              <th className="border-l border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                الكمية المتاحة
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                تاريخ الانتهاء
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {batches.map((batch, batchIndex) => (
                              <tr
                                key={batchIndex}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="border-l border-gray-200 px-4 py-3 text-gray-900">
                                  <div className="flex items-center gap-2 justify-end">
                                    <span className="bg-blue-100 mx-auto text-blue-700 px-2 py-1 rounded text-xs border border-blue-200">
                                      #{batch.batchNumber}
                                    </span>
                                  </div>
                                </td>
                                <td className="border-l border-gray-200 px-4 py-3 text-center">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                                    {batch.quantity} وحدة
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                      new Date(
                                        batch.expiryDate
                                          .split("/")
                                          .reverse()
                                          .join("-")
                                      ) < new Date()
                                        ? "bg-red-100 text-red-700 border border-red-200"
                                        : "bg-orange-100 text-orange-700 border border-orange-200"
                                    }`}
                                  >
                                    {batch.expiryDate}
                                    {new Date(
                                      batch.expiryDate
                                        .split("/")
                                        .reverse()
                                        .join("-")
                                    ) < new Date() && (
                                      <span className="mr-1 text-xs">⏰</span>
                                    )}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
