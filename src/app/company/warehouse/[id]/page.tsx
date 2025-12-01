"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, FileSpreadsheet, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import AddWarehouseProductModal from "@/components/warehouse/AddWarehouseProductModal";
import DeleteWarehouseModal from "@/components/warehouse/DeleteWarehouseModal";
import EditWarehouseModal from "@/components/warehouse/EditWarehouseModal";
import ImportProductsModal from "@/components/warehouse/ImportProductsModal";
import useWarehouseDetails from "@/hooks/warehouse/useWarehouseDetails";
import { UpdateWarehouseSchema } from "@/schemas/company/warehouse";
import { StoreWarehouseProductSchema } from "@/schemas/company/warehouseProducts";
import { ProductInput } from "@/types/company/uiProps";

import ProductBatchesModal from "./_components/ProductBatchesModal";
import ProductFilters from "./_components/ProductFilters";
import ProductSearch from "./_components/ProductSearch";
import ProductsTable from "./_components/ProductsTable";
import WarehouseInfoCard from "./_components/WarehouseInfoCard";
import WarehouseStats from "./_components/WarehouseStats";

export default function WarehouseDetailsPage() {
  // local ui state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpiryStatus, setSelectedExpiryStatus] =
    useState<string>("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>("all");

  // products
  const [showProductModal, setShowProductModel] = useState(false);
  const [showBatchesModal, setShowBatchesModal] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<WarehouseProductsIndex | null>(null);

  const params = useParams();
  const warehouseId = Number(params.id) || 0;

  // use centralized hook that encapsulates queries & mutations
  const {
    warehouseQuery,
    masterQuery,
    productsQuery,
    editMutation,
    deleteMutation,
    addProductMutation,
  } = useWarehouseDetails(warehouseId);

  const warehouse = warehouseQuery.data?.data;
  const isLoading = warehouseQuery.isLoading;
  const error = warehouseQuery.error;

  const allProducts = useMemo(
    () => productsQuery.data?.data || [],
    [productsQuery.data?.data]
  );
  const masterProductsArray = (masterQuery.data?.data as MasterProduct[]) || [];

  // Client-side filtering with useMemo
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.scientific_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.gtin?.includes(searchQuery) ||
        product.bar_code?.includes(searchQuery);

      // Filter by stock status using the stock_status field
      const matchesStockStatus =
        selectedStockStatus === "all" ||
        product.stock_status === selectedStockStatus;

      // Note: expiry status filtering removed as it's now at batch level
      const matchesExpiryStatus = selectedExpiryStatus === "all";

      return matchesSearch && matchesExpiryStatus && matchesStockStatus;
    });
  }, [allProducts, searchQuery, selectedExpiryStatus, selectedStockStatus]);

  const handleClearFilters = () => {
    setSelectedExpiryStatus("all");
    setSelectedStockStatus("all");
  };

  // نموذج تعديل المخزن
  const editForm = useForm({
    resolver: zodResolver(UpdateWarehouseSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      location: "",
      warehouseId: undefined as number | undefined,
      active: true,
    },
  });

  // تعبئة النموذج عند التعديل
  useEffect(() => {
    if (showEditModal && editingWarehouse) {
      editForm.reset({
        name: editingWarehouse.name,
        location: editingWarehouse.location ?? "",
        warehouseId: editingWarehouse.id,
        active: editingWarehouse.active ?? true,
      });
    }
  }, [showEditModal, editingWarehouse, editForm]);

  // edit mutation comes from hook; we'll call mutate with local onSuccess to close modal

  // deleteMutation from hook; we'll call it and then navigate on success

  // إرسال التعديل
  const onEditSubmitWarehouse = (formData: Record<string, unknown>) => {
    if (!editingWarehouse) return;

    const submitData = {
      warehouseId: editingWarehouse.id,
      ...formData,
    };

    editMutation.mutate(submitData, {
      onSuccess: () => {
        setShowEditModal(false);
        setEditingWarehouse(null);
        editForm.reset();
      },
      onError: () => {
        alert("حدث خطأ أثناء تحديث بيانات المخزن");
      },
    });
  };

  // معالجة الحذف
  const handleDeleteWarehouse = () => {
    deleteMutation.mutate(
      { itemsIds: [warehouseId] },
      {
        onSuccess: () => {
          window.location.href = "/company/warehouse";
        },
        onError: () => {
          alert("حدث خطأ أثناء حذف المخزن");
          setShowDeleteModal(false);
        },
      }
    );
  };

  // فتح modal التعديل
  const handleEditWarehouse = () => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setShowEditModal(true);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductInput>({
    resolver: zodResolver(StoreWarehouseProductSchema),
    defaultValues: { warehouseId },
  });

  const onSubmitproduct = (data: ProductInput) => {
    addProductMutation.mutate(
      { ...data, warehouseId },
      {
        onSuccess: () => {
          setShowProductModel(false);
          reset();
          toast.success(`تم اضافه المنتج للمستودع بنجاح`);
        },
        onError: () => {
          toast.error("حدث خطأ أثناء اضافة المنتج");
        },
      }
    );
  };

  // التحقق من صحة الـ ID
  if (isNaN(warehouseId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">خطأ</h1>
          <p className="mt-2 text-gray-600">معرف المخزن غير صحيح</p>
        </div>
      </div>
    );
  }
  // endd functios warehouse

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !warehouseQuery.data?.success || !warehouse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">خطأ</h1>
          <p className="mt-2 text-gray-600">المخزن غير موجود</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
        >
          <ArrowLeft className="h-5 w-5 text-emerald-600" />
          العودة
        </button>
      </div>

      {/* Warehouse Info Card */}
      <div className="mb-6">
        <WarehouseInfoCard
          warehouse={warehouse}
          onEdit={handleEditWarehouse}
          onDelete={() => setShowDeleteModal(true)}
          editing={editMutation.isPending}
          deleting={deleteMutation.isPending}
        />
      </div>

      {/* Warehouse Stats */}
      <div className="mb-6">
        <WarehouseStats products={allProducts} />
      </div>

      {/* Products Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
              <Plus className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-600">
                منتجات المخزن
              </h2>
              <p className="text-sm text-gray-500">إدارة وتتبع منتجات المخزن</p>
            </div>
          </div>
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
          >
            <FileSpreadsheet className="h-5 w-5" />
            إضافة رصيد أول المدة
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <ProductSearch value={searchQuery} onChange={setSearchQuery} />
          <ProductFilters
            selectedExpiryStatus={selectedExpiryStatus}
            selectedStockStatus={selectedStockStatus}
            onExpiryStatusChange={setSelectedExpiryStatus}
            onStockStatusChange={setSelectedStockStatus}
            onClearFilters={handleClearFilters}
            totalProducts={filteredProducts.length}
          />
        </div>

        {/* Products Table */}
        {productsQuery.isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
              <p className="text-gray-600">جاري تحميل المنتجات...</p>
            </div>
          </div>
        ) : (
          <ProductsTable
            products={filteredProducts}
            onViewBatches={(product) => {
              setSelectedProduct(product);
              setShowBatchesModal(true);
            }}
          />
        )}
      </div>

      {/* Modals */}
      <EditWarehouseModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={onEditSubmitWarehouse}
        editForm={editForm}
        saving={editMutation.isPending}
      />

      <DeleteWarehouseModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteWarehouse}
        deleting={deleteMutation.isPending}
        warehouseName={warehouse?.name}
      />

      <AddWarehouseProductModal
        show={showProductModal}
        onClose={() => setShowProductModel(false)}
        onSubmit={onSubmitproduct}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        masterproducts={masterProductsArray}
        submitting={addProductMutation.isPending}
      />

      <ProductBatchesModal
        product={selectedProduct}
        warehouseId={warehouseId}
        open={showBatchesModal}
        onOpenChange={(open) => {
          setShowBatchesModal(open);
          if (!open) setSelectedProduct(null);
        }}
      />

      <ImportProductsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        warehouseId={warehouseId}
        warehouseName={warehouse?.name ?? "المستودع"}
      />
    </div>
  );
}
