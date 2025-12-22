import styled from "styled-components";

export const ProjectsContainer = styled.div`
  padding: 2rem;
  background: var(--background-primary);
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const ProjectsHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const ProjectsTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const ProjectsSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const ProjectsActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const ProjectCard = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: var(--radius-md);
  }
`;

export const ProjectHeader = styled.div`
  margin-bottom: 1rem;
`;

export const ProjectInfo = styled.div`
  flex: 1;
`;

export const ProjectName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    word-break: break-word;
  }
`;

export const ProjectDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    word-break: break-word;
  }
`;

export const ProjectMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const ProjectMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  
  svg {
    color: var(--primary-500);
    flex-shrink: 0;
  }
`;

export const ProjectStatus = styled.div<{ $status: 'active' | 'completed' | 'paused' | 'cancelled' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ $status }) => {
    switch ($status) {
      case 'active':
        return `
          background: var(--success-50);
          color: var(--success-700);
          border: 1px solid var(--success-200);
        `;
      case 'completed':
        return `
          background: var(--primary-50);
          color: var(--primary-700);
          border: 1px solid var(--primary-200);
        `;
      case 'paused':
        return `
          background: var(--warning-50);
          color: var(--warning-700);
          border: 1px solid var(--warning-200);
        `;
      case 'cancelled':
        return `
          background: var(--error-50);
          color: var(--error-700);
          border: 1px solid var(--error-200);
        `;
      default:
        return `
          background: var(--gray-50);
          color: var(--gray-700);
          border: 1px solid var(--gray-200);
        `;
    }
  }}
`;

export const ProjectProgress = styled.div`
  margin-bottom: 1rem;
`;

export const ProjectProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

export const ProjectProgressText = styled.span`
  color: var(--text-secondary);
`;

export const ProjectProgressPercent = styled.span`
  color: var(--text-primary);
  font-weight: 600;
`;

export const ProjectProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
`;

export const ProjectProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
`;

export const ProjectTeam = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const ProjectTeamLabel = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const ProjectTeamAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: -0.5rem;
`;

export const ProjectTeamAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid white;
  margin-left: -0.5rem;
  
  &:first-child {
    margin-left: 0;
  }
`;

export const ProjectTeamCount = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid white;
  margin-left: -0.5rem;
`;

export const ProjectActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const ProjectActionButton = styled.button<{ $danger?: boolean }>`
  background: ${({ $danger }) => $danger ? 'var(--error-500)' : 'var(--primary-500)'};
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background: ${({ $danger }) => $danger ? 'var(--error-600)' : 'var(--primary-600)'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.6875rem;
    width: 100%;
    justify-content: center;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const EmptyState = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
`;

export const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: var(--text-secondary);
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

export const EmptyStateDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatsCard = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
`;

export const StatsCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const StatsCardIcon = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: ${({ $color }) => $color || 'var(--primary-100)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color ? 'white' : 'var(--primary-600)'};
`;

export const StatsCardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
`;

export const StatsCardNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

export const StatsCardLabel = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.625rem 0.875rem;
  }
`;

export const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-primary);
  user-select: none;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    flex: 1;
    justify-content: space-between;
  }
`;

export const ToggleSwitch = styled.div<{ $checked: boolean }>`
  position: relative;
  width: 44px;
  height: 24px;
  background: ${({ $checked }) => $checked ? 'var(--primary-500)' : 'var(--gray-300)'};
  border-radius: 12px;
  transition: background 0.2s ease;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $checked }) => $checked ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const ManagerBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--primary-50);
  color: var(--primary-700);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
    padding: 0.2rem 0.4rem;
    margin-left: 0.25rem;
    
    svg {
      width: 10px;
      height: 10px;
    }
  }
`;

export const ProjectCardManaged = styled(ProjectCard)`
  border-left: 4px solid var(--primary-500);
  background: linear-gradient(to right, var(--primary-50) 0%, white 4%);
`;