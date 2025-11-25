"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "@/components/common";
import { CreateNotificationRequest } from "@/types/api";
import {
  ModalForm,
  FormSection,
  FormActions,
} from "./modalStyle";

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notification: CreateNotificationRequest) => void;
  isLoading?: boolean;
}

const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateNotificationRequest>({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateNotificationRequest, string>>>({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: "", content: "" });
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateNotificationRequest, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof CreateNotificationRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo thông báo mới"
      size="lg"
      closable
    >
      <ModalForm onSubmit={handleSubmit}>
        <FormSection>
          <Input
            label="Tiêu đề"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            required
            fullWidth
          />
        </FormSection>

        <FormSection>
          <Input
            label="Nội dung"
            value={formData.content}
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
            Tạo thông báo
          </Button>
        </FormActions>
      </ModalForm>
    </Modal>
  );
};

export default CreateNotificationModal;

