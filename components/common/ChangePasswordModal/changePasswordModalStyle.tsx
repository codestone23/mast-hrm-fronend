import styled, { css } from 'styled-components';

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const PasswordStrengthIndicator = styled.div`
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const PasswordStrengthBar = styled.div<{ strength: number; color: string }>`
  flex: 1;
  height: 4px;
  background-color: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ strength }) => (strength / 5) * 100}%;
    background-color: ${({ color }) => color};
    transition: all 0.3s ease;
  }
`;

export const PasswordStrengthText = styled.span<{ color: string }>`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ color }) => color};
  min-width: 80px;
`;

export const PasswordRequirements = styled.div`
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RequirementItem = styled.div<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${({ met }) => met ? 'var(--success-600)' : 'var(--text-muted)'};
  transition: color 0.2s ease;
  
  svg {
    opacity: ${({ met }) => met ? 1 : 0.3};
  }
`;

export const SuccessMessage = styled.div`
  background-color: var(--success-50);
  color: var(--success-600);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  border: 1px solid var(--success-100);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

export const ErrorMessage = styled.div`
  background-color: var(--error-50);
  color: var(--error-600);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  border: 1px solid var(--error-100);
  text-align: center;
`;
