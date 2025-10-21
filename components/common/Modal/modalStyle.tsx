import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
  padding: 1rem;
  overflow: hidden;
`;

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return css`
        max-width: 400px;
        width: 100%;
      `;
    case 'md':
      return css`
        max-width: 500px;
        width: 100%;
      `;
    case 'lg':
      return css`
        max-width: 700px;
        width: 100%;
      `;
    case 'xl':
      return css`
        max-width: 900px;
        width: 100%;
      `;
    default:
      return css`
        max-width: 500px;
        width: 100%;
      `;
  }
};

export const ModalContainer = styled.div<{ size?: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  animation: ${slideIn} 0.2s ease-out;
  max-height: 90vh;
  
  ${({ size }) => getSizeStyles(size || 'md')}
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 95vh;
    margin: 1rem;
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 80vh;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: none;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--gray-100);
    color: var(--text-primary);
  }
  
  &:focus {
    outline: none;
    background-color: var(--gray-100);
    color: var(--text-primary);
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: block;
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    width: 10px;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb {
    width: 10px;
    border-radius: 50px;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
`;
