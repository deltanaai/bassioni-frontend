import { User } from "lucide-react";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import {
  PersonalInfoCard,
  PharmacyInfoCard,
  ProfileActions,
  ProfileHeader,
} from "./_components";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen space-y-6 bg-gray-900 p-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-emerald-900/30 p-3">
          <User className="h-7 w-7 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">الملف الشخصي</h1>
          <p className="text-sm text-gray-400">عرض وإدارة معلوماتك الشخصية</p>
        </div>
      </div>

      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Personal Info and Pharmacy Info */}
        <div className="space-y-6 lg:col-span-2">
          <PersonalInfoCard user={user} />
          {user.pharmacy && <PharmacyInfoCard pharmacy={user.pharmacy} />}
        </div>

        {/* Right Column - Actions */}
        <div className="lg:col-span-1">
          <ProfileActions user={user} />
        </div>
      </div>
    </div>
  );
}
