"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "@/components/common";

interface CreateAccountData {
  name: string;
  email: string;
  password: string;
}

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: CreateAccountData) => void;
  isLoading?: boolean;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateAccountData & { confirmPassword: string }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateAccountData | "confirmPassword", string>>>({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateAccountData | "confirmPassword", string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo tài khoản mới"
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
            Tạo tài khoản
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
            label="Mật khẩu"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Nhập mật khẩu"
            error={errors.password}
            required
            fullWidth
          />

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Nhập lại mật khẩu"
            error={errors.confirmPassword}
            required
            fullWidth
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateAccountModal;
