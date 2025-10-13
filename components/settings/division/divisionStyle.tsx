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
  AssetsGradientBox,
  AssetsNumber,
  AssetsLabel,
  AssetsListContainer,
  AssetsListTitle,
  AssetsItem,
  ResourcesCard,
  ResourcesHeader,
  ResourcesTitle,
  ResourcesLink,
  EffortSection,
  EffortDateLabel,
  EffortDisplay,
  EffortNumber,
  EffortLabel,
  EffortPercentage,
  EffortText,
  ResourcesInfo,
  ResourcesDetailLink,
} from "../../personal/personalStyle";

export const SearchInput = styled.input`
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 14px;
  min-width: 300px;
  background-color: white;
  color: var(--text-primary);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: var(--primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);

  &:hover {
    background-color: var(--primary-600);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const DivisionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

export const DivisionCard = styled.div`
  background-color: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: var(--shadow-sm);

  &:hover {
    border-color: var(--primary-200);
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
`;

export const DivisionIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary-100), var(--primary-50));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
`;

export const DivisionInfo = styled.div`
  flex: 1;
`;

export const DivisionName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  line-height: 1.3;
`;

export const DivisionDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const DivisionStats = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  flex-wrap: wrap;

  .stat {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;

    .status {
      font-weight: 600;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      font-size: 12px;
    }
  }
`;

export const DivisionActions = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: all 0.2s ease;

  ${DivisionCard}:hover & {
    opacity: 1;
  }
`;

export const ActionButton = styled.button<{ $variant: "edit" | "delete" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);

  ${props => {
    switch (props.$variant) {
      case "edit":
        return `
          background-color: var(--warning-100);
          color: var(--warning-600);
          &:hover {
            background-color: var(--warning-200);
            transform: scale(1.05);
          }
        `;
      case "delete":
        return `
          background-color: var(--error-100);
          color: var(--error-600);
          &:hover {
            background-color: var(--error-200);
            transform: scale(1.05);
          }
        `;
    }
  }}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: linear-gradient(135deg, var(--background), var(--background-secondary));
  border-radius: var(--radius-lg);
  border: 2px dashed var(--border);
`;

export const EmptyIcon = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-50));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-400);
  margin-bottom: 24px;
  box-shadow: var(--shadow-md);
`;

export const EmptyText = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
`;

// Modal Styles - tương tự như timekeeping
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

export const ModalContainer = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
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
  border-radius: var(--radius-md);
  background-color: var(--background-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--background);
    color: var(--text-primary);
  }
`;

export const ModalBody = styled.div`
  padding: 0 24px;
  flex: 1;
  overflow-y: auto;
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid var(--border);
  margin-top: 24px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

export const FormInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.$hasError ? 'var(--error-300)' : 'var(--border)'};
  border-radius: var(--radius-md);
  font-size: 14px;
  background-color: white;
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

export const FormTextArea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.$hasError ? 'var(--error-300)' : 'var(--border)'};
  border-radius: var(--radius-md);
  font-size: 14px;
  background-color: white;
  color: var(--text-primary);
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? 'var(--error-500)' : 'var(--primary-500)'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

export const FormSelect = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.$hasError ? 'var(--error-300)' : 'var(--border)'};
  border-radius: var(--radius-md);
  font-size: 14px;
  background-color: white;
  color: var(--text-primary);
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? 'var(--error-500)' : 'var(--primary-500)'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CancelButton = styled.button`
  padding: 12px 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: white;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--background-secondary);
    border-color: var(--text-secondary);
  }
`;

export const SaveButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-md);
  background-color: var(--primary-500);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);

  &:hover {
    background-color: var(--primary-600);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    background-color: var(--text-muted);
    cursor: not-allowed;
    box-shadow: none;
  }
`;
