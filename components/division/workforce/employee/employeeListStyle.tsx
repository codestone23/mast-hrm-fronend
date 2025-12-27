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
  CreateButton,
  SearchContainer,
  FilterRow,
  FilterItemSmall,
  FilterContainer,
  StatsRow,
  ActionMenuContainer,
  ActionMenuButton,
  ActionMenuDropdown,
  ActionMenuList,
  ActionMenuItem,
  ActionMenuLink,
  ActionMenuDivider,
} from "@/components/company/account/accountStyle";

// User info cell
export const UserInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AvatarContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  overflow: hidden;
`;

export const AvatarInitial = styled.span`
  font-weight: 500;
`;

export const UserInfoText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserNameText = styled.div`
  font-weight: 500;
  color: #111827;
  margin-bottom: 2px;
`;

export const UserEmailText = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

// Skills display
export const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

export const SkillTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0369a1;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

export const MoreSkillsText = styled.span`
  color: #64748b;
  font-size: 12px;
  font-style: italic;
`;

export const EmptySkillsText = styled.span`
  color: #9ca3af;
  font-style: italic;
`;

// Roles display
export const RolesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const RoleBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e0e7ff;
  color: #6366f1;
`;

export const EmptyRoleText = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

// Stats text
export const StatsText = styled.strong`
  color: var(--text-primary);
`;

// Pagination wrapper
export const PaginationWrapper = styled.div`
  margin-top: 16px;
`;

