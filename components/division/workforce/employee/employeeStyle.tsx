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
} from "../../../personal/personalStyle";

export const Container = styled.div`
  background-color: var(--background-secondary);
  min-height: 100vh;
  padding: 0.75rem;
`;

export const ContentContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #F57C00;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
  }
`;

export const EmployeeTable = styled.div`
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  color: #333;
  font-size: 15px;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #333;
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
  background-color: #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2196F3;
  overflow: hidden;
  font-weight: 500;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
`;

export const UserEmail = styled.div`
  font-size: 12px;
  color: #6b7280;
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

export const SkillsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  max-width: 100%;
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
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #bae6fd 0%, #7dd3fc 100%);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(3, 105, 161, 0.2);
  }
`;

export const MoreSkills = styled.span`
  display: inline-flex;
  align-items: center;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  font-style: italic;
`;