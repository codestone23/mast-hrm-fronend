"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "@/components/common";
import { User as UserType } from "@/types/api";

interface EditAccountData {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
}

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSave: (accountData: EditAccountData) => void;
  isLoading?: boolean;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<EditAccountData>({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EditAccountData, string>>>({});

  useEffect(() => {
    if (user && isOpen) {
      const userInfo = user.user_information && Array.isArray(user.user_information) && user.user_information.length > 0
        ? user.user_information[0] as { name?: string; phone?: string; department?: string; position?: string }
        : null;
      
      setFormData({
        name: userInfo?.name || user.name || "",
        email: user.email || "",
        phone: userInfo?.phone || "",
        department: userInfo?.department || "",
        position: userInfo?.position || "",
      });
      setErrors({});
    }
  }, [user, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EditAccountData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof EditAccountData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa tài khoản"
      size="lg"
      closable
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            Cập nhật
          </Button>
        </>
      }
    >
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Input
            label="Tên đầy đủ"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nhập tên đầy đủ"
            error={errors.name}
            required
            fullWidth
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Nhập email"
            error={errors.email}
            required
            fullWidth
          />

          <Input
            label="Số điện thoại"
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Nhập số điện thoại"
            fullWidth
          />

          <Input
            label="Phòng ban"
            value={formData.department || ""}
            onChange={(e) => handleChange("department", e.target.value)}
            placeholder="Nhập phòng ban"
            fullWidth
          />

          <Input
            label="Vị trí"
            value={formData.position || ""}
            onChange={(e) => handleChange("position", e.target.value)}
            placeholder="Nhập vị trí"
            fullWidth
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditAccountModal;
