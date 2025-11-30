"use client";

import { Mail, Phone, User } from "lucide-react";
import Image from "next/image";

interface PharmacistInfoCardProps {
  pharmacist: Pharmacist;
}

export default function PharmacistInfoCard({
  pharmacist,
}: PharmacistInfoCardProps) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-xl">
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-white">المعلومات الشخصية</h2>
        <p className="text-sm text-gray-400">بيانات الصيدلي الحالي</p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-emerald-600">
          {pharmacist.imageUrl ? (
            <Image
              src={pharmacist.imageUrl}
              alt={pharmacist.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-600">
              <User className="h-10 w-10 text-white" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            {pharmacist.name}
          </h3>
          <p className="text-sm text-gray-400">صيدلي معتمد</p>
        </div>
      </div>

      <div className="space-y-4">
        <InfoRow
          icon={<Mail className="h-5 w-5" />}
          label="البريد الإلكتروني"
          value={pharmacist.email}
        />
        <InfoRow
          icon={<Phone className="h-5 w-5" />}
          label="رقم الهاتف"
          value={pharmacist.phone}
        />
      </div>

      <div className="mt-6 rounded-lg bg-blue-900/20 p-3 text-center">
        <p className="text-xs text-gray-400">عضو منذ</p>
        <p className="text-sm font-medium text-gray-200">
          {new Date(pharmacist.createdAt).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
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
      <div className="mt-0.5 text-blue-400">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-200">{value}</p>
      </div>
    </div>
  );
}
