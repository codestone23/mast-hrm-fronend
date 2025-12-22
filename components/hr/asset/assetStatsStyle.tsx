import styled from "styled-components";

export const StatsContainer = styled.div`
  background-color: var(--background-secondary);
  min-height: 100vh;
  padding: 0.75rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
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

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 8px;
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

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const StatsValue = styled.div<{ $color?: string }>`
  font-size: 36px;
  font-weight: 700;
  color: ${(props) => props.$color || "#333"};

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const StatsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;

  @media (max-width: 768px) {
    font-size: 12px;
    gap: 6px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
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

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

export const ChartContainer = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    padding: 0.75rem;
    border-radius: 8px;
    
    h3 {
      font-size: 16px;
      margin-bottom: 12px;
    }
  }
`;

