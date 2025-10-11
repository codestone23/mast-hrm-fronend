import styled from "styled-components";

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Row = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Col = styled.div`
  flex: 1;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
`;

export const Select = styled.select`
  width: 100%;
  min-height: 120px;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
`;

export const FooterActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

export default {};
