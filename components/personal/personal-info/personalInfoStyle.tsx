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
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const StatCard = styled.div<{ $color: string }>`
  background: ${props => props.$color};
  flex: 1;
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
  display: flex;
  align-items: center;
  gap: 8px;
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

// Skills Section Styles
export const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const SkillCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  position: relative;
`;

export const SkillCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const SkillInfo = styled.div`
  flex: 1;
`;

export const SkillTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
`;

export const SkillDescription = styled.p`
  margin: 0 0 4px 0;
  color: #6b7280;
`;

export const SkillMainTag = styled.span`
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

export const SkillActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const SkillActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

export const SkillDeleteButton = styled(SkillActionButton)`
  color: #ef4444;

  &:hover {
    background: #fef2f2;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
`;

export const EmptyStateIcon = styled.div`
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.p`
  margin: 0;
  font-size: 16px;
`;

export const EmptyStateDescription = styled.p`
  margin: 8px 0 0 0;
  font-size: 14px;
`;

// Experience Section Styles
export const ExperienceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const ExperienceCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  position: relative;
`;

export const ExperienceCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ExperienceInfo = styled.div`
  flex: 1;
`;

export const ExperienceTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
`;

export const ExperienceCompany = styled.p`
  margin: 0 0 4px 0;
  color: #6b7280;
`;

export const ExperienceDate = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

export const ExperienceActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ExperienceActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

export const ExperienceDeleteButton = styled(ExperienceActionButton)`
  color: #ef4444;

  &:hover {
    background: #fef2f2;
  }
`;

// Certificate Section Styles
export const CertificateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const CertificateCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  position: relative;
`;

export const CertificateCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CertificateInfo = styled.div`
  flex: 1;
`;

export const CertificateTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
`;

export const CertificateId = styled.p`
  margin: 0 0 4px 0;
  color: #6b7280;
`;

export const CertificateDate = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

export const CertificateActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const CertificateActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

export const CertificateDeleteButton = styled(CertificateActionButton)`
  color: #ef4444;

  &:hover {
    background: #fef2f2;
  }
`;

// Education Section Styles
export const EducationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EducationCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  position: relative;
`;

export const EducationCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const EducationInfo = styled.div`
  flex: 1;
`;

export const EducationTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
`;

export const EducationMajor = styled.p`
  margin: 0 0 4px 0;
  color: #6b7280;
`;

export const EducationDescription = styled.p`
  margin: 0 0 4px 0;
  color: #6b7280;
  font-size: 14px;
`;

export const EducationDate = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

export const EducationActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const EducationActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

export const EducationDeleteButton = styled(EducationActionButton)`
  color: #ef4444;

  &:hover {
    background: #fef2f2;
  }
`;