import styled, { css } from 'styled-components';

export const SelectContainer = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}
`;

export const SelectLabel = styled.label<{ required?: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  
  .required {
    color: var(--error-500);
    margin-left: 0.25rem;
  }
`;

export const SelectTrigger = styled.div<{
  $size?: string;
  disabled?: boolean;
  $hasError?: boolean;
  $isOpen?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
        `;
      case 'lg':
        return css`
          padding: 1rem 1rem;
          font-size: 1rem;
        `;
      default:
        return css`
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
        `;
    }
  }}
  
  ${({ $hasError }) => $hasError && css`
    border-color: var(--error-500);
  `}
  
  ${({ $isOpen, $hasError }) => $isOpen && css`
    border-color: ${$hasError ? 'var(--error-500)' : 'var(--primary-500)'};
    box-shadow: 0 0 0 3px ${$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  `}
  
  ${({ disabled }) => disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--gray-100);
  `}
  
  &:hover:not([disabled]) {
    border-color: var(--gray-300);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const SelectValue = styled.span<{ $hasValue?: boolean }>`
  flex: 1;
  text-align: left;
  color: ${({ $hasValue }) => $hasValue ? 'var(--text-primary)' : 'var(--text-muted)'};
`;

export const SelectIcon = styled.div<{ $isOpen?: boolean }>`
  display: flex;
  align-items: center;
  color: var(--text-muted);
  transition: transform 0.2s ease;
  
  ${({ $isOpen }) => $isOpen && css`
    transform: rotate(180deg);
  `}
`;

export const SelectDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  margin-top: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
  }
`;

export const SelectOption = styled.div<{
  disabled?: boolean;
  selected?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
  
  ${({ selected }) => selected && css`
    background-color: var(--primary-50);
    color: var(--primary-600);
    font-weight: 500;
  `}
  
  ${({ disabled }) => disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
  `}
  
  &:hover:not([disabled]) {
    background-color: ${({ selected }) => selected ? 'var(--primary-100)' : 'var(--gray-50)'};
  }
  
  &:first-child {
    border-top-left-radius: var(--radius-md);
    border-top-right-radius: var(--radius-md);
  }
  
  &:last-child {
    border-bottom-left-radius: var(--radius-md);
    border-bottom-right-radius: var(--radius-md);
  }
`;

export const ErrorMessage = styled.div`
  font-size: 0.75rem;
  color: var(--error-500);
  margin-top: 0.25rem;
`;

export const HelperText = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
`;
