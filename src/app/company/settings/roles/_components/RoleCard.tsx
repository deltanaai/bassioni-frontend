import { Users, Edit, Trash2, Shield, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { getRoleById } from "@/lib/actions/company/role.action";
import { toast } from "sonner";
import { useState } from "react";
import ViewRoleModal from "./ViewRoleModal";

interface RoleCardProps {
  role: CompanyRole;
  onEdit: (role: CompanyRole) => void;
  onDelete: (role: CompanyRole) => void;
}

export default function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  const [selectedRole, setSelectedRole] = useState<CompanyRole | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const viewRoleMutation = useMutation({
    mutationFn: (roleId: number) => getRoleById({ roleId }),
    onSuccess: (res) => {
      if (res.success) {
        setSelectedRole(res.data);
        setIsViewOpen(true);
      } else {
        toast.error("فشل في جلب تفاصيل الدور");
      }
    },
  });
  return (
    <div className="group rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 p-3 transition-transform group-hover:scale-110">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>

          <div>
            <h3 className="mb-1 text-lg font-bold text-gray-900 capitalize">
              {role.name}
            </h3>
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>{role.guard_name}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
              <Shield className="h-3.5 w-3.5" />
              {role.permissions?.length || 0} صلاحية
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            onClick={() => viewRoleMutation.mutate(role.id)}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onEdit(role)}
            variant="ghost"
            size="sm"
            className="text-green-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(role)}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isViewOpen && selectedRole && (
        <ViewRoleModal
          role={selectedRole}
          onClose={() => setIsViewOpen(false)}
        />
      )}
    </div>
  );
}
