import styled from "styled-components";

export const Container = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  padding: 4px 0;
  //   z-index: 0;
`;

export const Title = styled.div`
  font-weight: 700;
  color: #0f172a;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TopTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Tab = styled.button<{ $active?: boolean }>`
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid
    ${(props) => (props.$active ? "var(--primary-500)" : "transparent")};
  background: ${(props) =>
    props.$active ? "var(--primary-50)" : "transparent"};
  color: ${(props) =>
    props.$active ? "var(--primary-600)" : "var(--text-primary)"};
  font-weight: 600;
  cursor: pointer;
`;

export default {};
