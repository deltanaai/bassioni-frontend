"use client";

import { MapPin, Plus, Edit, Trash, Trash2 } from "lucide-react";
import { useState } from "react";

interface Branch {
  id: number;
  name: string;
  location: string;
  pharmacy: string;
}

export default function PharmaciesPage() {
  // الصيدليات الأساسية
  const pharmacies = ["صيدلية النور", "صيدلية الشفاء", "صيدلية الحياة"];

  // الفروع الحالية
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 1,
      name: "فرع مدينة نصر",
      location: "القاهرة - مدينة نصر",
      pharmacy: "صيدلية النور",
    },
    {
      id: 2,
      name: "فرع سموحة",
      location: "الإسكندرية - سموحة",
      pharmacy: "صيدلية الشفاء",
    },
  ]);

  // مودال الإضافة / التعديل
  const [showModal, setShowModal] = useState(false);
  const [editBranchId, setEditBranchId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // بيانات النموذج
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pharmacy, setPharmacy] = useState<string>(pharmacies[0]);

  // فتح مودال الإضافة
  const openAddModal = () => {
    setEditBranchId(null);
    setName("");
    setLocation("");
    setPharmacy(pharmacies[0]);
    setShowModal(true);
  };

  // فتح مودال التعديل
  const openEditModal = (branch: Branch) => {
    setEditBranchId(branch.id);
    setName(branch.name);
    setLocation(branch.location);
    setPharmacy(branch.pharmacy);
    setShowModal(true);
  };

  const handleDeleteWarehouse = () => {};

  // حفظ الفرع
  const saveBranch = () => {
    if (editBranchId !== null) {
      // تعديل
      setBranches(
        branches.map((b) =>
          b.id === editBranchId ? { ...b, name, location, pharmacy } : b
        )
      );
    } else {
      // إضافة
      const newBranch: Branch = {
        id: branches.length + 1,
        name,
        location,
        pharmacy,
      };
      setBranches([...branches, newBranch]);
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-400">فروع الصيدليات</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2 font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          إضافة فرع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-lg transition duration-300 hover:shadow-emerald-500/30"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="mb-3 text-xl font-semibold text-white">
                {branch.name}
              </h2>
              <button
                className="cursor-pointer "
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash size={18} className="text-red-700 " />
              </button>
            </div>
            <p className="flex items-center gap-2 text-gray-300">
              <MapPin className="h-5 w-5 text-emerald-400" />
              الموقع:{" "}
              <span className="font-bold text-white">{branch.location}</span>
            </p>
            <p className="mt-2 flex items-center gap-2 text-gray-300">
              الصيدلية الأساسية:{" "}
              <span className="font-bold text-white">{branch.pharmacy}</span>
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => openEditModal(branch)}
                className="flex items-center gap-2 rounded-xl bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600"
              >
                <Edit className="h-4 w-4" /> تعديل
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm scale-100 transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <Trash2 className="h-7 w-7 text-orange-500" />
            </div>

            <div className="mb-7 text-center">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                حذف الفرع
              </h3>
              <p className="mb-3 text-base leading-relaxed text-gray-700">
                هل تريد نقل
                <span className="mx-1 font-bold text-orange-600">الفرع</span>
                إلى سلة المحذوفات؟
              </p>
              <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
                يمكنك استعادة الفرع في أي وقت من خلال سلة المحذوفات
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteWarehouse}
                // disabled={deleteWarehouseMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:bg-orange-600 hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {/* {deleteWarehouseMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          جاري الحذف...
                        </>
                      ) : ( */}
                <Trash2 className="h-5 w-5" />
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال الإضافة / التعديل */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-gray-900 p-6 text-white shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-emerald-400">
              {editBranchId !== null ? "تعديل الفرع" : "إضافة فرع جديد"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="اسم الفرع"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
              />
              <input
                type="text"
                placeholder="الموقع"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
              />
              <select
                value={pharmacy}
                onChange={(e) => setPharmacy(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-emerald-400"
              >
                {pharmacies.map((ph, idx) => (
                  <option key={idx} value={ph}>
                    {ph}
                  </option>
                ))}
              </select>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-xl bg-gray-700 px-4 py-2 hover:bg-gray-600"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveBranch}
                  className="rounded-xl bg-emerald-600 px-4 py-2 hover:bg-emerald-700"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
