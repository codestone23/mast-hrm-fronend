import { REQUEST_STATUS } from "@/constants/enums";
import styled from "styled-components";

export const ModalContent = styled.div`
  padding: 0;
`;

export const FormSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  
  p {
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--error-50);
  border: 1px solid var(--error-200);
  border-radius: var(--radius-md);
  color: var(--error-700);
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--success-50);
  border: 1px solid var(--success-200);
  border-radius: var(--radius-md);
  color: var(--success-700);
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
`;

export const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background-secondary);
`;

export const TimeSlot = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 1px solid ${({ $selected }) =>
      $selected ? "var(--primary-500)" : "var(--border)"};
  border-radius: var(--radius-sm);
  background: ${({ $selected }) => ($selected ? "var(--primary-50)" : "white")};
  color: ${({ $selected }) =>
      $selected ? "var(--primary-700)" : "var(--text-secondary)"};
  font-size: 0.75rem;
  font-weight: ${({ $selected }) => ($selected ? "600" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: var(--primary-300);
    background: var(--primary-25);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    flex-shrink: 0;
  }
`;

export const ReportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

export const ReportItem = styled.div`
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: white;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--primary-200);
    box-shadow: var(--shadow-sm);
  }
`;

export const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

export const ReportTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const ReportType = styled.span`
  padding: 0.25rem 0.5rem;
  background: var(--primary-100);
  color: var(--primary-700);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
`;

export const ReportMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const ReportMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const ReportDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  
  svg {
    margin-bottom: 1rem;
    color: var(--text-muted);
  }
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
  }
  
  p {
    font-size: 0.875rem;
    margin: 0;
  }
`;

export const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

export const RequestItem = styled.div<{
    $status?: REQUEST_STATUS;
}>`
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${(props) => {
        const status = props.$status || REQUEST_STATUS.PENDING;
        switch (status) {
            case REQUEST_STATUS.APPROVED:
                return "#22c55e";
            case REQUEST_STATUS.REJECTED:
                return "#ef4444";
            default:
                return "#f59e0b";
        }
    }};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

export const RequestContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
`;

export const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const RequestTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
`;

export const RequestLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`;

export const RequestRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 0.75rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    align-items: flex-start;
    width: 100%;
  }
`;

export const RequestNote = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin: 0;
  line-height: 1.5;
`;

export const RequestDescription = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
  word-break: break-word;
`;

export const RequestStatus = styled.span<{ $color?: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $color }) => ($color ? `${$color}15` : "#f3f4f6")};
  color: ${({ $color }) => $color || "#6b7280"};
  text-align: center;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const RequestMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const RequestMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  line-height: 1.5;
  font-size: 0.875rem;
  color: #6b7280;
  
  svg {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    color: #9ca3af;
  }
  
  span {
    white-space: nowrap;
  }
`;

export const RequestReason = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  word-break: break-word;
`;

// Styled components for Request Detail Modal
export const DetailSection = styled.div`
  padding: 1rem;
  background: var(--background-secondary);
  border-radius: var(--radius-md);
  margin: 1rem 0;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`;

export const DetailLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 120px;
`;

export const DetailValue = styled.div`
  font-size: 0.875rem;
  color: var(--text-primary);
  text-align: right;
  flex: 1;
`;

export const StatusBadge = styled.div<{
    $status: REQUEST_STATUS;
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  
  ${({ $status }) => {
      switch ($status) {
          case REQUEST_STATUS.PENDING:
              return `
          background: #FFF3CD;
          color: #856404;
        `;
          case REQUEST_STATUS.APPROVED:
              return `
          background: #D1F2DD;
          color: #155724;
        `;
          case REQUEST_STATUS.REJECTED:
              return `
          background: #F8D7DA;
          color: #721C24;
        `;
          default:
              return `
          background: var(--gray-100);
          color: var(--gray-700);
        `;
      }
  }}
`;

export const Divider = styled.div`
  height: 1px;
  background: var(--border);
  margin: 1rem 0;
`;

export const ReasonBox = styled.div`
  padding: 1rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-primary);
  max-height: 150px;
  overflow-y: auto;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const InfoCard = styled.div`
  padding: 1rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InfoCardLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
`;

export const TitleCard = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
`;

export const InfoCardValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

// Header styled components for RequestDetailModal
export const DetailHeader = styled(DetailSection)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
`;

export const DetailHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const DetailHeaderTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
`;

export const DetailHeaderSubtitle = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  opacity: 0.9;
`;

export const DetailInfoGrid = styled(InfoGrid)`
  margin-top: 0;
`;

export const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ApprovalSection = styled(DetailSection)`
  background: #D1F2DD;
`;

export const ApprovalSectionTitle = styled(SectionTitle)`
  color: #155724;
`;

export const RejectionSection = styled(DetailSection)`
  background: #F8D7DA;
  border: 1px solid #F5C6CB;
`;

export const RejectionSectionTitle = styled(SectionTitle)`
  color: #721C24;
`;

export const WhiteReasonBox = styled(ReasonBox)`
  background: white;
  border-color: #F5C6CB;
`;

// ListRequest styled components
export const ListRequestContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

export const ListRequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ListRequestTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
`;

export const ListRequestSubtitle = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const ListRequestHighlight = styled.span`
  font-weight: 600;
  color: var(--primary-500);
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  background: var(--background-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
`;

export const FilterLabel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  min-width: max-content;
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FilterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

export const ResetFilterButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  background: white;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary-50);
    border-color: var(--primary-300);
    color: var(--primary-700);
  }
`;

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

export const EmptyStateIcon = styled.div`
  margin-bottom: 1rem;
  
  svg {
    color: var(--text-muted);
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.875rem;
  margin: 0;
`;

// Icon wrapper for inline display
export const IconWrapper = styled.span`
  display: inline;
  margin-right: 0.25rem;
`;

// Request action buttons
export const RequestActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
  gap: 0.5rem;
  flex-shrink: 0;
`;

export const ApproveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  min-width: 110px;
  border: none;
  border-radius: 8px;
  background: #22c55e;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  &:hover:not(:disabled) {
    background: #16a34a;
    box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.3), 0 2px 4px -1px rgba(34, 197, 94, 0.2);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #9ca3af;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
  }
  
  svg {
    flex-shrink: 0;
  }
`;

export const RejectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  min-width: 110px;
  border: none;
  border-radius: 8px;
  background: #ef4444;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  &:hover:not(:disabled) {
    background: #dc2626;
    box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3), 0 2px 4px -1px rgba(239, 68, 68, 0.2);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #9ca3af;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
  }
  
  svg {
    flex-shrink: 0;
  }
`;

export const BulkActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const BulkApproveButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  background: #22c55e;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #16a34a;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const BulkRejectButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  background: #ef4444;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Pagination styles
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
`;

export const PaginationButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: white;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  
  &:hover:not(:disabled) {
    border-color: var(--primary-300);
    background: var(--primary-50);
    color: var(--primary-700);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
`;
