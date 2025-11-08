'use client";';

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Batch } from "@/constants/staticProductDataPharma";
import { indexCompanyProducts } from "@/lib/actions/company/companyProducts.action";
import { showMasterProduct } from "@/lib/actions/company/masterProducts";
import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";
import { getProductsByWarehouse } from "@/lib/actions/company/warehouseProducts.action";

import AddBatchModal from "./AddBatchModal";
import WarehouseCard from "./WarehouseCard";
import { ProductDetailsModalProps } from "../_types/product.types";

export default function ProductDetailsModal({
  isOpen,
  onClose,
  productId,
  productName,
  expandedWarehouses,
  onToggleWarehouse,
}: Omit<ProductDetailsModalProps, "warehouses">) {
  const numericProductId = Number(productId);

  const { data: MasterProductInfo } = useQuery({
    queryKey: ["MasterproductInfo", numericProductId],
    queryFn: () => indexCompanyProducts(),
    enabled: !!numericProductId && isOpen && !isNaN(numericProductId),
  });

  const MasterProductDetail = MasterProductInfo?.data?.find(
    (item) => item.id === numericProductId
  );

  const totalBatches = MasterProductDetail?.total_batches || 0;
  const totalStock = MasterProductDetail?.total_stock || 0;

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
  const warehouses = warehousesResponse?.data;

  // ? (warehousesResponse?.data as Warehouse[])
  // : (warehousesResponse?.data as unknown as PaginatedResponse<Warehouse>)
  //     ?.data || [];

  console.log("WAREHOUSE RESPONSE:", warehousesResponse?.data);

  // جلب بيانات المنتج في كل المخازن
  const { data: warehouseProducts, isLoading: warehouseLoading } = useQuery({
    queryKey: ["warehouseProducts", numericProductId, warehouses],
    queryFn: async () => {
      console.log("عدد المخازن:", warehouses?.length);

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
      !numericProductId || !warehouses || warehouses?.length > 0 || isOpen,
  });

  console.log("تفاصيل المنتج:", productDetails);
  console.log("المخازن المتاحة:", warehouses);
  console.log("منتجات المخازن:", warehouseProducts);

  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);

  if (!isOpen) return null;

 
  const displayProductDetails = productDetails?.data;

  if (productLoading || warehousesLoading || warehouseLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
        <div className="rounded-2xl bg-white p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
            جاري تحميل بيانات المنتج والمخازن...
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يتم العثور على المنتج
  if (!displayProductDetails) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8">
          <div className="text-center text-red-600">
            <div className="mb-2 text-xl font-bold">المنتج غير موجود</div>
            <p>تعذر العثور على بيانات المنتج</p>
            <button
              onClick={onClose}
              className="mt-4 rounded-xl bg-gray-500 px-6 py-2 text-white transition-colors hover:bg-gray-600"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {displayProductDetails.name ?? productName}
              </h2>
              <p className="mt-1 text-gray-600">
                {displayProductDetails.description || "تفاصيل المخزون والدفعات"}
              </p>

              {/* معلومات إضافية عن المنتج */}
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                {displayProductDetails.brand && (
                  <span className="rounded bg-gray-100 px-2 py-1">
                    البراند: {displayProductDetails.brand}
                  </span>
                )}
                {displayProductDetails.category?.name && (
                  <span className="rounded bg-gray-100 px-2 py-1">
                    الفئة: {displayProductDetails.category.name}
                  </span>
                )}
                {displayProductDetails.price && (
                  <span className="rounded bg-gray-100 px-2 py-1">
                    السعر: {displayProductDetails.price} ج.م
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-xl text-gray-400 transition-colors hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Total Summary */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-6">
            <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
              <div>
                <div className="text-sm text-gray-600">عدد المخازن</div>
                <div className="text-lg font-bold text-gray-900">
                  {warehouses?.length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">إجمالي الدفعات</div>
                <div className="text-lg font-bold text-gray-900">
                  {totalBatches}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">إجمالي المخزون</div>
                <div className="text-lg font-bold text-emerald-600">
                  {totalStock} وحدة
                </div>
              </div>
            </div>
          </div>

          {/* Warehouses Section */}
          <div className="mt-6 space-y-4">
            {warehouses?.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <div className="mb-2 text-lg font-semibold">
                  لا توجد مخازن تحتوي على هذا المنتج
                </div>
                <p className="text-sm">
                  هذا المنتج غير متوفر في أي مخزن حالياً
                </p>
              </div>
            ) : (
              warehouses?.map((warehouse) => (
                <WarehouseCard
                  key={warehouse.id}
                  id={warehouse.id}
                  name={warehouse.name}
                  productId={numericProductId}
                  expandedWarehouses={expandedWarehouses}
                  onToggleWarehouse={onToggleWarehouse}
                />
              ))
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
