"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Button, Input, Select, TextArea } from "@/components/common";
import { Asset } from "@/constants/types";
import { AssetStatus } from "@/constants/enums";
import { FormRow } from "./modalStyle";

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: Omit<Asset, "id">) => void;
  isLoading?: boolean;
}

interface FormData {
  asset_code: string;
  name: string;
  description: string;
  status: string;
  category: string;
  purchase_price: string;
  model: string;
}

const statusOptions = [
  { value: AssetStatus.AVAILABLE, label: "Có sẵn" },
  { value: AssetStatus.ASSIGNED, label: "Đã gán" },
  { value: AssetStatus.MAINTENANCE, label: "Bảo trì" },
  { value: AssetStatus.RETIRED, label: "Ngừng sử dụng" },
  { value: AssetStatus.LOST, label: "Mất" },
  { value: AssetStatus.DAMAGED, label: "Hỏng" },
];

const categoryOptions = [
  { value: "LAPTOP", label: "Laptop" },
  { value: "DESKTOP", label: "Desktop" },
  { value: "MONITOR", label: "Monitor" },
  { value: "KEYBOARD", label: "Keyboard" },
  { value: "MOUSE", label: "Mouse" },
  { value: "HEADPHONE", label: "Headphone" },
  { value: "PHONE", label: "Phone" },
];

const CreateAssetModal: React.FC<CreateAssetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      asset_code: "",
      name: "",
      description: "",
      status: AssetStatus.AVAILABLE,
      category: "",
      purchase_price: "",
      model: "",
    },
  });

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const onSubmit = (data: FormData) => {
    onSave({
      asset_code: data.asset_code,
      name: data.name,
      description: data.description,
      status: data.status as AssetStatus,
      category: data.category,
      purchase_price: data.purchase_price || "",
      model: data.model,
    } as Omit<Asset, "id">);
    // Không reset form và không đóng modal ở đây, để parent component quản lý
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo tài sản mới"
      size="md"
      footer={
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? "Đang tạo..." : "Tạo tài sản"}
          </Button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <FormRow>
          <Controller
            name="asset_code"
            control={control}
            rules={{ required: "Mã tài sản là bắt buộc" }}
            render={({ field }) => (
              <Input
                label="Mã tài sản"
                {...field}
                placeholder="Nhập mã tài sản"
                error={errors.asset_code?.message}
                required
                fullWidth
                disabled={isLoading}
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            rules={{ required: "Tên tài sản là bắt buộc" }}
            render={({ field }) => (
              <Input
                label="Tên tài sản"
                {...field}
                placeholder="Nhập tên tài sản"
                error={errors.name?.message}
                required
                fullWidth
                disabled={isLoading}
              />
            )}
          />
        </FormRow>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea
              label="Mô tả"
              {...field}
              placeholder="Nhập mô tả tài sản"
              rows={3}
              fullWidth
              disabled={isLoading}
            />
          )}
        />

        <FormRow>
          <Controller
            name="purchase_price"
            control={control}
            render={({ field }) => (
              <Input
                label="Giá (VNĐ)"
                type="number"
                {...field}
                placeholder="Nhập giá"
                fullWidth
                disabled={isLoading}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Trạng thái"
                options={statusOptions}
                value={field.value}
                onChange={field.onChange}
                fullWidth
                disabled={isLoading}
              />
            )}
          />
        </FormRow>

        <FormRow>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                label="Danh mục"
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Chọn danh mục"
                fullWidth
                disabled={isLoading}
              />
            )}
          />

          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <Input
                label="Model"
                {...field}
                placeholder="Nhập Model"
                fullWidth
                disabled={isLoading}
              />
            )}
          />
        </FormRow>
      </div>
    </Modal>
  );
};

export default CreateAssetModal;
