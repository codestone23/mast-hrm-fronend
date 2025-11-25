"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, Briefcase, User } from "lucide-react";
import { Modal, Input, Button, Select, DatePicker } from "@/components/common";
import { formatDateForDisplay, parseDateFromDisplay, formatDateForAPI } from "@/utils/dateUtils";
import { useUpdateProfile } from "@/hooks/useProfileMutation";
import { useToast } from "@/hooks/useToast";
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
} from "./personalInfoModalStyles";

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PersonalInfoData;
  onSave?: (data: PersonalInfoData) => void;
}

interface PersonalInfoData {
  name: string;
  birthDate: string; 
  nationality: string;
  gender: string;
  phone: string;
  maritalStatus: string;
  temporaryAddress: string;
  permanentAddress: string;
  personalEmail: string;
  expertise: string;
}

const EditPersonalInfoModal: React.FC<EditPersonalInfoModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const defaultValues: PersonalInfoData = useMemo(
    () => ({
      name: "",
      birthDate: "",
      nationality: "",
      gender: "",
      phone: "",
      maritalStatus: "",
      temporaryAddress: "",
      permanentAddress: "",
      personalEmail: "",
      expertise: "",
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
  } = useForm<PersonalInfoData>({
    defaultValues: initialData || defaultValues,
  });

  const [error, setError] = useState("");
  const { success: showSuccessToast } = useToast();

  const formData = watch();
  const updateProfileMutation = useUpdateProfile();

  const genderOptions = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
  ];

  const maritalStatusOptions = [
    { value: "Chưa kết hôn", label: "Chưa kết hôn" },
    { value: "Đã kết hôn", label: "Đã kết hôn" },
    { value: "Ly hôn", label: "Ly hôn" }
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset(initialData || defaultValues);
      setError("");
    }
  }, [isOpen, initialData, reset, defaultValues]);

  const onSubmit = async (data: PersonalInfoData) => {
    setError("");

    try {
      // Convert form data to API format
      const apiData = {
        name: data.name,
        personal_email: data.personalEmail,
        nationality: data.nationality,
        gender: data.gender,
        marital: data.maritalStatus,
        birthday: data.birthDate ? formatDateForAPI(parseDateFromDisplay(data.birthDate)) : undefined,
        address: data.permanentAddress,
        temp_address: data.temporaryAddress,
        phone: data.phone,
        expertise: data.expertise,
      };

      await updateProfileMutation.mutateAsync(apiData);

      // Show success toast
      showSuccessToast("Thông tin cá nhân đã được cập nhật thành công!", "Thành công");
      
      if (onSave) {
        onSave(data);
      }

      // Close modal immediately after success
      handleClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Chỉnh sửa thông tin cá nhân"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting || updateProfileMutation.isPending}
            disabled={isSubmitting || updateProfileMutation.isPending}
          >
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <ModalContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormSection>
          <h4>Thông tin cơ bản</h4>
          <FormGrid>
            <Input
              label="Tên"
              {...register("name", {
                required: "Vui lòng nhập tên",
              })}
              placeholder="Nhập tên đầy đủ"
              icon={<User size={16} />}
              required
              disabled={isSubmitting}
              error={errors.name?.message}
            />

            <DatePicker
              label="Ngày sinh"
              value={parseDateFromDisplay(formData.birthDate)}
              onChange={(date) =>
                setValue("birthDate", formatDateForDisplay(date))
              }
              mode="date"
              allowInput={true}
              placeholder="DD/MM/YYYY"
              required
              disabled={isSubmitting}
            />

            <Input
              label="Quốc tịch"
              {...register("nationality", {
                required: "Vui lòng nhập quốc tịch",
              })}
              placeholder="Nhập quốc tịch"
              icon={<MapPin size={16} />}
              required
              disabled={isSubmitting}
              error={errors.nationality?.message}
            />

            <Select
              label="Giới tính"
              value={formData.gender}
              onChange={(value) => setValue("gender", String(value))}
              options={genderOptions}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Chuyên môn"
              {...register("expertise", {
                required: "Vui lòng nhập chuyên môn",
              })}
              placeholder="Nhập chuyên môn"
              icon={<Briefcase size={16} />}
              required
              disabled={isSubmitting}
              error={errors.expertise?.message}
            />
          </FormGrid>
        </FormSection>

        <FormSection>
          <h4>Thông tin liên lạc</h4>
          <FormGrid>
            <Input
              label="Số điện thoại"
              type="tel"
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
              placeholder="Nhập số điện thoại (10-11 số)"
              icon={<Phone size={16} />}
              required
              disabled={isSubmitting}
              error={errors.phone?.message}
            />

            <Input
              label="Email cá nhân"
              type="email"
              {...register("personalEmail", {
                required: "Vui lòng nhập email cá nhân",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email không hợp lệ",
                },
              })}
              placeholder="Nhập email cá nhân"
              icon={<Mail size={16} />}
              required
              disabled={isSubmitting}
              error={errors.personalEmail?.message}
            />
            <Select
              label="Tình trạng hôn nhân"
              value={formData.maritalStatus}
              onChange={(value) => setValue("maritalStatus", String(value))}
              options={maritalStatusOptions}
              required
              disabled={isSubmitting}
            />
          </FormGrid>
        </FormSection>

        <FormSection>
          <h4>Địa chỉ</h4>
          <FormGrid>
            <Input
              label="Địa chỉ tạm trú"
              {...register("temporaryAddress")}
              placeholder="Nhập địa chỉ tạm trú"
              icon={<MapPin size={16} />}
              disabled={isSubmitting}
            />

            <Input
              label="Địa chỉ thường trú"
              {...register("permanentAddress")}
              placeholder="Nhập địa chỉ thường trú"
              icon={<MapPin size={16} />}
              disabled={isSubmitting}
            />
          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default EditPersonalInfoModal;
