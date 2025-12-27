import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 24px;
`;

export const SectionHeaderRow = styled.div`
  padding: 16px;
  display: flex;
  gap: 12px;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export const Field = styled.div<{ $minWidth?: number; $width?: string }>`
  min-width: ${(p) => (p.$minWidth ? `${p.$minWidth}px` : 'auto')};
  width: ${(p) => p.$width || 'auto'};
`;

export const SectionBody = styled.div`
  padding: 16px;
`;

export const MembersGrid = styled.div`
  display: grid;
  gap: 8px;
`;

export const MemberItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
`;

export const MemberInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  object-fit: cover;
`;

export const MemberTexts = styled.div``;

export const MemberName = styled.div`
  font-weight: 600;
`;

export const MemberEmail = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

export const DangerButton = styled.button`
  background: var(--error-100);
  color: var(--error-700);
  border-radius: 8px;
  border: none;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

export const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 8px;
`;

export const LoadMoreButton = styled.button`
  border: 1px solid var(--border);
  padding: 8px 12px;
  border-radius: 8px;
  background: white;
`;

export const CardMarginTop = styled.div`
  margin-top: 16px;
`;

export const DivisionInfoContent = styled.div`
  padding: 16px;
  color: var(--text-secondary);
`;

export const DivisionInfoRow = styled.div`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;


