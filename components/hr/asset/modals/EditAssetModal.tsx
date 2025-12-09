"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Modal, Input, Select, TextArea, Button } from "@/components/common";
import { Asset } from "@/constants/types";
import { AssetCategory, AssetStatus } from "@/constants/enums";

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onSave: (assetData: Asset) => void;
}

interface AssetFormData {
  name: string;
  description: string;
  status: AssetStatus;
  category: AssetCategory;
  serial_number: string;
  purchase_date: string;
  purchase_price: string;
  warranty_end_date: string;
  location: string;
  notes: string;
}

const EditAssetModal: React.FC<EditAssetModalProps> = ({
  isOpen,
  onClose,
  asset,
  onSave,
}) => {
  const defaultValues: AssetFormData = useMemo(
    () => ({
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
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<AssetFormData>({
    defaultValues: defaultValues,
  });

  const formData = watch();

  const statusOptions = [
    { value: AssetStatus.AVAILABLE, label: "Có sẵn" },
    { value: AssetStatus.ASSIGNED, label: "Đã gán" },
    { value: AssetStatus.MAINTENANCE, label: "Bảo trì" },
    { value: AssetStatus.RETIRED, label: "Ngừng sử dụng" },
    { value: AssetStatus.LOST, label: "Mất" },
    { value: AssetStatus.DAMAGED, label: "Hỏng" },
  ];

  const categoryOptions = Object.values(AssetCategory).map((cat) => ({
    value: cat,
    label: cat,
  }));

  useEffect(() => {
    if (isOpen && asset) {
      reset({
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
  }, [isOpen, asset, reset]);

  const onSubmit = (data: AssetFormData) => {
    if (asset) {
      const updatedAsset: Asset = {
        ...asset,
        name: data.name,
        description: data.description,
        status: data.status,
        category: data.category,
        serial_number: data.serial_number || undefined,
        purchase_date: data.purchase_date || undefined,
        purchase_price: data.purchase_price || undefined,
        warranty_end_date: data.warranty_end_date || undefined,
        location: data.location || undefined,
        notes: data.notes || undefined,
      };

      onSave(updatedAsset);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !asset) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Chỉnh sửa tài sản"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Input
            label="Mã tài sản"
            value={asset.asset_code || asset.code || ""}
            disabled
            placeholder="Mã tài sản"
            fullWidth
          />

          <Input
            label="Tên tài sản"
            {...register("name", {
              required: "Tên tài sản là bắt buộc",
            })}
            placeholder="Nhập tên tài sản"
            error={errors.name?.message}
            required
            fullWidth
            disabled={isSubmitting}
          />
        </div>

        <TextArea
          label="Mô tả"
          {...register("description")}
          placeholder="Nhập mô tả tài sản"
          rows={3}
          fullWidth
          disabled={isSubmitting}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Select
            label="Danh mục"
            options={categoryOptions}
            value={formData.category}
            onChange={(value) => setValue("category", value as AssetCategory)}
            fullWidth
            disabled={isSubmitting}
          />

          <Select
            label="Trạng thái"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => setValue("status", value as AssetStatus)}
            fullWidth
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Input
            label="Số serial"
            {...register("serial_number")}
            placeholder="Nhập số serial"
            fullWidth
            disabled={isSubmitting}
          />

          <Input
            label="Vị trí"
            {...register("location")}
            placeholder="Nhập vị trí"
            fullWidth
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Input
            label="Ngày mua"
            type="date"
            {...register("purchase_date")}
            placeholder="Chọn ngày mua"
            fullWidth
            disabled={isSubmitting}
          />

          <Input
            label="Giá mua (VNĐ)"
            type="number"
            {...register("purchase_price")}
            placeholder="Nhập giá mua"
            fullWidth
            disabled={isSubmitting}
          />
        </div>

        <Input
          label="Ngày hết bảo hành"
          type="date"
          {...register("warranty_end_date")}
          placeholder="Chọn ngày hết bảo hành"
          fullWidth
          disabled={isSubmitting}
        />

        <TextArea
          label="Ghi chú"
          {...register("notes")}
          placeholder="Nhập ghi chú"
          rows={3}
          fullWidth
          disabled={isSubmitting}
        />
      </div>
    </Modal>
  );
};

export default EditAssetModal;
