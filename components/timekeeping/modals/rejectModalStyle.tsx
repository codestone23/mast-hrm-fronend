import styled from 'styled-components';

export const RejectModalOverlay = styled.div`
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
`;

export const RejectModalContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSlideIn 0.2s ease-out;
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

export const RejectModalHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const RejectModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const RejectModalSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0.5rem 0 0 0;
`;

export const RejectModalContent = styled.div`
  margin-bottom: 1.5rem;
`;

export const RejectModalLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

export const RejectModalTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  resize: vertical;
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

export const RejectModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

export const RejectModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  ${({ $variant = 'secondary' }) => {
    if ($variant === 'primary') {
      return `
        background-color: #EF4444;
        color: white;
        border-color: #EF4444;
        
        &:hover:not(:disabled) {
          background-color: #DC2626;
          border-color: #DC2626;
        }
        
        &:disabled {
          background-color: #FCA5A5;
          border-color: #FCA5A5;
          cursor: not-allowed;
          opacity: 0.6;
        }
      `;
    } else {
      return `
        background-color: white;
        color: var(--text-primary);
        border-color: var(--border);
        
        &:hover:not(:disabled) {
          background-color: var(--gray-50);
          border-color: var(--gray-300);
        }
        
        &:disabled {
          background-color: var(--gray-100);
          color: var(--text-tertiary);
          cursor: not-allowed;
          opacity: 0.6;
        }
      `;
    }
  }}
`;

export const RejectModalError = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 6px;
  color: #DC2626;
  font-size: 0.875rem;
`;

export const RejectModalSuccess = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 6px;
  color: #16A34A;
  font-size: 0.875rem;
`;
