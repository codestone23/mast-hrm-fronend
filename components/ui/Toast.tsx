'use client';

import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Animations
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const progressBar = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

// Styled Components

const ToastWrapper = styled.div<{ $isVisible: boolean; $type: ToastType }>`
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  min-width: 300px;
  max-width: 400px;
  border-left: 4px solid ${props => {
    switch (props.$type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
  animation: ${props => props.$isVisible ? slideIn : slideOut} 0.3s ease-in-out;
  transform: ${props => props.$isVisible ? 'translateX(0)' : 'translateX(100%)'};
  opacity: ${props => props.$isVisible ? 1 : 0};
`;

const ToastHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ToastIcon = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => {
    switch (props.$type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

const ToastTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ToastMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
`;

const ProgressBar = styled.div<{ $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #e5e7eb;
  border-radius: 0 0 8px 8px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #6b7280;
    animation: ${progressBar} ${props => props.$duration}ms linear;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.$variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

// Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  actions?: ToastAction[];
  persistent?: boolean;
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  }, [onRemove, toast.id]);

  useEffect(() => {
    // Trigger slide in animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.persistent) return;

    const timer = setTimeout(() => {
      handleRemove();
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.duration, toast.persistent, handleRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getTitle = () => {
    if (toast.title) return toast.title;
    
    switch (toast.type) {
      case 'success': return 'Thành công';
      case 'error': return 'Lỗi';
      case 'warning': return 'Cảnh báo';
      case 'info': return 'Thông tin';
      default: return 'Thông báo';
    }
  };

  return (
    <ToastWrapper $isVisible={isVisible && !isRemoving} $type={toast.type}>
      <ToastHeader>
        <ToastIcon $type={toast.type}>
          {getIcon()}
          <ToastTitle>{getTitle()}</ToastTitle>
        </ToastIcon>
        <CloseButton onClick={handleRemove}>
          <X size={16} />
        </CloseButton>
      </ToastHeader>
      
      <ToastMessage>{toast.message}</ToastMessage>
      
      {toast.actions && toast.actions.length > 0 && (
        <ActionButtons>
          {toast.actions.map((action, index) => (
            <ActionButton
              key={index}
              $variant={action.variant || 'secondary'}
              onClick={action.onClick}
            >
              {action.label}
            </ActionButton>
          ))}
        </ActionButtons>
      )}
      
      {!toast.persistent && (
        <ProgressBar $duration={toast.duration || 5000} />
      )}
    </ToastWrapper>
  );
};

export default Toast;
