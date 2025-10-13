"use client";

import React, { useState } from "react";
import { X, User, Mail, Lock, Phone, Building, Briefcase } from "lucide-react";
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

interface AccountData {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  department: string;
  position: string;
  status: "active" | "inactive";
}

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: AccountData) => void;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
    phone: "",
    department: "",
    position: "",
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
      newErrors.name = "Tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        status: "active",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "User",
        phone: "",
        department: "",
        position: "",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "User",
      phone: "",
      department: "",
      position: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Tạo tài khoản mới</ModalTitle>
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
                    <Lock size={16} />
                  </IconWrapper>
                  Mật khẩu *
                </FormLabel>
                <FormInput
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Nhập mật khẩu"
                  $hasError={!!errors.password}
                />
                {errors.password && <span style={{ color: "var(--error-500)", fontSize: "12px" }}>{errors.password}</span>}
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  <IconWrapper>
                    <Lock size={16} />
                  </IconWrapper>
                  Xác nhận mật khẩu *
                </FormLabel>
                <FormInput
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  $hasError={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <span style={{ color: "var(--error-500)", fontSize: "12px" }}>{errors.confirmPassword}</span>}
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
          </ModalBody>

          <ModalFooter>
            <CancelButton type="button" onClick={handleClose}>
              Hủy
            </CancelButton>
            <SaveButton type="submit">
              Tạo tài khoản
            </SaveButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateAccountModal;
