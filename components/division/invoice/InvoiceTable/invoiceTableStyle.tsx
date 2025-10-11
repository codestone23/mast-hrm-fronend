import styled from "styled-components";

export const Container = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  border: 1px solid rgba(2, 6, 23, 0.04);
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
`;

export const TableContainer = styled.div`
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(15, 23, 42, 0.12);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const THead = styled.thead`
  background: rgba(248, 250, 252, 1);
  th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: rgba(248, 250, 252, 1);
  }
`;

export const TBody = styled.tbody``;

export const TR = styled.tr``;

export const TH = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-weight: 700;
  font-size: 13px;
  color: #23303b;
  border-bottom: 1px solid rgba(2, 6, 23, 0.06);
`;

export const TD = styled.td`
  padding: 12px 16px;
  border-top: 1px solid rgba(2, 6, 23, 0.04);
  color: #334155;
`;

export const Badge = styled.span<{ $color?: string }>`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 12px;
  color: white;
  background: ${(props) => props.$color || "var(--primary-500)"};
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px 0 4px;
  color: rgba(2, 6, 23, 0.6);
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default {};
