"use client";

import React, { useState, useEffect } from "react";
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
import { Input, Select, SelectOption, TextArea } from "@/components/common";

const enum AssetStatus {
  AVAILABLE = "available",
  IN_USE = "in_use",
  MAINTENANCE = "maintenance",
  DISPOSED = "disposed",
}

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onSave: (assetData: Asset) => void;
}

const EditAssetModal: React.FC<EditAssetModalProps> = ({
  isOpen,
  onClose,
  asset,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: AssetStatus.AVAILABLE,
    category: "",
    price: "",
    warehouse: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions: SelectOption[] = [
    { value: AssetStatus.AVAILABLE, label: "Trống" },
    { value: AssetStatus.IN_USE, label: "Đang sử dụng" },
    { value: AssetStatus.MAINTENANCE, label: "Bảo trì" },
    { value: AssetStatus.DISPOSED, label: "Thanh lý" },
  ];

  useEffect(() => {
    if (asset) {
      setFormData({
        code: asset.code,
        name: asset.name,
        description: asset.description || "",
        status: asset.status as AssetStatus,
        category: asset.category || "",
        price: asset.price?.toString() || "",
        warehouse: asset.warehouse || "",
      });
    }
  }, [asset]);

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
    
    if (validateForm() && asset) {
      onSave({
        ...asset,
        code: formData.code,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : undefined,
        warehouse: formData.warehouse,
      });
      
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !asset) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer size="md" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Chỉnh sửa tài sản</ModalTitle>
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
              Lưu thay đổi
            </SaveButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditAssetModal;

