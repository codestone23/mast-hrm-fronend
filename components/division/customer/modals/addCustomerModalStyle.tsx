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
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
`;

export const FooterActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  width: 100%;
`;

export const Tag = styled.div`
  background: #eef6f2;
  padding: 4px 8px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
`;

export const PriceRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  border: 1px solid rgba(2, 6, 23, 0.06);
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--bg-input, #fff);
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: visible;
  flex-wrap: nowrap;
`;

export const TagCloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-muted, #666);
  font-size: 12px;
  padding: 0;
`;

export const ProjectInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TagListStyled = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

export const DateGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const DateInput = styled.input`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-input, #fff);
  color: var(--text-primary);
  box-sizing: border-box;
`;

export const RemoveButton = styled.button`
  background: #f26060;
  color: #fff;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  z-index: 3;
`;

export const AddPriceButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--primary, #177dff);
  cursor: pointer;
  padding: 6px 0;
`;

export default {};
