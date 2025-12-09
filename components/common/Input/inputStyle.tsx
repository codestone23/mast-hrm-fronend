import styled, { css } from 'styled-components';

export const InputContainer = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}
`;

export const InputLabel = styled.label<{ required?: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  
  .required {
    color: var(--error-500);
    margin-left: 0.25rem;
  }
`;

export const InputWrapper = styled.div<{
  $size?: string;
  $variant?: string;
  $hasError?: boolean;
  $isFocused?: boolean;
  $hasLeftIcon?: boolean;
  $hasRightIcon?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'filled':
        return css`
          background-color: var(--gray-100);
          border: 1px solid transparent;
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border: 2px solid var(--border);
        `;
      default:
        return css`
          background-color: #fff;
          border: 1px solid var(--border);
        `;
    }
  }}
  
  ${({ $hasError }) => $hasError && css`
    border-color: var(--error-500);
    
    &:focus-within {
      border-color: var(--error-500);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
  
  ${({ $hasError, $isFocused }) => !$hasError && $isFocused && css`
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  `}
  
  &:hover:not(:focus-within) {
    border-color: var(--gray-300);
  }
`;

export const StyledInput = styled.input<{
  $size?: string;
  $variant?: string;
  $hasError?: boolean;
  $hasLeftIcon?: boolean;
  $hasRightIcon?: boolean;
}>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.875rem;
  
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
  
  ${({ $hasLeftIcon }) => $hasLeftIcon && css`
    padding-left: 2.75rem;
  `}
  
  ${({ $hasRightIcon }) => $hasRightIcon && css`
    padding-right: 2.75rem;
  `}
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Ẩn spinner cho input type number */
  &[type="number"] {
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const InputIcon = styled.div<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${({ $position }) => $position === 'left' ? css`
    left: 0.75rem;
  ` : css`
    right: 0.75rem;
  `}
`;

export const TogglePasswordButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--text-primary);
  }
  
  &:focus {
    outline: none;
    color: var(--primary-500);
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
