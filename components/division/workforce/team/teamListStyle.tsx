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

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const InfoBox = styled.div`
  background: #eef2ff;
  padding: 8px 12px;
  border-radius: 6px;
`;

export const Title = styled.div`
  font-weight: 700;
`;

export const CreateWrap = styled.div``;

export const TableWrap = styled.div`
  overflow: auto;
  border-radius: 8px;
  border: 1px solid rgba(2,6,23,0.04);
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

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: var(--text-muted);
`;

export default {};
