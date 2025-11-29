"use client";

import { Edit, KeyRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import ChangePasswordModal from "./ChangePasswordModal";
import EditProfileModal from "./EditProfileModal";

interface ProfileActionsProps {
  user: SessionUser;
}

export default function ProfileActions({ user }: ProfileActionsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-white">الإجراءات</h2>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => setShowEditModal(true)}
            className="w-full justify-start gap-3 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Edit className="h-5 w-5" />
            تعديل البيانات الشخصية
          </Button>
          <Button
            onClick={() => setShowPasswordModal(true)}
            className="w-full justify-start gap-3 border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
            variant="outline"
          >
            <KeyRound className="h-5 w-5" />
            تغيير كلمة المرور
          </Button>
        </div>
      </div>

      <EditProfileModal
        user={user}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
