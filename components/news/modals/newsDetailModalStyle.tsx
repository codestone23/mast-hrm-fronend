import styled from "styled-components";

export const NewsDetailModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const NewsDetailMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

export const NewsDetailMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);

  svg {
    color: var(--text-muted);
  }
`;

export const NewsDetailAuthor = styled(NewsDetailMetaItem)`
  font-weight: 500;
`;

export const NewsDetailContentWrapper = styled.div`
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-primary);
  max-height: 60vh;
  overflow-y: auto;

  p {
    margin: 0 0 1rem 0;
  }

  strong {
    font-weight: 600;
  }

  ul,
  ol {
    margin: 0 0 1rem 0;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  h1,
  h2,
  h3 {
    margin: 0 0 1rem 0;
    font-weight: 600;
  }

  h2 {
    font-size: 1.5rem;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: 4px;

    &:hover {
      background: var(--gray-400);
    }
  }
`;

export const RejectionReasonModal = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: var(--error-50);
  border: 1px solid var(--error-200);
  border-left: 4px solid var(--error-500);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--error-700);

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: var(--error-500);
  }

  div {
    flex: 1;

    strong {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--error-800);
    }

    p {
      margin: 0;
      color: var(--error-700);
    }
  }
`;

