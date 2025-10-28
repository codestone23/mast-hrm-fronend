import styled from 'styled-components';

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem 0;
  flex-wrap: wrap;
`;

export const PaginationButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: white;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  
  &:hover:not(:disabled) {
    border-color: var(--primary-300);
    background: var(--primary-50);
    color: var(--primary-700);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const PaginationNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const PaginationNumber = styled.button<{ $active: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  border: 1px solid ${({ $active }) => ($active ? 'var(--primary-500)' : 'var(--border)')};
  border-radius: var(--radius-md);
  background: ${({ $active }) => ($active ? 'var(--primary-500)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--text-primary)')};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  
  &:hover:not(:disabled) {
    border-color: var(--primary-300);
    background: ${({ $active }) => ($active ? 'var(--primary-600)' : 'var(--primary-50)')};
    color: ${({ $active }) => ($active ? 'white' : 'var(--primary-700)')};
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-left: 1rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 0.5rem;
    width: 100%;
    text-align: center;
  }
`;
