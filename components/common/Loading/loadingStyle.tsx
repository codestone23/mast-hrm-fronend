import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingContainer = styled.div<{ $fullScreen?: boolean; $center?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  ${({ $fullScreen }) => $fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  `}
  
  ${({ $center }) => $center && `
    width: 100%;
    height: 100%;
    min-height: 200px;
  `}
`;

const getSpinnerSize = (size: string) => {
  switch (size) {
    case 'sm':
      return '1.5rem';
    case 'md':
      return '2.5rem';
    case 'lg':
      return '4rem';
    default:
      return '2.5rem';
  }
};

const getBorderWidth = (size: string) => {
  switch (size) {
    case 'sm':
      return '2px';
    case 'md':
      return '3px';
    case 'lg':
      return '4px';
    default:
      return '3px';
  }
};

export const Spinner = styled.div<{ size: string }>`
  width: ${({ size }) => getSpinnerSize(size)};
  height: ${({ size }) => getSpinnerSize(size)};
  border: ${({ size }) => getBorderWidth(size)} solid #e5e7eb;
  border-top: ${({ size }) => getBorderWidth(size)} solid var(--primary-500, #3b82f6);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingText = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
  margin: 0;
  font-weight: 500;
`;

