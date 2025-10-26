"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, FileText, Users } from "lucide-react";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextArea,
  FormSelect,
  FormRow,
  ModalFooter,
  CancelButton,
  SaveButton,
  IconWrapper,
} from "../divisionStyle";
import { Division } from "@/constants/types";

interface EditDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division: Division | null;
  onSave: (divisionData: Division) => void;
}

const EditDivisionModal: React.FC<EditDivisionModalProps> = ({
  isOpen,
  onClose,
  division,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "",
    status: "active" as "active" | "inactive",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (division) {
      setFormData({
        name: division.name || "",
        description: division.description || "",
        manager: division.manager || "",
        status: division.status || "active",
      });
    }
  }, [division]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên phòng ban là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm() && division) {
      onSave({
        ...division,
        ...formData,
      });
      
      setErrors({});
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !division) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Chỉnh sửa phòng ban</ModalTitle>
          <ModalCloseButton onClick={handleClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <FormLabel>
                <IconWrapper>
                  <Building2 size={16} />
                </IconWrapper>
                Tên phòng ban *
              </FormLabel>
              <FormInput
                type="text"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
                placeholder="Nhập tên phòng ban"
                $hasError={!!errors.name}
              />
              {errors.name && <span style={{ color: "var(--error-500)", fontSize: "12px" }}>{errors.name}</span>}
            </FormGroup>

            <FormGroup>
              <FormLabel>
                <IconWrapper>
                  <FileText size={16} />
                </IconWrapper>
                Mô tả *
              </FormLabel>
              <FormTextArea
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("description", e.target.value)}
                placeholder="Nhập mô tả phòng ban"
                rows={4}
                $hasError={!!errors.description}
              />
              {errors.description && <span style={{ color: "var(--error-500)", fontSize: "12px" }}>{errors.description}</span>}
            </FormGroup>

            <FormRow>
              <FormGroup>
                <FormLabel>
                  <IconWrapper>
                    <Users size={16} />
                  </IconWrapper>
                  Quản lý phòng ban
                </FormLabel>
                <FormInput
                  type="text"
                  value={formData.manager}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("manager", e.target.value)}
                  placeholder="Nhập tên quản lý"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Trạng thái</FormLabel>
                <FormSelect
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange("status", e.target.value)}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </FormSelect>
              </FormGroup>
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

export default EditDivisionModal;
