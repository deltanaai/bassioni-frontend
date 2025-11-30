"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PermissionsSelectorProps {
  permissions: RolePermission[];
  selectedPermissions: number[];
  onPermissionsChange: (permissions: number[]) => void;
}

export default function PermissionsSelector({
  permissions,
  selectedPermissions,
  onPermissionsChange,
}: PermissionsSelectorProps) {
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setSelectAll(selectedPermissions.length === permissions.length);
  }, [selectedPermissions, permissions]);

  const handleToggleAll = () => {
    if (selectAll) {
      onPermissionsChange([]);
    } else {
      onPermissionsChange(permissions.map((p) => p.id));
    }
  };

  const handleTogglePermission = (permissionId: number) => {
    const isSelected = selectedPermissions.includes(permissionId);
    if (isSelected) {
      onPermissionsChange(
        selectedPermissions.filter((id) => id !== permissionId),
      );
    } else {
      onPermissionsChange([...selectedPermissions, permissionId]);
    }
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      const category = getCategoryFromPermission(permission.name);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    },
    {} as Record<string, RolePermission[]>,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-purple-700 bg-purple-900/20 p-4">
        <Label className="text-lg font-semibold text-white">
          الصلاحيات المتاحة
        </Label>
        <button
          type="button"
          onClick={handleToggleAll}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
        >
          {selectAll ? (
            <>
              <Check className="h-4 w-4" />
              إلغاء تحديد الكل
            </>
          ) : (
            "تحديد الكل"
          )}
        </button>
      </div>

      <ScrollArea className="h-[400px] rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([category, perms]) => (
            <div
              key={category}
              className="rounded-lg border border-gray-700 bg-gray-900/50 p-4"
            >
              <h4 className="mb-3 text-sm font-semibold text-emerald-400">
                {getCategoryLabel(category)}
              </h4>
              <div className="space-y-2">
                {perms.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-gray-800"
                  >
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() =>
                        handleTogglePermission(permission.id)
                      }
                      className="border-gray-600"
                    />
                    <Label
                      htmlFor={`permission-${permission.id}`}
                      className="flex-1 cursor-pointer text-sm text-gray-300"
                    >
                      {getPermissionLabel(permission.name)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="rounded-lg bg-blue-900/20 p-3 text-center">
        <p className="text-sm text-gray-400">
          تم تحديد{" "}
          <span className="font-bold text-white">
            {selectedPermissions.length}
          </span>{" "}
          من {permissions.length} صلاحية
        </p>
      </div>
    </div>
  );
}

function getCategoryFromPermission(permissionName: string): string {
  if (permissionName.includes("role")) return "roles";
  if (permissionName.includes("branch")) return "branches";
  if (permissionName.includes("product")) return "products";
  if (permissionName.includes("offer")) return "offers";
  if (permissionName.includes("order")) return "orders";
  if (permissionName.includes("employee")) return "employees";
  return "other";
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    roles: "🎭 إدارة الأدوار",
    branches: "🏢 إدارة الفروع",
    products: "🏷️ إدارة المنتجات",
    offers: "🎯 إدارة العروض",
    orders: "📋 إدارة الطلبات",
    employees: "👥 إدارة الموظفين",
    other: "⚙️ صلاحيات أخرى",
  };
  return labels[category] || category;
}

function getPermissionLabel(permissionName: string): string {
  const labels: Record<string, string> = {
    "role-list": "عرض الأدوار",
    "role-create": "إنشاء دور",
    "role-update": "تعديل دور",
    "role-delete": "حذف دور",
    "branch-list": "عرض الفروع",
    "branch-create": "إنشاء فرع",
    "branch-update": "تعديل فرع",
    "branch-delete": "حذف فرع",
    "product-list": "عرض المنتجات",
    "product-create": "إنشاء منتج",
    "product-update": "تعديل منتج",
    "product-delete": "حذف منتج",
    "offer-list": "عرض العروض",
    "offer-create": "إنشاء عرض",
    "offer-update": "تعديل عرض",
    "offer-delete": "حذف عرض",
    "order-list": "عرض الطلبات",
    "order-create": "إنشاء طلب",
    "order-update": "تعديل طلب",
    "order-delete": "حذف طلب",
    "employee-list": "عرض الموظفين",
    "employee-create": "إضافة موظف",
    "employee-update": "تعديل موظف",
    "employee-delete": "حذف موظف",
  };
  return labels[permissionName] || permissionName;
}
