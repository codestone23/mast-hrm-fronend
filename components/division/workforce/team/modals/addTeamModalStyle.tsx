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

export const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-input, #fff);
  color: var(--text-primary);
`;

export const DateInput = styled.input`
  width: 100%;
  padding: 0.45rem 0.6rem;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-input, #fff);
`;

export const FooterActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  width: 100%;
`;

export default {};
