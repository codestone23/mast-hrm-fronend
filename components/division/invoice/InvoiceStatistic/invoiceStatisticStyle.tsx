import styled from "styled-components";

export const StatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const StatCards = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const StatCard = styled.div`
  background: #f3faf7;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
`;

export const StatCardTitle = styled.div`
  font-size: 0.9rem;
  color: #065f46;
`;

export const StatCardValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #065f46;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const TableWrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(2,6,23,0.04);
`;

export const ProjectsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const THead = styled.thead``;
export const TBody = styled.tbody``;
export const TR = styled.tr``;
export const TH = styled.th`
  text-align: left;
  padding: 8px 12px;
  background: #f8fafc;
  font-weight: 700;
`;
export const TD = styled.td`
  padding: 8px 12px;
  border-top: 1px solid rgba(0,0,0,0.04);
`;

export const TotalRow = styled.tr`
  background: #fff7ed;
`;

export default {};
