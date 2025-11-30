"use client";

import { Edit, Loader2, Shield, Trash2, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useRoleDetails } from "../_hooks/useRoleDetails";

interface RoleCardProps {
  role: CompanyRole;
  onEdit: (role: CompanyRole) => void;
  onDelete: (roleId: number) => void;
}

export default function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  const [showPermissions, setShowPermissions] = useState(false);
  
  // Always fetch role details to show count
  const { data: roleDetails, isLoading: isLoadingDetails } = useRoleDetails(
    role.id,
    true // Always enabled to get permission count
  );

  const permissions = roleDetails?.permissions || [];

  return (
    <div className="group rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg transition-all hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{role.name}</h3>
            <p className="text-sm text-gray-400">معرف: {role.id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(role)}
            className="text-blue-400 hover:bg-blue-900/20 hover:text-blue-300"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(role.id)}
            className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-purple-900/20 p-3">
        <Users className="h-5 w-5 text-purple-400" />
        <div>
          <p className="text-xs text-gray-500">عدد الصلاحيات</p>
          <p className="text-lg font-semibold text-white">
            {isLoadingDetails ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              permissions.length
            )}
          </p>
        </div>
      </div>

      {/* Toggle Permissions */}
      <button
        onClick={() => setShowPermissions(!showPermissions)}
        className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-700"
      >
        {showPermissions ? "إخفاء الصلاحيات" : "عرض الصلاحيات"}
      </button>

      {/* Permissions List */}
      {showPermissions && (
        <div className="mt-4 max-h-60 space-y-1 overflow-y-auto rounded-lg bg-gray-900/50 p-3">
          {permissions.length > 0 ? (
            permissions.map((permission) => (
              <div
                key={permission.id}
                className="rounded bg-gray-800/50 px-3 py-2 text-sm text-gray-300"
              >
                {permission.name}
              </div>
            ))
          ) : (
            <p className="py-2 text-center text-sm text-gray-500">
              لا توجد صلاحيات
            </p>
          )}
        </div>
      )}
    </div>
  );
}
