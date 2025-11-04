import styled from "styled-components";

export const PersonalContainer = styled.div`
  background-color: var(--background-secondary);
  min-height: calc(100vh - 60px);
  padding: 1.5rem;
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div<{ span?: number }>`
  background: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  grid-column: span ${(props) => props.span || 1};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;

export const WelcomeCard = styled(Card)`
  font-size: 1.2rem;
  background: linear-gradient(135deg, var(--secondary-400), var(--secondary-500));
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15), 0 4px 10px -3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 20px 40px -7px rgba(0, 0, 0, 0.2), 0 8px 16px -4px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    right: -10%;
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
`;

export const WelcomeContent = styled.div`
  position: relative;
  z-index: 2;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0;
  }
`;

export const ProfileCard = styled(Card)`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 25px -5px rgba(99, 102, 241, 0.3), 0 4px 10px -3px rgba(99, 102, 241, 0.2);
  
  &:hover {
    box-shadow: 0 20px 40px -7px rgba(99, 102, 241, 0.4), 0 8px 16px -4px rgba(99, 102, 241, 0.3);
    transform: translateY(-3px);
  }
`;

export const ProfileAvatar = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.85rem;
    opacity: 0.9;
    margin-bottom: 0.5rem;
  }
  
  .role {
    font-size: 0.8rem;
    opacity: 0.8;
  }
`;

export const ProfileDetailRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: flex-end;
  font-size: 0.85rem;
`;

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const ButtonDetail = styled.button`
  background: var(--primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: var(--primary-700);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.75rem;
  
  .fill {
    height: 100%;
    background: var(--success-500);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

export const StatsCard = styled(Card)`
  text-align: center;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &.compact {
    padding: 1rem 0.75rem;
  }
`;

export const StatsNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  line-height: 1;
  
  &.large {
    font-size: 3rem;
    background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const StatsLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
  
  .stat-item {
    text-align: center;
    
    .number {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }
  }
`;

export const AttendanceCard = styled(Card)`
  .title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const AttendanceStatus = styled.div`
  background: var(--success-100);
  border: 1px solid var(--success-200);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(34, 197, 94, 0.15);
    transform: translateY(-1px);
  }
  
  .date {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--success-700);
    margin-bottom: 0.5rem;
  }
  
  .status {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    
    .in, .out {
      color: var(--success-600);
      
      &::before {
        content: '●';
        margin-right: 0.25rem;
      }
    }
  }
`;

export const MetricsList = styled.div`
  .metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--gray-100);
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .value {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    &.warning .value {
      color: var(--error-600);
    }
    
    &.success .value {
      color: var(--success-600);
    }
  }
`;

export const ResourcesCard = styled(Card)`
  .header {
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 1rem;
    
    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
    
    .link {
      font-size: 0.85rem;
      color: #3b82f6;
      cursor: pointer;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export const EffortSection = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--card-background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    border-radius: 2px 0 0 2px;
  }
  
  &:last-child {
    margin-bottom: 0.5rem;
  }
  
  .date-label {
    font-size: 0.85rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  
  .effort-display {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .effort-number {
      font-size: 2rem;
      font-weight: 700;
      color: #dc2626;
    }
    
    .effort-label {
      font-size: 0.9rem;
      color: #6b7280;
    }
    
    .effort-percentage {
      font-size: 1.5rem;
      font-weight: 600;
      color: #16a34a;
    }
  }
`;

export const NoDataMessage = styled.div`
  text-align: center;
  color: var(--error-600);
  font-size: 0.9rem;
  padding: 1rem;
  background: var(--error-50);
  border-radius: var(--radius-sm);
  border: 1px solid var(--error-100);
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.15);
  }
`;

// Header Components
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

export const CardLink = styled.span`
  margin-left: auto;
  font-size: 0.85rem;
  color: var(--primary-600);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const IconWrapper = styled.div<{ color?: string }>`
  color: ${(props) => props.color || "var(--primary-600)"};
  display: flex;
  align-items: center;
`;

export const ProfileDetail = styled.div<{
    $marginTop?: string;
    $fontSize?: string;
    $opacity?: number;
}>`
  margin-top: ${(props) => props.$marginTop || "0"};
  font-size: ${(props) => props.$fontSize || "1.2rem"};
  opacity: ${(props) => props.$opacity || 1};
  h3, p {
    font-size: ${(props) => props.$fontSize || "1rem"};
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
`;

