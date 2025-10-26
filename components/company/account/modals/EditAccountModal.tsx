"use client";

import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, Building, Briefcase } from "lucide-react";
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
  FormSelect,
  FormRow,
  ModalFooter,
  CancelButton,
  SaveButton,
  IconWrapper,
} from "./modalStyle";
import { Account } from "@/constants/types";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  onSave: (accountData: Account) => void;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    status: "active" as "active" | "inactive",
    phone: "",
    department: "",
    position: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || "",
        email: account.email || "",
        role: account.role || "User",
        status: account.status || "active",
        phone: account.phone || "",
        department: account.department || "",
        position: account.position || "",
      });
    }
  }, [account]);

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
      newErrors.name = "Tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && account) {
      onSave({
        ...account,
        ...formData,
      });
      
      setErrors({});
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !account) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Chỉnh sửa tài khoản</ModalTitle>
          <ModalCloseButton onClick={handleClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormRow>
              <FormGroup>
                <FormLabel>
                  <IconWrapper>
                    <User size={16} />
                  </IconWrapper>
                  Tên đầy đủ *
                </FormLabel>
                <FormInput
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập tên đầy đủ"
                  $hasError={!!errors.name}
                />
                {errors.name && <span style={{ color: "var(--error-500)", fontSize: "12px" }}>{errors.name}</span>}
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  <IconWrapper>
                    <Mail size={16} />
                  </IconWrapper>
                  Email *
                </FormLabel>
                <FormInput
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Nhập email"
                  $hasError={!!errors.email}
                />
                {errors.email && <span style={{ color: "var(--error-500)", fontSize: "12px" }}>{errors.email}</span>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <FormLabel>
                  <IconWrapper>
                    <Phone size={16} />
                  </IconWrapper>
                  Số điện thoại *
                </FormLabel>
                <FormInput
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Nhập số điện thoại"
                  $hasError={!!errors.phone}
                />
                {errors.phone && <span style={{ color: "var(--error-500)", fontSize: "12px" }}>{errors.phone}</span>}
              </FormGroup>

              <FormGroup>
                <FormLabel>Vai trò</FormLabel>
                <FormSelect
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </FormSelect>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <FormLabel>
                  <IconWrapper>
                    <Building size={16} />
                  </IconWrapper>
                  Phòng ban
                </FormLabel>
                <FormInput
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="Nhập phòng ban"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  <IconWrapper>
                    <Briefcase size={16} />
                  </IconWrapper>
                  Vị trí
                </FormLabel>
                <FormInput
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  placeholder="Nhập vị trí"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
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
              Lưu thay đổi
            </SaveButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditAccountModal;
