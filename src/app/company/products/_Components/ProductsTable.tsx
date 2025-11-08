import { FiEye, FiDollarSign, FiPackage } from "react-icons/fi";
import { ProductTableProps, Product } from "../_types/product.types";

export default function ProductTable({
  products,
  onViewDetails,
}: ProductTableProps) {
  // إذا لم توجد بيانات أو كانت المصفوفة فارغة
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
        <div className="px-6 py-16 text-center">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <FiPackage className="w-16 h-16 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-xl text-gray-600">
                لا توجد منتجات
              </p>
              <p className="text-gray-500 mt-2">
                لم يتم العثور على منتجات متطابقة مع بحثك
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                #
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                المنتج
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                الفئة
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                البراند
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                <div className="flex items-center gap-1 justify-center">
                  <FiDollarSign className="w-4 h-4" />
                  السعر
                </div>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 uppercase tracking-wider border-l border-gray-200">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product: Product, index: number) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-all duration-200 border-b border-gray-100"
              >
                <td className="px-6 py-4 text-sm text-emerald-600 font-semibold text-center">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className=" items-center gap-3">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 text-lg">
                        {product.name}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200 shadow-sm">
                    {typeof product.category === "string"
                      ? product.category
                      : product.category?.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center font-medium">
                  {product.brand || "لا يوجد"}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
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
                      className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <FiEye className="w-4 h-4" />
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
