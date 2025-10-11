import styled from "styled-components";

export const Container = styled.div`
  background: linear-gradient(180deg,#ffffff 0%, #f7fafc 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(15,23,42,0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const TopTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
`;

export const Tab = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? "var(--primary-500)" : "transparent")};
  background: ${(p) => (p.$active ? "var(--primary-50)" : "transparent")};
  color: ${(p) => (p.$active ? "var(--primary-600)" : "var(--text-primary)")};
  font-weight: 600;
  cursor: pointer;
`;

export const Placeholder = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(2,6,23,0.04);
`;

export default {};
