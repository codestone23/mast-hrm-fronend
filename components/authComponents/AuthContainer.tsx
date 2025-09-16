'use client';

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Login from './login/Login';
import ForgotPassword from './forgot-password/ForgotPassword';

const Container = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const SlideContainer = styled.div<{ $isVisible: boolean; direction: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  
${({ $isVisible, direction }) => {
    if ($isVisible) {
      return css`
        transform: translateX(0);
        opacity: 1;
        z-index: 2;
      `;
    } else {
      return css`
        transform: translateX(${direction === 'left' ? '-100%' : '33.333%'});
        opacity: 0;
        z-index: 1;
      `;
    }
  }}
`;

export enum AuthView {
  LOGIN = 'login',
  FORGOT = 'forgot'
}

interface AuthContainerProps {
  forgot?: string;
}

const AuthContainer = (props: AuthContainerProps) => {
  const { forgot } = props;
  const [currentView, setCurrentView] = useState<AuthView>(forgot ? AuthView.FORGOT : AuthView.LOGIN);

  const switchToForgotPassword = () => {
    setCurrentView(AuthView.FORGOT);
  };

  const switchToLogin = () => {
    setCurrentView(AuthView.LOGIN);
  };

  const handleForgotPasswordSuccess = (userEmail: string) => {
    // Redirect đến trang OTP với email parameter
    window.location.href = `/verify-otp?email=${encodeURIComponent(userEmail)}`;
  };

  const viewOrder = {
    [AuthView.LOGIN]: 0,
    [AuthView.FORGOT]: 1
  };

  const getSlideDirection = (view: AuthView): 'left' | 'right' => {
    const currentIndex = viewOrder[currentView];
    const targetIndex = viewOrder[view];
    return currentIndex < targetIndex ? 'right' : 'left';
  };

  return (
    <Container>
      <SlideContainer 
        $isVisible={currentView === AuthView.LOGIN} 
        direction={getSlideDirection(AuthView.LOGIN)}
      >
        <Login onForgotPassword={switchToForgotPassword} />
      </SlideContainer>
      
      <SlideContainer 
        $isVisible={currentView === AuthView.FORGOT} 
        direction={getSlideDirection(AuthView.FORGOT)}
      >
        <ForgotPassword 
          onBackToLogin={switchToLogin}
          onEmailSent={handleForgotPasswordSuccess}
        />
      </SlideContainer>
    </Container>
  );
};

export default AuthContainer;
