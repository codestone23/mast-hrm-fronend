import styled from "styled-components";

export const NotificationContainer = styled.div`
  position: relative;
`;

export const NotificationIconButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-200);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    color: var(--secondary-500);
    background-color: var(--gray-600);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: var(--error-500);
  color: white;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 600;
`;

export const NotificationDropdownPanel = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border);
  width: 380px;
  max-height: 500px;
  z-index: 1000;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.$isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: calc(100vw - 2rem);
    max-width: 380px;
    right: -1rem;
    max-height: calc(100vh - 120px);
  }
`;

export const NotificationHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--background-secondary);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const NotificationTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const NotificationList = styled.div`
  overflow-y: auto;
  flex: 1;
  max-height: 400px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: 3px;

    &:hover {
      background: var(--gray-400);
    }
  }
`;

export const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--background-secondary);
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const NotificationItemTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    word-break: break-word;
  }
`;

export const NotificationItemDescription = styled.p`
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

export const NotificationItemTime = styled.span`
  font-size: 0.75rem;
  color: var(--text-muted);

  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`;

export const EmptyNotifications = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);

  svg {
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
`;

export const LoadingMore = styled.div`
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

export const NotificationSentinel = styled.div`
  height: 1px;
  width: 100%;
`;

