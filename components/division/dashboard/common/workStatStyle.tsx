import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(23, 42, 69, 0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
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
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
`;

export const LeftCard = styled(CardBase)`
  background: #e6f2ff;
  color: #0b63d3;
  position: relative;
`;

export const RightCard = styled(CardBase)`
  background: #e9f9ef;
  color: #0f5132;
  position: relative;
`;

export const BottomCard = styled(CardBase)`
  background: #fdecec;
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
  display: grid;
  grid-template-columns: 8% 1fr;
  align-items: center;
  gap: 5px;
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
