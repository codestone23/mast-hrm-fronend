import styled from "styled-components";

export const TimeSheetsContainer = styled.div`
  background-color: var(--background-secondary);
  min-height: 100vh;
  padding: 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Tab = styled.div<{ $active: boolean }>`
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  ${(props) =>
    props.$active
      ? `
    background: #2196F3;
    color: white;
    box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
  `
      : `
    color: #666;
    
    &:hover {
      background: #f5f5f5;
      color: #333;
    }
  `}
`;

export const HeaderButtons = styled.div`
  display: flex;
  gap: 12px;
`;

export const CreateButton = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F57C00;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
  }
`;



export const CalendarContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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
`;

export const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  margin-bottom: 1.5rem;
  font-size: 12px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
`;

export const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
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
  $status?: string;
  $isToday?: boolean;
}>`
  background: ${(props) => {
    if (!props.$isCurrentMonth) return "#f8f8f8";
    if (props.$status === "work") return "#c9f8c9";
    if (props.$status === "absent") return "#f3a7a7";
    if (props.$status === "holiday") return "#FFF3E0";
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
    border: 1px solid #FF9800;
  `}
`;

export const DayNumber = styled.div<{
  $isCurrentMonth: boolean;
  $isToday?: boolean;
}>`
  font-weight: ${(props) => (props.$isToday ? "700" : "500")};
  color: ${(props) => {
    if (props.$isToday) return "#FF9800";
    if (!props.$isCurrentMonth) return "#999";
    return "#333";
  }};
  font-size: 14px;
`;

export const DayStatus = styled.div`
  margin-top: auto;
  font-size: 12px;
  color: #666;
  
  > div:first-child {
    font-weight: 500;
    margin-bottom: 4px;
  }
`;

export const TimeDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  span {
    font-size: 12px;
    color: #4CAF50;
    
    &::before {
      content: '●';
      margin-right: 4px;
    }
  }
`;

export const SidebarContainer = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SidebarCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
`;

export const SidebarTitle = styled.div`
  font-weight: 500;
  color: #555;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
`;

export const SidebarContent = styled.div`
  text-align: center;
`;

export const StatsGrid = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
`;

export const StatItem = styled.div`
  padding: 0.75rem;
  background: #fafafa;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #f0f0f0;
`;

export const StatNumber = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  color: #777;
  line-height: 1.2;
`;

export const MainContent = styled.div`
  display: flex;
  gap: 1rem;
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

export const WorkSchedule = styled.div`
  color: #2196F3;
  font-size: 13px;
  margin-bottom: 4px;
`;

export const WorkScheduleTime = styled.div`
  color: #2196F3;
  font-size: 13px;
`;

export const LeaveHours = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #2196F3;
`;

export const TotalWork = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #4CAF50;
`;
