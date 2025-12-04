import styled from "styled-components";

export const BookingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TimeSlotContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
  }
`;

export const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--card-background);

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

export const TimeSlotButton = styled.button<{ $isSelected: boolean }>`
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: ${({ $isSelected }) =>
    $isSelected ? "var(--primary-500)" : "var(--card-background)"};
  color: ${({ $isSelected }) => ($isSelected ? "white" : "var(--text-primary)")};
  font-size: 0.875rem;
  font-weight: ${({ $isSelected }) => ($isSelected ? "600" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ $isSelected }) =>
      $isSelected ? "var(--primary-600)" : "var(--gray-100)"};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;
