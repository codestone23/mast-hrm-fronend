import styled from "styled-components";

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DetailLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  
  svg {
    color: var(--primary-600);
  }
`;

export const DetailValue = styled.div`
  font-size: 1rem;
  color: var(--text-primary);
  padding-left: 1.75rem;
  word-wrap: break-word;
`;

export const DetailActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
`;
