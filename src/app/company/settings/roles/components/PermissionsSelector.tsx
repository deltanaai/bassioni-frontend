import { roleCreateInput } from '@/types/company/uiProps';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';



interface PermissionsSelectorProps {
  permissions: RolePermission[];
  register: UseFormRegister<roleCreateInput>;
  errors?: import("react-hook-form").FieldErrors<roleCreateInput>;
}

//  عشان نقسمهم لاجزاء في فورم الاضافه ميبقاش كله علي بعضه
const PermissionsSelector: React.FC<PermissionsSelectorProps> = ({ 
  permissions, 
  register, 
  errors 
}) => {
  const getPermissionLabel = (permissionName: string) => {
    const labels: { [key: string]: string } = {
      'manage-company': 'إدارة الشركة',
      'employee-list': 'عرض الموظفين',
      'employee-create': 'إضافة موظف',
      'employee-edit': 'تعديل موظف',
      'employee-delete': 'حذف موظف',
      'role-list': 'عرض الأدوار',
      'role-create': 'إضافة دور',
      'role-edit': 'تعديل دور',
      'role-delete': 'حذف دور',
      'warehouse-list': 'عرض المستودعات',
      'warehouse-create': 'إضافة مستودع',
      'warehouse-edit': 'تعديل مستودع',
      'warehouse-delete': 'حذف مستودع',
      'warehouse-product-list': 'عرض منتجات المستودع',
      'warehouse-product-create': 'إضافة منتج للمستودع',
      'warehouse-product-edit': 'تعديل منتج في المستودع',
      'warehouse-product-delete': 'حذف منتج من المستودع',
      'company-list': 'عرض الشركات',
      'pharmacy-list': 'عرض الصيدليات',
      'offer-list': 'عرض العروض',
      'offer-create': 'إضافة عرض',
      'offer-edit': 'تعديل عرض',
      'offer-delete': 'حذف عرض',
      'response_offer-list': 'عرض ردود العروض',
      'response_offer-edit': 'تعديل رد العرض',
      'response_offer-delete': 'حذف رد العرض',
      'product-list': 'عرض المنتجات',
      'order-list': 'عرض الطلبات',
      'order-create': 'إضافة طلب',
      'order-edit': 'تعديل طلب',
      'order-delete': 'حذف طلب'
    };
    
    return labels[permissionName] || permissionName;
  };

  return (
    <div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 my-4">
    الصلاحيات
  </label>
  
  {errors?.permissions && (
    <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
      {errors.permissions.message}
    </p>
  )}
  
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-3 bg-gray-50 rounded-xl">
    
    {/* Employee Management */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 text-base">
        👥 إدارة الموظفين
      </h4>
      <div className="space-y-3">
        {permissions
          ?.filter(p => p.name.includes('employee') && !p.name.includes('manage-company'))
          .map(permission => (
          <label key={permission.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              value={permission.id}
              {...register("permissions")}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            />
            <span className="text-sm font-medium text-gray-700 flex-1">
              {getPermissionLabel(permission.name)}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Role Management */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 text-base">
        🎭 إدارة الأدوار
      </h4>
      <div className="space-y-3">
        {permissions
          ?.filter(p => p.name.includes('role'))
          .map(permission => (
          <label key={permission.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              value={permission.id}
              {...register("permissions")}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            />
            <span className="text-sm font-medium text-gray-700 flex-1">
              {getPermissionLabel(permission.name)}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Warehouse Management */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 text-base">
        📦 إدارة المستودعات
      </h4>
      <div className="space-y-3">
        {permissions
          ?.filter(p => p.name.includes('warehouse') && !p.name.includes('warehouse-product'))
          .map(permission => (
          <label key={permission.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              value={permission.id}
              {...register("permissions")}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            />
            <span className="text-sm font-medium text-gray-700 flex-1">
              {getPermissionLabel(permission.name)}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Warehouse Products */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 text-base">
        🏷️ منتجات المستودعات
      </h4>
      <div className="space-y-3">
        {permissions
          ?.filter(p => p.name.includes('warehouse-product'))
          .map(permission => (
          <label key={permission.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              value={permission.id}
              {...register("permissions")}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            />
            <span className="text-sm font-medium text-gray-700 flex-1">
              {getPermissionLabel(permission.name)}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Offers Management */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 text-base">
        🎯 إدارة العروض
      </h4>
      <div className="space-y-3">
        {permissions
          ?.filter(p => p.name.includes('offer') && !p.name.includes('response_offer'))
          .map(permission => (
          <label key={permission.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              value={permission.id}
              {...register("permissions")}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            />
            <span className="text-sm font-medium text-gray-700 flex-1">
              {getPermissionLabel(permission.name)}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Response Offers */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 text-base">
        💬 ردود العروض
      </h4>
      <div className="space-y-3">
        {permissions
          ?.filter(p => p.name.includes('response_offer'))
          .map(permission => (
          <label key={permission.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              value={permission.id}
              {...register("permissions")}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            />
            <span className="text-sm font-medium text-gray-700 flex-1">
              {getPermissionLabel(permission.name)}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Orders Management */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 text-base">
        📋 إدارة الطلبات
      </h4>
      <div className="space-y-3">
        {permissions
          ?.filter(p => p.name.includes('order'))
          .map(permission => (
          <label key={permission.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              value={permission.id}
              {...register("permissions")}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            />
            <span className="text-sm font-medium text-gray-700 flex-1">
              {getPermissionLabel(permission.name)}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Other Permissions */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 text-base">
        ⚙️ صلاحيات أخرى
      </h4>
      <div className="space-y-3">
        {permissions
          ?.filter(p => 
            p.name === 'manage-company' ||
            p.name === 'company-list' ||
            p.name === 'pharmacy-list' ||
            p.name === 'product-list'
          )
          .map(permission => (
          <label key={permission.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              value={permission.id}
              {...register("permissions")}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            />
            <span className="text-sm font-medium text-gray-700 flex-1">
              {getPermissionLabel(permission.name)}
            </span>
          </label>
        ))}
      </div>
    </div>

  </div>
</div>
  );
};

export default PermissionsSelector;