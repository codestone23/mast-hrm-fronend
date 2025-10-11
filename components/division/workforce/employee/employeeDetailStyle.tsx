import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 12px;
  width: 100%;
`;

export const LeftCol = styled.div``;
export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(2,6,23,0.04);
`;

export const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
`;

export const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-top: 8px;
`;

export const SmallText = styled.div`
  font-size: 13px;
  color: var(--text-muted);
`;

export const StatRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  justify-content: center;
`;

export const StatItem = styled.div`
  text-align: center;
  .num { font-weight: 800; font-size: 20px; }
  .label { font-size: 12px; color: var(--text-muted); }
`;

export const Badge = styled.div`
  background: linear-gradient(90deg, #ffd9a8, #ffc078);
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  display: inline-block;
`;

export const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  align-items: center;
`;

export const Row = styled.div`
  display: contents;
`;

export const Label = styled.div`
  font-size: 13px;
  color: var(--text-muted);
  padding: 6px 0;
`;

export const Value = styled.div`
  font-weight: 600;
  padding: 6px 0;
`;

export const SectionTitle = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
`;

export const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Chip = styled.div`
  background: #f3f4f6;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
`;

export const TabContainer = styled.div`
    background: white;
    padding: 12px;
    display: flex;
    gap: 12px;
    border-radius: 8px;
`;

export default {};
