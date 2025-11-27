import { Eye, Package } from "lucide-react";

interface ProductsTableProps {
  products: MasterProduct[];
  onViewDetails: (product: MasterProduct) => void;
}

export default function ProductsTable({
  products,
  onViewDetails,
}: ProductsTableProps) {
  if (!products || products.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="px-6 py-20 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-700">
            لا توجد منتجات
          </h3>
          <p className="text-sm text-gray-500">
            لم يتم العثور على منتجات متطابقة مع معايير البحث
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                #
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                المنتج
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                الفئة
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                البراند
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                سعر الجمهور
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                الحالة
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {products.map((product, index) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="mt-1 text-sm text-gray-500">
                        {product.description.length > 50
                          ? `${product.description.substring(0, 50)}...`
                          : product.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                    {typeof product.category === "string"
                      ? product.category
                      : product.category?.name || "غير محدد"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  {product.brand || "غير محدد"}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="font-bold text-emerald-600">
                    {typeof product.price === "number"
                      ? product.price.toFixed(2)
                      : "0.00"}{" "}
                    <span className="text-xs text-gray-500">ج.م</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {product.active ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      نشط
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                      غير نشط
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onViewDetails(product)}
                      className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:scale-105 hover:from-blue-500 hover:to-blue-400 hover:shadow-lg"
                    >
                      <Eye className="h-4 w-4" />
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
