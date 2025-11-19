import { UseMutationResult } from "@tanstack/react-query";
import { AlertTriangle, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DeleteRoleModalProps {
  role: CompanyRole;
  mutation: UseMutationResult<
    ActionResponse<{ message: string }>,
    Error,
    { itemsIds: number[] }
  >;
  onClose: () => void;
}

export default function DeleteRoleModal({
  role,
  mutation,
  onClose,
}: DeleteRoleModalProps) {
  const handleDelete = () => {
    mutation.mutate(
      { itemsIds: [role.id] },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-900">تأكيد الحذف</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-white hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-gray-700">
            هل أنت متأكد من حذف دور{" "}
            <span className="font-bold text-red-600 capitalize">
              {role.name}
            </span>
            ؟
          </p>
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              💡 يمكنك استعادة الدور في أي وقت من خلال سلة المحذوفات
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDelete}
              disabled={mutation.isPending}
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              {mutation.isPending ? "جاري الحذف..." : "حذف الدور"}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
