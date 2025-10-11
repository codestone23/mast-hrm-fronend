import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Grid4 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px 16px;
  align-items: center;
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

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TimelineRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

export const DateCol = styled.div`
  width: 160px;
  font-size: 13px;
  color: var(--text-muted);
`;

export const EventCard = styled.div`
  flex: 1;
  border: 1px solid rgba(2,6,23,0.06);
  background: white;
  border-radius: 8px;
  padding: 12px;
`;

export const EventTitle = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

export const Small = styled.div`
  font-size: 13px;
  color: var(--text-muted);
`;