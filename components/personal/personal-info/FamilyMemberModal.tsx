"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, Users } from "lucide-react";
import { Modal, Input, Button, Select, DatePicker } from "@/components/common";
import { formatDateForAPI, parseDateFromAPI } from "@/utils/dateUtils";
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  SuccessMessage,
} from "./personalInfoModalStyles";

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: FamilyMemberData;
  onSave?: (data: FamilyMemberData) => void;
}

interface FamilyMemberData {
  id: string;
  name: string;
  relationship: string;
  gender: string;
  birthDate: string;
  phone: string;
  dependent: string;
  notes: string;
}

const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<FamilyMemberData>({
    id: "",
    name: "",
    relationship: "",
    gender: "",
    birthDate: "",
    phone: "",
    dependent: "Không",
    notes: "N/A",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: "",
        name: "",
        relationship: "",
        gender: "",
        birthDate: "",
        phone: "",
        dependent: "Không",
        notes: "N/A",
      });
    }
  }, [initialData, isOpen]);

  const relationshipOptions = [
    { value: "Bố", label: "Bố" },
    { value: "Mẹ", label: "Mẹ" },
    { value: "Vợ", label: "Vợ" },
    { value: "Chồng", label: "Chồng" },
    { value: "Con trai", label: "Con trai" },
    { value: "Con gái", label: "Con gái" },
    { value: "Anh trai", label: "Anh trai" },
    { value: "Chị gái", label: "Chị gái" },
    { value: "Em trai", label: "Em trai" },
    { value: "Em gái", label: "Em gái" },
    { value: "Ông", label: "Ông" },
    { value: "Bà", label: "Bà" },
  ];

  const genderOptions = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
  ];

  const dependentOptions = [
    { value: "Có", label: "Có" },
    { value: "Không", label: "Không" },
  ];

  const handleInputChange = (field: keyof FamilyMemberData, value: string) => {
    setError(""); // Clear error on input change
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      setError("Vui lòng nhập họ và tên");
      return;
    }
    if (!formData.relationship) {
      setError("Vui lòng chọn mối quan hệ");
      return;
    }
    if (!formData.gender) {
      setError("Vui lòng chọn giới tính");
      return;
    }
    if (!formData.birthDate) {
      setError("Vui lòng nhập ngày sinh");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
      if (onSave) {
        const dataToSave = {
          ...formData,
          id: initialData?.id || `family_${Date.now()}`,
        };
        onSave(dataToSave);
      }

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const isSubmitDisabled =
    isLoading ||
    !formData.name ||
    !formData.relationship ||
    !formData.gender ||
    !formData.birthDate;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        mode === "add"
          ? "Thêm thông tin thân nhân"
          : "Chỉnh sửa thông tin thân nhân"
      }
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
          >
            {mode === "add" ? "Thêm thân nhân" : "Lưu thay đổi"}
          </Button>
        </>
      }
    >
      <ModalContent>
        {success ? (
          <SuccessMessage>
            <Users size={24} style={{ marginRight: "0.5rem" }} />
            {mode === "add"
              ? "Thông tin thân nhân đã được thêm thành công!"
              : "Thông tin thân nhân đã được cập nhật thành công!"}
          </SuccessMessage>
        ) : (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormSection>
              <FormGrid>
                <Input
                  label="Họ và tên"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  icon={<User size={16} />}
                  placeholder="Nhập họ và tên"
                  required
                  disabled={isLoading}
                />

                <Select
                  label="Mối quan hệ"
                  value={formData.relationship}
                  onChange={(value) =>
                    handleInputChange("relationship", String(value))
                  }
                  options={relationshipOptions}
                  placeholder="Chọn mối quan hệ"
                  required
                  disabled={isLoading}
                />

                <Select
                  label="Giới tính"
                  value={formData.gender}
                  onChange={(value) =>
                    handleInputChange("gender", String(value))
                  }
                  options={genderOptions}
                  placeholder="Chọn giới tính"
                  required
                  disabled={isLoading}
                />

                <DatePicker
                  label="Ngày sinh"
                  value={parseDateFromAPI(formData.birthDate)}
                  onChange={(date) => handleInputChange("birthDate", formatDateForAPI(date))}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Số điện thoại"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  icon={<Phone size={16} />}
                  placeholder="Nhập số điện thoại"
                  disabled={isLoading}
                />

                <Select
                  label="Người phụ thuộc"
                  value={formData.dependent}
                  onChange={(value) =>
                    handleInputChange("dependent", String(value))
                  }
                  options={dependentOptions}
                  required
                  disabled={isLoading}
                />
              </FormGrid>
            </FormSection>

            <FormSection>
              <Input
                label="Ghi nhận phụ thuộc"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Nhập ghi chú (tùy chọn)"
                disabled={isLoading}
              />
            </FormSection>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FamilyMemberModal;
