import styled from "styled-components";

export {
  PersonalContainer,
  Card,
  CardHeader,
  CardTitle,
  IconWrapper,
  DashboardCol,
} from "../../../personal/personalStyle";

export {
  DashboardGridAccount,
  FilterContainer,
  FilterRow,
  FilterItemSmall,
  SearchContainer,
  StatsRow,
} from "../../../company/account/accountStyle";

export const RotationBadge = styled.span<{ $type: 'PERMANENT' | 'TEMPORARY' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $type }) => $type === 'PERMANENT' ? '#dcfce7' : '#fef3c7'};
  color: ${({ $type }) => $type === 'PERMANENT' ? '#166534' : '#92400e'};
`;

export const DivisionTransfer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

export const DivisionName = styled.span`
  color: #374151;
  font-weight: 500;
`;

export const ArrowIcon = styled.span`
  color: #9ca3af;
  display: flex;
  align-items: center;
`;

export const DetailSection = styled.div`
  margin-bottom: 20px;
`;

export const DetailLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
`;

export const DetailValue = styled.div`
  font-size: 14px;
  color: #111827;
  font-weight: 500;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

