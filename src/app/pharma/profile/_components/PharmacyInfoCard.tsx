"use client";

import { Building2, FileText, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";

interface PharmacyInfoCardProps {
  pharmacy: Pharmacy;
}

export default function PharmacyInfoCard({ pharmacy }: PharmacyInfoCardProps) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-800 shadow-lg">
      <div className="border-b border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white">معلومات الصيدلية</h2>
        <p className="text-sm text-gray-400">تفاصيل الصيدلية المرتبطة</p>
      </div>

      <div className="p-6">
        {/* Pharmacy Image and Name */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-gray-700 bg-gray-700">
            {pharmacy.imageUrl ? (
              <Image
                src={pharmacy.imageUrl}
                alt={pharmacy.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".fallback-icon")) {
                    const div = document.createElement("div");
                    div.className =
                      "fallback-icon flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600";
                    const svg = document.createElementNS(
                      "http://www.w3.org/2000/svg",
                      "svg"
                    );
                    svg.setAttribute("class", "h-10 w-10 text-white");
                    svg.setAttribute("fill", "none");
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.setAttribute("stroke", "currentColor");
                    svg.innerHTML =
                      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />';
                    div.appendChild(svg);
                    parent.appendChild(div);
                  }
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600">
                <Building2 className="h-10 w-10 text-white" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{pharmacy.name}</h3>
            {pharmacy.license_number && (
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                <FileText className="h-4 w-4" />
                <span>رخصة: {pharmacy.license_number}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pharmacy Details */}
        <div className="space-y-4">
          <div className="bg-gray-750 flex items-center gap-4 rounded-xl border border-gray-700 p-4">
            <div className="rounded-lg bg-emerald-900/30 p-3">
              <Phone className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">رقم الهاتف</p>
              <p className="font-medium text-white">{pharmacy.phone}</p>
            </div>
          </div>

          <div className="bg-gray-750 flex items-center gap-4 rounded-xl border border-gray-700 p-4">
            <div className="rounded-lg bg-purple-900/30 p-3">
              <MapPin className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">العنوان</p>
              <p className="font-medium text-white">{pharmacy.address}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-gray-750 flex items-center gap-4 rounded-xl border border-gray-700 p-4">
            <div className="rounded-lg bg-yellow-900/30 p-3">
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">التقييم</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(pharmacy.avg_rate)
                          ? "fill-yellow-400"
                          : "fill-gray-600"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="font-medium text-white">
                  {pharmacy.avg_rate.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  ({pharmacy.total_rate ?? 0} تقييم)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
