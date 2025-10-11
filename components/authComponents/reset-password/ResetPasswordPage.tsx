'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
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
  InputGroup,
  InputLabel,
  InputWrapper,
  Input,
  InputIcon,
  TogglePasswordButton,
  PasswordStrengthIndicator,
  PasswordStrengthBar,
  PasswordStrengthText,
  PasswordRequirements,
  RequirementItem,
  SubmitButton,
  BackToLogin,
  ErrorMessage,
  SuccessMessage
} from './resetPasswordStyle';
import ROUTERS from "@/config/router";
import { authService } from '@/services/auth.service';


interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Kiểm tra token khi component mount
    const validateToken = async () => {
      if (!token) {
        setError('Token không hợp lệ hoặc đã hết hạn');
        setTokenValid(false);
        return;
      }

    try {
      // Decode token để lấy email và OTP
      const decodedToken = atob(token!);
      const [email, otp] = decodedToken.split(':');
      
      if (email && otp) {
        setTokenValid(true);
      } else {
        setError('Token không hợp lệ hoặc đã hết hạn');
        setTokenValid(false);
      }
    } catch {
      setError('Token không hợp lệ hoặc đã hết hạn');
      setTokenValid(false);
    }
    };

    validateToken();
  }, [token]);

  const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const strengthMap = {
      0: { label: 'Rất yếu', color: '#ef4444' },
      1: { label: 'Yếu', color: '#f97316' },
      2: { label: 'Trung bình', color: '#eab308' },
      3: { label: 'Mạnh', color: '#22c55e' },
      4: { label: 'Rất mạnh', color: '#16a34a' },
      5: { label: 'Cực mạnh', color: '#15803d' }
    };

    return { score, ...strengthMap[score as keyof typeof strengthMap] };
  };

  const passwordStrength = getPasswordStrength(password);

  const passwordRequirements = [
    { text: 'Ít nhất 8 ký tự', met: password.length >= 8 },
    { text: 'Chứa chữ thường', met: /[a-z]/.test(password) },
    { text: 'Chứa chữ hoa', met: /[A-Z]/.test(password) },
    { text: 'Chứa số', met: /\d/.test(password) },
    { text: 'Chứa ký tự đặc biệt', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Decode token để lấy email và OTP
      const decodedToken = atob(token!);
      const [email, otp] = decodedToken.split(':');
      
      await authService.resetPassword({
        email: email,
        otp: otp,
        newPassword: password
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push(ROUTERS.AUTH.LOGIN + '?message=password-reset-success');
      }, 2500);
    } catch {
      const errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error) setError('');
  };

  const handleBackToLogin = () => {
    router.push(ROUTERS.AUTH.LOGIN);
  };

  // Loading state khi đang validate token
  if (tokenValid === null) {
    return (
      <ResetPasswordContainer>
        <LeftSection>
          <ResetPasswordCard>
            <Logo>
              <LogoText>MAST</LogoText>
              <LogoSubtext>Hệ thống quản lý nhân sự</LogoSubtext>
            </Logo>
            <Title>Đang xác thực...</Title>
            <Subtitle>Vui lòng đợi trong giây lát</Subtitle>
          </ResetPasswordCard>
        </LeftSection>
        <RightSection>
          <RightContent>
            <h1>Bảo mật</h1>
            <p>Đang xác thực yêu cầu của bạn</p>
          </RightContent>
        </RightSection>
      </ResetPasswordContainer>
    );
  }

  // Token không hợp lệ
  if (tokenValid === false) {
    return (
      <ResetPasswordContainer>
        <LeftSection>
          <ResetPasswordCard>
            <Logo>
              <LogoText>MAST</LogoText>
              <LogoSubtext>Hệ thống quản lý nhân sự</LogoSubtext>
            </Logo>
            <Title>Liên kết không hợp lệ</Title>
            <Subtitle>
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn
            </Subtitle>
            <ErrorMessage>{error}</ErrorMessage>
            <SubmitButton onClick={handleBackToLogin}>
              <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
              Quay lại đăng nhập
            </SubmitButton>
          </ResetPasswordCard>
        </LeftSection>
        <RightSection>
          <RightContent>
            <h1>Hết hạn</h1>
            <p>Vui lòng yêu cầu liên kết mới</p>
          </RightContent>
        </RightSection>
      </ResetPasswordContainer>
    );
  }

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
            <Form onSubmit={handleSubmit}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <InputGroup>
                <InputLabel htmlFor="password">Mật khẩu mới</InputLabel>
                <InputWrapper>
                  <InputIcon>
                    <Lock size={16} />
                  </InputIcon>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <TogglePasswordButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </TogglePasswordButton>
                </InputWrapper>
                
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
              </InputGroup>

              <InputGroup>
                <InputLabel htmlFor="confirmPassword">Xác nhận mật khẩu</InputLabel>
                <InputWrapper>
                  <InputIcon>
                    <Lock size={16} />
                  </InputIcon>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                  <TogglePasswordButton
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </TogglePasswordButton>
                </InputWrapper>
              </InputGroup>

              <SubmitButton type="submit" disabled={isLoading || passwordStrength.score < 3}>
                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </SubmitButton>

              <BackToLogin as="button" type="button" onClick={handleBackToLogin}>
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

export default ResetPasswordPage;
