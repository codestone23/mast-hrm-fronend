import styled from 'styled-components';

export const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

export const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const BreadcrumbItem = styled.li<{ $isLast?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ $isLast }) => $isLast ? 'var(--text-primary)' : 'var(--text-secondary)'};
  font-weight: ${({ $isLast }) => $isLast ? '500' : '400'};
`;

export const BreadcrumbLink = styled.a`
  color: var(--text-secondary);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--primary-600);
  }
  
  &:focus {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: var(--text-muted);
  font-size: 0.75rem;
  user-select: none;
`;

export const BreadcrumbIcon = styled.span`
  display: flex;
  align-items: center;
  color: inherit;
`;

export const BreadcrumbText = styled.span`
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  
  @media (max-width: 768px) {
    max-width: 150px;
  }
  
  @media (max-width: 480px) {
    max-width: 100px;
  }
`;
