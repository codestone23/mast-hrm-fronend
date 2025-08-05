import styled from 'styled-components';

export const PersonalContainer = styled.div`
  background-color: var(--background-secondary);
  min-height: 100vh;
  padding: 1.5rem;
  padding-top: calc(60px + 1.5rem);
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div<{ span?: number }>`
  background: var(--card-background);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  grid-column: span ${props => props.span || 1};
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

export const WelcomeCard = styled(Card)`
  background: linear-gradient(135deg, var(--secondary-400), var(--secondary-500));
  color: white;
  position: relative;
  overflow: hidden;
  
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
`;

export const StatsNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
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
  margin-bottom: 1.5rem;
  
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
  color: ${props => props.color || 'var(--primary-600)'};
  display: flex;
  align-items: center;
`;

// Profile Components
export const ProfileDetail = styled.div<{ marginTop?: string; fontSize?: string; opacity?: number }>`
  margin-top: ${props => props.marginTop || '0'};
  font-size: ${props => props.fontSize || '0.85rem'};
  opacity: ${props => props.opacity || 1};
`;

export const ProgressText = styled.div<{ textAlign?: string; marginTop?: string; fontSize?: string }>`
  margin-top: ${props => props.marginTop || '0'};
  font-size: ${props => props.fontSize || '0.8rem'};
  text-align: ${props => props.textAlign || 'left'};
`;

// Stats Components
export const StatsHeader = styled.div<{ marginBottom?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: ${props => props.marginBottom || '1rem'};
`;

export const StatsNewest = styled.div<{ marginTop?: string }>`
  margin-top: ${props => props.marginTop || '1rem'};
  text-align: center;
`;

export const StatsNewestLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
`;

// Work Stats Components
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
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
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

export const AssetsItem = styled.div<{ marginBottom?: string }>`
  margin-bottom: ${props => props.marginBottom || '0.25rem'};
`;

// Resources Components
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
`;

export const EffortNumber = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: var(--error-600);
`;

export const EffortLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const EffortPercentage = styled.span<{ color?: string }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.color || 'var(--success-600)'};
`;

export const EffortText = styled.span<{ fontSize?: string; color?: string }>`
  font-size: ${props => props.fontSize || '0.9rem'};
  color: ${props => props.color || 'var(--text-secondary)'};
`;

export const EffortNote = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
`;

export const ResourcesInfo = styled.div<{ marginBottom?: string }>`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: ${props => props.marginBottom || '0.5rem'};
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
  
  &:hover {
    background: var(--secondary-600);
    transform: translateY(-1px);
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
