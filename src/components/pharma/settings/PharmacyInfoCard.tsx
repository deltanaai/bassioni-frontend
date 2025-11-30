"use client";

import { Building2, Mail, MapPin, Phone } from "lucide-react";

interface PharmacyInfoCardProps {
  pharmacy: Pharmacy;
}

export default function PharmacyInfoCard({ pharmacy }: PharmacyInfoCardProps) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-xl">
      <div className="mb-6 flex items-center gap-4 border-b border-gray-700 pb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600">
          <Building2 className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">معلومات الصيدلية</h2>
          <p className="text-sm text-gray-400">بيانات الصيدلية المسجلة</p>
        </div>
      </div>

      <div className="space-y-4">
        <InfoRow
          icon={<Building2 className="h-5 w-5" />}
          label="اسم الصيدلية"
          value={pharmacy.name}
        />
        <InfoRow
          icon={<Phone className="h-5 w-5" />}
          label="رقم الهاتف"
          value={pharmacy.phone}
        />
        <InfoRow
          icon={<MapPin className="h-5 w-5" />}
          label="العنوان"
          value={pharmacy.address}
        />
        {pharmacy.license_number && (
          <InfoRow
            icon={<Mail className="h-5 w-5" />}
            label="رقم الترخيص"
            value={pharmacy.license_number}
          />
        )}
      </div>

      {pharmacy.avg_rate > 0 && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-900/20 p-3">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="text-sm text-gray-400">التقييم</p>
            <p className="font-semibold text-white">
              {pharmacy.avg_rate.toFixed(1)} من 5
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-800/50 p-3 transition-colors hover:bg-gray-800">
      <div className="mt-0.5 text-emerald-400">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-200">{value}</p>
      </div>
    </div>
  );
}
