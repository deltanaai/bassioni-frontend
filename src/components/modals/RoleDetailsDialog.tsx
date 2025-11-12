"use client";

import React from "react";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { getRoleDetails } from "@/lib/actions/owner/roles.actions";
import { useQuery } from "@tanstack/react-query";
import { PERMISSION_LABELS } from "@/constants";
import SpinnerMini from "@/components/custom/SpinnerMini";

interface RoleDetailsDialogProps {
  roleId: number;
  trigger?: React.ReactNode;
  showTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function RoleDetailsDialog({
  roleId,
  trigger,
  showTrigger = true,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: RoleDetailsDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const {
    data: roleDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["role-details", roleId],
    queryFn: () => getRoleDetails(roleId),
    enabled: open, // Only fetch when dialog is open
  });

  const role = roleDetails?.data;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && !trigger && (
        <DialogTrigger asChild>
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="عرض التفاصيل"
          >
            <Eye className="h-4 w-4" />
          </button>
        </DialogTrigger>
      )}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            تفاصيل الدور
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <SpinnerMini />
              <span className="mr-2">جاري تحميل التفاصيل...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">حدث خطأ في تحميل التفاصيل</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : role ? (
            <>
              {/* Role Name */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  اسم الدور
                </h3>
                <p className="text-gray-700 text-lg">{role.name}</p>
              </div>

              {/* Permissions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  الصلاحيات ({role.permissions?.length || 0})
                </h3>
                {role.permissions && role.permissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {role.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">
                          {PERMISSION_LABELS[permission.name] ||
                            permission.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    لا توجد صلاحيات لهذا الدور
                  </p>
                )}
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  معلومات إضافية
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المعرف:</span>
                    <span className="font-medium">{role.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">نوع الحماية:</span>
                    <span className="font-medium">{role.guard_name}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">لم يتم العثور على بيانات الدور</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
