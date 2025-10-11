import styled from 'styled-components';

export const TimePickerContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const TimePickerLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
`;

export const TimePickerInput = styled.div<{
  disabled?: boolean;
  $hasError?: boolean;
  $isOpen?: boolean;
}>`
  position: relative;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  background-color: ${props => props.disabled ? '#f9fafb' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: ${props => props.disabled ? '#9ca3af' : '#374151'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: ${props => props.$hasError ? '#ef4444' : '#9ca3af'};
  }
  
  &:focus-within {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? '#fef2f2' : '#eff6ff'};
  }
  
  ${props => props.$isOpen && `
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px #eff6ff;
  `}
`;

export const TimePickerIcon = styled.div`
  display: flex;
  align-items: center;
  color: #6b7280;
  pointer-events: none;
`;

export const TimePickerDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  margin-top: 4px;
  padding: 12px;
  min-width: 200px;
`;

export const TimePickerOption = styled.div<{ $isSelected?: boolean }>`
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  transition: all 0.2s ease;
  background-color: ${props => props.$isSelected ? '#3b82f6' : 'transparent'};
  color: ${props => props.$isSelected ? 'white' : '#374151'};
  
  &:hover {
    background-color: ${props => props.$isSelected ? '#2563eb' : '#f3f4f6'};
  }
`;

export const TimePickerSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #6b7280;
  margin-top: 20px;
`;
