import styled from "styled-components";

// Import styles from personalStyle
export {
  PersonalContainer,
  DashboardGrid,
  Card,
  WelcomeCard,
  WelcomeContent,
  ProfileCard,
  ProfileAvatar,
  ProfileInfo,
  StatsCard,
  StatsNumber,
  StatsGrid,
  CardHeader,
  CardTitle,
  CardLink,
  IconWrapper,
  ProfileDetail,
  StatsHeader,
  ButtonDetail,
  ProfileDetailRight,
  CardWrapper,
  DashboardCol,
  MetricsList,
  AssetsGradientBox,
  AssetsNumber,
  AssetsLabel,
  AssetsListContainer,
  AssetsListTitle,
  AssetsItem,
  ResourcesCard,
  ResourcesHeader,
  ResourcesTitle,
  ResourcesLink,
  EffortSection,
  EffortDateLabel,
  EffortDisplay,
  EffortNumber,
  EffortLabel,
  EffortPercentage,
  EffortText,
  ResourcesInfo,
  ResourcesDetailLink,
} from "../../personal/personalStyle";

export const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  min-width: 300px;
  background-color: var(--surface);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-600);
  }
`;

export const AccountTable = styled.div`
  background-color: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px;
  gap: 16px;
  padding: 16px 20px;
  background-color: var(--background);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--background-hover);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const DashboardGridAccount = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TableCell = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--text-primary);
`;

export const TableActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button<{ $variant: "view" | "edit" | "delete" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$variant) {
      case "view":
        return `
          background-color: var(--info-100);
          color: var(--info-600);
          &:hover {
            background-color: var(--info-200);
          }
        `;
      case "edit":
        return `
          background-color: var(--warning-100);
          color: var(--warning-600);
          &:hover {
            background-color: var(--warning-200);
          }
        `;
      case "delete":
        return `
          background-color: var(--error-100);
          color: var(--error-600);
          &:hover {
            background-color: var(--error-200);
          }
        `;
    }
  }}
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled.div`
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
`;

export const UserEmail = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

export const StatusBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.$color}20;
  color: ${props => props.$color};
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
  background-color: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  margin-bottom: 16px;
`;

export const EmptyText = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
`;
