import { Users, Edit, Trash2, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

interface RoleCardProps {
  role: CompanyRole;
  onEdit: (role: CompanyRole) => void;
  onDelete: (role: CompanyRole) => void;
}

export default function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
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

        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(role)}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
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
    </div>
  );
}
