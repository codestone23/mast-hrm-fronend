"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
  BackToLogin,
  ResendSection,
  ResendText,
  ResendButton,
  ErrorMessage,
  Timer,
} from "./otpVerificationStyle";
import { Button } from "@/components/common";
import ROUTERS from "@/config/router";
import { authService } from "@/services/auth.service";
import SuccessModal from '@/components/common/SuccessModal/SuccessModal';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface OtpFormData {
  otp: string;
}

const OtpVerificationPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
    clearErrors
  } = useForm<OtpFormData>({
    defaultValues: {
      otp: ''
    },
    mode: 'onChange'
  });

  useEffect(() => {
    // Kiểm tra email parameter
    if (!email) {
      router.push(ROUTERS.AUTH.LOGIN);
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
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string, onChange: (value: string) => void) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số

    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1); // Chỉ lấy ký tự cuối
    setOtpDigits(newOtp);
    
    const otpValue = newOtp.join('');
    setValue('otp', otpValue);
    onChange(otpValue);

    if (error) {
      setError("");
      clearErrors();
    }

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Tự động submit khi nhập đủ 6 số
    if (newOtp.every((digit) => digit !== "") && otpValue.length === 6) {
      setTimeout(() => {
        onSubmit({ otp: otpValue });
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };


  const onSubmit = async (data: OtpFormData) => {
    const otpToVerify = data.otp;

    if (otpToVerify.length !== 6) {
      setError("Vui lòng nhập đủ 6 chữ số");
      return;
    }

    setError("");
    clearErrors();

    try {
      await authService.verifyOTP(otpToVerify, email);
      setShowSuccessModal(true);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message || apiError?.message || "Mã OTP không chính xác. Vui lòng thử lại.";
      setError(errorMessage);
      setOtpDigits(["", "", "", "", "", ""]);
      setValue('otp', '');
      reset();
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setError("");
    clearErrors();

    try {
      await authService.forgotPassword({ email });

      setTimeLeft(300);
      setCanResend(false);
      setOtpDigits(["", "", "", "", "", ""]);
      setValue('otp', '');
      reset();
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message || apiError?.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau.";
      setError(errorMessage);
    }
  };

  const handleBackToForgotPassword = () => {
    router.push(ROUTERS.AUTH.FORGOT_PASSWORD); 
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Chuyển hướng đến trang reset password với token
    router.push(`${ROUTERS.AUTH.RESET_PASSWORD}?token=${btoa(email + ":" + otpDigits.join(""))}`);
  };


  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 3) return email;

    const visiblePart = localPart.slice(0, 2);
    const hiddenPart = "*".repeat(localPart.length - 2);
    return `${visiblePart}${hiddenPart}@${domain}`;
  };

  if (!email) {
    return null; 
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
            Chúng tôi đã gửi mã xác thực 6 chữ số đến email{" "}
            <strong>{maskEmail(email)}</strong>
          </Subtitle>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Controller
              name="otp"
              control={control}
              rules={{
                required: 'Vui lòng nhập đủ 6 chữ số',
                validate: (value) => value.length === 6 || 'Vui lòng nhập đủ 6 chữ số'
              }}
              render={({ field: { onChange } }) => {
                const handlePasteWithOnChange = (e: React.ClipboardEvent) => {
                  e.preventDefault();
                  const pastedData = e.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  if (pastedData.length === 6) {
                    const newOtp = pastedData.split("");
                    setOtpDigits(newOtp);
                    setValue('otp', pastedData);
                    onChange(pastedData);
                    inputRefs.current[5]?.focus();
                  }
                };

                return (
                  <OtpInputGroup>
                    {otpDigits.map((digit, index) => (
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
                        onChange={(e) => handleOtpChange(index, e.target.value, onChange)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePasteWithOnChange : undefined}
                        disabled={isSubmitting}
                        autoComplete="one-time-code"
                      />
                    ))}
                  </OtpInputGroup>
                );
              }}
            />

            <Timer>
              Mã có hiệu lực trong: <span>{formatTime(timeLeft)}</span>
            </Timer>

            <Button 
              type="submit" 
              disabled={isSubmitting || otpDigits.join("").length !== 6}
              loading={isSubmitting}
              style={{ width: '100%' }}
            >
              {isSubmitting ? "Đang xác thực..." : "Xác thực OTP"}
            </Button>

            <ResendSection>
              <ResendText>Không nhận được mã?</ResendText>
              <ResendButton
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isSubmitting}
              >
                {canResend
                  ? "Gửi lại mã"
                  : `Gửi lại sau ${formatTime(timeLeft)}`}
              </ResendButton>
            </ResendSection>

            <BackToLogin
              as="button"
              type="button"
              onClick={handleBackToForgotPassword}
              disabled={isSubmitting}
            >
              <ArrowLeft
                size={16}
                style={{ marginRight: "0.5rem", display: "inline" }}
              />
              Quay lại
            </BackToLogin>
          </Form>
        </OtpCard>
      </LeftSection>

      <RightSection>
        <RightContent>
          <h1>Bảo mật</h1>
          <p>Mã OTP giúp bảo vệ tài khoản của bạn an toàn</p>
        </RightContent>
      </RightSection>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Xác thực thành công!"
        message="Mã OTP đã được xác thực thành công. Bạn sẽ được chuyển hướng đến trang đặt lại mật khẩu."
        buttonText="Tiếp tục"
        onButtonClick={handleSuccessModalClose}
      />
    </OtpContainer>
  );
};

export default OtpVerificationPage;
