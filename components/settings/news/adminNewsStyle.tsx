import styled from "styled-components";

export const AdminNewsContainer = styled.div`
  width: 100%;
  padding: 1.5rem;
`;

export const AdminNewsHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const AdminNewsTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

export const NewsGridWithReview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

export const NewsCardWithReview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ReviewButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

