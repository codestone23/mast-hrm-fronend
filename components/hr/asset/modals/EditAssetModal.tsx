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
import { AssetCategory, AssetStatus } from "@/constants/enums";
import { Input, Select, SelectOption, TextArea } from "@/components/common";

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
    name: "",
    description: "",
    status: AssetStatus.AVAILABLE,
    category: AssetCategory.OTHER,
    serial_number: "",
    purchase_date: "",
    purchase_price: "",
    warranty_end_date: "",
    location: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions: SelectOption[] = [
    { value: AssetStatus.AVAILABLE, label: "Có sẵn" },
    { value: AssetStatus.ASSIGNED, label: "Đã gán" },
    { value: AssetStatus.MAINTENANCE, label: "Bảo trì" },
    { value: AssetStatus.RETIRED, label: "Ngừng sử dụng" },
    { value: AssetStatus.LOST, label: "Mất" },
    { value: AssetStatus.DAMAGED, label: "Hỏng" },
  ];

  const categoryOptions: SelectOption[] = Object.values(AssetCategory).map(cat => ({
    value: cat,
    label: cat,
  }));

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || "",
        description: asset.description || "",
        status: (asset.status as AssetStatus) || AssetStatus.AVAILABLE,
        category: (asset.category as AssetCategory) || AssetCategory.OTHER,
        serial_number: asset.serial_number || "",
        purchase_date: asset.purchase_date || "",
        purchase_price: asset.purchase_price ? String(asset.purchase_price) : "",
        warranty_end_date: asset.warranty_end_date || "",
        location: asset.location || "",
        notes: asset.notes || "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Tên tài sản là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && asset) {
      const updatedAsset: Asset = {
        ...asset,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        category: formData.category,
        serial_number: formData.serial_number || undefined,
        purchase_date: formData.purchase_date || undefined,
        purchase_price: formData.purchase_price || undefined,
        warranty_end_date: formData.warranty_end_date || undefined,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
      };
      
      onSave(updatedAsset);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !asset) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer size="lg" onClick={(e) => e.stopPropagation()}>
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
                value={asset.asset_code || asset.code || ""}
                disabled
                placeholder="Mã tài sản"
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
              <Select
                label="Danh mục"
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleInputChange("category", String(value))}
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
                label="Số serial"
                value={formData.serial_number}
                onChange={(e) => handleInputChange("serial_number", e.target.value)}
                placeholder="Nhập số serial"
                fullWidth
              />

              <Input
                label="Vị trí"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Nhập vị trí"
                fullWidth
              />
            </FormRow>

            <FormRow>
              <Input
                label="Ngày mua"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => handleInputChange("purchase_date", e.target.value)}
                placeholder="Chọn ngày mua"
                fullWidth
              />

              <Input
                label="Giá mua (VNĐ)"
                type="number"
                value={formData.purchase_price}
                onChange={(e) => handleInputChange("purchase_price", e.target.value)}
                placeholder="Nhập giá mua"
                fullWidth
              />
            </FormRow>

            <FormRow>
              <Input
                label="Ngày hết bảo hành"
                type="date"
                value={formData.warranty_end_date}
                onChange={(e) => handleInputChange("warranty_end_date", e.target.value)}
                placeholder="Chọn ngày hết bảo hành"
                fullWidth
              />
            </FormRow>

            <TextArea
              label="Ghi chú"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Nhập ghi chú"
              rows={3}
              fullWidth
            />
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
