'use client';

import { useState } from "react";
import { Plus, Edit } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  pharmacy: string;
  warehouse: string;
  role: "صيدلي" | "محاسب" | "إداري";
  password: string;
}

export default function EmployeesPage() {
  // الصيدليات المتاحة
  const pharmacies = ["صيدلية النور", "صيدلية الشفاء", "صيدلية الحياة"];
  const warehouses = [" مخزن القاهرة", "مخزن الغردقة ", "مخزن دمنهور "];

  // قائمة الموظفين
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "أحمد محمد", pharmacy: "صيدلية النور", warehouse: "مخزن الغردقة", role: "صيدلي", password: "123456" },
    { id: 2, name: "سارة علي", pharmacy: "صيدلية الشفاء", warehouse: "مخزن دمنهور", role: "محاسب", password: "123456" },
  ]);

  // مودال الإضافة / التعديل
  const [showModal, setShowModal] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);

  // بيانات النموذج
  const [name, setName] = useState("");
  const [pharmacy, setPharmacy] = useState(pharmacies[0]);
  const [warehouse, setWarehouse] = useState(warehouses[0]);
  const [role, setRole] = useState<Employee["role"]>("صيدلي");
  const [password, setPassword] = useState("");

  // فتح مودال الإضافة
  const openAddModal = () => {
    setEditEmployeeId(null);
    setName("");
    setPharmacy(pharmacies[0]);
    setRole("صيدلي");
    setPassword("");
    setShowModal(true);
  };

  // فتح مودال التعديل
  const openEditModal = (employee: Employee) => {
    setEditEmployeeId(employee.id);
    setName(employee.name);
    setPharmacy(employee.pharmacy);
    setWarehouse(employee.warehouse);
    setRole(employee.role);
    setPassword(employee.password);
    setShowModal(true);
  };

  // حفظ الموظف
  const saveEmployee = () => {
    if (editEmployeeId !== null) {
      setEmployees(employees.map(e =>
        e.id === editEmployeeId ? { ...e, name, pharmacy, role, password } : e
      ));
    } else {
      const newEmployee: Employee = {
        id: employees.length + 1,
        name,
        pharmacy,
        warehouse,
        role,
        password,
      };
      setEmployees([...employees, newEmployee]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-950">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-400">الموظفين</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white font-semibold transition"
        >
          <Plus className="w-5 h-5" />
          إضافة موظف
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-emerald-500/30 transition duration-300"
          >
            <h2 className="text-xl font-semibold text-white mb-3">{employee.name}</h2>
            <p className="text-gray-300">الصيدلية: <span className="font-bold text-white">{employee.pharmacy}</span></p>
            <p className="text-gray-300">المخزن: <span className="font-bold text-white">{employee.warehouse}</span></p>
            <p className="text-gray-300 mt-1">الدور: <span className="font-bold text-white">{employee.role}</span></p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => openEditModal(employee)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white text-sm"
              >
                <Edit className="w-4 h-4" /> تعديل
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* مودال الإضافة / التعديل */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-lg text-white">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4">
              {editEmployeeId !== null ? "تعديل الموظف" : "إضافة موظف جديد"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="اسم الموظف"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-emerald-400"
              />

              <select
                value={pharmacy}
                onChange={(e) => setPharmacy(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-emerald-400"
              >
                {pharmacies.map((ph, idx) => (
                  <option key={idx} value={ph}>{ph}</option>
                ))}
              </select>
              <select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-emerald-400"
              >
                {warehouses.map((ph, idx) => (
                  <option key={idx} value={ph}>{ph}</option>
                ))}
              </select>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Employee["role"])}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-emerald-400"
              >
                <option value="صيدلي">صيدلي</option>
                <option value="محاسب">محاسب</option>
                <option value="إداري">إداري</option>
              </select>

              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-emerald-400"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveEmployee}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
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
