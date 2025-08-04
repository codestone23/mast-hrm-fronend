'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  text-align: center;
  opacity: 0.9;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background-color: #3b82f6;
    color: white;
    
    &:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background-color: white;
    color: #1f2937;
    
    &:hover {
      background-color: #f9fafb;
      transform: translateY(-2px);
    }
  }
`;

export default function Home() {
  const router = useRouter();

  const handleNavigateToOverview = () => {
    // Tạm thời redirect trực tiếp, sau này sẽ check authentication
    window.location.href = '/overview';
  };

  const handleNavigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Container>
      <Title>Mast HRM</Title>
      <Subtitle>Hệ thống quản lý nhân sự hiện đại</Subtitle>
      
      <ButtonGroup>
        <Button className="primary" onClick={handleNavigateToOverview}>
          Vào hệ thống
        </Button>
        <Button className="secondary" onClick={handleNavigateToLogin}>
          Đăng nhập
        </Button>
      </ButtonGroup>
    </Container>
  );
}
