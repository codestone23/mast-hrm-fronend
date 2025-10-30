"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormRow,
  CancelButton,
  SaveButton,
} from "./modalStyle";
import { Asset } from "@/constants/types";
import { Input, Select, TextArea } from "@/components/common";

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: Omit<Asset, "id">) => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const CreateAssetModal: React.FC<CreateAssetModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: "available" as const,
    category: "",
    price: "",
    warehouse: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions: SelectOption[] = [
    { value: "available", label: "Trống" },
    { value: "in_use", label: "Đang sử dụng" },
    { value: "maintenance", label: "Bảo trì" },
    { value: "disposed", label: "Thanh lý" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Mã tài sản là bắt buộc";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Tên tài sản là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        asset_code: formData.code,
        // keep legacy code for backward compatibility
        code: formData.code,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : undefined,
        warehouse: formData.warehouse,
      } as Omit<Asset, "id">);
      
      setFormData({
        code: "",
        name: "",
        description: "",
        status: "available",
        category: "",
        price: "",
        warehouse: "",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      status: "available",
      category: "",
      price: "",
      warehouse: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer size="md" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Tạo tài sản mới</ModalTitle>
          <ModalCloseButton onClick={handleClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormRow>
              <Input
                label="Mã tài sản"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="Nhập mã tài sản"
                error={errors.code}
                required
                fullWidth
              />

              <Input
                label="Tên tài sản"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nhập tên tài sản"
                error={errors.name}
                required
                fullWidth
              />
            </FormRow>

            <TextArea
              label="Mô tả"
              value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Nhập mô tả tài sản"
              rows={3}
              fullWidth
            />

            <FormRow>
              <Input
                label="Giá (VNĐ)"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Nhập giá"
                fullWidth
              />

              <Select
                label="Trạng thái"
                options={statusOptions}
                value={formData.status}
                onChange={(value) => handleInputChange("status", String(value))}
                fullWidth
              />
            </FormRow>

            <FormRow>
              <Input
                label="Danh mục"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="Nhập danh mục"
                fullWidth
              />

              <Input
                label="Kho"
                value={formData.warehouse}
                onChange={(e) => handleInputChange("warehouse", e.target.value)}
                placeholder="Nhập kho"
                fullWidth
              />
            </FormRow>
          </ModalBody>

          <ModalFooter>
            <CancelButton type="button" onClick={handleClose}>
              Hủy
            </CancelButton>
            <SaveButton type="submit">
              Tạo tài sản
            </SaveButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateAssetModal;

