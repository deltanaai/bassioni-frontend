"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import AddWarehouseProductModal from "@/components/warehouse/AddWarehouseProductModal";
import DeleteWarehouseModal from "@/components/warehouse/DeleteWarehouseModal";
import DeleteWarehouseProductModal from "@/components/warehouse/DeleteWarehouseProductModal";
import WarehouseInfoCard from "@/components/warehouse/details/WarehouseInfoCard";
import WarehouseProductsTable from "@/components/warehouse/details/WarehouseProductsTable";
import EditWarehouseModal from "@/components/warehouse/EditWarehouseModal";
import useWarehouseDetails from "@/hooks/warehouse/useWarehouseDetails";
import { UpdateWarehouseSchema } from "@/schemas/company/warehouse";
import { StoreWarehouseProductSchema } from "@/schemas/company/warehouseProducts";
import { ProductInput } from "@/types/company/uiProps";

export default function WarehouseDetailsPage() {
  // local ui state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );

  // products
  const [showProductModal, setShowProductModel] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: number;
    name: string;
    batch_number: string;
  } | null>(null);

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
    deleteProductMutation,
  } = useWarehouseDetails(warehouseId);

  const warehouse = warehouseQuery.data?.data;
  const isLoading = warehouseQuery.isLoading;
  const error = warehouseQuery.error;

  const products = productsQuery.data?.data || [];
  const masterProductsArray = (masterQuery.data?.data as MasterProduct[]) || [];

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

  const handleProductDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(
        {
          warehouseId,
          itemsId: [productToDelete.id],
          batchNumber: productToDelete.batch_number,
        },
        {
          onSuccess: () => {
            setShowDeleteProductModal(false);
            setProductToDelete(null);
            toast.success(`تم حذف المنتج من المستودع بنجاح`);
          },
          onError: () => {
            toast.error("حدث خطأ غير متوقع أثناء حذف المنتج");
          },
        }
      );
    }
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
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      {/* الأزرار العلوية */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <button
          onClick={() => window.history.back()}
          className="order-2 inline-flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 transition duration-200 hover:bg-gray-300 sm:order-1"
        >
          <ArrowLeft className="h-5 w-5 text-emerald-600" /> العودة
        </button>
      </div>

      {/* معلومات المخزن */}
      <WarehouseInfoCard
        warehouse={warehouse}
        onEdit={handleEditWarehouse}
        onDelete={() => setShowDeleteModal(true)}
        editing={editMutation.isPending}
        deleting={deleteMutation.isPending}
      />

      <EditWarehouseModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={onEditSubmitWarehouse}
        editForm={editForm}
        saving={editMutation.isPending}
      />

      {/* قسم المنتجات */}
      <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-md">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-emerald-600">🛒 المنتجات</h2>
        </div>

        <WarehouseProductsTable
          products={products as unknown as Record<string, unknown>[]}
          onEdit={() => {
            // open edit product flow if needed
          }}
          onDelete={(p) => {
            setShowDeleteProductModal(true);
            setProductToDelete(
              p as unknown as { id: number; name: string; batch_number: string }
            );
          }}
        />
      </div>

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

      <DeleteWarehouseProductModal
        show={showDeleteProductModal}
        product={productToDelete}
        onClose={() => {
          setShowDeleteProductModal(false);
          setProductToDelete(null);
        }}
        onConfirm={handleProductDelete}
        deleting={deleteProductMutation.isPending}
      />
    </div>
  );
}
