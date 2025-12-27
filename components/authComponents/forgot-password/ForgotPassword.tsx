import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
import {
  ForgotPasswordContainer,
  LeftSection,
  RightSection,
  RightContent,
  ForgotPasswordCard,
  Logo,
  LogoText,
  LogoSubtext,
  Title,
  Subtitle,
  Form,
  BackToLogin,
  ErrorMessage
} from './forgotPasswordStyle';
import { Input, Button } from '@/components/common';
import { authService } from '@/services/auth.service';
import SuccessModal from '@/components/common/SuccessModal/SuccessModal';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onEmailSent?: (email: string) => void;
}

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage: React.FC<ForgotPasswordProps> = ({ onBackToLogin, onEmailSent }) => {
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: ''
    },
    mode: 'onChange'
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError('');
    clearErrors();

    try {
      await authService.forgotPassword({ email: data.email });
      setSubmittedEmail(data.email);
      setShowSuccessModal(true);
      reset();
    } catch {
      const errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      setError(errorMessage);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Chuyển sang màn OTP nếu có callback
    if (onEmailSent) {
      onEmailSent(submittedEmail);
    }
    setSubmittedEmail('');
  };

  return (
    <ForgotPasswordContainer>
      <LeftSection>
        <ForgotPasswordCard>
          <Logo>
            <LogoText>MAST</LogoText>
            <LogoSubtext>Hệ thống quản lý nhân sự</LogoSubtext>
          </Logo>

          <Title>Quên mật khẩu?</Title>
          <Subtitle>
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </Subtitle>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Input
              label="Email"
              type="email"
              placeholder="Nhập email của bạn"
              {...register('email', {
                required: 'Vui lòng nhập email của bạn',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email không hợp lệ'
                }
              })}
              icon={<Mail size={16} />}
              required
              disabled={isSubmitting}
              error={errors.email?.message}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting}
              loading={isSubmitting}
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
            </Button>

            <BackToLogin as="button" type="button" onClick={onBackToLogin} disabled={isSubmitting}>
              <ArrowLeft size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Quay lại đăng nhập
            </BackToLogin>
          </Form>
        </ForgotPasswordCard>
      </LeftSection>

      <RightSection>
        <RightContent>
          <h1>Quên mật khẩu?</h1>
          <p>Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại mật khẩu</p>
        </RightContent>
      </RightSection>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Email đã được gửi!"
        message="Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn."
        buttonText="Tiếp tục"
        onButtonClick={handleSuccessModalClose}
      />
    </ForgotPasswordContainer>
  );
};

export default ForgotPasswordPage;
