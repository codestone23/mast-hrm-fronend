import styled from "styled-components";

// Import styles from personalStyle
export {
  PersonalContainer,
  DashboardGrid,
  Card as BaseCard,
  WelcomeCard,
  WelcomeContent,
  ProfileCard,
  ProfileAvatar,
  ProfileInfo,
  StatsCard,
  StatsNumber,
  StatsGrid,
  CardHeader,
  CardTitle as BaseCardTitle,
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

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
`;

export const StatWrapper = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

export const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  flex: 1;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
`;

export const CardTitle = styled.div`
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;

export const CardValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 360px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
`;
