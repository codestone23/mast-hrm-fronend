import styled from 'styled-components';

export const ModalContent = styled.div`
  padding: 0;
`;

export const FormSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--error-50);
  border: 1px solid var(--error-200);
  border-radius: var(--radius-md);
  color: var(--error-700);
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--success-50);
  border: 1px solid var(--success-200);
  border-radius: var(--radius-md);
  color: var(--success-700);
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
`;

export const SingleFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ConfirmText = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const DeleteWarning = styled.div`
  background: var(--warning-50);
  border: 1px solid var(--warning-200);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-bottom: 1.5rem;
  
  h4 {
    color: var(--warning-700);
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    border: none;
    padding: 0;
  }
  
  p {
    color: var(--warning-600);
    font-size: 0.875rem;
    margin: 0;
  }
`;