export const ProgressText = styled.div<{
    $textAlign?: string;
    $marginTop?: string;
    $fontSize?: string;
}>`
  margin-top: ${(props) => props.$marginTop || "0"};
  font-size: ${(props) => props.$fontSize || "0.8rem"};
  text-align: ${(props) => props.$textAlign || "left"};
`;

export const StatsHeader = styled.div<{ $marginBottom?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: ${(props) => props.$marginBottom || "0.75rem"};
`;

export const StatsNewest = styled.div<{ marginTop?: string }>`
  margin-top: ${(props) => props.marginTop || "1rem"};
  text-align: center;
`;

export const StatsNewestLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
`;

export const WorkStatsContainer = styled.div`
  margin-bottom: 1rem;
`;

export const WorkStatsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const WorkStatsMonth = styled.span`
  margin-left: auto;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

// Assets Components
export const AssetsGradientBox = styled.div`
  background: linear-gradient(135deg, #06b6d4, var(--primary-500));
  color: white;
  border-radius: var(--radius-md);
  padding: 0.5rem;
  text-align: center;
  box-shadow: 0 6px 20px -5px rgba(6, 182, 212, 0.3), 0 3px 8px -2px rgba(6, 182, 212, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 30px -7px rgba(6, 182, 212, 0.4), 0 6px 12px -3px rgba(6, 182, 212, 0.3);
    transform: translateY(-2px);
  }
`;

export const AssetsNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const AssetsLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

export const AssetsListContainer = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const AssetsListTitle = styled.div`
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

export const AssetsItem = styled.div<{ $marginBottom?: string }>`
  margin-bottom: ${(props) => props.$marginBottom || "0.25rem"};
`;

export const ResourcesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ResourcesTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const ResourcesLink = styled.span`
  font-size: 0.85rem;
  color: var(--primary-600);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const EffortDateLabel = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

export const EffortDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0;
`;

export const EffortNumber = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--error-600);
  background: linear-gradient(135deg, var(--error-500), var(--error-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
`;

export const EffortLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const EffortPercentage = styled.span<{ color?: string }>`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(props) => props.color || "var(--success-600)"};
  background: ${(props) =>
      props.color === "var(--warning-500)"
          ? "linear-gradient(135deg, var(--warning-500), var(--warning-600))"
          : "linear-gradient(135deg, var(--success-500), var(--success-600))"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
`;

export const EffortText = styled.span<{ fontSize?: string; color?: string }>`
  font-size: ${(props) => props.fontSize || "0.9rem"};
  color: ${(props) => props.color || "var(--text-secondary)"};
`;

export const EffortNote = styled.div`
  font-size: 0.8rem;
  color: var(--warning-600);
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: var(--warning-50);
  border: 1px solid var(--warning-200);
  border-radius: var(--radius-sm);
  font-weight: 500;
  display: inline-block;
`;

export const ResourcesInfo = styled.div<{ $marginBottom?: string }>`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: ${(props) => props.$marginBottom || "0.5rem"};
`;

export const ResourcesDetailLink = styled.div`
  font-size: 0.85rem;
  color: var(--primary-600);
  cursor: pointer;
  margin-bottom: 1rem;
`;

// Report Components
export const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ReportTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ReportButton = styled.button`
  background: var(--secondary-500);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: var(--secondary-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;
// Following Team Components
export const FollowingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const FollowingTitle = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

export const DashboardCol = styled.div<{ $span?: number }>`
  display: flex;
  flex-direction: column;
  grid-column: span ${(props) => props.$span || 1};
  gap: 1rem;
`;

// News Sidebar Components
export const NewsSidebar = styled(Card)`
  overflow-y: auto;
  height: 100%;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: 3px;
    
    &:hover {
      background: var(--gray-400);
    }
  }
`;

export const ContainerDashboard = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

export const NewsSidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--gray-100);
`;

export const NewsSidebarTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const NewsSidebarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const NewsSidebarItem = styled.div`
  padding: 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--card-background);
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: var(--primary-300);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

export const NewsSidebarItemTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

export const NewsSidebarItemContent = styled.p`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
`;

export const NewsSidebarItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
`;

export const NewsSidebarViewMore = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary-700);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const NewsSidebarEmpty = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

export const NewsSidebarLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
`;