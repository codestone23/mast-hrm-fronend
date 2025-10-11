"use client";

import React, { useState } from 'react';
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

const ResetPassword: React.FC<ResetPasswordProps> = ({ 
  token, 
  onBackToLogin, 
  onPasswordReset 
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setTimeout(() => {
        onPasswordReset();
      }, 2000);
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
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

              <BackToLogin as="button" type="button" onClick={onBackToLogin}>
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
