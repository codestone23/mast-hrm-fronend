import styled from "styled-components";

export const ProjectDetailContainer = styled.div`
  padding: 2rem;
  background: var(--background-primary);
  min-height: 100vh;
`;

export const ProjectDetailHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
`;

export const ProjectDetailTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

export const ProjectDetailMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  
  span {
    color: var(--text-muted);
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

export const ProjectDetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ProjectDetailCard = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

export const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const ProjectOverview = styled.div`
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  h4 {
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 600;
    margin: 1.5rem 0 0.75rem 0;
  }
  
  ul {
    color: var(--text-secondary);
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
  }
`;

export const ProjectProgress = styled.div`
  margin-bottom: 1.5rem;
`;

export const ProjectProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const ProjectProgressText = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const ProjectProgressPercent = styled.span`
  font-size: 0.875rem;
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

export const ProjectInfo = styled.div`
  margin-bottom: 1.5rem;
`;

export const ProjectInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`;

export const HorizontalStack = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 30px;
  margin: 0 0.5rem;
  width: 2px;
  background: var(--border);
`;

export const ProjectInfoLabel = styled.span`
  font-size: 0.875rem;
`;

export const ProjectInfoValue = styled.span`
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
`;

export const TaskSection = styled.div``;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TaskItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
`;

export const TaskCheckbox = styled.div<{ $completed: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  border: 2px solid ${({ $completed }) => $completed ? 'var(--success-500)' : 'var(--border)'};
  background: ${({ $completed }) => $completed ? 'var(--success-500)' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

export const TaskContent = styled.div`
  flex: 1;
`;

export const TaskTitle = styled.h4<{ $completed: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $completed }) => $completed ? 'var(--text-muted)' : 'var(--text-primary)'};
  margin: 0 0 0.25rem 0;
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
`;

export const TaskDescription = styled.p`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

export const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const TaskAssignee = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

export const TaskDueDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

export const TaskPriority = styled.div<{ $priority: 'high' | 'medium' | 'low' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${({ $priority }) => {
    switch ($priority) {
      case 'high':
        return 'var(--error-600)';
      case 'medium':
        return 'var(--warning-600)';
      case 'low':
        return 'var(--success-600)';
      default:
        return 'var(--text-secondary)';
    }
  }};
`;

export const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TeamMember = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
`;

export const TeamMemberAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
`;

export const TeamMemberInfo = styled.div`
  flex: 1;
`;

export const TeamMemberName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
`;

export const TeamMemberRole = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
`;

export const TeamMemberContact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
`;

export const TimelineSection = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border);
  }
`;

export const TimelineItem = styled.div<{ $isLast: boolean }>`
  position: relative;
  display: flex;
  gap: 1rem;
  margin-bottom: ${({ $isLast }) => $isLast ? '0' : '1.5rem'};
  
  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--primary-500);
    border: 2px solid white;
    box-shadow: 0 0 0 2px var(--border);
    z-index: 1;
  }
`;

export const TimelineDate = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  width: 80px;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const TimelineContent = styled.div`
  flex: 1;
  margin-left: 1rem;
`;

export const TimelineTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
`;

export const TimelineDescription = styled.p`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
`;

export const DocumentSection = styled.div``;

export const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--background-primary);
    border-color: var(--primary-200);
  }
`;

export const DocumentIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  flex-shrink: 0;
`;

export const DocumentInfo = styled.div`
  flex: 1;
`;

export const DocumentName = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
`;

export const DocumentSize = styled.p`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
`;

export const DocumentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary-600);
  }
`;

export const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-600);
    border-color: var(--primary-200);
    background: var(--primary-50);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
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
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

export const EmptyStateDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    gap: 4px;
    overflow-x: auto;
  }
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border: none;
  background: ${({ $active }) => ($active ? "#4f46e5" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#6b7280")};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ $active }) => ($active ? "#4338ca" : "#f3f4f6")};
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

export const TabContent = styled.div`
  margin-top: 24px;
`;