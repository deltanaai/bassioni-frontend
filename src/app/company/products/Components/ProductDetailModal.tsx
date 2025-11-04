import { FiChevronRight } from "react-icons/fi";
import { Batch, ProductDetailsModalProps } from "../types/product.types";
import { Plus } from "lucide-react";
import AddBatchModal from "./AddBatchModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { showMasterProduct } from "@/lib/actions/company/masterProducts";
import { getProductsByWarehouse } from "@/lib/actions/company/warehouseProducts.action";
import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";

export default function ProductDetailsModal({
  isOpen,
  onClose,
  productId,
  productName,
  expandedWarehouses,
  onToggleWarehouse,
}: Omit<ProductDetailsModalProps, "warehouses">) {
  const numericProductId = Number(productId);

  // جلب بيانات المنتج الرئيسي
  const { data: productDetails, isLoading: productLoading } = useQuery({
    queryKey: ["productDetails", numericProductId],
    queryFn: () => showMasterProduct({ id: numericProductId }),
    enabled: !!numericProductId && isOpen && !isNaN(numericProductId),
  });

  // جلب جميع المخازن
  const { data: warehousesResponse, isLoading: warehousesLoading } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouses(),
    enabled: isOpen,
  });

  // بناخد البيانات لو الداتا راجعه مباشر و احتايطي ب paginate لو عملته
  const warehouses: Warehouse[] = Array.isArray(warehousesResponse?.data)
    ? (warehousesResponse?.data as Warehouse[])
    : (warehousesResponse?.data as unknown as PaginatedResponse<Warehouse>)
        ?.data || [];

  // جلب بيانات المنتج في كل المخازن
  const { data: warehouseProducts, isLoading: warehouseLoading } = useQuery({
    queryKey: ["warehouseProducts", numericProductId, warehouses],
    queryFn: async () => {
      console.log("عدد المخازن:", warehouses.length);

      if (!warehouses || warehouses.length === 0) {
        console.log("لا توجد مخازن متاحة");
        return [];
      }

      const warehousePromises = warehouses.map(async (warehouse: Warehouse) => {
        try {
          // جلب منتجات هذا المخزن ثم تصفية المنتج المطلوب محلياً
          const productsData = await getProductsByWarehouse({
            warehouseId: warehouse.id,
          });

          // شكل الريسبونس اللي راحع: [{ warehouse: {}, products: [] }]
          type WarehouseProductEntry = {
            id?: number;
            product_id?: number;
            stock?: number;
            expiry_date?: string;
            batch_number?: string;
          };
          type WarehouseProductsResponseItem = {
            warehouse?: Warehouse;
            products?: WarehouseProductEntry[];
          };

          const allWarehousesData: WarehouseProductsResponseItem[] =
            Array.isArray(productsData?.data)
              ? (productsData.data as WarehouseProductsResponseItem[])
              : [];
          const currentWarehouseData = allWarehousesData.find(
            (w) => w?.warehouse?.id === warehouse.id
          );
          const warehouseProductsList: WarehouseProductEntry[] =
            currentWarehouseData?.products || [];
          const matchedProducts = warehouseProductsList.filter(
            (p) =>
              p?.id === numericProductId || p?.product_id === numericProductId
          );

          if (!matchedProducts.length) return null;

          const batches = matchedProducts.map((item) => ({
            batchNumber: item.batch_number,
            quantity: item.stock,
            expiryDate: item.expiry_date,
          }));

          const totalQuantity = matchedProducts.reduce(
            (sum: number, item) => sum + (item?.stock || 0),
            0
          );

          return {
            warehouseId: warehouse.id,
            warehouseName: warehouse.name,
            batches,
            totalQuantity,
          };
        } catch (error) {
          console.error(`خطأ في جلب بيانات المخزن ${warehouse.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(warehousePromises);

      // تصفية النتائج لإزالة القيم null
      const validResults = results.filter(
        (
          result
        ): result is {
          warehouseId: number;
          warehouseName: string;
          batches: Batch[];
          totalQuantity: number;
        } => result !== null
      );
      console.log("المخازن التي تحتوي على المنتج:", validResults);
      return validResults;
    },
    enabled:
      !!numericProductId &&
      warehouses.length > 0 &&
      isOpen &&
      !isNaN(numericProductId),
  });

  console.log("تفاصيل المنتج:", productDetails);
  console.log("المخازن المتاحة:", warehouses);
  console.log("منتجات المخازن:", warehouseProducts);

  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);

  if (!isOpen) return null;

  type DisplayWarehouse = {
    warehouseId: number;
    warehouseName: string;
    batches: Batch[];
    totalQuantity: number;
  };
  const displayWarehouses: DisplayWarehouse[] =
    (warehouseProducts as DisplayWarehouse[]) || [];
  const displayProductDetails = productDetails?.data;

  if (productLoading || warehousesLoading || warehouseLoading) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            جاري تحميل بيانات المنتج والمخازن...
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يتم العثور على المنتج
  if (!displayProductDetails) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="text-center text-red-600">
            <div className="text-xl font-bold mb-2">المنتج غير موجود</div>
            <p>تعذر العثور على بيانات المنتج</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {displayProductDetails.name ?? productName}
              </h2>
              <p className="text-gray-600 mt-1">
                {displayProductDetails.description || "تفاصيل المخزون والدفعات"}
              </p>

              {/* معلومات إضافية عن المنتج */}
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                {displayProductDetails.brand && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    البراند: {displayProductDetails.brand}
                  </span>
                )}
                {displayProductDetails.category?.name && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    الفئة: {displayProductDetails.category.name}
                  </span>
                )}
                {displayProductDetails.price && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    السعر: {displayProductDetails.price} ج.م
                  </span>
                )}
              </div>
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
                  {displayWarehouses.length}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">إجمالي الدفعات</div>
                <div className="text-gray-900 font-bold text-lg">
                  {displayWarehouses.reduce(
                    (total: number, warehouse: DisplayWarehouse) =>
                      total + (warehouse.batches?.length || 0),
                    0
                  )}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">إجمالي المخزون</div>
                <div className="text-emerald-600 font-bold text-lg">
                  {displayWarehouses.reduce(
                    (total: number, warehouse: DisplayWarehouse) =>
                      total + (warehouse.totalQuantity || 0),
                    0
                  )}{" "}
                  وحدة
                </div>
              </div>
            </div>
          </div>

          {/* Warehouses Section */}
          <div className="space-y-4 mt-6">
            {displayWarehouses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-lg font-semibold mb-2">
                  لا توجد مخازن تحتوي على هذا المنتج
                </div>
                <p className="text-sm">
                  هذا المنتج غير متوفر في أي مخزن حالياً
                </p>
              </div>
            ) : (
              displayWarehouses.map(
                (warehouse: DisplayWarehouse, warehouseIndex: number) => {
                  const warehouseName =
                    warehouse.warehouseName || `مخزن ${warehouseIndex + 1}`;
                  const warehouseBatches = warehouse.batches || [];
                  const isExpanded =
                    expandedWarehouses.includes(warehouseIndex);

                  return (
                    <div
                      key={warehouse.warehouseId || warehouseIndex}
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
                            {warehouseName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{warehouseBatches.length} دفعة</span>
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs border border-emerald-200">
                            {warehouse.totalQuantity ||
                              warehouseBatches.reduce(
                                (total: number, batch: Batch) =>
                                  total + batch.quantity,
                                0
                              )}{" "}
                            وحدة
                          </span>
                        </div>
                      </button>

                      {/* Warehouse Collapsible Content */}
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
                                {warehouseBatches.map(
                                  (batch: Batch, batchIndex: number) => (
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
                                            new Date(batch.expiryDate) <
                                            new Date()
                                              ? "bg-red-100 text-red-700 border border-red-200"
                                              : "bg-orange-100 text-orange-700 border border-orange-200"
                                          }`}
                                        >
                                          {batch.expiryDate}
                                          {new Date(batch.expiryDate) <
                                            new Date() && (
                                            <span className="mr-1 text-xs">
                                              منتهي
                                            </span>
                                          )}
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                            <div className="flex justify-end my-2 ml-5">
                              <button
                                onClick={() => setIsAddBatchOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                              >
                                <Plus className="w-4 h-4" />
                                اضافة دفعة
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>
      </div>

      {/*  لسا مش شغال مودال إضافة الدفعة */}
      <AddBatchModal
        isOpen={isAddBatchOpen}
        onClose={() => setIsAddBatchOpen(false)}
        onAddBatch={() => {}}
        productId={productId}
        productName={displayProductDetails.name ?? productName}
      />
    </div>
  );
}
