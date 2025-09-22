import styled, { css, keyframes } from 'styled-components';
import { ButtonProps } from './Button';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: var(--primary-500);
        color: white;
        border: 1px solid var(--primary-500);
        
        &:hover:not(:disabled) {
          background-color: var(--primary-600);
          border-color: var(--primary-600);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
      `;
    case 'secondary':
      return css`
        background-color: var(--secondary-500);
        color: white;
        border: 1px solid var(--secondary-500);
        
        &:hover:not(:disabled) {
          background-color: var(--secondary-600);
          border-color: var(--secondary-600);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
      `;
    case 'success':
      return css`
        background-color: var(--success-500);
        color: white;
        border: 1px solid var(--success-500);
        
        &:hover:not(:disabled) {
          background-color: var(--success-600);
          border-color: var(--success-600);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
      `;
    case 'warning':
      return css`
        background-color: var(--warning-500);
        color: white;
        border: 1px solid var(--warning-500);
        
        &:hover:not(:disabled) {
          background-color: var(--warning-600);
          border-color: var(--warning-600);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
      `;
    case 'error':
      return css`
        background-color: var(--error-500);
        color: white;
        border: 1px solid var(--error-500);
        
        &:hover:not(:disabled) {
          background-color: var(--error-600);
          border-color: var(--error-600);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: var(--primary-500);
        border: 1px solid var(--primary-500);
        
        &:hover:not(:disabled) {
          background-color: var(--primary-50);
          color: var(--primary-600);
          border-color: var(--primary-600);
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: var(--text-primary);
        border: 1px solid transparent;
        
        &:hover:not(:disabled) {
          background-color: var(--gray-100);
          color: var(--text-primary);
        }
      `;
    default:
      return css`
        background-color: var(--primary-500);
        color: white;
        border: 1px solid var(--primary-500);
      `;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return css`
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
        min-height: 2rem;
      `;
    case 'md':
      return css`
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        min-height: 2.5rem;
      `;
    case 'lg':
      return css`
        padding: 1rem 1.5rem;
        font-size: 1rem;
        min-height: 3rem;
      `;
    default:
      return css`
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        min-height: 2.5rem;
      `;
  }
};

export const StyledButton = styled.button<Partial<ButtonProps>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  text-decoration: none;
  
  ${({ variant }) => getVariantStyles(variant || 'primary')}
  ${({ size }) => getSizeStyles(size || 'md')}
  
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
  
  .icon-left {
    margin-right: 0.25rem;
    display: flex;
    align-items: center;
  }
  
  .icon-right {
    margin-left: 0.25rem;
    display: flex;
    align-items: center;
  }
`;
