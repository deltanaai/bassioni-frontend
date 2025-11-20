"use client";

import { Building2, Edit, MapPin, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";

interface BranchCardProps {
  branch: Branch;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

export default function BranchCard({
  branch,
  onEdit,
  onDelete,
}: BranchCardProps) {
  return (
    <Card className="group overflow-hidden border-gray-800/50 bg-gray-900/30 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 md:h-12 md:w-12">
                <Building2 className="h-5 w-5 text-emerald-400 md:h-6 md:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white md:text-lg">
                  {branch.name}
                </h3>
                <p className="mt-1 text-xs text-gray-400 md:text-sm">
                  #{branch.id}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDelete(branch)}
              className="shrink-0 text-red-500/50 transition-all hover:scale-110 hover:text-red-400"
              aria-label="حذف الفرع"
            >
              <Trash className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 rounded-lg border border-gray-800/50 bg-gray-950/50 p-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 md:h-5 md:w-5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400">الموقع</p>
              <p className="mt-0.5 text-sm font-medium text-white md:text-base">
                {branch.address}
              </p>
            </div>
          </div>

          {/* Pharmacy Name */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-800/50 bg-gray-950/50 p-3">
            <Building2 className="h-4 w-4 shrink-0 text-gray-400 md:h-5 md:w-5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400">الصيدلية الأساسية</p>
              <p className="mt-0.5 text-sm font-medium text-white md:text-base">
                {branch.pharmacy.name}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => onEdit(branch)}
              variant="outline"
              size="sm"
              className="border-emerald-700/50 bg-emerald-900/20 text-emerald-300 transition-all hover:border-emerald-600 hover:bg-emerald-900/40 hover:text-emerald-200"
            >
              <Edit className="ml-2 h-4 w-4" />
              تعديل
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
