import styled from "styled-components";

export const PersonalInfoContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
`;

export const LeftSidebar = styled.div`
  width: 320px;
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  height: fit-content;
  position: sticky;
  top: 80px;
`;

export const UserProfile = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const UserAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, var(--primary-500));
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--border);
  box-shadow: var(--shadow-md);
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

export const UserRole = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

export const ProfileProgress = styled.div`
  margin-bottom: 2rem;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--success-500), var(--success-600));
  border-radius: 4px;
`;

export const UserDetails = styled.div`
  margin-bottom: 2rem;
`;

export const DetailItem = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
`;

export const DetailValue = styled.div`
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
  
  a {
    color: var(--primary-600);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const StatCard = styled.div<{ $color: string }>`
  background: ${props => props.$color};
  padding: 1rem;
  border-radius: var(--radius-md);
  text-align: center;
  color: white;
`;

export const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.9;
`;

export const MainContent = styled.div`
  flex: 1;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  overflow: hidden;
`;

export const ContentTabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border);
  background: var(--background-secondary);
`;

export const TabItem = styled.div<{ $active: boolean }>`
  padding: 1rem 2rem;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.$active ? 'var(--primary-500)' : 'transparent'};
  color: ${props => props.$active ? 'var(--primary-600)' : 'var(--text-secondary)'};
  font-weight: ${props => props.$active ? '600' : '500'};
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-600);
  }
`;

export const TabContent = styled.div`
  padding: 2rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const SectionAction = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-600);
    background: var(--background-secondary);
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

export const InfoValue = styled.div`
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
`;

export const FamilyTable = styled.div`
  margin-top: 1rem;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 80px;
  gap: 1rem;
  padding: 1rem;
  background: var(--background-secondary);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 80px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.div`
  font-size: 0.875rem;
  color: var(--text-primary);
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled.button<{ $type: 'edit' | 'delete' }>`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.$type === 'edit' ? 'var(--primary-600)' : 'var(--error-600)'};
  
  &:hover {
    background: ${props => props.$type === 'edit' ? 'var(--primary-50)' : 'var(--error-50)'};
  }
`;