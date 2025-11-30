import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { roleCreateInput, UpdateRoleInput } from "@/types/company/uiProps";
import Toggle from "./Toggle";
import { getPermissionLabel } from "@/app/utils/permissions";

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
  // console.log("PERMISSIONS", permissions);
  const selectedPermissions = (watch("permissions") || []).map((p) =>
    Number(p)
  );

  const isAllPermissionsSelected = selectedPermissions.includes(42);

  const superPermission = permissions.find((p) => p.id === 42);

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
      {/* Super Permission*/}
      {superPermission && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <h4 className="mb-3 text-base font-semibold text-blue-800">
            ⭐ صلاحية التحكم الكامل
          </h4>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-blue-100">
            <span className="flex-1 text-sm font-medium text-blue-900">
              {getPermissionLabel(superPermission.name)}
            </span>

            <Toggle
              value={42}
              name="permissions"
              register={register}
              defaultChecked={selectedPermissions.includes(42)}
            />
          </label>
        </div>
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
                  !p.name.includes("manage-company") &&
                  p.id !== 42
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
                    defaultChecked={selectedPermissions.includes(permission.id)}
                    disabled={isAllPermissionsSelected}
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
              ?.filter((p) => p.name.includes("role") && p.id !== 42)
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
                    defaultChecked={selectedPermissions.includes(permission.id)}
                    disabled={isAllPermissionsSelected}
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
                  !p.name.includes("warehouse-product") &&
                  p.id !== 42
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
                    defaultChecked={selectedPermissions.includes(permission.id)}
                    disabled={isAllPermissionsSelected}
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
              ?.filter(
                (p) => p.name.includes("warehouse-product") && p.id !== 42
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
                    defaultChecked={selectedPermissions.includes(permission.id)}
                    disabled={isAllPermissionsSelected}
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
                  p.name.includes("offer") &&
                  !p.name.includes("response_offer") &&
                  p.id !== 42
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
                    defaultChecked={selectedPermissions.includes(permission.id)}
                    disabled={isAllPermissionsSelected}
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
              ?.filter((p) => p.name.includes("response_offer") && p.id !== 42)
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
                    defaultChecked={selectedPermissions.includes(permission.id)}
                    disabled={isAllPermissionsSelected}
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
              ?.filter((p) => p.name.includes("order") && p.id !== 42)
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
                    defaultChecked={selectedPermissions.includes(permission.id)}
                    disabled={isAllPermissionsSelected}
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
                    defaultChecked={selectedPermissions.includes(permission.id)}
                    disabled={isAllPermissionsSelected}
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
