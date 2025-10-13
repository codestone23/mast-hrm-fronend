"use client";

import React, { useState } from "react";
import { X, Building2, FileText, Users } from "lucide-react";
import { Division } from "@/constants/types";
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

interface CreateDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (divisionData: Division) => void;
}

const CreateDivisionModal: React.FC<CreateDivisionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "",
    status: "active" as "active" | "inactive",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        manager: formData.manager,
        status: formData.status,
        employeeCount: 0,
        createdAt: new Date().toISOString(),
      });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        manager: "",
        status: "active",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      manager: "",
      status: "active",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Tạo phòng ban mới</ModalTitle>
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
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                onChange={(e) => handleInputChange("description", e.target.value)}
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
                  onChange={(e) => handleInputChange("manager", e.target.value)}
                  placeholder="Nhập tên quản lý"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Trạng thái</FormLabel>
                <FormSelect
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
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
              Tạo phòng ban
            </SaveButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateDivisionModal;
