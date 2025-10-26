import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContainer = styled.div<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: ${props => {
    switch (props.size) {
      case 'sm': return '400px';
      case 'lg': return '800px';
      case 'xl': return '1200px';
      default: return '600px';
    }
  }};
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FormInput = styled.input<{ $hasError?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#2196F3'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(33, 150, 243, 0.1)'};
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const FormSelect = styled.select<{ $hasError?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#2196F3'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(33, 150, 243, 0.1)'};
  }
`;

export const FormTextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#2196F3'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(33, 150, 243, 0.1)'};
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

export const SaveButton = styled.button`
  padding: 10px 20px;
  background: #2196F3;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1976d2;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
  }
`;

export const DeleteButton = styled.button`
  padding: 10px 20px;
  background: #ef4444;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #6b7280;
`;

export const DetailField = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const DetailLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  min-width: 120px;
`;

export const DetailValue = styled.div`
  font-size: 14px;
  color: #111827;
  flex: 1;
`;

export const ConfirmContainer = styled.div`
  padding: 8px 0;
`;

export const Message = styled.div`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const Spacer = styled.div`
  flex: 1;
`;

