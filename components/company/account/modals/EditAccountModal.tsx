"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Input } from "@/components/common";
import { User as UserType, UpdateUserRequest } from "@/types/api";
import userService from "@/services/user.service";
import { useToast } from "@/hooks/useToast";
import { FormContainer } from "./modalStyle";

interface EditAccountFormData {
  name: string;
  email: string;
  phone: string;
}

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSave?: () => void; 
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const defaultValues: EditAccountFormData = useMemo(
    () => ({
      name: "",
      email: "",
      phone: "",
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditAccountFormData>({
    defaultValues: defaultValues,
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      userService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Cập nhật tài khoản thành công");
      if (onSave) {
        onSave();
      }
      handleClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật tài khoản");
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      const userInfo =
        user.user_information &&
        Array.isArray(user.user_information) &&
        user.user_information.length > 0
          ? (user.user_information[0] as {
              name?: string;
              phone?: string;
            })
          : null;

      reset({
        name: userInfo?.name || user.name || "",
        email: user.email || "",
        phone: userInfo?.phone || "",
      });
    }
  }, [isOpen, user, reset]);

  const onSubmit = (data: EditAccountFormData) => {
    if (!user) return;

    // Tách name thành firstName và lastName
    const nameParts = data.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const updateData: UpdateUserRequest = {
      firstName,
      lastName,
      phone: data.phone || undefined,
    };

    updateMutation.mutate({ userId: String(user.id), data: updateData });
  };

  const handleClose = () => {
    onClose();
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Chỉnh sửa tài khoản"
      size="lg"
      closable
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting || updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting || updateMutation.isPending}
            disabled={isSubmitting || updateMutation.isPending}
          >
            Cập nhật
          </Button>
        </>
      }
    >
      <FormContainer>
        <Input
          label="Tên đầy đủ"
          {...register("name", {
            required: "Tên là bắt buộc",
          })}
          placeholder="Nhập tên đầy đủ"
          error={errors.name?.message}
          required
          fullWidth
          disabled={isSubmitting || updateMutation.isPending}
        />

        <Input
          label="Email"
          type="email"
          {...register("email", {
            required: "Email là bắt buộc",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Email không hợp lệ",
            },
          })}
          placeholder="Nhập email"
          error={errors.email?.message}
          required
          fullWidth
          disabled={true}
        />

        <Input
          label="Số điện thoại"
          type="tel"
          {...register("phone")}
          placeholder="Nhập số điện thoại"
          fullWidth
          disabled={isSubmitting || updateMutation.isPending}
        />
      </FormContainer>
    </Modal>
  );
};

export default EditAccountModal;
