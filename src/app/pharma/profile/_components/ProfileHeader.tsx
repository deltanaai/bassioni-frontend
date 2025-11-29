"use client";

import { Building2, Mail, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  user: SessionUser;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 shadow-xl">
      <div className="relative h-32 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="relative px-6 pb-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
            <div className="relative -mt-16 md:-mt-12">
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-gray-800 bg-gray-700 shadow-xl">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.name}
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
                        svg.setAttribute("class", "h-16 w-16 text-white");
                        svg.setAttribute("fill", "none");
                        svg.setAttribute("viewBox", "0 0 24 24");
                        svg.setAttribute("stroke", "currentColor");
                        svg.innerHTML =
                          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />';
                        div.appendChild(svg);
                        parent.appendChild(div);
                      }
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <User className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>
              <div className="absolute -right-2 -bottom-2">
                <Badge
                  className={`${
                    user.active
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                      : "border-gray-500 bg-gray-500/20 text-gray-400"
                  } border-2`}
                >
                  {user.active ? "نشط" : "غير نشط"}
                </Badge>
              </div>
            </div>

            <div className="text-center md:mb-2 md:text-right">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="mt-1 text-sm text-gray-400">{user.role}</p>
              {user.pharmacy && (
                <div className="mt-2 flex items-center justify-center gap-2 text-emerald-400 md:justify-start">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {user.pharmacy.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {user.pharmacy && (
            <div className="bg-gray-750 flex gap-4 rounded-xl border border-gray-700 p-4">
              <div className="text-center">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(user.pharmacy!.avg_rate)
                          ? "fill-yellow-400"
                          : "fill-gray-600"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {user.pharmacy.avg_rate.toFixed(1)} (
                  {user.pharmacy.total_rate ?? 0} تقييم)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
