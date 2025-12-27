import styled from "styled-components";
import { BriefcaseBusiness } from "lucide-react";

export const Container = styled.div`
  width: 100%;
  max-width: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 400px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1e293b;
  font-weight: 600;
  font-size: 18px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 12px;
  width: 100%;
  height: 100%;
`;

const CardBase = styled.div`
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
  }
`;

export const LeftCard = styled(CardBase)`
  background: linear-gradient(135deg, #e6f2ff 0%, #dbeafe 100%);
  color: #0b63d3;
  position: relative;
`;

export const RightCard = styled(CardBase)`
  background: linear-gradient(135deg, #e9f9ef 0%, #d1fae5 100%);
  color: #0f5132;
  position: relative;
`;

export const BottomCard = styled(CardBase)`
  background: linear-gradient(135deg, #fdecec 0%, #fee2e2 100%);
  color: #b91c1c;
  grid-column: 1 / span 2;
`;

export const CardHeader = styled.div`
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 10px;
`;

export const CardBody = styled.div`
height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const StatBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const StatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StatNumber = styled.div<{ $green?: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => (props.$green ? "#059669" : "inherit")};
`;

export const StatLabel = styled.div`
  font-size: 20px;
  color: rgba(2,6,23,0.6);
`;

export const ArrowBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  border-radius: 50%;
  background: transparent;
  color: rgba(2,6,23,0.5);
  cursor: pointer;
`;


export const LoadingContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.div`
  font-size: 16px;
  color: #64748b;
`;

export const EmptyDataContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
  gap: 12px;
  padding: 20px 0;
`;
export const EmptyDataText = styled.div`
  font-size: 16px;
  color: #64748b;
`;

export const EmptyDataIcon = styled(BriefcaseBusiness)`
  color: #e0e0e0;
`;

export const ClickableCard = styled(CardBase)`
  cursor: pointer;
`;