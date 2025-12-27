import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContainer = styled.div<{ $width?: string; $isLarge?: boolean }>`
  background-color: var(--surface);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: ${props => props.$isLarge ? '1200px' : (props.$width || "500px")};
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--background-hover);
    color: var(--text-primary);
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
  background-color: var(--background);
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
`;

export const FormInput = styled.input<{ $hasError?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.$hasError ? 'var(--error-500)' : 'var(--border-color)'};
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--surface);
  color: var(--text-primary);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? 'var(--error-500)' : 'var(--primary-500)'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

export const FormSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--surface);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  background-color: var(--surface);
  color: var(--text-primary);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--background-hover);
  }
`;

export const SaveButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: var(--primary-500);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-600);
  }
`;

// Detail Modal Styles
export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DetailTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DetailLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
`;

export const DetailValue = styled.div`
  font-size: 14px;
  color: var(--text-primary);
  padding-left: 24px;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: var(--background);
  border-radius: 12px;
  border: 1px solid var(--border-color);
`;

export const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserEmail = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

export const StatusBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.$color}20;
  color: ${props => props.$color};
`;

export const DetailActions = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
`;

export const ActionButton = styled.button<{ $variant: "edit" | "delete" }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$variant) {
      case "edit":
        return `
          background-color: var(--warning-100);
          color: var(--warning-600);
          &:hover {
            background-color: var(--warning-200);
          }
        `;
      case "delete":
        return `
          background-color: var(--error-100);
          color: var(--error-600);
          &:hover {
            background-color: var(--error-200);
          }
        `;
    }
  }}
`;

// PersonalInfo Layout Components
export const PersonalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--background-secondary);
`;

export const LeftSidebar = styled.div`
  width: 300px;
  background: white;
  border-right: 1px solid var(--border-color);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const UserProfile = styled.div`
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
`;

export const UserAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

export const UserPosition = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SidebarDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SidebarDetailLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SidebarDetailValue = styled.div`
  font-size: 14px;
  color: var(--text-primary);
`;

export const StatsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StatCard = styled.div<{ $color: string }>`
  background: ${props => props.$color}10;
  border: 1px solid ${props => props.$color}20;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

export const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export const MainContent = styled.div`
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
`;

export const ContentTabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background: var(--background);
`;

export const TabItem = styled.div<{ $active: boolean }>`
  padding: 16px 24px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$active ? 'var(--primary-600)' : 'var(--text-secondary)'};
  border-bottom: 2px solid ${props => props.$active ? 'var(--primary-600)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-600);
  }
`;

export const TabContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
`;

export const SectionAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-50);
    color: var(--primary-600);
    border-color: var(--primary-200);
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.div`
  font-size: 14px;
  color: var(--text-primary);
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 80px;
  gap: 16px;
  padding: 12px 16px;
  background: var(--background);
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 80px;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
  color: var(--text-primary);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--background-hover);
  }
`;

export const TableCell = styled.div`
  display: flex;
  align-items: center;
`;

export const TableActionButtons = styled.div`
  display: flex;
  gap: 4px;
`;

export const TableActionButton = styled.button<{ $type: "edit" | "delete" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$type) {
      case "edit":
        return `
          background: var(--warning-100);
          color: var(--warning-600);
          &:hover {
            background: var(--warning-200);
          }
        `;
      case "delete":
        return `
          background: var(--error-100);
          color: var(--error-600);
          &:hover {
            background: var(--error-200);
          }
        `;
    }
  }}
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$variant) {
      case "primary":
        return `
          background-color: var(--primary-500);
          color: white;
          &:hover {
            background-color: var(--primary-600);
          }
        `;
      case "secondary":
      default:
        return `
          background-color: var(--gray-100);
          color: var(--text-primary);
          &:hover {
            background-color: var(--gray-200);
          }
        `;
    }
  }}
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

// Modal Form Styles
export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const UserInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const UserInfoLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
`;

export const UserInfoValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #111827;
`;

export const RoleBadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const RoleBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e0e7ff;
  color: #6366f1;
`;

export const CurrentRolesSection = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export const CurrentRolesLabel = styled.div`
  margin-bottom: 4px;
`;

export const ErrorMessage = styled.div`
  font-size: 14px;
  color: #ef4444;
  padding: 12px;
  background-color: #fef2f2;
  border-radius: 8px;
`;