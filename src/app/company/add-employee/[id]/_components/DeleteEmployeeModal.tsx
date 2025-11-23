"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteEmployees } from "@/lib/actions/company/employee.action";

interface DeleteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

export default function DeleteEmployeeModal({
  isOpen,
  onClose,
  employee,
}: DeleteEmployeeModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteEmployees,
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء حذف الموظف");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("تم حذف الموظف بنجاح");
      router.push("/company/add-employee");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الموظف");
      onClose();
    },
  });

  const handleDelete = () => {
    mutation.mutate({
      employeesId: [employee.id],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="h-7 w-7 text-red-600" />
        </div>

        <div className="mb-7 text-center">
          <h3 className="mb-3 text-xl font-bold text-gray-900">حذف الموظف</h3>
          <p className="mb-3 text-base leading-relaxed text-gray-700">
            هل تريد نقل
            <span className="mx-1 font-bold text-red-600">{employee.name}</span>
            إلى سلة المحذوفات؟
          </p>
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
            يمكنك استعادة الموظف في أي وقت من خلال سلة المحذوفات
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={mutation.isPending}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleDelete}
            disabled={mutation.isPending}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <Trash2 className="ml-2 h-5 w-5" />
                تأكيد الحذف
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
