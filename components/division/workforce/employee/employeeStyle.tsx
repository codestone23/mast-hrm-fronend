import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
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

export const TableWrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid rgba(2, 6, 23, 0.04);
`;

export const TableContainer = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const THead = styled.thead`
  th {
    text-align: left;
    padding: 10px;
    background: #f8fafc;
    font-weight: 700;
  }
`;
export const TBody = styled.tbody``;
export const TR = styled.tr``;
export const TH = styled.th``;
export const TD = styled.td`
  padding: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
`;

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  object-fit: cover;
`;

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const PageButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const RowsPerPageSelect = styled.select`
  padding: 6px 8px;
  border-radius: 6px;
`;

export default {};
