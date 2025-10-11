import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

export const CommonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  grid-auto-rows: 1fr;

  & > * {
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
`;

export const Tags = styled.div`
    font-size: 18px;
    font-weight: 600;
    border-left: 4px solid #3b82f6;
    padding-left: 8px;
`;

export const StatisticRow = styled.div`
  display: block;
  width: 100%;
`;

export default {};
