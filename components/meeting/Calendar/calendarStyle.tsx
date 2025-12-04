import styled, { css } from "styled-components";

export const CalendarContainer = styled.div`
  background: var(--card-background);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const CalendarNavButton = styled.button`
  background: var(--gray-100);
  border: none;
  border-radius: var(--radius-md);
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: var(--text-primary);

  &:hover {
    background: var(--gray-200);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CalendarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  text-transform: capitalize;
`;

export const WeeklyGrid = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(5, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  min-width: 900px;
  width: 100%;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gray-100);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gray-400);
    border-radius: 4px;

    &:hover {
      background: var(--gray-500);
    }
  }
`;

export const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--card-background);
  position: sticky;
  left: 0;
  z-index: 10;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
`;

export const TimeSlot = styled.div<{ $isHeader?: boolean }>`
  height: ${({ $isHeader }) => ($isHeader ? "60px" : "40px")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isHeader }) => ($isHeader ? "0.875rem" : "0.75rem")};
  font-weight: ${({ $isHeader }) => ($isHeader ? "600" : "400")};
  color: ${({ $isHeader }) => ($isHeader ? "var(--text-primary)" : "var(--text-secondary)")};
  background: ${({ $isHeader }) => ($isHeader ? "var(--gray-100)" : "var(--card-background)")};
  border-bottom: 1px solid var(--border);
  padding: 0 0.5rem;
  text-align: center;
`;

export const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--card-background);
  min-width: 0;
`;

export const DayHeader = styled.div<{ $isToday?: boolean; $isSelected?: boolean; $isPast?: boolean }>`
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ $isToday, $isSelected, $isPast }) => {
    if ($isPast) return "var(--gray-50)";
    if ($isSelected) return "var(--primary-100)";
    if ($isToday) return "var(--primary-50)";
    return "var(--gray-50)";
  }};
  border-bottom: 1px solid var(--border);
  padding: 0.5rem;
  position: sticky;
  top: 0;
  z-index: 5;
  opacity: ${({ $isPast }) => ($isPast ? "0.6" : "1")};

  ${({ $isToday }) =>
    $isToday &&
    css`
      border-top: 2px solid var(--primary-500);
    `}

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      border-top: 2px solid var(--primary-600);
    `}

  .day-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ $isPast }) => ($isPast ? "var(--text-secondary)" : "var(--text-primary)")};
    text-transform: capitalize;
    margin-bottom: 0.25rem;
  }

  .day-number {
    font-size: 0.75rem;
    color: ${({ $isPast }) => ($isPast ? "var(--text-muted)" : "var(--text-secondary)")};
  }
`;

export const DayContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const HourSlot = styled.div<{ $isPast?: boolean }>`
  height: 40px;
  border-bottom: 1px solid var(--border);
  position: relative;
  cursor: ${({ $isPast }) => ($isPast ? "not-allowed" : "pointer")};
  transition: background-color 0.15s ease;
  background: ${({ $isPast }) => ($isPast ? "var(--gray-100)" : "var(--card-background)")};
  opacity: ${({ $isPast }) => ($isPast ? "0.5" : "1")};

  &:hover {
    background: ${({ $isPast }) => ($isPast ? "var(--gray-200)" : "var(--gray-50)")};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const MeetingBlock = styled.div<{ $isMyMeeting?: boolean; $isClickable?: boolean }>`
  position: absolute;
  left: 2px;
  right: 2px;
  background: ${({ $isMyMeeting }) => ($isMyMeeting ? "var(--primary-600)" : "var(--gray-500)")};
  color: white;
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "default")};
  transition: all 0.2s ease;
  overflow: hidden;
  z-index: 2;
  border-left: 3px solid ${({ $isMyMeeting }) => ($isMyMeeting ? "var(--primary-700)" : "var(--gray-600)")};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  opacity: ${({ $isClickable }) => ($isClickable ? "1" : "0.85")};

  ${({ $isClickable, $isMyMeeting }) => {
    if ($isClickable) {
      return css`
        &:hover {
          background: ${$isMyMeeting ? "var(--primary-700)" : "var(--gray-600)"};
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          z-index: 3;
        }
      `;
    }
    return css`
      &:hover {
        opacity: 0.9;
      }
    `;
  }}

  .meeting-time {
    font-weight: 600;
    font-size: 0.65rem;
    margin-bottom: 0.125rem;
    opacity: 0.95;
  }

  .meeting-title {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.125rem;
  }

  .meeting-room {
    font-size: 0.6rem;
    opacity: 0.9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
