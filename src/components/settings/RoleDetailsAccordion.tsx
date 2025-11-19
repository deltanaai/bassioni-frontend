import { Shield } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface RoleDetailsAccordionProps {
  permissions: RolePermission[];
}

export default function RoleDetailsAccordion({
  permissions,
}: RoleDetailsAccordionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedPermissions = showAll ? permissions : permissions.slice(0, 3);
  const hasMore = permissions.length > 3;

  return (
    <div className="space-y-3 rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Shield className="h-4 w-4 text-indigo-600" />
        الصلاحيات ({permissions.length})
      </h4>

      <div className="space-y-2">
        {displayedPermissions.map((permission) => (
          <div
            key={permission.id}
            className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm shadow-sm"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="font-medium text-gray-700">{permission.name}</span>
            <span className="mr-auto text-xs text-gray-500">
              ({permission.guard_name})
            </span>
          </div>
        ))}
      </div>

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
        >
          {showAll
            ? "إخفاء الصلاحيات"
            : `عرض جميع الصلاحيات (${permissions.length})`}
        </Button>
      )}
    </div>
  );
}
