import Pagination from "@/components/custom/pagination";
import { ProductRequest } from "../types/product-request";

interface ProductRequestsTableProps {
  requests: ProductRequest[];
  onReview: (request: ProductRequest) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  totalCount: number;
}

export default function ProductRequestsTable({
  requests,
  onReview,
  itemsPerPage,
  totalCount,
}: ProductRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900">لا توجد طلبات</h3>
        <p className="text-gray-500 mt-1">
          لم يتم العثور على أي طلبات تطابق معايير البحث.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                اسم المنتج
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                اسم الشركة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                مقدم الطلب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.productName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {request.companyName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.submittedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onReview(request)}
                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                  >
                    مراجعة
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        count={totalCount}
        pageSize={itemsPerPage}
        visibleButtons={5}
      />
    </div>
  );
}

// مكون الشارة للحالة
function StatusBadge({ status }: { status: ProductRequest["status"] }) {
  const statusConfig = {
    pending: { label: "قيد الانتظار", class: "bg-yellow-100 text-yellow-800" },
    approved: { label: "مقبول", class: "bg-green-100 text-green-800" },
    rejected: { label: "مرفوض", class: "bg-red-100 text-red-800" },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.class}`}
    >
      {config.label}
    </span>
  );
}
