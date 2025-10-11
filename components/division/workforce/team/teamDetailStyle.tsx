import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h3`
  margin: 0;
`;

export const TopActions = styled.div``;

export const MembersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(2,6,23,0.04);
`;

export const Thead = styled.thead``;
export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid rgba(2,6,23,0.04);
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 13px;
  color: var(--text-muted);
`;

export const Td = styled.td`
  padding: 12px;
  vertical-align: middle;
`;

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  object-fit: cover;
`;

export const Empty = styled.div`
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
`;

export default {};
