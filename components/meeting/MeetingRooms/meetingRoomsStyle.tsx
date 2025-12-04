import styled from "styled-components";

export const MeetingRoomsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: var(--background-secondary);
  min-height: calc(100vh - 60px);
`;

export const MeetingRoomsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const MeetingRoomsTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const MeetingRoomsActions = styled.div`
  display: flex;
  gap: 1rem;
`;

export const FiltersContainer = styled.div`
  background: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

export const MeetingRoomsContent = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const CalendarSection = styled.div`
  background: transparent;
  border-radius: var(--radius-md);
  padding: 0;
  box-shadow: none;
  overflow-x: auto;
`;

export const BookingSection = styled.div`
  background: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  max-height: calc(100vh - 200px);
  overflow-y: auto;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

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

export const MeetingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const MeetingItem = styled.div<{ $isMyMeeting?: boolean }>`
  border: 1px solid ${({ $isMyMeeting }) => ($isMyMeeting ? "var(--primary-300)" : "var(--border)")};
  border-radius: var(--radius-md);
  padding: 1rem;
  transition: all 0.2s ease;
  background: ${({ $isMyMeeting }) => ($isMyMeeting ? "var(--primary-50)" : "var(--card-background)")};

  &:hover {
    border-color: ${({ $isMyMeeting }) => ($isMyMeeting ? "var(--primary-500)" : "var(--primary-300)")};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

export const MeetingItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  span {
    font-size: 0.875rem;
    color: var(--primary-600);
    font-weight: 500;
  }
`;

export const MeetingItemContent = styled.div`
  margin-bottom: 0.75rem;

  p {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0 0 0.5rem 0;
  }

  div {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
`;

export const MeetingItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
  text-align: center;

  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    font-size: 0.875rem;
    margin: 0;
  }
`;
