"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ROUTES_PHARMA } from "@/constants/routes";
import useBranchDetails from "@/hooks/branches/useBranchDetails";
import useBranchProducts from "@/hooks/branches/useBranchProducts";

import BranchInfoCard from "./_components/BranchInfoCard";
import BranchStats from "./_components/BranchStats";
import DeleteBranchModal from "./_components/DeleteBranchModal";
import EditBranchModal from "./_components/EditBranchModal";
import ImportProductsModal from "./_components/ImportProductsModal";
import ProductFilters from "./_components/ProductFilters";
import ProductSearch from "./_components/ProductSearch";
import ProductsTable from "./_components/ProductsTable";

// Schema for edit form
const UpdateBranchFormSchema = z.object({
  name: z.string().min(1, "اسم الفرع مطلوب"),
  address: z.string().min(1, "الموقع مطلوب"),
  branchId: z.number(),
});

type UpdateBranchFormData = z.infer<typeof UpdateBranchFormSchema>;

export default function BranchDetailsPage() {
  // Local UI state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>("all");

  const params = useParams();
  const router = useRouter();
  const branchId = Number(params.id) || 0;

  // Use centralized hook that encapsulates queries & mutations
  const { branchQuery, editMutation, deleteMutation } =
    useBranchDetails(branchId);

  const { productsQuery } = useBranchProducts(branchId);

  const branch = branchQuery.data?.data;
  const isLoading = branchQuery.isLoading;
  const error = branchQuery.error;

  const allProducts = useMemo(
    () => productsQuery.data?.data || [],
    [productsQuery.data?.data]
  );

  // Client-side filtering with useMemo
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStockStatus =
        selectedStockStatus === "all" ||
        product.stock_status === selectedStockStatus;

      return matchesSearch && matchesStockStatus;
    });
  }, [allProducts, searchQuery, selectedStockStatus]);

  const handleClearFilters = () => {
    setSelectedStockStatus("all");
  };

  // Edit form
  const editForm = useForm<UpdateBranchFormData>({
    resolver: zodResolver(UpdateBranchFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      branchId: undefined as number | undefined,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (showEditModal && editingBranch) {
      editForm.reset({
        name: editingBranch.name,
        address: editingBranch.address,
        branchId: editingBranch.id,
      });
    }
  }, [showEditModal, editingBranch, editForm]);

  // Submit edit
  const onEditSubmitBranch = (formData: UpdateBranchFormData) => {
    if (!editingBranch) return;

    const submitData = {
      branchId: editingBranch.id,
      name: formData.name,
      address: formData.address,
    };

    editMutation.mutate(submitData, {
      onSuccess: () => {
        toast.success("تم تحديث بيانات الفرع بنجاح");
        setShowEditModal(false);
        setEditingBranch(null);
        editForm.reset();
      },
      onError: () => {
        toast.error("حدث خطأ أثناء تحديث بيانات الفرع");
      },
    });
  };

  // Handle delete
  const handleDeleteBranch = () => {
    deleteMutation.mutate(
      { branchId: [branchId] },
      {
        onSuccess: () => {
          toast.success("تم حذف الفرع بنجاح");
          router.push(ROUTES_PHARMA.BRANCHES);
        },
        onError: () => {
          toast.error("حدث خطأ أثناء حذف الفرع");
          setShowDeleteModal(false);
        },
      }
    );
  };

  // Open edit modal
  const handleEditBranch = () => {
    if (branch) {
      setEditingBranch(branch);
      setShowEditModal(true);
    }
  };

  // Validate ID
  if (isNaN(branchId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">خطأ</h1>
          <p className="mt-2 text-gray-600">معرف الفرع غير صحيح</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-800 border-t-emerald-500"></div>
              <p className="text-gray-400">جاري التحميل...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !branchQuery.data?.success || !branch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400">خطأ</h1>
            <p className="mt-2 text-gray-400">الفرع غير موجود</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push(ROUTES_PHARMA.BRANCHES)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-800/50 bg-gray-900/50 px-4 py-2 text-gray-300 shadow-sm backdrop-blur-xl transition-all hover:bg-gray-900/70 hover:text-white hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5 text-emerald-400" />
            العودة
          </button>
        </div>

        {/* Branch Info Card */}
        <div className="mb-6">
          <BranchInfoCard
            branch={branch}
            onEdit={handleEditBranch}
            onDelete={() => setShowDeleteModal(true)}
            editing={editMutation.isPending}
            deleting={deleteMutation.isPending}
          />
        </div>

        {/* Branch Stats */}
        <div className="mb-6">
          <BranchStats branch={branch} />
        </div>

        {/* Additional Info Section */}
        <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-xl font-bold text-white">معلومات إضافية</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-800/50 bg-gray-950/50 p-4">
              <span className="text-gray-400">تاريخ الإنشاء</span>
              <span className="font-semibold text-white">
                {new Date(branch.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-800/50 bg-gray-950/50 p-4">
              <span className="text-gray-400">آخر تحديث</span>
              <span className="font-semibold text-white">
                {new Date(branch.updatedAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {branch.deletedAt && (
              <div className="flex items-center justify-between rounded-lg border border-red-800/50 bg-red-950/30 p-4">
                <span className="text-red-400">تاريخ الحذف</span>
                <span className="font-semibold text-red-300">
                  {new Date(branch.deletedAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20">
                <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">منتجات الفرع</h2>
                <p className="text-sm text-gray-400">
                  إدارة وتتبع منتجات الفرع
                </p>
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
              selectedStockStatus={selectedStockStatus}
              onStockStatusChange={setSelectedStockStatus}
              onClearFilters={handleClearFilters}
              totalProducts={filteredProducts.length}
            />
          </div>

          {/* Products Table */}
          {productsQuery.isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-800 border-t-emerald-500"></div>
                <p className="text-gray-400">جاري تحميل المنتجات...</p>
              </div>
            </div>
          ) : (
            <ProductsTable products={filteredProducts} />
          )}
        </div>
      </div>

      {/* Modals */}
      <EditBranchModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={onEditSubmitBranch}
        editForm={editForm}
        saving={editMutation.isPending}
      />

      <DeleteBranchModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteBranch}
        deleting={deleteMutation.isPending}
        branchName={branch?.name}
      />

      <ImportProductsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        branchId={branchId}
        branchName={branch?.name ?? "الفرع"}
      />
    </div>
  );
}
