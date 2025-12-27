"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Input } from "@/components/common";
import { FormContainer, FormGrid } from "./modalStyle";

interface CreateAccountData {
  name: string;
  email: string;
  password: string;
}

interface CreateAccountFormData extends CreateAccountData {
  confirmPassword: string;
}

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: CreateAccountData) => void;
  isLoading?: boolean;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateAccountFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password");

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: CreateAccountFormData) => {
    onSave({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo tài khoản mới"
      size="lg"
      closable
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
          >
            Tạo tài khoản
          </Button>
        </>
      }
    >
      <FormContainer>
        <FormGrid>
          <Input
            label="Tên đầy đủ"
            {...register("name", {
              required: "Tên là bắt buộc",
            })}
            placeholder="Nhập tên đầy đủ"
            error={errors.name?.message}
            required
            fullWidth
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </FormGrid>

        <Input
          label="Mật khẩu"
          type="password"
          {...register("password", {
            required: "Mật khẩu là bắt buộc",
            minLength: {
              value: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự",
            },
          })}
          placeholder="Nhập mật khẩu"
          error={errors.password?.message}
          required
          fullWidth
          disabled={isLoading}
        />

        <Input
          label="Xác nhận mật khẩu"
          type="password"
          {...register("confirmPassword", {
            required: "Vui lòng xác nhận mật khẩu",
            validate: (value) =>
              value === password || "Mật khẩu xác nhận không khớp",
          })}
          placeholder="Nhập lại mật khẩu"
          error={errors.confirmPassword?.message}
          required
          fullWidth
          disabled={isLoading}
        />
      </FormContainer>
    </Modal>
  );
};

export default CreateAccountModal;
