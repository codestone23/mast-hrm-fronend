import styled from "styled-components";

export const TimekeepingContainer = styled.div`
  background: linear-gradient(180deg, var(--surface) 0%, var(--background-secondary) 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--border-color);

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
    gap: 12px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  background-color: var(--surface);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Tab = styled.div<{ $active: boolean }>`
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  ${(props) =>
    props.$active
      ? `
    background: #2196F3;
    color: white;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
  `
      : `
    color: #666;
    
    &:hover {
      background: #f5f5f5;
      color: #333;
    }
  `}

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 12px;
    flex: 1;
    text-align: center;
  }
`;

export const TabContent = styled.div`
  width: 100%;
`;

