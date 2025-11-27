import styled from "styled-components";

export const SettingsContainer = styled.div`
  background-color: var(--background-secondary);
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const SettingsHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const SettingsTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const SettingsTabs = styled.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: fit-content;
`;

export const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
  border: none;
  background: transparent;
  
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
`;

export const SettingsContent = styled.div`
  display: flex;
  gap: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const Sidebar = styled.div`
  width: 280px;
  border-right: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 1rem 0;
`;

export const SidebarItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) => (props.$active ? "#2196F3" : "#4b5563")};
  background: ${(props) => (props.$active ? "#e3f2fd" : "transparent")};
  border-left: 3px solid ${(props) => (props.$active ? "#2196F3" : "transparent")};
  font-weight: ${(props) => (props.$active ? "500" : "400")};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? "#e3f2fd" : "#f3f4f6")};
  }
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

