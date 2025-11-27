import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { roleCreateInput, UpdateRoleInput } from "@/types/company/uiProps";
import Toggle from "./Toggle";

interface PermissionsSelectorProps {
  permissions: RolePermission[];
  register: UseFormRegister<roleCreateInput> | UseFormRegister<UpdateRoleInput>;
  errors?: FieldErrors<roleCreateInput> | FieldErrors<UpdateRoleInput>;
  watch: (field: "permissions") => number[];
}

//  عشان نقسمهم لاجزاء في فورم الاضافه ميبقاش كله علي بعضه
const PermissionsSelector: React.FC<PermissionsSelectorProps> = ({
  permissions,
  register,
  errors,
  watch,
}) => {
  const getPermissionLabel = (permissionName: string) => {
    const labels: { [key: string]: string } = {
      "manage-company": "إدارة الشركة",
      "employee-list": "عرض الموظفين",
      "employee-create": "إضافة موظف",
      "employee-edit": "تعديل موظف",
      "employee-delete": "حذف موظف",
      "role-list": "عرض الأدوار",
      "role-create": "إضافة دور",
      "role-edit": "تعديل دور",
      "role-delete": "حذف دور",
      "warehouse-list": "عرض المستودعات",
      "warehouse-create": "إضافة مستودع",
      "warehouse-edit": "تعديل مستودع",
      "warehouse-delete": "حذف مستودع",
      "warehouse-product-list": "عرض منتجات المستودع",
      "warehouse-product-create": "إضافة منتج للمستودع",
      "warehouse-product-edit": "تعديل منتج في المستودع",
      "warehouse-product-delete": "حذف منتج من المستودع",
      "company-list": "عرض الشركات",
      "pharmacy-list": "عرض الصيدليات",
      "offer-list": "عرض العروض",
      "offer-create": "إضافة عرض",
      "offer-edit": "تعديل عرض",
      "offer-delete": "حذف عرض",
      "response_offer-list": "عرض ردود العروض",
      "response_offer-edit": "تعديل رد العرض",
      "response_offer-delete": "حذف رد العرض",
      "product-list": "عرض المنتجات",
      "order-list": "عرض الطلبات",
      "order-create": "إضافة طلب",
      "order-edit": "تعديل طلب",
      "order-delete": "حذف طلب",
    };

    return labels[permissionName] || permissionName;
  };

  // console.log("PERMISSIONS",permissions);

  return (
    <div className="mb-6">
      <label className="my-4 block text-sm font-medium text-gray-700">
        الصلاحيات
      </label>

      {errors?.permissions && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-500">
          {errors.permissions.message}
        </p>
      )}

      <div className="grid max-h-[500px] grid-cols-1 gap-4 overflow-y-auto rounded-xl bg-gray-50 p-3 lg:grid-cols-2 xl:grid-cols-3">
        {/* Employee Management */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">
            👥 إدارة الموظفين
          </h4>
          <div className="space-y-3">
            {permissions
              ?.filter(
                (p) =>
                  p.name.includes("employee") &&
                  !p.name.includes("manage-company")
              )
              .map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {getPermissionLabel(permission.name)}
                  </span>
                  <Toggle
                    value={permission.id}
                    name="permissions"
                    register={register}
                    defaultChecked={watch("permissions")?.includes(
                      permission.id
                    )}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Role Management */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">
            🎭 إدارة الأدوار
          </h4>
          <div className="space-y-3">
            {permissions
              ?.filter((p) => p.name.includes("role"))
              .map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {getPermissionLabel(permission.name)}
                  </span>
                  <Toggle
                    value={permission.id}
                    name="permissions"
                    register={register}
                    defaultChecked={watch("permissions")?.includes(
                      permission.id
                    )}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Warehouse Management */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">
            📦 إدارة المستودعات
          </h4>
          <div className="space-y-3">
            {permissions
              ?.filter(
                (p) =>
                  p.name.includes("warehouse") &&
                  !p.name.includes("warehouse-product")
              )
              .map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {getPermissionLabel(permission.name)}
                  </span>
                  <Toggle
                    value={permission.id}
                    name="permissions"
                    register={register}
                    defaultChecked={watch("permissions")?.includes(
                      permission.id
                    )}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Warehouse Products */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">
            🏷️ منتجات المستودعات
          </h4>
          <div className="space-y-3">
            {permissions
              ?.filter((p) => p.name.includes("warehouse-product"))
              .map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {getPermissionLabel(permission.name)}
                  </span>
                  <Toggle
                    value={permission.id}
                    name="permissions"
                    register={register}
                    defaultChecked={watch("permissions")?.includes(
                      permission.id
                    )}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Offers Management */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">
            🎯 إدارة العروض
          </h4>
          <div className="space-y-3">
            {permissions
              ?.filter(
                (p) =>
                  p.name.includes("offer") && !p.name.includes("response_offer")
              )
              .map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {getPermissionLabel(permission.name)}
                  </span>
                  <Toggle
                    value={permission.id}
                    name="permissions"
                    register={register}
                    defaultChecked={watch("permissions")?.includes(
                      permission.id
                    )}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Response Offers */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">
            💬 ردود العروض
          </h4>
          <div className="space-y-3">
            {permissions
              ?.filter((p) => p.name.includes("response_offer"))
              .map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {getPermissionLabel(permission.name)}
                  </span>
                  <Toggle
                    value={permission.id}
                    name="permissions"
                    register={register}
                    defaultChecked={watch("permissions")?.includes(
                      permission.id
                    )}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Orders Management */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">
            📋 إدارة الطلبات
          </h4>
          <div className="space-y-3">
            {permissions
              ?.filter((p) => p.name.includes("order"))
              .map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {getPermissionLabel(permission.name)}
                  </span>
                  <Toggle
                    value={permission.id}
                    name="permissions"
                    register={register}
                    defaultChecked={watch("permissions")?.includes(
                      permission.id
                    )}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Other Permissions */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">
            ⚙️ صلاحيات أخرى
          </h4>
          <div className="space-y-3">
            {permissions
              ?.filter(
                (p) =>
                  p.name === "manage-company" ||
                  p.name === "company-list" ||
                  p.name === "pharmacy-list" ||
                  p.name === "product-list"
              )
              .map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                >
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {getPermissionLabel(permission.name)}
                  </span>
                  <Toggle
                    value={permission.id}
                    name="permissions"
                    register={register}
                    defaultChecked={watch("permissions")?.includes(
                      permission.id
                    )}
                  />
                </label>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsSelector;
