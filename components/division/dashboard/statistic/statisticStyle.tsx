import styled from "styled-components";

export const StatWrapper = styled.div`
  background: #fff;
  padding: 18px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(16,24,40,0.06);
  margin-bottom: 20px;
`;

export const CardsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
`;

export const Card = styled.div`
  flex: 1;
  padding: 18px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 72px;
`;

export const CardTitle = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export const CardValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 320px;
`;
