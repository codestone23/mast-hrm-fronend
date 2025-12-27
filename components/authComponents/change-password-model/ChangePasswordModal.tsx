'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Modal, Button, Input } from '@/components/common';
import { authService } from '@/services/auth.service';
import { ChangePasswordRequest } from '@/types/api';
import { useToast } from '@/hooks/useToast';
import {
  ModalContent,
  FormSection,
  PasswordStrengthIndicator,
  PasswordStrengthBar,
  PasswordStrengthText,
  PasswordRequirements,
  RequirementItem,
  ErrorMessage
} from './changePasswordModalStyle';
import { getPasswordStrength } from "@/utils/help";

export interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose
}) => {
  const [error, setError] = useState('');
  const { success: showSuccessToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setError: setFormError,
    clearErrors
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  });

  const newPassword = watch('newPassword');

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data),
    onSuccess: () => {
      showSuccessToast('Đổi mật khẩu thành công!');
      handleClose();
    },
    onError: (error: unknown) => {
      console.error('Change password error:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại sau.';
      setError(errorMessage);
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError('');
      clearErrors();
    }
  }, [isOpen, reset]);

  const passwordStrength = getPasswordStrength(newPassword || '');

  const passwordRequirements = [
    { text: 'Ít nhất 8 ký tự', met: (newPassword || '').length >= 8 },
    { text: 'Chứa chữ thường', met: /[a-z]/.test(newPassword || '') },
    { text: 'Chứa chữ hoa', met: /[A-Z]/.test(newPassword || '') },
    { text: 'Chứa số', met: /\d/.test(newPassword || '') },
    { text: 'Chứa ký tự đặc biệt', met: /[^A-Za-z0-9]/.test(newPassword || '') }
  ];

  const validatePasswordStrength = (password: string): boolean => {
    const strength = getPasswordStrength(password);
    return strength.score >= 3;
  };

  const validatePasswordMatch = (confirmPassword: string, formValues: ChangePasswordFormData): boolean => {
    return confirmPassword === formValues.newPassword;
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError('');
    clearErrors();

    if (data.currentPassword === data.newPassword) {
      setFormError('newPassword', {
        type: 'manual',
        message: 'Mật khẩu mới phải khác mật khẩu hiện tại'
      });
      return;
    }

    if (!validatePasswordStrength(data.newPassword)) {
      setFormError('newPassword', {
        type: 'manual',
        message: 'Mật khẩu mới quá yếu. Vui lòng chọn mật khẩu mạnh hơn'
      });
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
  };

  const handleClose = () => {
    reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    clearErrors();
    changePasswordMutation.reset();
    onClose();
  };

  const isLoading = isSubmitting || changePasswordMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Đổi mật khẩu"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
          </Button>
        </>
      }
    >
      <ModalContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormSection>
          <Input
            label="Mật khẩu hiện tại"
            type="password"
            placeholder="Nhập mật khẩu hiện tại"
            {...register('currentPassword', {
              required: 'Vui lòng nhập mật khẩu hiện tại'
            })}
            icon={<Lock size={16} />}
            required
            disabled={isLoading}
            error={errors.currentPassword?.message}
          />
        </FormSection>

        <FormSection>
          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="Nhập mật khẩu mới"
            {...register('newPassword', {
              required: 'Vui lòng nhập mật khẩu mới',
              validate: {
                strength: (value) => 
                  validatePasswordStrength(value) || 'Mật khẩu mới quá yếu. Vui lòng chọn mật khẩu mạnh hơn'
              }
            })}
            icon={<Lock size={16} />}
            required
            disabled={isLoading}
            error={errors.newPassword?.message}
          />

          {newPassword && (
            <>
              <PasswordStrengthIndicator>
                <PasswordStrengthBar 
                  strength={passwordStrength.score}
                  color={passwordStrength.color}
                />
                <PasswordStrengthText color={passwordStrength.color}>
                  {passwordStrength.label}
                </PasswordStrengthText>
              </PasswordStrengthIndicator>
              
              <PasswordRequirements>
                {passwordRequirements.map((req, index) => (
                  <RequirementItem key={index} $met={req.met}>
                    <CheckCircle size={14} />
                    {req.text}
                  </RequirementItem>
                ))}
              </PasswordRequirements>
            </>
          )}
        </FormSection>

        <FormSection>
          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            {...register('confirmPassword', {
              required: 'Vui lòng xác nhận mật khẩu mới',
              validate: (value, formValues) => 
                validatePasswordMatch(value, formValues) || 'Mật khẩu xác nhận không khớp'
            })}
            icon={<Lock size={16} />}
            required
            disabled={isLoading}
            error={errors.confirmPassword?.message}
          />
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;
