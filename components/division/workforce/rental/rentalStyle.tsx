import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(2,6,23,0.04);
`;

export const TabsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const SubTab = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? "var(--primary-500)" : "transparent")};
  background: ${(p) => (p.$active ? "var(--primary-50)" : "transparent")};
  color: ${(p) => (p.$active ? "var(--primary-600)" : "var(--text-primary)")};
  font-weight: 600;
  cursor: pointer;
`;

export const QueryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(2, 6, 23, 0.04);
`;
export const SearchRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
export const FilterRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ControlRow = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

export const TableWrap = styled.div`
  overflow: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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
  width: 32px;
  height: 32px;
  border-radius: 999px;
  object-fit: cover;
`;

export default {};
