"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Building2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import {
  createBranch,
  deleteBranch,
  indexBranches,
  updateBranch,
} from "@/lib/actions/pharma/branches.action";
import { queryClient } from "@/lib/queryClient";

import AddBranchModal from "./_components/AddBranchModal";
import BranchCard from "./_components/BranchCard";
import BranchFilters from "./_components/BranchFilters";
import BranchSearch from "./_components/BranchSearch";
import DeleteBranchModal from "./_components/DeleteBranchModal";
import EditBranchModal from "./_components/EditBranchModal";

export default function BranchesPage() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Fetch branches
  const { data: branchesResponse, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: () => indexBranches({}),
  });

  const branches = useMemo(() => {
    return branchesResponse?.data || [];
  }, [branchesResponse?.data]);

  // Filter branches based on search and filters
  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      const matchesSearch =
        searchQuery === "" ||
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        selectedLocation === "all" || branch.address === selectedLocation;

      return matchesSearch && matchesLocation;
    });
  }, [branches, searchQuery, selectedLocation]);

  // Mutations
  const addBranchMutation = useMutation({
    mutationFn: createBranch,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["branches"] });
        setShowAddModal(false);
        toast.success("تم إضافة الفرع بنجاح");
      } else {
        toast.error(res.error?.message || "فشل في إضافة الفرع");
      }
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إضافة الفرع");
    },
  });

  const editBranchMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["branches"] });
        setShowEditModal(false);
        setSelectedBranch(null);
        toast.success("تم تعديل بيانات الفرع بنجاح");
      } else {
        toast.error(res.error?.message || "فشل في تعديل بيانات الفرع");
      }
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تعديل بيانات الفرع");
    },
  });

  const deleteBranchMutation = useMutation({
    mutationFn: deleteBranch,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["branches"] });
        setShowDeleteModal(false);
        setSelectedBranch(null);
        toast.success("تم حذف الفرع بنجاح");
      } else {
        toast.error(res.error?.message || "فشل في حذف الفرع");
      }
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الفرع");
    },
  });

  // Handlers
  const handleClearFilters = () => {
    setSelectedLocation("all");
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleDeleteBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedBranch) return;
    deleteBranchMutation.mutate({ branchId: [selectedBranch.id] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-20 w-full bg-gray-800" />
          <Skeleton className="h-16 w-full bg-gray-800" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 md:h-14 md:w-14">
              <Building2 className="h-6 w-6 text-white md:h-7 md:w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                فروع الصيدلية
              </h1>
              <p className="text-sm text-gray-400 md:text-base">
                {branches.length > 0
                  ? `${branches.length} فرع إجمالي`
                  : "لا توجد فروع"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/40 md:px-6 md:py-3"
          >
            <Plus className="h-5 w-5" />
            إضافة فرع جديد
          </button>
        </div>

        {/* Search & Filters */}
        <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-4 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <BranchSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="ابحث بالاسم أو الموقع..."
              />
            </div>
            <div className="flex-shrink-0">
              <BranchFilters
                branches={branches}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                onClearFilters={handleClearFilters}
                totalBranches={filteredBranches.length}
              />
            </div>
          </div>
        </div>

        {/* Branches Grid */}
        {filteredBranches.length === 0 ? (
          <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-12 text-center backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800/50">
              <Building2 className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-300">
              لا توجد فروع
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery || selectedLocation !== "all"
                ? "لم يتم العثور على نتائج مطابقة للبحث"
                : "ابدأ بإضافة فرع جديد للصيدلية"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBranches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                onEdit={handleEditBranch}
                onDelete={handleDeleteBranch}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddBranchModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(data) => addBranchMutation.mutate(data)}
        isLoading={addBranchMutation.isPending}
      />

      <EditBranchModal
        isOpen={showEditModal}
        branch={selectedBranch}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBranch(null);
        }}
        onSubmit={(data) => editBranchMutation.mutate(data)}
        isLoading={editBranchMutation.isPending}
      />

      <DeleteBranchModal
        isOpen={showDeleteModal}
        branch={selectedBranch}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBranch(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={deleteBranchMutation.isPending}
      />
    </div>
  );
}
