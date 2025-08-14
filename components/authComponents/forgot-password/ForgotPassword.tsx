import React, { useState } from 'react';
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
  InputGroup,
  InputLabel,
  InputWrapper,
  Input,
  InputIcon,
  SubmitButton,
  BackToLogin,
  SuccessMessage,
  ErrorMessage
} from './forgotPasswordStyle';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Vui lòng nhập email của bạn');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
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

          {success ? (
            <div>
              <SuccessMessage>
                Email đã được gửi! Vui lòng kiểm tra hộp thư của bạn để đặt lại mật khẩu.
              </SuccessMessage>
              <BackToLogin as="button" type="button" onClick={onBackToLogin} style={{ marginTop: '1rem', display: 'block' }}>
                <ArrowLeft size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                Quay lại đăng nhập
              </BackToLogin>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <InputGroup>
                <InputLabel htmlFor="email">Email</InputLabel>
                <InputWrapper>
                  <InputIcon>
                    <Mail size={16} />
                  </InputIcon>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
              </SubmitButton>

              <BackToLogin as="button" type="button" onClick={onBackToLogin}>
                <ArrowLeft size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                Quay lại đăng nhập
              </BackToLogin>
            </Form>
          )}
        </ForgotPasswordCard>
      </LeftSection>

      <RightSection>
        <RightContent>
          <h1>Quên mật khẩu?</h1>
          <p>Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại mật khẩu</p>
        </RightContent>
      </RightSection>
    </ForgotPasswordContainer>
  );
};

export default ForgotPasswordPage;
