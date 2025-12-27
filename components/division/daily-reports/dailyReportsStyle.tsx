import styled from "styled-components";

// Import shared styles
export {
  PersonalContainer,
  DashboardGridAccount,
  Card,
  CardHeader,
  CardTitle,
  IconWrapper,
  DashboardCol,
  SearchContainer,
  FilterRow,
  FilterItemSmall,
  FilterContainer,
  StatsRow,
} from "@/components/company/account/accountStyle";

// Status Badge
export const StatusBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => `${props.$color}20`};
  color: ${props => props.$color};
`;

// Table cell styles
export const TableCellText = styled.span<{ $fontSize?: string; $color?: string; $fontWeight?: number }>`
  font-size: ${props => props.$fontSize || "14px"};
  color: ${props => props.$color || "#6b7280"};
  font-weight: ${props => props.$fontWeight || 400};
`;

export const TableCellTitle = styled.div`
  font-weight: 500;
  color: #111827;
`;

export const TableCellHours = styled.span`
  font-weight: 500;
`;

// Actions container
export const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

// Checkbox styles
export const CheckboxInput = styled.input`
  cursor: pointer;
`;

// Selected reports banner
export const SelectedReportsBanner = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: ${props => props.$isMobile ? "10px" : "12px"};
  background-color: #f0f9ff;
  border-radius: 8px;
  flex-direction: ${props => props.$isMobile ? "column" : "row"};
  flex-wrap: wrap;
`;

export const SelectedCountText = styled.span<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? "13px" : "14px"};
  font-weight: 500;
  width: ${props => props.$isMobile ? "100%" : "auto"};
`;

export const SelectedActionsContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: 8px;
  width: ${props => props.$isMobile ? "100%" : "auto"};
`;

export const SelectedActionButton = styled.div<{ $isMobile?: boolean }>`
  flex: ${props => props.$isMobile ? 1 : "auto"};
`;

// Pagination wrapper
export const PaginationWrapper = styled.div`
  margin-top: 16px;
`;

// Stats text
export const StatsText = styled.span`
  color: var(--text-primary);
`;

