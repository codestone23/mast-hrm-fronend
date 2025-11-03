import styled from "styled-components";

// NewsList styles
export const NewsListContainer = styled.div`
  width: 100%;
  padding: 1.5rem;
`;

export const NewsListHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const NewsListTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

export const NewsListSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
`;

export const FilterContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

// NewsCard styles
export const NewsCardContainer = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
    border-color: var(--primary-300);
  }
`;

export const NewsCardHeader = styled.div`
  margin-bottom: 1rem;
`;

export const NewsCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const NewsCardContent = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const NewsCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const NewsCardMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);

  svg {
    color: var(--text-muted);
  }
`;

export const NewsCardAuthor = styled(NewsCardMetaItem)`
  font-weight: 500;
`;

// NewsDetail styles
export const NewsDetailContainer = styled.div`
  width: 100%;
  max-width: calc(100% - 100px);
  margin: 0 auto;
  padding: 1.5rem;
`;

export const NewsDetailHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

export const NewsDetailBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--primary-600);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-700);
    transform: translateX(-2px);
  }
`;

export const NewsDetailTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  line-height: 1.3;
`;

export const NewsDetailMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
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

export const NewsDetailContent = styled.div`
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-primary);

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
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1rem;
  color: var(--text-secondary);
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;

  p {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  margin-bottom: 1rem;
  opacity: 0.5;
  color: var(--text-muted);
`;

export const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

export const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
`;

export const LoadingMore = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

export const NewsSentinel = styled.div`
  height: 1px;
  width: 100%;
`;

// Status Badge
export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $status }) => {
    switch ($status) {
      case "DRAFT":
        return "var(--gray-100)";
      case "PENDING":
        return "var(--warning-100)";
      case "APPROVED":
        return "var(--success-100)";
      case "REJECTED":
        return "var(--error-100)";
      default:
        return "var(--gray-100)";
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "DRAFT":
        return "var(--gray-700)";
      case "PENDING":
        return "var(--warning-700)";
      case "APPROVED":
        return "var(--success-700)";
      case "REJECTED":
        return "var(--error-700)";
      default:
        return "var(--gray-700)";
    }
  }};
  border: 1px solid ${({ $status }) => {
    switch ($status) {
      case "DRAFT":
        return "var(--gray-300)";
      case "PENDING":
        return "var(--warning-300)";
      case "APPROVED":
        return "var(--success-300)";
      case "REJECTED":
        return "var(--error-300)";
      default:
        return "var(--gray-300)";
    }
  }};
`;

// Rejection Reason
export const RejectionReason = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  margin: 0.75rem 0;
  background: var(--error-50);
  border: 1px solid var(--error-200);
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--error-700);

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: var(--error-500);
  }

  strong {
    font-weight: 600;
  }
`;

