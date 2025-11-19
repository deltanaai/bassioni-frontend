"use client";

import { useMutation } from "@tanstack/react-query";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { updateProfile } from "@/lib/actions/company/profile.action";
import { queryClient } from "@/lib/queryClient";

import FormInput from "./FormInput";
import Modal from "./Modal";
import ModalActions from "./ModalActions";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Employee;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address || "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("تم تحديث الملف الشخصي بنجاح");
        queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
        onClose();
      } else {
        toast.error(data.error?.message || "فشل تحديث الملف الشخصي");
      }
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تعديل الملف الشخصي"
      icon={User}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="الاسم"
            icon={User}
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />

          <FormInput
            label="البريد الإلكتروني"
            icon={Mail}
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            required
          />

          <FormInput
            label="رقم الهاتف"
            icon={Phone}
            type="tel"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            required
          />

          <FormInput
            label="العنوان"
            icon={MapPin}
            value={formData.address}
            onChange={(value) => setFormData({ ...formData, address: value })}
          />
        </div>

        {/* Info Note */}
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>ملاحظة:</strong> بعض المعلومات مثل الدور والشركة لا يمكن
            تعديلها من هنا. يرجى التواصل مع المسؤول إذا كنت بحاجة لتغييرها.
          </p>
        </div>

        <ModalActions
          onCancel={onClose}
          isLoading={updateProfileMutation.isPending}
        />
      </form>
    </Modal>
  );
}
