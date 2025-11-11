import React from "react";
import { FiChevronRight } from "react-icons/fi";

const BranchCard = ({
  branch,
  isExpanded,
  onToggleWarehouse,
}: {
  branch: Branch;
    isExpanded: boolean;
    onToggleWarehouse: (index: number) => void;
}) => {
  const {
    id,
    name,
    address,
    createdAt,
    deleted,
    deletedAt,
    pharmacy,
    updatedAt,
  } = branch;
  return (
    <div
      key={branch.id}
      className="bg-gray-750 overflow-hidden rounded-xl border border-gray-600"
    >
      {/* هيدر المخزن */}
      <button
        onClick={() => onToggleWarehouse(id)}
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
            <h3 className="text-lg font-semibold text-white">{branch.name}</h3>
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
                عدد الدفعات: {/* <strong>{warehouse.batches.length}</strong> */}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchCard;
