"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Briefcase,
} from "lucide-react";
import React, { useState } from "react";

import { getProfile } from "@/lib/actions/company/profile.action";
import { formatBackendDateToArabic } from "@/lib/utils";

import ChangePasswordModal from "./_components/ChangePasswordModal";
import EditProfileModal from "./_components/EditProfileModal";
import InfoCard from "./_components/InfoCard";
import InfoItem from "./_components/InfoItem";
import ProfileHeader from "./_components/ProfileHeader";

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: getProfile,
  });

  const profile = response?.success ? response.data : null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">لم يتم العثور على بيانات الملف الشخصي</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="mt-1 text-sm text-gray-500">
            إدارة معلوماتك الشخصية وإعدادات الحساب
          </p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <ProfileHeader
          name={profile.name}
          role={profile.role}
          isActive={profile.active}
          onEditClick={() => setIsEditModalOpen(true)}
          onPasswordClick={() => setIsPasswordModalOpen(true)}
        />

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Info Card */}
          <InfoCard title="معلومات الاتصال" icon={Mail}>
            <InfoItem
              icon={Mail}
              label="البريد الإلكتروني"
              value={profile.email}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <InfoItem
              icon={Phone}
              label="رقم الهاتف"
              value={profile.phone}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
          </InfoCard>

          {/* Company Info Card */}
          <InfoCard title="معلومات الشركة" icon={Building}>
            <InfoItem
              icon={Building}
              label="الدور الوظيفي"
              value={profile.role}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
            <InfoItem
              icon={Briefcase}
              label="المستودعات"
              value={profile.warehouse_id ? "مخصص" : "غير مخصص"}
              iconBgColor="bg-orange-100"
              iconColor="text-orange-600"
            />
          </InfoCard>

          {/* Location & Dates Card */}
          <InfoCard title="الموقع والتواريخ" icon={MapPin}>
            <InfoItem
              icon={MapPin}
              label="العنوان"
              value={profile.address || "غير محدد"}
              iconBgColor="bg-red-100"
              iconColor="text-red-600"
            />
            <InfoItem
              icon={Calendar}
              label="تاريخ الإنشاء"
              value={formatBackendDateToArabic(profile.createdAt)}
              iconBgColor="bg-indigo-100"
              iconColor="text-indigo-600"
            />
          </InfoCard>
        </div>

        {/* Last Updated */}
        <div className="m-6 mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              آخر تحديث
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatBackendDateToArabic(profile.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
