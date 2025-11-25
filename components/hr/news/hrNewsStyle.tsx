import styled from "styled-components";

export const HRNewsContainer = styled.div`
  width: 100%;
  padding: 1.5rem;
`;

export const HRNewsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const HRNewsTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

export const HRNewsActions = styled.div`
  display: flex;
  gap: 1rem;
`;

export const NewsGridWithActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

export const NewsCardWithActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

