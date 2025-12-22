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
} from "../../personal/personalStyle";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 12px;
  }
`;

export const CommonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  grid-auto-rows: 1fr;

  & > * {
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
`;

export const Tags = styled.div`
  font-size: 18px;
  font-weight: 600;
  border-left: 4px solid var(--primary-500);
  padding-left: 8px;
  color: var(--text-primary);

  @media (max-width: 768px) {
    font-size: 16px;
    padding-left: 6px;
    border-left-width: 3px;
  }
`;

export const StatisticRow = styled.div`
  display: block;
  width: 100%;
`;

export default {};
