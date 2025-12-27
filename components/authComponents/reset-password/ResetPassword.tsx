"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import {
  ResetPasswordContainer,
  LeftSection,
  RightSection,
  RightContent,
  ResetPasswordCard,
  Logo,
  LogoText,
  LogoSubtext,
  Title,
  Subtitle,
  Form,
  PasswordStrengthIndicator,
  PasswordStrengthBar,
  PasswordStrengthText,
  PasswordRequirements,
  RequirementItem,
  BackToLogin,
  ErrorMessage,
  SuccessMessage
} from './resetPasswordStyle';
import { Input, Button } from '@/components/common';
import { authService } from '@/services/auth.service';
import { ResetPasswordRequest } from '@/types/api';
import { getPasswordStrength } from "@/utils/help";

interface ResetPasswordProps {
  token: string;
  onBackToLogin: () => void;
  onPasswordReset: () => void;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ 
  token,
  onBackToLogin, 
  onPasswordReset 
}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError: setFormError,
    clearErrors
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  });

  const password = watch('password');

  const passwordStrength = getPasswordStrength(password || '');

  const passwordRequirements = [
    { text: 'Ít nhất 8 ký tự', met: (password || '').length >= 8 },
    { text: 'Chứa chữ thường', met: /[a-z]/.test(password || '') },
    { text: 'Chứa chữ hoa', met: /[A-Z]/.test(password || '') },
    { text: 'Chứa số', met: /\d/.test(password || '') },
    { text: 'Chứa ký tự đặc biệt', met: /[^A-Za-z0-9]/.test(password || '') }
  ];

  const validatePasswordStrength = (password: string): boolean => {
    const strength = getPasswordStrength(password);
    return strength.score >= 3;
  };

  const validatePasswordMatch = (confirmPassword: string, formValues: ResetPasswordFormData): boolean => {
    return confirmPassword === formValues.password;
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError('');
    clearErrors();

    if (!validatePasswordStrength(data.password)) {
      setFormError('password', {
        type: 'manual',
        message: 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn'
      });
      return;
    }

    try {
      // Decode token để lấy email và OTP
      const decodedToken = atob(token);
      const [email, otp] = decodedToken.split(':');
      
      const resetData: ResetPasswordRequest = {
        email: email,
        otp: otp,
        newPassword: data.password
      };

      await authService.resetPassword(resetData);
      
      setSuccess(true);
      setTimeout(() => {
        onPasswordReset();
      }, 2000);
    } catch (error: unknown) {
      console.error(error);
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      setError(errorMessage);
    }
  };

  return (
    <ResetPasswordContainer>
      <LeftSection>
        <ResetPasswordCard>
          <Logo>
            <LogoText>MAST</LogoText>
            <LogoSubtext>Hệ thống quản lý nhân sự</LogoSubtext>
          </Logo>

          <Title>Đặt lại mật khẩu</Title>
          <Subtitle>
            Nhập mật khẩu mới cho tài khoản của bạn
          </Subtitle>

          {success ? (
            <div>
              <SuccessMessage>
                <CheckCircle size={24} style={{ marginRight: '0.5rem' }} />
                Mật khẩu đã được đặt lại thành công! Đang chuyển hướng đến trang đăng nhập...
              </SuccessMessage>
            </div>
          ) : (
            <Form onSubmit={handleSubmit(onSubmit)}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <div>
                <Input
                  label="Mật khẩu mới"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  {...register('password', {
                    required: 'Vui lòng nhập mật khẩu mới',
                    validate: {
                      strength: (value) => 
                        validatePasswordStrength(value) || 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn'
                    }
                  })}
                  icon={<Lock size={16} />}
                  required
                  disabled={isSubmitting}
                  error={errors.password?.message}
                />
                
                {password && (
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
              </div>

              <Input
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                {...register('confirmPassword', {
                  required: 'Vui lòng xác nhận mật khẩu mới',
                  validate: (value, formValues) => 
                    validatePasswordMatch(value, formValues) || 'Mật khẩu xác nhận không khớp'
                })}
                icon={<Lock size={16} />}
                required
                disabled={isSubmitting}
                error={errors.confirmPassword?.message}
              />

              <Button 
                type="submit" 
                disabled={isSubmitting || passwordStrength.score < 3}
                loading={isSubmitting}
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </Button>

              <BackToLogin as="button" type="button" onClick={onBackToLogin} disabled={isSubmitting}>
                <ArrowLeft size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                Quay lại đăng nhập
              </BackToLogin>
            </Form>
          )}
        </ResetPasswordCard>
      </LeftSection>

      <RightSection>
        <RightContent>
          <h1>Bảo mật</h1>
          <p>Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn</p>
        </RightContent>
      </RightSection>
    </ResetPasswordContainer>
  );
};

export default ResetPassword;
