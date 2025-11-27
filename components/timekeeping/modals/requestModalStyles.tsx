import styled from 'styled-components';

export const ModalContent = styled.div`
  padding: 0;
`;

export const RequestTypeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 400px;
  overflow-y: auto;
`;

export const RequestTypeItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
  &::-webkit-scrollbar {
    display: block;
    width: 10px;
    background-color: #f9fafb;
  }
  &::-webkit-scrollbar-track {
    width: 10px;
    background-color: #f9fafb;
  }
`;

export const RequestTypeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f3f4f6;
  border-radius: 8px;
  margin-right: 12px;
  color: #6b7280;
`;

export const RequestTypeText = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

export const RequestTypeCount = styled.div`
  background-color: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
`;

export const FormSection = styled.div`
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
`;

export const InfoBanner = styled.div`
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
`;
