"use client";

import { AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useRoleMutations } from "../_hooks/useRoleMutations";

interface DeleteRoleDialogProps {
  roleId: number | null;
  roleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteRoleDialog({
  roleId,
  roleName,
  open,
  onOpenChange,
}: DeleteRoleDialogProps) {
  const { deleteMutation } = useRoleMutations();

  const handleDelete = () => {
    if (roleId) {
      deleteMutation.mutate(
        { itemsIds: [roleId] },
        {
          onSuccess: (response) => {
            if (response.success) {
              onOpenChange(false);
            }
          },
        }
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-gray-800 bg-gray-950">
        <AlertDialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl font-semibold text-gray-100">
            تأكيد حذف الدور
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-400">
            هل أنت متأكد من حذف الدور{" "}
            <span className="font-semibold text-red-400">
              &quot;{roleName}&quot;
            </span>
            ؟
            <br />
            <span className="text-sm text-gray-500">
              هذا الإجراء لا يمكن التراجع عنه.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-3">
          <AlertDialogCancel className="border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200">
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
          >
            {deleteMutation.isPending ? "جاري الحذف..." : "حذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
