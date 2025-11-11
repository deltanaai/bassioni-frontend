"use client";

import { useQuery } from "@tanstack/react-query";
import { FiChevronRight } from "react-icons/fi";

import { staticWarehouses } from "@/constants/staticProductDataPharma";
import { indexBranches } from "@/lib/actions/pharma/branches.action";
import { branchProductsIndex } from "@/lib/actions/pharma/branchProducts.action";

import BranchCard from "./BranchCard";

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

  const { data: branchProductResponse } = useQuery({
    queryKey: ["branchProductDetails", selectedProduct?.id],
    queryFn: () =>
      branchProductsIndex({
        filters: {
          id: selectedProduct!.id,
        },
      }),
    enabled: !!selectedProduct?.id,
  });

  const branches = branchesResponse?.data || [];
  console.log("RESPONSE", branchesResponse);

  console.log("BRANCHES", branches);

  if (!isOpen || !selectedProduct) return null;

  const {
    id,
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

            {branches.map((branch) => {
              const isExpanded = expandedBranches.includes(branch.id);

              return (
                <BranchCard
                  key={branch.id}
                  branch={{ ...branch }}
                  isExpanded={isExpanded}
                  onToggleWarehouse={onToggleWarehouse}
                />
              );
            })}
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
