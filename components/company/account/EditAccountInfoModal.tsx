"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Mail, User } from "lucide-react";
import { Modal, Input, Button } from "@/components/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "@/services/user.service";
import { UpdateUserRequest } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
} from "@/components/personal/personal-info/personalInfoModalStyles";

interface EditAccountInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialData?: PersonalInfoData;
  onSave?: () => void;
}

interface PersonalInfoData {
  name: string;
  email: string;
}

const EditAccountInfoModal: React.FC<EditAccountInfoModalProps> = ({
  isOpen,
  onClose,
  userId,
  initialData,
  onSave,
}) => {
  const defaultValues: PersonalInfoData = useMemo(
    () => ({
      name: "",
      email: "",
    }),
    []
  );

  console.log(initialData);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PersonalInfoData>({
    defaultValues: initialData || defaultValues,
  });

  const [error, setError] = useState("");
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => userService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-detail', userId] });
      showSuccessToast("Thông tin tài khoản đã được cập nhật thành công!", "Thành công");
      if (onSave) {
        onSave();
      }
      handleClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
      setError(errorMessage);
      showErrorToast(errorMessage, "Lỗi");
    },
  });

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
      const apiData: UpdateUserRequest = {
        name: data.name,
        email: data.email,
      };

      await updateUserMutation.mutateAsync(apiData);
    } catch (error) {
      console.error('Error updating user:', error);
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
      title="Chỉnh sửa thông tin tài khoản"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting || updateUserMutation.isPending}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting || updateUserMutation.isPending}
            disabled={isSubmitting || updateUserMutation.isPending}
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
              icon={<User size={16} />}
              required
              disabled={isSubmitting || updateUserMutation.isPending}
              error={errors.name?.message}
              placeholder="Nhập tên"
            />

            <Input
              label="Email"
              type="email"
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
              icon={<Mail size={16} />}
              required
              disabled={isSubmitting || updateUserMutation.isPending}
              error={errors.email?.message}
              placeholder="Nhập email"
            />
          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default EditAccountInfoModal;

