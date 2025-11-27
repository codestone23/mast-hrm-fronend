import styled from 'styled-components';

export const ConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: transparent;
`;

export const Message = styled.div`
  background: var(--bg, #fff);
  border-radius: 8px;
  color: var(--text-primary, #222);
  font-size: 16px;
  text-align: left;
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
`;

export const Spacer = styled.div`
  flex: 1 1 auto;
`;
