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

export const DetailHeader = styled.div<{ $isMobile?: boolean }>`
  padding: ${props => props.$isMobile ? '12px' : '20px'};
  border-bottom: 1px solid var(--border-color);
`;

export const DetailHeaderContent = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: ${props => props.$isMobile ? 'wrap' : 'nowrap'};
  gap: ${props => props.$isMobile ? '12px' : '0'};
`;

export const DetailTitleWrapper = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.$isMobile ? '8px' : '16px'};
  flex: 1;
  min-width: 0;
`;

export const DetailTitle = styled.h1<{ $isMobile?: boolean }>`
  margin: 0;
  font-size: ${props => props.$isMobile ? '18px' : '24px'};
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: ${props => props.$isMobile ? 'normal' : 'nowrap'};
`;

export const DetailContent = styled.div<{ $isMobile?: boolean }>`
  padding: ${props => props.$isMobile ? '12px' : '0px'};
`;

export const DetailInfoGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${props => props.$isMobile ? '1fr' : '1fr 1fr'};
  gap: ${props => props.$isMobile ? '12px' : '16px'};
  margin-top: ${props => props.$isMobile ? '12px' : '16px'};
`;

export const CardHeaderActions = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: ${props => props.$isMobile ? 'flex-start' : 'center'};
  margin-bottom: ${props => props.$isMobile ? '12px' : '16px'};
  flex-direction: ${props => props.$isMobile ? 'column' : 'row'};
  gap: ${props => props.$isMobile ? '12px' : '0'};
`;

export const ResponsiveButton = styled.button<{ $isMobile?: boolean }>`
  width: ${props => props.$isMobile ? '100%' : 'auto'};
`;

export const DetailHeaderWrapper = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
`;

export const DetailHeaderContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DetailHeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const DetailPageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;