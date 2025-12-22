import { REQUEST_STATUS } from "@/constants/enums";
import styled from "styled-components";

export const DailyReportsContainer = styled.div`
  background-color: var(--background-secondary);
  min-height: 100vh;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Tab = styled.div<{ $active: boolean; $isMobile?: boolean }>`
  padding: ${props => props.$isMobile ? '8px 12px' : '12px 24px'};
  cursor: pointer;
  font-weight: 500;
  font-size: ${props => props.$isMobile ? '12px' : '14px'};
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  ${(props) =>
    props.$active
      ? `
    background: #2196F3;
    color: white;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
  `
      : `
    color: #666;
    
    &:hover {
      background: #f5f5f5;
      color: #333;
    }
  `}
`;

export const HeaderButtons = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${props => props.$isMobile ? '8px' : '12px'};
  flex-wrap: ${props => props.$isMobile ? 'wrap' : 'nowrap'};
`;

export const CreateButton = styled.button<{ $isMobile?: boolean }>`
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: ${props => props.$isMobile ? '8px 12px' : '12px 20px'};
  font-weight: 500;
  font-size: ${props => props.$isMobile ? '12px' : '14px'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1976D2;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
  }
`;

export const MainContent = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const CalendarContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
  }
`;

export const MonthNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

export const MonthButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #8D8D8D;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

export const MonthDisplay = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const Legend = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 1.5rem;
  font-size: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
    font-size: 11px;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
`;

export const LegendColor = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${(props) => props.$color};
  flex-shrink: 0;
`;

export const CalendarHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 1px;
  background: #E0E0E0;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
`;

export const WeekDay = styled.div`
  background: white;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #333;
  font-size: 14px;

  @media (max-width: 768px) {
    padding: 8px 4px;
    font-size: 11px;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #E0E0E0;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
`;

export const DayCell = styled.div<{
  $isCurrentMonth: boolean;
  $status?: REQUEST_STATUS;
  $isToday?: boolean;
}>`
  background: ${(props) => {
    if (!props.$isCurrentMonth) return "#f8f8f8";
    if (props.$status === REQUEST_STATUS.APPROVED) return "#c9f8c9"; 
    if (props.$status === REQUEST_STATUS.PENDING) return "#FFCDD2";
    return "white";
  }};
  padding: 8px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: ${(props) => (props.$isCurrentMonth ? "pointer" : "default")};
  transition: all 0.2s ease;
  
  ${(props) =>
    props.$isToday &&
    `
    border: 2px solid #e87979;
  `}

  @media (max-width: 768px) {
    padding: 4px;
    min-height: 60px;
    font-size: 11px;
  }
`;

export const DayNumber = styled.div<{
  $isCurrentMonth: boolean;
  $isToday?: boolean;
}>`
  font-weight: ${(props) => (props.$isToday ? "700" : "500")};
  color: ${(props) => {
    if (props.$isToday) return "#e87979";
    if (!props.$isCurrentMonth) return "#999";
    return "#333";
  }};
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

export const DayStatus = styled.div`
  margin-top: auto;
  font-size: 12px;
  color: #666;
`;

export const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

export const DayMenu = styled.div`
  cursor: pointer;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
`;

export const HoursDisplay = styled.div`
  font-size: 12px;
  color: #4CAF50;
  font-weight: 500;
  margin-top: 4px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

export const TabContentWrapper = styled.div<{ $isMobile?: boolean }>`
  padding: ${props => props.$isMobile ? '1rem' : '1rem'};
  width: 100%;
`;
