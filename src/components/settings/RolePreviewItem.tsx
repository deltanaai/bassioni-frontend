import { Users, ChevronRight } from "lucide-react";

interface RolePreviewItemProps {
  name: string;
  permissionsCount: number;
}

export default function RolePreviewItem({
  name,
  permissionsCount,
}: RolePreviewItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gradient-to-r from-indigo-50/50 to-white p-4 transition-all hover:border-indigo-300 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-indigo-100 p-2">
          <Users className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 capitalize">{name}</h4>
          <p className="text-sm text-gray-500">{permissionsCount} صلاحية</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </div>
  );
}
