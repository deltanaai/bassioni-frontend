"use client";

import { useMutation } from "@tanstack/react-query";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { updatePassword } from "@/lib/actions/company/profile.action";
import { queryClient } from "@/lib/queryClient";

import Modal from "./Modal";
import ModalActions from "./ModalActions";
import PasswordInput from "./PasswordInput";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "تم تحديث كلمة المرور بنجاح");
        queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
        onClose();
        setFormData({
          currentPassword: "",
          newPassword: "",
          newPasswordConfirmation: "",
        });
      } else {
        toast.error(data.error?.message || "فشل تحديث كلمة المرور");
      }
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث كلمة المرور");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.newPasswordConfirmation) {
      toast.error("كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين");
      return;
    }
    updatePasswordMutation.mutate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تغيير كلمة المرور"
      icon={KeyRound}
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <PasswordInput
            label="كلمة المرور الحالية"
            value={formData.currentPassword}
            onChange={(value) =>
              setFormData({ ...formData, currentPassword: value })
            }
            required
          />

          <PasswordInput
            label="كلمة المرور الجديدة"
            value={formData.newPassword}
            onChange={(value) =>
              setFormData({ ...formData, newPassword: value })
            }
            required
            minLength={8}
            helperText="يجب أن تكون كلمة المرور 8 أحرف على الأقل"
          />

          <PasswordInput
            label="تأكيد كلمة المرور الجديدة"
            value={formData.newPasswordConfirmation}
            onChange={(value) =>
              setFormData({ ...formData, newPasswordConfirmation: value })
            }
            required
          />
        </div>

        <ModalActions
          onCancel={onClose}
          isLoading={updatePasswordMutation.isPending}
        />
      </form>
    </Modal>
  );
}
