'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import {
  OtpContainer,
  LeftSection,
  RightSection,
  RightContent,
  OtpCard,
  Logo,
  LogoText,
  LogoSubtext,
  Title,
  Subtitle,
  Form,
  OtpInputGroup,
  OtpInput,
  SubmitButton,
  BackToLogin,
  ResendSection,
  ResendText,
  ResendButton,
  SuccessMessage,
  ErrorMessage,
  Timer
} from './otpVerificationStyle';

const OtpVerificationPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Kiểm tra email parameter
    if (!email) {
      router.push('/login');
      return;
    }
  }, [email, router]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Focus vào ô input đầu tiên khi component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Chỉ lấy ký tự cuối
    setOtp(newOtp);
    
    if (error) setError('');

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Tự động submit khi nhập đủ 6 số
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      setTimeout(() => handleSubmit(newOtp.join('')), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (otpValue?: string) => {
    const otpToVerify = otpValue || otp.join('');
    
    if (otpToVerify.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate validation
      if (otpToVerify === '123456') {
        setSuccess(true);
        // Chuyển hướng đến trang reset password với token
        setTimeout(() => {
          router.push(`/reset-password?token=${btoa(email + ':' + otpToVerify)}`);
        }, 1500);
      } else {
        setError('Mã OTP không chính xác. Vui lòng thử lại.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) return email;
    
    const visiblePart = localPart.slice(0, 2);
    const hiddenPart = '*'.repeat(localPart.length - 2);
    return `${visiblePart}${hiddenPart}@${domain}`;
  };

  if (!email) {
    return null; // hoặc loading component
  }

  return (
    <OtpContainer>
      <LeftSection>
        <OtpCard>
          <Logo>
            <LogoText>MAST</LogoText>
            <LogoSubtext>Hệ thống quản lý nhân sự</LogoSubtext>
          </Logo>

          <Title>Xác thực OTP</Title>
          <Subtitle>
            Chúng tôi đã gửi mã xác thực 6 chữ số đến email <strong>{maskEmail(email)}</strong>
          </Subtitle>

          {success ? (
            <SuccessMessage>
              <Shield size={24} style={{ marginRight: '0.5rem' }} />
              Xác thực thành công! Đang chuyển hướng đến trang đặt lại mật khẩu...
            </SuccessMessage>
          ) : (
            <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <OtpInputGroup>
                {otp.map((digit, index) => (
                  <OtpInput
                    key={index}
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isLoading}
                    autoComplete="one-time-code"
                  />
                ))}
              </OtpInputGroup>

              <Timer>
                Mã có hiệu lực trong: <span>{formatTime(timeLeft)}</span>
              </Timer>

              <SubmitButton type="submit" disabled={isLoading || otp.join('').length !== 6}>
                {isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
              </SubmitButton>

              <ResendSection>
                <ResendText>Không nhận được mã?</ResendText>
                <ResendButton
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || isLoading}
                >
                  {canResend ? 'Gửi lại mã' : `Gửi lại sau ${formatTime(timeLeft)}`}
                </ResendButton>
              </ResendSection>

              <BackToLogin as="button" type="button" onClick={handleBackToForgotPassword}>
                <ArrowLeft size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                Quay lại
              </BackToLogin>
            </Form>
          )}
        </OtpCard>
      </LeftSection>

      <RightSection>
        <RightContent>
          <h1>Bảo mật</h1>
          <p>Mã OTP giúp bảo vệ tài khoản của bạn an toàn</p>
        </RightContent>
      </RightSection>
    </OtpContainer>
  );
};

export default OtpVerificationPage;
