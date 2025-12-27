"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input, TextArea, Select, DatePicker } from "@/components/common";
import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormLabel,
  CancelButton,
  SaveButton,
} from "@/components/hr/asset/modals/modalStyle";
import {
  MilestoneProject,
  MilestoneProjectCreateRequest,
} from "@/services/project.service";
import { MilestoneProjectStatus } from "@/constants/enums";

interface CreateEditMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MilestoneProjectCreateRequest) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
  milestone?: MilestoneProject;
  projectId: string;
  existingMilestones: MilestoneProject[];
}

const statusOptions = [
  { value: MilestoneProjectStatus.PENDING, label: "Chờ bắt đầu" },
  { value: MilestoneProjectStatus.IN_PROGRESS, label: "Đang thực hiện" },
  { value: MilestoneProjectStatus.COMPLETED, label: "Hoàn thành" },
];

const CreateEditMilestoneModal: React.FC<CreateEditMilestoneModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  mode,
  milestone,
  projectId,
  existingMilestones,
}) => {
  const [formData, setFormData] = useState<MilestoneProjectCreateRequest>({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: MilestoneProjectStatus.PENDING,
    progress: 0,
    order: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && milestone) {
        setFormData({
          name: milestone.name,
          description: milestone.description,
          start_date: milestone.start_date.split("T")[0],
          end_date: milestone.end_date.split("T")[0],
          status: milestone.status as MilestoneProjectStatus,
          progress: milestone.progress,
          order: milestone.order,
        });
      } else {
        // Tạo mới: order = số milestone hiện tại + 1
        const nextOrder = existingMilestones.length > 0 
          ? Math.max(...existingMilestones.map(m => m.order)) + 1 
          : 1;
        setFormData({
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          status: MilestoneProjectStatus.PENDING,
          progress: 0,
          order: nextOrder,
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, milestone, existingMilestones]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên milestone là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Ngày bắt đầu là bắt buộc";
    }

    if (!formData.end_date) {
      newErrors.end_date = "Ngày kết thúc là bắt buộc";
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = "Tiến độ phải từ 0 đến 100";
    }

    if (formData.order < 1) {
      newErrors.order = "Thứ tự phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      status: MilestoneProjectStatus.PENDING,
      progress: 0,
      order: 1,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer size="lg" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {mode === "create" ? "Tạo milestone mới" : "Chỉnh sửa milestone"}
            </ModalTitle>
            <ModalCloseButton onClick={handleClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <FormLabel>Tên milestone *</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên milestone"
                  error={errors.name}
                  required
                  fullWidth
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Mô tả *</FormLabel>
                <TextArea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả milestone"
                  rows={3}
                  error={errors.description}
                  required
                  fullWidth
                />
              </FormGroup>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <FormGroup>
                    <DatePicker
                    label="Ngày bắt đầu"
                    value={formData.start_date ? new Date(formData.start_date) : null}
                    onChange={(date) =>
                        setFormData({
                        ...formData,
                        start_date: date ? date.toISOString().split("T")[0] : "",
                        })
                    }
                    error={errors.start_date}
                    required
                    fullWidth
                    placeholder="Chọn ngày bắt đầu"
                    />
                </FormGroup>
                <FormGroup>
                    <DatePicker
                    label="Ngày kết thúc"
                    value={formData.end_date ? new Date(formData.end_date) : null}
                    onChange={(date) =>
                        setFormData({
                        ...formData,
                        end_date: date ? date.toISOString().split("T")[0] : "",
                        })
                    }
                    error={errors.end_date}
                    required
                    fullWidth
                    placeholder="Chọn ngày kết thúc"
                    minDate={formData.start_date ? new Date(formData.start_date) : undefined}
                    />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Trạng thái *</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(value) =>
                      setFormData({ ...formData, status: String(value) as MilestoneProjectStatus })
                    }
                    options={statusOptions}
                    fullWidth
                  />
                </FormGroup>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                <FormGroup>
                  <FormLabel>Thứ tự *</FormLabel>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
                    }
                    min={1}
                    error={errors.order}
                    required
                    fullWidth
                  />
                </FormGroup>
                {mode === "create" && (
                    <FormGroup>
                    <FormLabel>Tiến độ (%)</FormLabel>
                    <Input
                        type="number"
                        value={formData.progress}
                        onChange={(e) =>
                        setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })
                        }
                        min={0}
                        max={100}
                        error={errors.progress}
                        fullWidth
                    />
                    </FormGroup>
                )}
              </div>

            </ModalBody>

            <ModalFooter>
              <CancelButton type="button" onClick={handleClose} disabled={isLoading}>
                Hủy
              </CancelButton>
              <SaveButton type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === "create"
                    ? "Đang tạo..."
                    : "Đang lưu..."
                  : mode === "create"
                  ? "Tạo milestone"
                  : "Lưu thay đổi"}
              </SaveButton>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateEditMilestoneModal;

