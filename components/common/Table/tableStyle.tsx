import styled from "styled-components";

export const TableContainer = styled.div`
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

export const TableHeader = styled.div<{ $gridTemplateColumns?: string }>`
  display: grid;
  grid-template-columns: ${(props) => props.$gridTemplateColumns || "1fr"};
  gap: 16px;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  color: #333;
  font-size: 15px;
`;

export const TableRow = styled.div<{ 
  $gridTemplateColumns?: string;
  $clickable?: boolean;
}>`
  display: grid;
  grid-template-columns: ${(props) => props.$gridTemplateColumns || "1fr"};
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};

  &:hover {
    background-color: ${(props) => (props.$clickable ? "#f9f9f9" : "transparent")};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.div<{ $align?: "left" | "center" | "right" }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => {
    if (props.$align === "center") return "center";
    if (props.$align === "right") return "flex-end";
    return "flex-start";
  }};
  font-size: 15px;
  color: #333;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  margin-bottom: 16px;
`;

export const EmptyText = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

