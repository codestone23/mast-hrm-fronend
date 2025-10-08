'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';
import ROUTERS from "@/config/router";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  color: white;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  text-align: center;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  text-align: center;
  margin-top: 1rem;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.4; }
  }
`;

const RedirectInfo = styled.div`
  position: absolute;
  bottom: 2rem;
  text-align: center;
  opacity: 0.7;
  font-size: 0.9rem;
`;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after a short delay
    const timer = setTimeout(() => {
      router.push(ROUTERS.AUTH.LOGIN);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Container>
      <LoadingContainer>
        <Title>MAST HRM</Title>
        <Subtitle>Hệ thống quản lý nhân sự hiện đại</Subtitle>
        
        <LoadingSpinner />
        <LoadingText>Đang khởi tạo hệ thống...</LoadingText>
      </LoadingContainer>
      
      <RedirectInfo>
        Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát
      </RedirectInfo>
    </Container>
  );
}
