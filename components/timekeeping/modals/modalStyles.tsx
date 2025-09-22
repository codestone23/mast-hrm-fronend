import styled from 'styled-components';

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
  border: 1px solid ${({ $selected }) => $selected ? 'var(--primary-500)' : 'var(--border)'};
  border-radius: var(--radius-sm);
  background: ${({ $selected }) => $selected ? 'var(--primary-50)' : 'white'};
  color: ${({ $selected }) => $selected ? 'var(--primary-700)' : 'var(--text-secondary)'};
  font-size: 0.75rem;
  font-weight: ${({ $selected }) => $selected ? '600' : '400'};
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
`;

export const RequestItem = styled.div`
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

export const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

export const RequestTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const RequestStatus = styled.span<{ $status: 'pending' | 'approved' | 'rejected' }>`
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ $status }) => {
    switch ($status) {
      case 'pending':
        return `
          background: var(--warning-100);
          color: var(--warning-700);
        `;
      case 'approved':
        return `
          background: var(--success-100);
          color: var(--success-700);
        `;
      case 'rejected':
        return `
          background: var(--error-100);
          color: var(--error-700);
        `;
      default:
        return `
          background: var(--gray-100);
          color: var(--gray-700);
        `;
    }
  }}
`;

export const RequestMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const RequestMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const RequestReason = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
`;
