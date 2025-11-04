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
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftCol = styled.div``;

export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Card = styled.div`
  background-color: var(--surface);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
`;

export const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
  background-color: var(--primary-100);
`;

export const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-top: 8px;
  color: var(--text-primary);
  text-align: center;
`;

export const SmallText = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
`;

export const StatRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  justify-content: center;
`;

export const StatItem = styled.div`
  text-align: center;
  .num {
    font-weight: 800;
    font-size: 20px;
    color: var(--text-primary);
  }
  .label {
    font-size: 12px;
    color: var(--text-secondary);
  }
`;

export const Badge = styled.div`
  background: linear-gradient(90deg, var(--warning-300), var(--warning-400));
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  display: inline-block;
  color: var(--text-primary);
  font-size: 13px;
`;

export const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  align-items: center;
`;

export const Row = styled.div`
  display: contents;
`;

export const Label = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  padding: 6px 0;
`;

export const Value = styled.div`
  font-weight: 600;
  padding: 6px 0;
  color: var(--text-primary);
`;

export const SectionTitle = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
`;

export const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Chip = styled.div`
  background-color: var(--background);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  color: var(--text-primary);
`;

export const TabContainer = styled.div`
  background-color: var(--surface);
  padding: 12px;
  display: flex;
  gap: 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
`;

export default {};
