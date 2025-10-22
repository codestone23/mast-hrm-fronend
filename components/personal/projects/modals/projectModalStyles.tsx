import styled from "styled-components";

export const ModalContent = styled.div`
  padding: 1.5rem;
`;

export const FormSection = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

export const ErrorMessage = styled.div`
  background: var(--error-50);
  color: var(--error-700);
  border: 1px solid var(--error-200);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;
