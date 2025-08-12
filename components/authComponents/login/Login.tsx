'use client';

import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { LoginContainer, LeftSection, LeftContent, RightSection, LoginCard, Logo, LogoText, LogoSubtext, Form, InputGroup, InputLabel, InputWrapper, InputIcon, PasswordToggle, LoginButton, ForgotPassword, ErrorMessage, Input } from './loginStyle';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    try {
      // Tạm thời sử dụng mock authentication
      if (formData.username === 'admin' && formData.password === 'admin123') {
        alert('Đăng nhập thành công! Chuyển hướng đến trang chính...');
        // Ở đây sẽ redirect đến overview page
        window.location.href = '/overview';
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LeftSection>
        <LeftContent>
          <h1>MAST HRM</h1>
          <p>Hệ thống quản lý nhân sự hiện đại</p>
        </LeftContent>
      </LeftSection>
      
      <RightSection>
        <LoginCard>
          <Logo>
            <LogoText>MAST</LogoText>
            <LogoSubtext>Hệ thống quản lý nhân sự</LogoSubtext>
          </Logo>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <InputGroup>
              <InputLabel htmlFor="username">Tên đăng nhập</InputLabel>
              <InputWrapper>
                <InputIcon>
                  <User size={16} />
                </InputIcon>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputLabel htmlFor="password">Mật khẩu</InputLabel>
              <InputWrapper>
                <InputIcon>
                  <Lock size={16} />
                </InputIcon>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </InputWrapper>
            </InputGroup>

            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </LoginButton>

            <ForgotPassword>Quên mật khẩu?</ForgotPassword>
          </Form>
        </LoginCard>
      </RightSection>
    </LoginContainer>
  );
};

export default Login;