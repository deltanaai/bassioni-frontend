// components/BulkAssignModal.tsx
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { assignEmployeeRole, assignEmployeesWarehouse, getAllEmployees } from '@/lib/actions/company/employee.action';
import { getAllRoles } from '@/lib/actions/company/role.action';
import { getAllWarehouses } from '@/lib/actions/company/warehouse.action';

interface BulkAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  // نحذف الـ props اللي كنا هنمررها
}

export default function BulkAssignModal({ isOpen, onClose }: BulkAssignModalProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'role' | 'warehouse'>('role');
  
  const queryClient = useQueryClient();

  // جلب البيانات
  const { data: employeesData} = useQuery({
    queryKey: ['employees'],
    queryFn:()=> getAllEmployees({}),
    enabled: isOpen,
  });
  const employees = employeesData?.data || [];

  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles({ }),
    enabled:isOpen
  });
  const roles = rolesData?.data || [];

  const { data: warehousesData } = useQuery({
    queryKey: ['warehouses'],
    queryFn:()=> getAllWarehouses({}),
    enabled: isOpen
  });
  const warehouses = warehousesData?.data ||[]

  // دالة تعيين الأدوار
  const assignRoleMutation = useMutation({
    mutationFn: assignEmployeeRole,
    onSuccess: async (result) => {
      toast.success('تم تعيين الأدوار بنجاح!');
      console.log('✅ تعيين الأدوار نجح:', result);

      handleClose();
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
        console.log('❌ خطأ في تعيين الأدوار:', error);

      toast.error('حدث خطأ أثناء تعيين الأدوار');
    }
  });

  // دالة تعيين المخازن
  const assignWarehouseMutation = useMutation({
    mutationFn: assignEmployeesWarehouse,
    onSuccess: async () => {
      toast.success('تم تعيين المخازن بنجاح!');
      handleClose();
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
    console.log('❌ خطأ في تعيين الأدوار:', error);

      toast.error('حدث خطأ أثناء تعيين المخازن');
    }
  });

  const handleClose = () => {
    setSelectedEmployees([]);
    setSelectedRole(null);
    setSelectedWarehouse(null);
    onClose();
  };

  const handleSubmit = async () => {
    console.log(' البيانات اللي بتتبعت:', {
        roleId: selectedRole,
        employeesId: selectedEmployees,
        // سبب الايرور: المتغير employees قد يكون نوعه never[] أو PaginatedResponse<Employee>، 
        // و PaginatedResponse لا يحتوي على دالة filter. الحل أن نتحقق أن employees مصفوفة قبل استخدام filter
        employeesData: Array.isArray(employees)
          ? (employees as {id: number}[]).filter((emp) => selectedEmployees.includes(emp.id))
          : []
      });
    if (selectedEmployees.length === 0) {
      toast.error('يجب اختيار موظفين على الأقل');
      return;
    }

    if (activeTab === 'role' && selectedRole) {
      assignRoleMutation.mutate({
        roleId: selectedRole,
        employeesId: selectedEmployees
      });
    } else if (activeTab === 'warehouse' && selectedWarehouse) {
      assignWarehouseMutation.mutate({
        warehouseId: selectedWarehouse,
        employeesId: selectedEmployees
      });
    } else {
      toast.error('يجب اختيار ' + (activeTab === 'role' ? 'دور' : 'مخزن'));
    }
  };

  // دالة لاختيار/إلغاء اختيار كل الموظفين
  const toggleSelectAll = () => {
    const employeesArray: { id: number }[] = Array.isArray(employees) ? employees : [];
    if (selectedEmployees.length === employeesArray.length) {
      setSelectedEmployees([]);
    } else {
      const allIds = employeesArray.map((emp) => emp.id);
      setSelectedEmployees(allIds);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* الهيدر */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">تعيين جماعي للموظفين</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* التبويبات */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('role')}
            className={`flex-1 py-4 font-medium ${
              activeTab === 'role' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🎭 تعيين الأدوار
          </button>
          <button
            onClick={() => setActiveTab('warehouse')}
            className={`flex-1 py-4 font-medium ${
              activeTab === 'warehouse' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📦 تعيين المخازن
          </button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {/* اختيار الموظفين */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium">
                اختر الموظفين ({selectedEmployees.length} مختارين)
              </label>
              <button
                onClick={toggleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedEmployees.length === (Array.isArray(employees) ? employees.length : 0) ? 'إلغاء اختيار الكل' : 'اختيار الكل'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {Array.isArray(employees) && employees.map((employee: { id: number; name: string; role: string; warehouse_name: string }) => (
                <label key={employee.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmployees(prev => [...prev, employee.id]);
                      } else {
                        setSelectedEmployees(prev => prev.filter(id => id !== employee.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{employee.name}</p>
                    <p className="text-xs text-gray-500">
                      {employee.role} - {employee.warehouse_name}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* محتوى التبويب */}
          {activeTab === 'role' ? (
            <div>
              <label className="block text-sm font-medium mb-2">اختر الدور</label>
              <select 
                value={selectedRole || ''}
                onChange={(e) => setSelectedRole(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">اختر الدور</option>
                {(Array.isArray(roles) ? roles : []).map((role: { id: number; name: string }) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">اختر المخزن</label>
              <select 
                value={selectedWarehouse || ''}
                onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">اختر المخزن</option>
                {(Array.isArray(warehouses) ? warehouses : []).map((warehouse: { id: number; name: string }) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* الفوتر */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-white"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              (activeTab === 'role' && !selectedRole) ||
              (activeTab === 'warehouse' && !selectedWarehouse) ||
              selectedEmployees.length === 0 ||
              assignRoleMutation.isPending ||
              assignWarehouseMutation.isPending
            }
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {(assignRoleMutation.isPending || assignWarehouseMutation.isPending) 
              ? 'جاري التعيين...' 
              : `تعيين ${selectedEmployees.length} موظف`}
          </button>
        </div>
      </div>
    </div>
  );
}