"use client";

import { useState } from "react";
import { MapPin, Plus, Edit, Store } from "lucide-react";

interface Branch {
  id: number;
  name: string;
  location: string;
  pharmacy: string;
}

export default function PharmaciesPage() {
  const pharmacies = ["صيدلية النور", "صيدلية الشفاء", "صيدلية الحياة"];

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

  const [showModal, setShowModal] = useState(false);
  const [editBranchId, setEditBranchId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pharmacy, setPharmacy] = useState<string>(pharmacies[0]);

  const openAddModal = () => {
    setEditBranchId(null);
    setName("");
    setLocation("");
    setPharmacy(pharmacies[0]);
    setShowModal(true);
  };

  const openEditModal = (branch: Branch) => {
    setEditBranchId(branch.id);
    setName(branch.name);
    setLocation(branch.location);
    setPharmacy(branch.pharmacy);
    setShowModal(true);
  };

  const saveBranch = () => {
    if (editBranchId !== null) {
      setBranches(
        branches.map((b) =>
          b.id === editBranchId ? { ...b, name, location, pharmacy } : b
        )
      );
    } else {
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
    <div className="p-6 min-h-screen bg-white">
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold text-emerald-600">
              الصيدليات و الفروع
            </h1>
            <p className="text-gray-600">إدارة وتنظيم الصيدليات و فروعها</p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          إضافة فرع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {branch.name}
            </h2>
            <p className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5 text-emerald-500" />
              الموقع:{" "}
              <span className="font-bold text-gray-800">{branch.location}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-600 mt-2">
              الصيدلية الأساسية:{" "}
              <span className="font-bold text-gray-800">{branch.pharmacy}</span>
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => openEditModal(branch)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-800 text-sm border border-gray-300"
              >
                <Edit className="w-4 h-4 text-emerald-600" /> تعديل
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* مودال الإضافة / التعديل */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">
              {editBranchId !== null ? "تعديل الفرع" : "إضافة فرع جديد"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="اسم الفرع"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                placeholder="الموقع"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={pharmacy}
                onChange={(e) => setPharmacy(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              >
                {pharmacies.map((ph, idx) => (
                  <option key={idx} value={ph}>
                    {ph}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl border border-gray-300"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveBranch}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white"
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
