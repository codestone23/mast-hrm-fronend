import styled from "styled-components";

export const StatsContainer = styled.div`
  background-color: var(--background-secondary);
  min-height: 100vh;
  padding: 0.75rem;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

export const StatsCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 18px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const StatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

export const StatsTitle = styled.h3`
  font-size: 15px;
  color: #666;
  font-weight: 500;
  margin-bottom: 6px;
`;

export const StatsValue = styled.div<{ $color?: string }>`
  font-size: 36px;
  font-weight: 700;
  color: ${(props) => props.$color || "#333"};
`;

export const StatsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

export const IconWrapper = styled.div<{ $color: string }>`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background-color: ${(props) => props.$color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.$color};
`;

export const ChartContainer = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
`;

