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
    asset_code: "",
    name: "",
    description: "",
    status: "available" as const,
    category: "",
    purchase_price: "",
    model: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions: SelectOption[] = [
    { value: "AVAILABLE", label: "Trống" },
    { value: "ASSIGNED", label: "Đang sử dụng" },
    { value: "MAINTENANCE", label: "Bảo trì" },
    { value: "RETIRED", label: "Thanh lý" },
  ];

  const categoryOptions: SelectOption[] = [
    { value: "LAPTOP", label: "Laptop" },
    { value: "DESKTOP", label: "Desktop" },
    { value: "MONITOR", label: "Monitor" },
    { value: "KEYBOARD", label: "Keyboard" },
    { value: "MOUSE", label: "Mouse" },
    { value: "HEADPHONE", label: "Headphone" },
    { value: "PHONE", label: "Phone" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.asset_code.trim()) {
      newErrors.asset_code = "Mã tài sản là bắt buộc";
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
        asset_code: formData.asset_code,
        // keep legacy code for backward compatibility
        name: formData.name,
        description: formData.description,
        status: formData.status,
        category: formData.category,
        purchase_price: formData.purchase_price ? formData.purchase_price : "",
        model: formData.model,
      } as Omit<Asset, "id">);
      
      setFormData({
        asset_code: "",
        name: "",
        description: "",
        status: "available",
        category: "",
        purchase_price: "",
        model: "",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      asset_code: "",
      name: "",
      description: "",
      status: "available",
      category: "",
      purchase_price: "",
      model: "",
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
                value={formData.asset_code}
                onChange={(e) => handleInputChange("asset_code", e.target.value)}
                placeholder="Nhập mã tài sản"
                error={errors.asset_code}
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
                value={formData.purchase_price}
                onChange={(e) => handleInputChange("purchase_price", e.target.value)}
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
              <Select
                label="Danh mục"
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleInputChange("category", String(value))}
                fullWidth
              />

              <Input
                label="Model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                placeholder="Nhập Model"
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

