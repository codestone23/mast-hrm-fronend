"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "@/components/common";
import { Notification, UpdateNotificationRequest } from "@/types/api";
import {
  ModalForm,
  FormSection,
  FormActions,
} from "./modalStyle";

interface EditNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
  onSave: (id: number, data: UpdateNotificationRequest) => void;
  isLoading?: boolean;
}

const EditNotificationModal: React.FC<EditNotificationModalProps> = ({
  isOpen,
  onClose,
  notification,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateNotificationRequest>({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateNotificationRequest, string>>>({});

  useEffect(() => {
    if (notification && isOpen) {
      setFormData({
        title: notification.title || "",
        content: notification.content || "",
      });
      setErrors({});
    }
  }, [notification, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateNotificationRequest, string>> = {};

    if (formData.title !== undefined && !formData.title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    }

    if (formData.content !== undefined && !formData.content.trim()) {
      newErrors.content = "Nội dung không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notification && validate()) {
      onSave(notification.id, formData);
    }
  };

  const handleChange = (field: keyof UpdateNotificationRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!notification) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa thông báo"
      size="lg"
      closable
    >
      <ModalForm onSubmit={handleSubmit}>
        <FormSection>
          <Input
            label="Tiêu đề"
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            required
            fullWidth
          />
        </FormSection>

        <FormSection>
          <Input
            label="Nội dung"
            value={formData.content || ""}
            onChange={(e) => handleChange("content", e.target.value)}
            error={errors.content}
            required
            multiline
            rows={6}
            fullWidth
          />
        </FormSection>

        <FormActions>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
          >
            Cập nhật
          </Button>
        </FormActions>
      </ModalForm>
    </Modal>
  );
};

export default EditNotificationModal;

