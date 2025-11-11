import { FiEye, FiDollarSign, FiPackage } from "react-icons/fi";

import { ProductTableProps, Product } from "../_types/product.types";

export default function ProductTable({
  products,
  onViewDetails,
}: ProductTableProps) {
  // إذا لم توجد بيانات أو كانت المصفوفة فارغة
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="px-6 py-16 text-center">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="rounded-2xl bg-gray-50 p-4">
              <FiPackage className="h-16 w-16 text-gray-400" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-600">
                لا توجد منتجات
              </p>
              <p className="mt-2 text-gray-500">
                لم يتم العثور على منتجات متطابقة مع بحثك
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="border-l border-gray-200 px-6 py-4 text-right text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                #
              </th>
              <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                المنتج
              </th>
              <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                الفئة
              </th>
              <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                البراند
              </th>
              <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                <div className="flex items-center justify-center gap-1">
                  <FiDollarSign className="h-4 w-4" />
                  السعر
                </div>
              </th>
              <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold tracking-wider text-emerald-700 uppercase">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product: Product, index: number) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 transition-all duration-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-center text-sm font-semibold text-emerald-600">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className=" items-center gap-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center rounded-full border border-purple-200 bg-gradient-to-r from-purple-100 to-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 shadow-sm">
                    {typeof product.category === "string"
                      ? product.category
                      : product.category?.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  {product.brand || "لا يوجد"}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-lg font-bold text-transparent">
                      {typeof product.price === "number"
                        ? product.price.toFixed(2)
                        : "0.00"}
                    </span>
                    <span className="text-xs text-gray-500">ج.م</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onViewDetails(product)}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-500 hover:to-blue-400 hover:shadow-lg"
                    >
                      <FiEye className="h-4 w-4" />
                      التفاصيل
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
