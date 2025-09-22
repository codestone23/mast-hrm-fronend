import styled from 'styled-components';

export const StyledTextArea = styled.textarea<{
  $size?: string;
  $variant?: string;
  $hasError?: boolean;
}>`
  width: 100%;
  min-height: ${({ rows = 3 }) => `${rows * 1.5 + 1}rem`};
  padding: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '0.5rem 0.75rem';
      case 'lg': return '0.875rem 1rem';
      default: return '0.75rem 1rem';
    }
  }};
  
  border: 1px solid ${({ $hasError }) => 
    $hasError ? 'var(--error-300)' : 'var(--border)'
  };
  border-radius: var(--radius-md);
  
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'filled': return 'var(--background-secondary)';
      case 'outline': return 'transparent';
      default: return 'white';
    }
  }};
  
  color: var(--text-primary);
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  }};
  font-family: inherit;
  line-height: 1.5;
  
  resize: vertical;
  
  transition: all 0.2s ease;
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
  }
  
  &:hover:not(:focus):not(:disabled) {
    border-color: var(--primary-300);
  }
  
  &:disabled {
    background: var(--background-muted);
    color: var(--text-muted);
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  ${({ $hasError }) => $hasError && `
    &:focus {
      border-color: var(--error-500);
      box-shadow: 0 0 0 3px var(--error-100);
    }
  `}
`;
