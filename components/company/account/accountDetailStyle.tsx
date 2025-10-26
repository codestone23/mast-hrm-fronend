import styled from "styled-components";

// Import styles from personalInfoStyle for consistency
export {
  PersonalInfoContainer,
  LeftSidebar,
  UserProfile,
  UserAvatar,
  UserName,
  UserRole,
  UserDetails,
  DetailItem as SidebarDetailItem,
  DetailLabel as SidebarDetailLabel,
  DetailValue as SidebarDetailValue,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  MainContent,
  ContentTabs,
  TabItem,
  TabContent,
  SectionHeader,
  SectionTitle,
  SectionAction,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  FamilyTable,
  TableHeader,
  TableRow,
  TableCell,
  ActionButtons,
  ActionButton as TableActionButton,
} from "../../personal/personal-info/personalInfoStyle";

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: white;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-50);
    color: var(--primary-600);
    border-color: var(--primary-200);
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const ActionButton = styled.button<{ $variant: "edit" | "delete" }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$variant) {
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
